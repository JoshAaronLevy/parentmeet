# Project Summary

Build a mobile-first app that helps local parents and expecting parents meet other nearby families in person through curated, host-created meetup proposals.

The product is intentionally not a social feed, dating app, chat app, or monetized event marketplace. The core experience is:

1. A household creates a local meetup proposal.
2. Other eligible households express interest and indicate which constraints/options work for them.
3. The host reviews interested households and finalizes the meetup details.
4. Selected households confirm attendance.
5. The host approves final attendees.
6. The meetup happens in person.
7. Attendees can optionally indicate interest in reconnecting afterward.

The MVP should prioritize trust, clarity, local relevance, and real-world follow-through.

---

## Core Product Principles

- In-person connection is the product.
- The app should reduce friction, not replace social interaction.
- Every meetup starts as a proposal, but rigid proposals can effectively move straight to RSVP.
- Hosts remain the decision-makers.
- Interested households provide structured availability/preferences, not open-ended committee planning.
- Exact private addresses are never visible until the host has approved attendance.
- Manual event review is required before a proposal is publicly visible.
- Safety, reporting, and blocking are MVP-level requirements.
- Avoid social-media-style features.
- Avoid monetization.
- Avoid maps/geofencing for MVP; use local area/subdivision selections instead.

---

## Recommended Stack

### Mobile App

- Expo
- React Native
- TypeScript
- Expo Router
- Tamagui
- TanStack Query
- React Hook Form
- Zod
- Zustand

### Backend

- Supabase Auth
- Supabase Postgres
- Supabase Storage
- Supabase Row Level Security
- Supabase Edge Functions only where needed

### Admin

- Next.js admin app inside the same repo, used only by internal moderators/admins.

### Repo Type

Use a monorepo structure so the mobile app, admin app, and shared code can live together cleanly.

Recommended package manager: `pnpm`.

---

## Global Engineering Rules

- Keep the MVP focused.
- Do not build speculative features.
- Prefer boring, readable, maintainable code.
- Keep abstractions shallow until repetition proves they are needed.
- Use TypeScript throughout.
- Use Zod schemas for form validation and important shared data validation.
- Use TanStack Query for server state.
- Use Zustand only for local UI/app state.
- Use Tamagui as the UI/styling system. Do not add React Native Paper, NativeWind, or another styling framework unless explicitly requested later.
- Do not implement payments.
- Do not implement public social feeds.
- Do not implement general direct messaging between arbitrary users.
- Do not implement algorithmic matching.
- Do not implement map drawing or polygon-based search.
- Do not implement push notifications in the initial stages unless specifically requested later.
- Do not write automated tests unless explicitly requested.
- After each stage is complete, add a corresponding log entry to the CHANGELOG.md in accordance with the Keep a Changelog format, and ensure the version number is updated appropriately based on the nature of the changes (e.g., patch, minor, major), and the version number is updated in the root `package.json` as well as any relevant `package.json` files in the monorepo.

---

# Stage 1 — Scaffold the Monorepo and Base Tooling

## Goal

Create the project foundation from an empty repo containing only `README.md` and `.gitignore`.

## Tasks

Set up a pnpm-based monorepo with:

```txt
apps/
  mobile/
  admin/
packages/
  shared/
  config/
````

### Mobile App

Create an Expo app in `apps/mobile` using:

* Expo
* TypeScript
* Expo Router

Install and configure:

* Tamagui
* TanStack Query
* React Hook Form
* Zod
* Zustand
* Supabase JS client

### Admin App

Create a minimal Next.js app in `apps/admin` using:

* TypeScript
* App Router
* basic Supabase client setup

### Shared Package

Create `packages/shared` for:

* shared Zod schemas
* shared TypeScript types
* shared constants
* local area data
* enums

### Config Package

Create `packages/config` for shared lint/tsconfig settings if useful.

## Required Output

* Root `package.json`
* `pnpm-workspace.yaml`
* TypeScript configs
* working Expo mobile app
* working Next.js admin app
* shared package imported successfully by both apps
* basic README update with local dev commands

## Acceptance Criteria

* `pnpm install` works.
* `pnpm dev:mobile` starts Expo.
* `pnpm dev:admin` starts the admin app.
* Mobile app shows a simple Tamagui-rendered home screen.
* Admin app shows a simple protected-placeholder admin landing page.
* No business logic yet.

---

# Stage 2 — Configure Tamagui Design System

## Goal

Create a clean, warm, reusable design foundation for the mobile app.

## Tasks

Configure Tamagui in `apps/mobile`.

Create basic tokens for:

* colors
* spacing
* radius
* font sizes
* line heights
* shadows/elevation if needed

Create basic themes:

* light
* optional dark placeholder, but do not fully invest in dark mode yet

Create reusable primitives:

```txt
components/
  ui/
    Screen.tsx
    AppText.tsx
    AppButton.tsx
    AppCard.tsx
    AppInput.tsx
    AppTextarea.tsx
    AppSelect.tsx
    AppCheckbox.tsx
    AppTag.tsx
    EmptyState.tsx
    LoadingState.tsx
    ErrorState.tsx
