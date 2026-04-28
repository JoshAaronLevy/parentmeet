# ParentMeet

Mobile-first app for helping local parents and expecting parents meet nearby
families in person through curated meetup proposals.

## Local Development

Install dependencies:

```sh
pnpm install
```

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

## Workspace

- `apps/mobile` - Expo, React Native, Expo Router, Tamagui
- `apps/admin` - Next.js App Router admin placeholder
- `packages/shared` - shared constants, enums, Zod schemas, and types
- `packages/config` - shared TypeScript configuration
