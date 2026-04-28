create extension if not exists pgcrypto with schema extensions;

create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null references auth.users(id) on delete cascade,
  first_name text not null,
  last_name text,
  display_name text not null,
  avatar_url text,
  app_role text not null default 'member',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_auth_user_id_key unique (auth_user_id),
  constraint profiles_app_role_check check (
    app_role in ('member', 'moderator', 'admin')
  ),
  constraint profiles_first_name_check check (char_length(trim(first_name)) > 0),
  constraint profiles_display_name_check check (char_length(trim(display_name)) > 0)
);

create table public.households (
  id uuid primary key default gen_random_uuid(),
  created_by_profile_id uuid not null references public.profiles(id) on delete restrict,
  household_name text not null,
  household_type text not null,
  bio text,
  city text not null,
  primary_area_id text not null,
  area_ids text[] not null default '{}',
  is_expectant_parent boolean not null default false,
  is_parent_household boolean not null default true,
  interests text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint households_household_name_check check (char_length(trim(household_name)) > 0),
  constraint households_household_type_check check (
    household_type in ('expecting', 'parent', 'expecting_and_parent', 'caregiver')
  ),
  constraint households_city_check check (char_length(trim(city)) > 0),
  constraint households_primary_area_id_check check (char_length(trim(primary_area_id)) > 0),
  constraint households_area_ids_check check (array_length(area_ids, 1) is not null)
);

create table public.household_members (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  member_type text not null,
  display_name text,
  age_band text,
  due_window text,
  created_at timestamptz not null default now(),
  constraint household_members_member_type_check check (
    member_type in ('adult', 'child', 'expected_child')
  ),
  constraint household_members_age_band_check check (
    age_band is null or age_band in (
      'expecting',
      'newborn',
      'infant',
      'toddler',
      'preschool',
      'early_elementary',
      'elementary',
      'middle_school',
      'teen'
    )
  )
);

create table public.meetup_proposals (
  id uuid primary key default gen_random_uuid(),
  host_household_id uuid not null references public.households(id) on delete cascade,
  title text not null,
  description text not null,
  status text not null default 'draft',
  visibility text not null default 'local_public',
  venue_privacy text not null default 'public_location',
  venue_type text not null,
  public_location_name text,
  private_address text,
  area_id text not null,
  area_label text not null,
  target_age_bands text[] not null default '{}',
  interest_limit int,
  desired_family_count_min int,
  desired_family_count_max int,
  max_adults int,
  max_children int,
  food_notes text,
  activity_notes text,
  flexible_food boolean not null default false,
  flexible_location boolean not null default false,
  flexible_time boolean not null default false,
  manual_review_status text not null default 'pending',
  manual_review_notes text,
  finalized_starts_at timestamptz,
  finalized_ends_at timestamptz,
  finalized_location_label text,
  finalized_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint meetup_proposals_title_check check (char_length(trim(title)) > 0),
  constraint meetup_proposals_description_check check (char_length(trim(description)) > 0),
  constraint meetup_proposals_status_check check (
    status in (
      'draft',
      'pending_review',
      'interest_open',
      'finalizing',
      'rsvp_open',
      'confirmed',
      'canceled',
      'completed'
    )
  ),
  constraint meetup_proposals_visibility_check check (
    visibility in ('private', 'local_public')
  ),
  constraint meetup_proposals_venue_privacy_check check (
    venue_privacy in ('public_location', 'private_address_after_approval')
  ),
  constraint meetup_proposals_venue_type_check check (
    venue_type in ('home', 'park', 'library', 'community_space', 'business', 'other')
  ),
  constraint meetup_proposals_manual_review_status_check check (
    manual_review_status in ('pending', 'approved', 'rejected', 'needs_changes')
  ),
  constraint meetup_proposals_count_check check (
    (interest_limit is null or interest_limit > 0)
    and (desired_family_count_min is null or desired_family_count_min > 0)
    and (desired_family_count_max is null or desired_family_count_max > 0)
    and (
      desired_family_count_min is null
      or desired_family_count_max is null
      or desired_family_count_min <= desired_family_count_max
    )
    and (max_adults is null or max_adults > 0)
    and (max_children is null or max_children >= 0)
  ),
  constraint meetup_proposals_finalized_time_check check (
    finalized_starts_at is null
    or finalized_ends_at is null
    or finalized_starts_at < finalized_ends_at
  )
);

create table public.proposal_options (
  id uuid primary key default gen_random_uuid(),
  proposal_id uuid not null references public.meetup_proposals(id) on delete cascade,
  option_type text not null,
  label text not null,
  starts_at timestamptz,
  ends_at timestamptz,
  location_label text,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  constraint proposal_options_option_type_check check (
    option_type in ('time', 'location', 'format')
  ),
  constraint proposal_options_label_check check (char_length(trim(label)) > 0),
  constraint proposal_options_time_check check (
    starts_at is null or ends_at is null or starts_at < ends_at
  )
);

create table public.interest_responses (
  id uuid primary key default gen_random_uuid(),
  proposal_id uuid not null references public.meetup_proposals(id) on delete cascade,
  household_id uuid not null references public.households(id) on delete cascade,
  adult_count int not null,
  child_count int not null,
  note text,
  dietary_notes text,
  accessibility_notes text,
  status text not null default 'interested',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint interest_responses_proposal_household_key unique (proposal_id, household_id),
  constraint interest_responses_status_check check (
    status in ('interested', 'withdrawn', 'invited', 'not_selected')
  ),
  constraint interest_responses_counts_check check (
    adult_count > 0 and child_count >= 0
  )
);

