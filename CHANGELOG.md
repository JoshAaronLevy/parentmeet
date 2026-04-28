# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [1.5.0] - 2026-04-28

### Added

- Added authenticated mobile household onboarding flow for household basics, adults, children, areas, interests, and review.
- Added Supabase persistence for profiles, households, and household members from onboarding.
- Added onboarding completion guard so new users must complete household setup before reaching the main app.
- Added household read-back on the authenticated mobile home screen.
- Added Highlands Ranch and nearby local area data plus editable household interest constants.

## [1.4.0] - 2026-04-28

### Added

- Added persisted Supabase Auth client setup for the mobile app.
- Added mobile auth provider with session restoration, sign in, sign up, and sign out actions.
- Added Expo Router auth and app route groups with authenticated routing guards.
- Added mobile sign-in and sign-up screens using email and password.
- Added sign-out support to the authenticated mobile home screen.

## [1.3.0] - 2026-04-28

### Added

- Added initial Supabase schema migrations for MVP profiles, households, meetup proposals, interest, RSVP, event message, reconnect, report, and block tables.
- Added baseline RLS policies and public-safe discovery views for household and proposal reads.
- Added shared TypeScript constants and Zod schemas for database-constrained status values.
- Added Supabase local development commands to the root package and README.

## [1.2.0] - 2026-04-28

### Added

- Added app-owned Tamagui tokens, light theme, and dark placeholder theme for the mobile app.
- Added reusable mobile UI primitives for screens, text, buttons, cards, fields, selection, tags, and common states.
- Updated the mobile home screen to render the Stage 2 design primitives.

## [1.1.0] - 2026-04-28

### Added

- Scaffolded the pnpm monorepo with mobile, admin, shared, and config workspaces.
- Added a minimal Expo Router mobile app using Tamagui and TanStack Query.
- Added a minimal Next.js App Router admin placeholder with Supabase client setup.
- Added shared constants, enums, and Zod schemas imported by both apps.
- Documented local development commands.
