# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Homer Enrichment Hub (HEH) is a registration and information gateway for enrichment programs in Homer, Alaska. Built with Next.js 15, TypeScript, and Firebase Auth.

**IMPORTANT MIGRATION**: This project is migrating from homerenrichment.com to homerenrichment.com. See CLOUDFLARE_MIGRATION.md for details.

## Infrastructure Management

### Cloudflare DNS Management
This project uses the integrated Cloudflare management system:

```bash
# Quick DNS operations (context-aware)
cf dns list                          # List all DNS records
cf dns add A kbe 35.219.200.11      # Add subdomain
cf dns update kbe 35.219.200.12     # Update record
cf dns delete kbe                    # Remove record

# Direct cf-go CLI for advanced operations
cf-go dns list
cf-go diag token                    # Verify token access
cf-go api GET zones                 # Direct API calls
```

### Secret Management (gopass)
All tokens and credentials stored securely:
```bash
# Project tokens
gopass show -o cloudflare/tokens/projects/homerenrichment/dns
gopass show -o cloudflare/tokens/projects/homerenrichment/terraform

# General tokens  
gopass show -o cloudflare/tokens/human/readonly  # Safe read-only
gopass show -o cloudflare/tokens/human/full      # Management access
```

### Repository Navigation (ds CLI)
```bash
cd $(ds cd kbe-website)              # Jump to this project
cd $(ds cd cloudflare-management)    # Jump to Cloudflare IaC
ds status                            # Check all repo statuses
```

### Zone Information
- **Domain**: homerenrichment.com (migrating from homerenrichment.com)
- **Zone ID**: 7a95b1a3db5d14d1292fd04b9007ba32
- **Account ID**: 13eb584192d9cefb730fde0cfd271328
- **Subdomains**: kbe.homerenrichment.com (main site)

## Essential Commands

### Development

```bash
npm run dev          # Start dev server on port 9002 with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run typecheck    # TypeScript type checking (tsc --noEmit)
```

## Architecture Overview

### Tech Stack

- **Frontend**: Next.js 15.4.5 with App Router, React 19.0.0, TypeScript 5.7.3
- **Styling**: Tailwind CSS 4.0.0 with shadcn/ui components (Radix UI primitives)
- **Backend**: Firebase Auth with multiple providers (Email, Google, Magic Link)
- **Forms**: React Hook Form with Zod validation

### Key Directories

- `/src/app/` - Next.js App Router pages
- `/src/components/` - Reusable React components (shadcn/ui based)
- `/src/hooks/` - Custom React hooks (auth, mobile, toast)
- `/src/lib/` - Utilities and configurations

### Route Structure

- `/` - Login/authentication page with program navigation
- `/programs` - List of available enrichment programs
- `/programs/mathcounts` - Dedicated MathCounts information
- `/register` - 3-step registration flow
- `/schedule` - Unified calendar for all programs
- `/resources` - Curated external links
- `/dashboard` - Parent portal (auth required)
- `/admin` - Admin dashboard (redirects to registrations)

### Authentication Flow

- `AuthProvider` wraps the app with Firebase Auth context
- `use-auth` hook provides authentication state
- Protected routes automatically redirect to login
- 30-day session persistence with "Remember me" option

### Component Architecture

- All UI components follow shadcn/ui patterns with Radix UI
- Components use CSS variables for theming (light/dark modes)
- Form components integrate React Hook Form + Zod validation
- Dashboard uses widget-based architecture for modularity

## Important Notes

1. **Firebase Configuration**: Environment variables stored in Google Cloud Secret Manager. Local development uses `.env.local` (not in repo).

2. **Port Configuration**: Dev server runs on port 9002 (not default 3000)

3. **TypeScript Path Alias**: Use `@/` for imports from `/src/`

4. **No Test Setup**: No testing framework configured yet

5. **Deployment**: Firebase App Hosting via GitHub integration - push to main branch triggers automatic deployment (see DEPLOYMENT_METHOD.md)

