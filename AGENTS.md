# AGENTS.md - Codex CLI Project Configuration

This file provides project-specific configuration for Codex CLI agents when working with the Homer Enrichment Hub (kbe-website) codebase.

## Project Overview

Homer Enrichment Hub is a Next.js 15 registration portal for enrichment programs in Homer, Alaska.

## Tech Stack

- **Framework**: Next.js 15.4.5 with App Router
- **Language**: TypeScript 5.7.3
- **UI**: Tailwind CSS 4.0.0 + shadcn/ui (Radix UI)
- **Auth**: Firebase Auth (Email, Google, Magic Link)
- **Database**: Firestore
- **Deployment**: Firebase App Hosting
- **Forms**: React Hook Form + Zod validation

## Essential Commands

```bash
# Development
npm run dev          # Start dev server on port 9002
npm run build        # Production build
npm run start        # Start production server

# Quality Checks
npm run lint         # ESLint
npm run typecheck    # TypeScript checking (tsc --noEmit)

# Deployment (automatic via GitHub push to main)
git push origin main # Triggers Firebase App Hosting deployment
```

## Project Rules

1. **Port Configuration**: Dev server MUST run on port 9002 (not 3000)
2. **Dependencies**: Production deps in `dependencies`, NOT `devDependencies` (Firebase requirement)
3. **TypeScript Paths**: Use `@/` for imports from `/src/`
4. **No Test Framework**: Tests not configured yet
5. **Build Errors**: Next.js ignores TS/ESLint errors during build (configured)
6. **Environment Variables**: Use `.env.local` for dev, Google Cloud Secret Manager for prod

## Critical Warnings

### Firebase App Hosting Requirements
- ALL production dependencies MUST be in `dependencies` section
- These packages MUST stay in `dependencies`:
  - `typescript`
  - `@tailwindcss/postcss`
  - `postcss`
  - `tailwindcss`
- Moving them to `devDependencies` will break deployment

### Domain Migration
- Currently migrating from homerenrichment.com to homerenrichment.com
- Use `./migrate-domain.sh` script for migration
- Check `CLOUDFLARE_MIGRATION.md` for details

## Security Requirements

1. **Firebase Config**: Never commit API keys directly - use environment variables
2. **Secrets Management**: Use gopass for local dev, Google Cloud Secret Manager for prod
3. **Auth Domains**: Must be configured in Firebase Console
4. **API Key Restrictions**: Browser keys must have HTTP referrer restrictions

## File Structure

```
/src/
├── app/           # Next.js App Router pages
├── components/    # React components (shadcn/ui based)
├── hooks/         # Custom React hooks
├── lib/           # Utilities and configurations
└── providers/     # Context providers
```

## Common Tasks

### Add a new page
1. Create file in `/src/app/[route]/page.tsx`
2. Use existing layout patterns from other pages
3. Import components from `@/components/`

### Update Firebase configuration
1. Edit `.env.local` for development
2. Update secrets in Google Cloud Secret Manager for production
3. Run `firebase apphosting:secrets:grantaccess` if adding new secrets

### Fix type errors
1. Run `npm run typecheck` to see all errors
2. Check `audit/testing-type-fix-strategy.md` for common solutions
3. Use typed wrappers for dynamic imports when needed

### Deploy to production
1. Ensure all changes committed: `git status`
2. Push to main branch: `git push origin main`
3. Monitor deployment: Check GitHub Actions or Firebase Console

## Codex Profile Recommendations

- **Quick fixes**: Use `speed` profile
- **New features**: Use `auto` profile (smart routing)
- **Refactoring**: Use `codegen` profile
- **Documentation**: Use `teach` profile
- **Type issues**: Use `depth` profile for complex analysis

## Contact & Support

- Project: Homer Enrichment Hub
- Domain: homerenrichment.com (migrating to homerenrichment.com)
- Firebase Project: kbe-website