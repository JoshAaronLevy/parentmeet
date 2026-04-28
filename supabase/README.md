# Supabase

Stage 3 adds the initial database foundation for the ParentMeet MVP.

## Local Commands

From the repository root:

```sh
pnpm db:start
pnpm db:reset
pnpm db:types
```

These commands require the Supabase CLI.

## Security Model

- Public discovery should read from `public.meetup_proposals_public`, not directly
  from `public.meetup_proposals`.
- Household browsing should read from `public.household_public_profiles`, not
  directly from `public.households`.
- Direct table reads are reserved for owners, hosts, approved attendees, and
  admins/moderators according to RLS.
- Admin and moderator access is based on the authenticated user's JWT
  `app_metadata.role` value being `admin` or `moderator`.