6. **Build Errors**: Next.js config ignores TypeScript/ESLint errors during build

## Design System

- **Primary Color**: #008080 (Deep teal - trust, academic)
- **Secondary**: #B8860B (Gold - achievement, warmth)
- **Background**: #FAFAFA (Slightly warmer white)
- **Font**: Inter for all typography
- CSS variables support theme switching

## Firebase App Hosting Deployment

### Critical Requirements

1. **Dependencies**: ALL production dependencies must be in `dependencies`, NOT `devDependencies`. Firebase runs `npm ci --omit=dev` which skips devDependencies.
2. **TypeScript Path Aliases**: Firebase's buildpack automatically handles `@/*` imports via Next.js's built-in resolution. Do NOT add custom webpack configs.
3. **Global .gitignore**: Check `~/.gitignore_global` - files ignored globally won't be in the repo and will cause build failures.
4. **Environment Variables**: All secrets must be configured in Google Cloud Secret Manager and referenced in `apphosting.yaml`.

### Common Build Issues and Solutions

1. **"Module not found" errors**: Usually means files are missing from Git. Check both local and global .gitignore files.
2. **PostCSS/Tailwind errors**: Move @tailwindcss/postcss and related packages to `dependencies`.
3. **Firebase overwriting config**: This is expected behavior. Don't fight the buildpack - it needs to configure Next.js for serverless deployment.

### Build Script

The project uses a simple `next build` command. Firebase App Hosting automatically:

- Installs production dependencies only (`npm ci --omit=dev`)
- Configures Next.js for serverless deployment
- Handles TypeScript path resolution
- Manages Node.js version (currently 22)

### Secrets Configuration

All secrets are stored in Google Cloud Secret Manager and must be granted access:

```bash
firebase apphosting:secrets:grantaccess
```

Required secrets include:

- Firebase configuration (API keys, auth domain, etc.)
- Any third-party service credentials

## AI Assistant Guidelines (Copilot, Cursor, etc.)

### CRITICAL: Never move these to devDependencies
- `typescript`
- `@tailwindcss/postcss`
- `postcss`
- `tailwindcss`

These MUST remain in `dependencies` because Firebase App Hosting only installs production dependencies (`npm ci --omit=dev`). Moving them will break deployment.

### Other Important Rules
- Use Tailwind CSS v4 import syntax: `@import 'tailwindcss/base'`
- Don't add custom webpack configs to next.config.js
- Development server runs on port 9002

## Domain Migration: homerenrichment.com → homerenrichment.com

### Current Status
- 56 files reference homerenrichment.com
- Migration script available: `./migrate-domain.sh`
- Full guide: `CLOUDFLARE_MIGRATION.md`

### Quick Migration Commands
```bash
# 1. Update DNS records (using Cloudflare API)
export CLOUDFLARE_API_TOKEN=$(gopass show -o cloudflare/tokens/projects/homerenrichment/dns)
cf-go dns add A kbe 35.219.200.11

# 2. Run domain migration in code
./migrate-domain.sh

# 3. Update Firebase authorized domains
echo "Add homerenrichment.com and kbe.homerenrichment.com to:"
echo "https://console.firebase.google.com/project/kbe-website/authentication/settings"

# 4. Test the migration
npm run dev  # Check locally on port 9002
```

### DNS Records Needed
- A record: kbe → Firebase App Hosting IP
- CNAME records: SendGrid email authentication
- TXT records: SPF, DMARC for email

## Project Philosophy

Homer Enrichment Hub is designed as a simple, professional gateway for program registration and information. It is NOT an LMS (Learning Management System) and should avoid features that imply:

- Grade tracking or assessment
- Assignment management
- Course progress tracking
- Daily attendance monitoring
- Gamification elements

Instead, focus on:
- Simple, clear registration flows
- Easy access to schedules and information
- Professional parent-friendly interface
- Essential communication tools
- Basic registration management for admins