```

## Design Direction

The app should feel:

* warm
* local
* trustworthy
* polished
* parent-friendly
* not overly corporate
* not like a generic Material UI app
* not like a dating app

## Acceptance Criteria

* Mobile app uses Tamagui provider correctly.
* Shared UI primitives render correctly.
* Components are simple and composable.
* No overly elaborate design system.
* No extra UI libraries.

---

# Stage 3 — Supabase Project Setup and Database Schema

## Goal

Define the initial database schema, RLS policies, and local Supabase integration structure.

## Tasks

Create Supabase migration files for the MVP schema.

## Core Tables

### profiles

Represents an authenticated adult user.

Fields:

* `id uuid primary key`
* `auth_user_id uuid references auth.users(id)`
* `first_name text`
* `last_name text nullable`
* `display_name text`
* `avatar_url text nullable`
* `created_at timestamptz`
* `updated_at timestamptz`

### households

Represents a family/household profile.

Fields:

* `id uuid primary key`
* `created_by_profile_id uuid references profiles(id)`
* `household_name text`
* `household_type text`
* `bio text nullable`
* `city text`
* `primary_area_id text`
* `area_ids text[]`
* `is_expectant_parent boolean default false`
* `is_parent_household boolean default true`
* `interests text[]`
* `created_at timestamptz`
* `updated_at timestamptz`

### household_members

Represents adults and children in a household.

Fields:

* `id uuid primary key`
* `household_id uuid references households(id)`
* `member_type text` — adult, child, expected_child
* `display_name text nullable`
* `age_band text nullable`
* `due_window text nullable`
* `created_at timestamptz`

Do not require exact child names or exact birthdates.

### meetup_proposals

Represents the event/proposal object.

Fields:

* `id uuid primary key`
* `host_household_id uuid references households(id)`
* `title text`
* `description text`
* `status text`
* `visibility text`
* `venue_privacy text`
* `venue_type text`
* `public_location_name text nullable`
* `private_address text nullable`
* `area_id text`
* `area_label text`
* `target_age_bands text[]`
* `interest_limit int nullable`
* `desired_family_count_min int nullable`
* `desired_family_count_max int nullable`
* `max_adults int nullable`
* `max_children int nullable`
* `food_notes text nullable`
* `activity_notes text nullable`
* `flexible_food boolean default false`
* `flexible_location boolean default false`
* `flexible_time boolean default false`
* `manual_review_status text default 'pending'`
* `manual_review_notes text nullable`
* `finalized_starts_at timestamptz nullable`
* `finalized_ends_at timestamptz nullable`
* `finalized_location_label text nullable`
* `finalized_at timestamptz nullable`
* `created_at timestamptz`
* `updated_at timestamptz`

Statuses should include:

* draft
* pending_review
* interest_open
* finalizing
* rsvp_open
* confirmed
* canceled
* completed

Manual review statuses:

* pending
* approved
* rejected
* needs_changes

### proposal_options

Represents selectable options for time/location/etc.

Fields:

* `id uuid primary key`
* `proposal_id uuid references meetup_proposals(id)`
* `option_type text`
* `label text`
* `starts_at timestamptz nullable`
* `ends_at timestamptz nullable`
* `location_label text nullable`
* `sort_order int`
* `created_at timestamptz`

Option types:

* time
* location
* format

### interest_responses

Represents a household expressing interest before final RSVP.

Fields:

* `id uuid primary key`
* `proposal_id uuid references meetup_proposals(id)`
* `household_id uuid references households(id)`
* `adult_count int`
* `child_count int`
* `note text nullable`
* `dietary_notes text nullable`
* `accessibility_notes text nullable`
* `status text`
* `created_at timestamptz`
* `updated_at timestamptz`

Statuses:

* interested
* withdrawn
* invited
* not_selected

### interest_response_options

Links an interest response to selected proposal options.

Fields:

* `id uuid primary key`
* `interest_response_id uuid references interest_responses(id)`
* `proposal_option_id uuid references proposal_options(id)`

### rsvps

Represents official attendance request/confirmation after finalization.

Fields:

* `id uuid primary key`
* `proposal_id uuid references meetup_proposals(id)`
* `household_id uuid references households(id)`
* `interest_response_id uuid nullable references interest_responses(id)`
* `status text`
* `adult_count int`
* `child_count int`
* `message_to_host text nullable`
* `created_at timestamptz`
* `updated_at timestamptz`

Statuses:

* requested
* approved
* declined
* canceled
* attended
* late_cancel
* no_show

### event_messages

Limited event-scoped messages.

Fields:

* `id uuid primary key`
* `proposal_id uuid references meetup_proposals(id)`
* `sender_profile_id uuid references profiles(id)`
* `message_type text`
* `body text`
* `created_at timestamptz`

Message types:

* host_announcement
* approved_attendee_message
* system

No general arbitrary DMs.

### reconnect_interests

Post-event mutual interest.

Fields:

* `id uuid primary key`
* `proposal_id uuid references meetup_proposals(id)`
* `from_household_id uuid references households(id)`
* `to_household_id uuid references households(id)`
* `created_at timestamptz`

### reports

Fields:

* `id uuid primary key`
* `reporter_profile_id uuid references profiles(id)`
* `target_profile_id uuid nullable`
* `target_household_id uuid nullable`
* `target_proposal_id uuid nullable`
* `reason text`
* `details text nullable`
* `status text default 'open'`
* `created_at timestamptz`

### blocks

Fields:

* `id uuid primary key`
* `blocker_household_id uuid references households(id)`
* `blocked_household_id uuid references households(id)`
* `created_at timestamptz`

## RLS Requirements

Implement basic RLS policies:

* Users can read/update their own profile.
* Users can read public-safe household fields.
* Users can update their own household.
* Users can create proposals only for their own household.
* Only approved/reviewed proposals are publicly discoverable.
* Private address is not exposed to non-approved attendees.
* Hosts can view interest responses for their own proposals.
* Households can view their own interest responses.
* Hosts can view RSVPs for their own proposals.
* Approved attendees can view limited attendee info.
* Event messages are visible only to host and approved attendees.
* Admin/moderator role can review proposals and reports.

## Acceptance Criteria

* Migration files exist.
* Schema can be applied cleanly.
* RLS is enabled on relevant tables.
* Basic policies exist.
* Shared TypeScript enums/constants match DB status values.

---

# Stage 4 — Authentication and Session Handling

## Goal

Implement basic auth flows in the mobile app using Supabase Auth.

## Tasks

Create mobile screens:

```txt
app/
  (auth)/
    sign-in.tsx
    sign-up.tsx
  (app)/
    _layout.tsx
    index.tsx