create table public.interest_response_options (
  id uuid primary key default gen_random_uuid(),
  interest_response_id uuid not null references public.interest_responses(id) on delete cascade,
  proposal_option_id uuid not null references public.proposal_options(id) on delete cascade,
  constraint interest_response_options_unique unique (
    interest_response_id,
    proposal_option_id
  )
);

create table public.rsvps (
  id uuid primary key default gen_random_uuid(),
  proposal_id uuid not null references public.meetup_proposals(id) on delete cascade,
  household_id uuid not null references public.households(id) on delete cascade,
  interest_response_id uuid references public.interest_responses(id) on delete set null,
  status text not null default 'requested',
  adult_count int not null,
  child_count int not null,
  message_to_host text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint rsvps_proposal_household_key unique (proposal_id, household_id),
  constraint rsvps_status_check check (
    status in (
      'requested',
      'approved',
      'declined',
      'canceled',
      'attended',
      'late_cancel',
      'no_show'
    )
  ),
  constraint rsvps_counts_check check (adult_count > 0 and child_count >= 0)
);

create table public.event_messages (
  id uuid primary key default gen_random_uuid(),
  proposal_id uuid not null references public.meetup_proposals(id) on delete cascade,
  sender_profile_id uuid not null references public.profiles(id) on delete restrict,
  message_type text not null,
  body text not null,
  created_at timestamptz not null default now(),
  constraint event_messages_message_type_check check (
    message_type in ('host_announcement', 'approved_attendee_message', 'system')
  ),
  constraint event_messages_body_check check (char_length(trim(body)) > 0)
);

create table public.reconnect_interests (
  id uuid primary key default gen_random_uuid(),
  proposal_id uuid not null references public.meetup_proposals(id) on delete cascade,
  from_household_id uuid not null references public.households(id) on delete cascade,
  to_household_id uuid not null references public.households(id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint reconnect_interests_unique unique (
    proposal_id,
    from_household_id,
    to_household_id
  ),
  constraint reconnect_interests_not_self check (from_household_id <> to_household_id)
);

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_profile_id uuid not null references public.profiles(id) on delete restrict,
  target_profile_id uuid references public.profiles(id) on delete set null,
  target_household_id uuid references public.households(id) on delete set null,
  target_proposal_id uuid references public.meetup_proposals(id) on delete set null,
  reason text not null,
  details text,
  status text not null default 'open',
  created_at timestamptz not null default now(),
  constraint reports_reason_check check (char_length(trim(reason)) > 0),
  constraint reports_status_check check (
    status in ('open', 'reviewing', 'resolved', 'dismissed')
  ),
  constraint reports_target_check check (
    target_profile_id is not null
    or target_household_id is not null
    or target_proposal_id is not null
  )
);

create table public.blocks (
  id uuid primary key default gen_random_uuid(),
  blocker_household_id uuid not null references public.households(id) on delete cascade,
  blocked_household_id uuid not null references public.households(id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint blocks_unique unique (blocker_household_id, blocked_household_id),
  constraint blocks_not_self check (blocker_household_id <> blocked_household_id)
);

create index households_created_by_profile_id_idx on public.households(created_by_profile_id);
create index households_primary_area_id_idx on public.households(primary_area_id);
create index household_members_household_id_idx on public.household_members(household_id);
create index meetup_proposals_host_household_id_idx on public.meetup_proposals(host_household_id);
create index meetup_proposals_discovery_idx on public.meetup_proposals(
  area_id,
  status,
  manual_review_status
);
create index proposal_options_proposal_id_idx on public.proposal_options(proposal_id);
create index interest_responses_proposal_id_idx on public.interest_responses(proposal_id);
create index interest_responses_household_id_idx on public.interest_responses(household_id);
create index rsvps_proposal_id_idx on public.rsvps(proposal_id);
create index rsvps_household_id_idx on public.rsvps(household_id);
create index event_messages_proposal_id_idx on public.event_messages(proposal_id);
create index reconnect_interests_proposal_id_idx on public.reconnect_interests(proposal_id);
create index reports_status_idx on public.reports(status);
create index blocks_blocker_household_id_idx on public.blocks(blocker_household_id);
create index blocks_blocked_household_id_idx on public.blocks(blocked_household_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger households_set_updated_at
before update on public.households
for each row execute function public.set_updated_at();

create trigger meetup_proposals_set_updated_at
before update on public.meetup_proposals
for each row execute function public.set_updated_at();

create trigger interest_responses_set_updated_at
before update on public.interest_responses
for each row execute function public.set_updated_at();

create trigger rsvps_set_updated_at
before update on public.rsvps
for each row execute function public.set_updated_at();

create view public.household_public_profiles as
select
  id,
  household_name,
  household_type,
  city,
  primary_area_id,
  area_ids,
  is_expectant_parent,
  is_parent_household,
  interests,
  created_at
from public.households;

create view public.meetup_proposals_public as
select
  id,
  host_household_id,
  title,
  description,
  status,
  visibility,
  venue_privacy,
  venue_type,
  public_location_name,
  area_id,
  area_label,
  target_age_bands,
  interest_limit,
  desired_family_count_min,
  desired_family_count_max,
  max_adults,
  max_children,
  food_notes,
  activity_notes,
  flexible_food,
  flexible_location,
  flexible_time,
  finalized_starts_at,
  finalized_ends_at,
  finalized_location_label,
  finalized_at,
  created_at,
  updated_at
from public.meetup_proposals
where visibility = 'local_public'
  and manual_review_status = 'approved'
  and status in ('interest_open', 'finalizing', 'rsvp_open', 'confirmed');

comment on view public.meetup_proposals_public is
  'Public discovery projection. Excludes private_address and manual review notes.';

comment on view public.household_public_profiles is
  'Public-safe household projection. Excludes household bio and private operational data.';
