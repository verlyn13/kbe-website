# Homer Enrichment Hub

Your Gateway to MathCounts & Enrichment Programs in Homer.

Simple registration. Clear schedules. One place for everything.

## Overview

Homer Enrichment Hub connects families with quality enrichment programs in our community. Founded by educators passionate about critical thinking and authentic learning, we provide a simple, professional platform for program registration and information.

## Getting Started

To get started with development, take a look at src/app/page.tsx.

## Development

```bash
npm run dev          # Start dev server on port 9002
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run typecheck    # TypeScript type checking
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