```

Implement:

* sign up with email/password
* sign in with email/password
* sign out
* session persistence
* auth gate routing
* basic loading state while restoring session

Create auth provider:

```txt
src/providers/AuthProvider.tsx
```

Create Supabase client:

```txt
src/lib/supabase.ts
```

## Acceptance Criteria

* User can sign up.
* User can sign in.
* User can sign out.
* App routes unauthenticated users to auth screens.
* App routes authenticated users to main app.
* No profile/household onboarding yet.

---

# Stage 5 — Household Onboarding

## Goal

After sign-up, users create their household profile.

## Tasks

Create onboarding flow:

```txt
app/(app)/onboarding/
  index.tsx
  adults.tsx
  children.tsx
  areas.tsx
  interests.tsx
  review.tsx
```

Collect:

* household name
* adult display names
* parent/expecting parent eligibility
* child age bands or expected child due window
* primary area
* additional nearby areas
* interests
* short bio

Use local predefined area/subdivision data from `packages/shared`.

Initial area data should include Highlands Ranch and nearby area placeholders.

Example area IDs:

* westridge
* highlands_ranch_central
* highlands_ranch_eastridge
* highlands_ranch_southridge
* lone_tree
* littleton
* parker
* centennial

Keep this data easy to edit.

## UX Requirements

* Do not ask for exact child birthdates.
* Do not require child names.
* Use reassuring copy.
* Make eligibility self-attested.
* Do not make onboarding feel invasive.

## Acceptance Criteria

* New user is forced through onboarding after sign-up.
* Completed household profile is saved to Supabase.
* Returning onboarded user lands on main app.
* Household data can be read back and displayed.

---

# Stage 6 — Main App Shell and Navigation

## Goal

Create the core authenticated app layout.

## Tabs

Implement bottom tabs:

* Discover
* Create
* My Meetups
* Profile

## Screens

```txt
app/(app)/(tabs)/
  discover.tsx
  create.tsx
  my-meetups.tsx
  profile.tsx
