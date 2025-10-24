# Homer Enrichment Hub

Your Gateway to MathCounts & Enrichment Programs in Homer.

Simple registration. Clear schedules. One place for everything.

## Overview

Homer Enrichment Hub connects families with quality enrichment programs in our community. Founded by educators passionate about critical thinking and authentic learning, we provide a simple, professional platform for program registration and information.

## Quick Links

- Docs Index: `docs/README.md`
- Dev Setup: `docs/dev/QUICKSTART.md`
- Vercel Quickstart: `docs/VERCEL-QUICKSTART.md`
  

## Getting Started

To get started with development, open `src/app/page.tsx` and run:

```bash
bun install
bun run dev          # Dev server on port 9002 (Turbopack)
```

## Development

```bash
bun run build        # Production build
bun run start        # Run built app
bun run lint         # Biome lint
bun run format       # Biome format
bun run typecheck    # TypeScript diagnostics
bun run test         # Vitest
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

## Deployment

- Platform: Vercel (Next.js)
- Config: `vercel.json`
- Auto-Deploy: Enabled for `main` branch via Vercel GitHub App
- Guides: `docs/VERCEL-QUICKSTART.md`, `docs/VERCEL-CONFIG-REVIEW.md`

## Infrastructure

- Cloudflare DNS: `docs/cloudflare.md`, `docs/cloudflare-sendgrid-dns.md`
- Email (SendGrid): `docs/sendgrid-next-steps.md`, `docs/sendgrid-domain-decisions.md`
- Secrets: `docs/INFISICAL_SETUP.md` (Infisical) and `docs/secrets/`
- Error Tracking (Sentry): `docs/SENTRY-READY.md` ⭐ (configured & ready)

## Authentication

- Current: Supabase Auth

## Tech Stack

- Next.js 15 + React 19 + TypeScript 5.8
- Prisma 6 + Supabase (Postgres)
- Tailwind CSS 4 + shadcn/ui
- Bun 1.x

For a full documentation index, see `docs/README.md`.
