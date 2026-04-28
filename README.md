# ParentMeet

Mobile-first app for helping local parents and expecting parents meet nearby
families in person through curated meetup proposals.

## Local Development

Install dependencies:

```sh
pnpm install
```

Create local environment files from the examples:

```sh
cp .env.example .env
cp apps/mobile/.env.example apps/mobile/.env
cp apps/admin/.env.example apps/admin/.env
```

Use `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` in the mobile app. Use all
three Supabase variables in the admin app and root `.env`; never ship
`SUPABASE_SECRET_KEY` in a client bundle.

Start the Expo mobile app:

```sh
pnpm dev:mobile
```

Start the Next.js admin app:

```sh
pnpm dev:admin
```

Run TypeScript checks across the workspace:

```sh
pnpm typecheck
```

Start local Supabase services and apply migrations:

```sh
pnpm db:start
pnpm db:reset
```

Generate local database types after Supabase is running:

```sh
pnpm db:types
```

## Workspace

- `apps/mobile` - Expo, React Native, Expo Router, Tamagui
- `apps/admin` - Next.js App Router admin placeholder
- `packages/shared` - shared constants, enums, Zod schemas, and types
- `packages/config` - shared TypeScript configuration

## Supabase

Database migrations live in `supabase/migrations`. Stage 3 defines the initial
MVP schema, public-safe discovery views, and baseline RLS policies for profiles,
households, proposals, interest responses, RSVPs, event messages, reports, and
blocks.