```

## Tasks

* Add app shell with Tamagui styling.
* Add placeholder cards/states for each tab.
* Add profile summary screen.
* Add sign out action.
* Add onboarding completion guard.

## Acceptance Criteria

* Authenticated/onboarded users can navigate tabs.
* UI is polished enough to establish the visual direction.
* No real proposal creation yet.

---

# Stage 7 — Create Meetup Proposal Flow

## Goal

Allow a host household to create a meetup proposal.

## Important Product Model

All meetups are proposals initially.

A proposal can be rigid or flexible depending on the constraints/options the host provides.

Examples:

* rigid: barbecue at our house Sunday 11–3
* flexible time: barbecue this weekend or next
* flexible venue: K1 Raceway or Main Event
* flexible food/location/time toggles

## Screens

```txt
app/(app)/create-proposal/
  index.tsx
  basics.tsx
  options.tsx
  capacity.tsx
  details.tsx
  privacy.tsx
  review.tsx
```

## Data Collected

* title
* description
* area
* target child age bands
* venue type
* public location name if applicable
* private address if home/private
* candidate time options
* candidate location options if applicable
* max adults / max children
* desired family count min/max
* food notes
* activity notes
* flexible food/location/time booleans
* interest limit
* visibility/privacy fields

## Submission Behavior

When submitted:

* proposal status should become `pending_review`
* manual review status should become `pending`
* proposal should not appear in public Discover until approved

## Acceptance Criteria

* Host can create a proposal.
* Proposal saves to Supabase.
* Proposal is not publicly discoverable until admin approval.
* Private address is stored but never displayed in public proposal cards.

---

# Stage 8 — Admin Manual Review

## Goal

Build minimal admin functionality to review meetup proposals before they go live.

## Admin App Screens

```txt
apps/admin/app/
  login/page.tsx
  dashboard/page.tsx
  proposals/page.tsx
  proposals/[id]/page.tsx
