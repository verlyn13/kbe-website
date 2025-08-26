# Homer Enrichment Hub

Your Gateway to MathCounts & Enrichment Programs in Homer.

Simple registration. Clear schedules. One place for everything.

## Overview

Homer Enrichment Hub connects families with quality enrichment programs in our community. Founded by educators passionate about critical thinking and authentic learning, we provide a simple, professional platform for program registration and information.

## Getting Started

To get started with development, take a look at src/app/page.tsx.

## Development

```bash
bun run dev          # Start dev server on port 9002
bun run build        # Build for production
bun run start        # Start production server
bun run lint         # Run ESLint
bun run typecheck    # TypeScript type checking
```

### Package Management

This project uses [Bun](https://bun.sh) as the package manager and runtime:

```bash
bun install          # Install dependencies
bun add <package>    # Add a new dependency
bun add -D <package> # Add a dev dependency
bun ci               # Install with frozen lockfile (CI)
bunx <command>       # Execute package binaries
```

### ⚠️ Known Issue: App Check & OAuth

**Important**: Firebase App Check must be set to "Unenforced" mode for OAuth to work.

If Google sign-in fails with `auth/internal-error`:

1. Go to Firebase Console → App Check → Apps
2. Set Authentication and Firestore APIs to "Unenforced"
3. Wait 1-2 minutes and test again

See `APP_CHECK_OAUTH_ISSUE.md` for details.

## Deployment

This project is deployed on Firebase App Hosting. See apphosting.yaml for configuration.

## Cloudflare Integration

This repo integrates with Cloudflare for DNS and zone diagnostics via the `cf-go` CLI.

- Project config: `.cloudflare` (contains `PROJECT_NAME` and `ZONE`)
- Helper targets: `make preflight`, `make zone`, `make ns`, `make dns`
- Full details: see `docs/cloudflare.md`