```

## Tasks

* Implement admin login using Supabase Auth.
* Add a simple admin role check.
* List pending proposals.
* View proposal details.
* Approve proposal.
* Reject proposal.
* Mark proposal as needs changes.
* Add moderator notes.

## Approval Behavior

When approved:

* `manual_review_status = approved`
* if proposal is ready for interest, set `status = interest_open`

When rejected:

* `manual_review_status = rejected`
* keep status not publicly visible

## Acceptance Criteria

* Admin can see pending proposals.
* Admin can approve/reject proposals.
* Approved proposals appear in mobile Discover.
* Rejected proposals do not appear publicly.

---

# Stage 9 — Discover Feed

## Goal

Allow users to browse approved meetup proposals.

## Screens

```txt
app/(app)/(tabs)/discover.tsx
app/(app)/proposal/[id].tsx
```

## Discover Card Should Show

* title
* area
* rough venue type
* date/time option summary
* target age bands
* host household summary
* capacity/desired family count
* tags/interests
* whether flexible
* whether interest is open or RSVP is open

## Filters

Implement simple filters:

* area/subdivision
* child age band
* date/time rough filter
* venue type

Do not build map search.

## Proposal Detail Should Show

* full public-safe details
* host profile summary
* options available
* food/activity notes
* target age bands
* interest CTA

Do not show private address unless user is approved later.

## Acceptance Criteria

* Discover lists approved proposals.
* Users can filter by simple local criteria.
* Proposal detail is readable and polished.
* Private home address remains hidden.

---

# Stage 10 — Interest Response Flow

## Goal

Allow households to express interest in a proposal and indicate which options work.

## Screens

```txt
app/(app)/proposal/[id]/interest.tsx
```

## Interest Form

Collect:

* adult count
* child count
* selected time/location/format options
* dietary notes
* accessibility notes
* short note to host

## Rules

* One active interest response per household per proposal.
* Household can withdraw interest.
* Interest is not an RSVP.
* UI must clearly say this is not a confirmed spot.

## Acceptance Criteria

* User can express interest.
* User can select available proposal options.
* Host can later view the response.
* User can withdraw interest.
* Interest state is reflected on proposal detail.

---

# Stage 11 — Host Interest Review

## Goal

Allow hosts to review interested households and finalize the proposal.

## Screens

```txt
app/(app)/host/proposals/[id]/interests.tsx
app/(app)/host/proposals/[id]/finalize.tsx
```

## Host Review UI

Show:

* interested households
* household profiles
* adult/child counts
* selected options
* dietary/accessibility notes
* short note
* attendance history summary if available

## Attendance History MVP

Show only neutral factual text, such as:

* “No prior attendance history”
* “Attended 2 of 2 confirmed meetups”
* “Missed 1 of 3 confirmed meetups”

Do not create public ratings or shame badges.

## Finalization

Host chooses:

* final date/time
* final location label
* final venue/privacy
* selected households to invite to RSVP

When finalized:

* proposal status becomes `rsvp_open`
* selected interest responses become `invited`
* non-selected can become `not_selected` only if necessary

## Acceptance Criteria

* Host can view interest responses.
* Host can finalize date/time/location.
* Host can invite selected households to RSVP.
* Proposal moves to RSVP phase.

---

# Stage 12 — RSVP and Host Approval

## Goal

After finalization, invited/interested households can officially request attendance.

## Screens

```txt
app/(app)/proposal/[id]/rsvp.tsx
app/(app)/host/proposals/[id]/rsvps.tsx
```

## RSVP Flow

User can:

* request attendance
* confirm adult/child count
* add short message
* cancel request

Host can:

* approve RSVP
* decline RSVP
* see capacity summary

## Address Visibility

Only approved RSVP households can see private address details.

## Acceptance Criteria

* User can submit RSVP request.
* Host can approve/decline.
* Approved attendees can see finalized private details.
* Non-approved users cannot see private address.
* Proposal can move to confirmed once host is ready.

---

# Stage 13 — My Meetups

## Goal

Give users a clear dashboard of their meetup activity.

## Sections

In `My Meetups`, show:

* Hosting
* Interested
* Invited / RSVP needed
* Approved / Upcoming
* Past

## Card States

Each card should clearly communicate:

* proposal phase
* user’s current status
* required next action
* date/time if finalized
* location visibility if approved

## Acceptance Criteria

* User can see proposals they created.
* User can see proposals they expressed interest in.
* User can see RSVP-needed meetups.
* User can see approved upcoming meetups.
* Empty states are polished and helpful.

---

# Stage 14 — Event-Scoped Messaging

## Goal

Implement limited messaging for coordination without turning the product into a chat app.

## Message Types

* Host announcements
* Approved attendee group messages
* System messages

## Rules

* No arbitrary general DMs.
* Only approved attendees and host can access event message thread.
* Before RSVP approval, only structured interest/RSVP notes are available.
* Host announcements should be visually distinct.

## Screens

```txt
app/(app)/proposal/[id]/messages.tsx
```

## Acceptance Criteria

* Host can post announcement.
* Approved attendees can see messages.
* Approved attendees can post event-scoped messages.
* Unapproved users cannot see event messages.
* Messaging is scoped to a specific meetup only.

---

# Stage 15 — Cancel and Salvage Flow

## Goal

Support real-life changes without destroying the social opportunity.

## Host Cancellation

Host can:

* cancel outright
* mark original venue/time as unavailable
* open salvage mode

## Salvage Mode

When salvage mode opens:

* approved attendees are notified in-app
* event thread remains available temporarily
* attendees can propose:

  * public fallback location
  * new time
  * volunteer to host

## MVP Constraint

For MVP, keep salvage simple:

* allow text-based fallback proposal inside event thread
* allow host/admin to update finalized details
* if a new private home host is proposed, require manual admin review before private address is shared

Do not build complex voting.

## Acceptance Criteria

* Host can cancel or open salvage mode.
* Approved attendees retain temporary coordination access.
* Admin/host can update event details after salvage.
* Private replacement venue still requires review.

---

# Stage 16 — Attendance Outcomes and Reliability Signals

## Goal

Track attendance outcomes tactfully for future host review.

## Post-Event Host Actions

Host can mark each approved RSVP as:

* attended
* canceled in advance
* late cancel
* no_show

## Reliability Summary

Future hosts can see a neutral summary during RSVP/interest review.

Do not show:

* public ratings
* star scores
* public badges
* shame labels

## Acceptance Criteria

* Host can mark attendance outcomes.
* Outcomes are saved.
* Future host review screen shows neutral attendance history.
* Users are not publicly shamed.

---

# Stage 17 — Post-Event Reconnect Interest

## Goal

Help real friendships continue after the meetup without forcing social-media behavior.

## Post-Event Flow

After completed meetup, attendees can indicate:

* “We’d be open to meeting this household again”

If both households indicate interest:

* show mutual reconnect state
* allow event-scoped follow-up or simple contact unlock placeholder

## MVP Simplicity

Do not build a full friends graph yet.

## Acceptance Criteria

* User can mark reconnect interest for another attendee household.
* Mutual interest is detected.
* UI shows mutual reconnect result.
* No general social feed is created.

---

# Stage 18 — Reporting, Blocking, and Basic Safety

## Goal

Add baseline trust and safety controls.

## Reporting

Users can report:

* household
* profile
* proposal
* message

Report reasons:

* inappropriate behavior
* suspicious profile/event
* safety concern
* harassment
* spam
* other

## Blocking

A household can block another household.

Blocked households should not:

* see each other in normal discovery contexts where practical
* message each other
* attend each other’s hosted events

## Admin

Admin can:

* view reports
* mark reports open/resolved
* inspect related proposal/profile

## Acceptance Criteria

* Users can submit reports.
* Users can block households.
* Blocking affects relevant app behavior.
* Admin can review reports.

---

# Stage 19 — Polish, Empty States, and Copy Pass

## Goal

Make the MVP feel intentional, warm, and trustworthy.

## Polish Areas

* onboarding copy
* proposal creation copy
* interest vs RSVP distinction
* private address privacy copy
* empty states
* loading states
* error states
* success confirmations
* host review explanations
* cancellation/salvage copy

## Important Copy Distinctions

Use clear language:

* “Express interest” means not committed yet.
* “RSVP” means asking to officially attend.
* “Approved” means host confirmed attendance.
* “Private details unlock after approval.”

## Acceptance Criteria

* No confusing proposal/RSVP language.
* Empty states feel helpful.
* Error states are understandable.
* UI feels coherent and polished.

---

# Stage 20 — Local Pilot Readiness

## Goal

Prepare the app for a small Highlands Ranch/local pilot.

## Tasks

* Seed local area data.
* Add seed/sample proposals for development only.
* Add admin checklist for reviewing proposals.
* Add basic environment documentation.
* Add deployment notes for Expo and admin app.
* Add Supabase setup instructions.
* Add local pilot checklist.

## Pilot Checklist

Before inviting real users:

* Auth works.
* Onboarding works.
* Proposal creation works.
* Admin approval works.
* Discover works.
* Interest works.
* Host finalization works.
* RSVP approval works.
* Private address remains hidden until approved.
* Event messages are scoped correctly.
* Reporting/blocking exists.
* Manual review is usable.

## Acceptance Criteria

* README has setup instructions.
* `.env.example` files exist.
* App can be run locally from fresh clone.
* Admin can approve proposal.
* User can complete full proposal → interest → finalize → RSVP → approved flow.

---

# MVP Non-Goals

Do not implement these unless explicitly requested later:

* payments
* subscriptions
* public social feed
* likes/reactions
* general DMs
* AI matching
* map drawing
* geofenced polygons
* push notifications
* SMS notifications
* calendar sync
* complex recommendation algorithm
* business-hosted events
* childcare marketplace
* photo galleries
* full friend graph
* public ratings
* automated background checks
