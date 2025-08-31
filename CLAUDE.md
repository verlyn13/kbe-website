# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Homer Enrichment Hub (HEH) is a registration and information gateway for enrichment programs in Homer, Alaska. Built with Next.js 15, TypeScript, Supabase Auth, and Prisma.

**MIGRATION COMPLETE**: Successfully migrated from Firebase to Supabase + Prisma stack. See `docs/migration/migration-completed.md` for details.

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

## Advanced Orchestration & MCP Integration

### Agent Team Structure

This project uses specialized Claude Code agents for coordinated workflows:

- **orchestrator** - Master coordination and decision routing
- **heh-architect** - Educational platform architecture specialist
- **auth-engineer** - Firebase Auth and App Check security expert
- **ui-craftsman** - Next.js + shadcn/ui accessibility specialist
- **deployment-manager** - Firebase App Hosting deployment expert

### Orchestration Commands

```bash
# Feature development workflow (4-phase with quality gates)
/heh-feature-development "Build waitlist registration system"

# Multi-agent debugging workflow
/heh-debug-issue "Parents can't complete registration on mobile"

# Deployment monitoring and validation
/heh-deploy "Deploy authentication updates to production"
```

### MCP Server Capabilities

The project is configured with 7 MCP servers for enhanced functionality:

```bash
# GitHub integration for repository operations
mcp__github__* functions - PR management, issue tracking, workflow monitoring

# Memory bank for persistent context across sessions
mcp__memory-bank__* functions - Decision logging, progress tracking, context management

# Browser automation for E2E testing
mcp__puppeteer__* functions - Authentication flow testing, mobile simulation

# File system operations with security boundaries
mcp__filesystem__* functions - Code analysis, configuration management

# Web research and content analysis
mcp__brave-search__* and mcp__fetch__* functions - Educational platform research

# Complex reasoning for architecture decisions
mcp__sequential-thinking__* functions - Multi-step problem solving
```

### Educational Platform Workflow Patterns

#### E2E Authentication Testing

```bash
# Automated workflow using puppeteer + memory-bank + github
1. Browser automation tests all auth providers
2. Validates reCAPTCHA Enterprise integration
3. Stores results in memory bank
4. Creates GitHub issues for failures
```

#### Parent Journey Validation

```bash
# Mobile-first testing workflow
1. Simulate parent on mobile device (busy, distracted context)
2. Test touch-friendly interactions and accessibility
3. Validate registration flow under real conditions
4. Document UX issues with specific recommendations
```

#### Deployment Intelligence

```bash
# Coordinated deployment monitoring
1. GitHub workflow status via mcp__github__
2. Firebase App Hosting health via mcp__fetch__
3. Performance metrics collection and analysis
4. Automated rollback triggers for quality issues
```

### Agent Coordination Patterns

#### Sequential Workflows

```typescript
// Phase-based execution with quality gates
Phase 1: Architecture & Planning (orchestrator → heh-architect)
Phase 2: Implementation (ui-craftsman + auth-engineer parallel)
Phase 3: Security & Testing (sequential validation)
Phase 4: Deployment (deployment-manager with monitoring)
```

#### Parallel Investigation

```typescript
// Multi-agent debugging for complex issues
Route by category:
- Authentication: auth-engineer + security specialist
- UI/UX: ui-craftsman + accessibility validator
- Infrastructure: deployment-manager + performance analyst
- Data: firebase-specialist + security auditor
```

#### Context-Aware Routing

```typescript
// Educational platform specific decision tree
Parent impact: High → Immediate specialist assignment
Registration period: Active → Enhanced monitoring workflows
Mobile usage: 60%+ → Mobile-first testing protocols
Trust critical: Always → Security-first approach
```

## Essential Commands

### Development

```bash
bun run dev          # Start dev server on port 9002 with Turbopack
bun run build        # Build for production
bun run start        # Start production server
bun run lint         # Run ESLint
bun run typecheck    # TypeScript type checking (tsc --noEmit)
```

### Package Management

This project uses **Bun** (v1.2.21+) as the package manager:

```bash
bun install          # Install dependencies
bun add <package>    # Add a dependency
bun add -D <package> # Add a dev dependency
bun ci               # Install with frozen lockfile (for CI)
bunx <command>       # Execute package binaries (replaces npx)
```

## Architecture Overview

### Tech Stack

- **Frontend**: Next.js 15.4.5 with App Router, React 19.0.0, TypeScript 5.8.3
- **Styling**: Tailwind CSS 4.0.0 with shadcn/ui components (Radix UI primitives)
- **Backend**: Supabase Auth with multiple providers (Email, Google, Magic Link)
- **Database**: PostgreSQL via Supabase with Prisma 6.15.0 ORM
- **Forms**: React Hook Form with Zod validation

### Key Directories

- `/src/app/` - Next.js App Router pages
- `/src/components/` - Reusable React components (shadcn/ui based)
- `/src/hooks/` - Custom React hooks (Supabase auth, mobile, toast)
- `/src/lib/` - Utilities, configurations, and services
- `/src/lib/services/` - Prisma-based data services
- `/src/lib/supabase/` - Supabase client and server utilities
- `/prisma/` - Database schema and migrations

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

- `SupabaseAuthProvider` wraps the app with Supabase Auth context
- `useSupabaseAuth` hook provides authentication state
- Protected routes automatically redirect to login
- Session persistence handled by Supabase Auth cookies

### Component Architecture

- All UI components follow shadcn/ui patterns with Radix UI
- Components use CSS variables for theming (light/dark modes)
- Form components integrate React Hook Form + Zod validation
- Dashboard uses widget-based architecture for modularity

## Important Notes

1. **Supabase Configuration**: Environment variables for Supabase and PostgreSQL. Local development uses `.env.local` (not in repo).

2. **Port Configuration**: Dev server runs on port 9002 (not default 3000)

3. **TypeScript Path Alias**: Use `@/` for imports from `/src/`

4. **Database**: Prisma with PostgreSQL via Supabase. Use `runtime = 'nodejs'` for Prisma routes.

5. **Testing**: Vitest configured with test utilities. Run `bun run test` for unit tests.

6. **Deployment**: Vercel deployment ready. Push to main branch for automatic deployment.

6. **Build Errors**: Next.js config ignores TypeScript/ESLint errors during build

## ✅ Migration Complete: Firebase to Supabase

**Status**: Successfully migrated from Firebase to Supabase + Prisma stack.

**New Authentication**: Supabase Auth handles all authentication flows including:
- Email/password authentication
- Google OAuth
- Magic link sign-in
- Password reset flows

**Database**: PostgreSQL via Supabase with Prisma ORM and Row Level Security (RLS) policies.

**Details**: See `docs/migration/migration-completed.md` for full migration details.

## Design System

- **Primary Color**: #008080 (Deep teal - trust, academic)
- **Secondary**: #B8860B (Gold - achievement, warmth)
- **Background**: #FAFAFA (Slightly warmer white)
- **Font**: Inter for all typography
- CSS variables support theme switching

## Vercel Deployment

### Critical Requirements

1. **Dependencies**: ALL production dependencies must be in `dependencies`, NOT `devDependencies`. Vercel installs production deps for serverless functions.
2. **TypeScript Path Aliases**: Next.js automatically handles `@/*` imports. No custom webpack config needed.
3. **Database Runtime**: Use `export const runtime = 'nodejs'` for Prisma API routes.
4. **Environment Variables**: Configure in Vercel dashboard or use `.env.local` for development.

### Database Connection

- **Connection Pooling**: Use pooled connection URLs for serverless compatibility
- **Prisma Client**: Singleton pattern prevents connection exhaustion
- **Runtime**: Prisma requires Node.js runtime (not Edge)

### Build Configuration

The project uses standard Next.js build with Vercel's optimizations:

- Automatic serverless function creation for API routes
- Static page generation where possible
- TypeScript compilation and path resolution
- Bun as package manager (configured in Vercel)

### Environment Variables

Required environment variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `DATABASE_URL` (pooled connection)
- `DIRECT_URL` (for migrations)

## AI Assistant Guidelines (Copilot, Cursor, etc.)

### CRITICAL: Never move these to devDependencies

- `typescript`
- `@tailwindcss/postcss`
- `postcss`
- `tailwindcss`
- `@prisma/client`

These MUST remain in `dependencies` for Vercel deployment compatibility.

### Other Important Rules

- Use Tailwind CSS v4 import syntax: `@import 'tailwindcss/base'`
- Add `export const runtime = 'nodejs'` for Prisma API routes
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

## Agentic Orchestration Configuration

### Available Orchestration Patterns

**Multi-Agent Workflows:**

- Use **Task tool** for spawning specialized subagents
- Prefix complex requests with **"think hard"** for deep analysis
- Use **"/heh-feature-development"** for complete feature development
- Use **"/heh-debug-issue"** for complex debugging workflows
- Use **"/heh-deploy"** for deployment monitoring and validation

**Subagent Specializations:**

- **orchestrator**: Master coordinator (always start here for complex tasks)
- **heh-architect**: Educational platform architecture and design
- **auth-engineer**: Firebase Authentication + App Check specialist
- **ui-craftsman**: Next.js + shadcn/ui + accessibility expert
- **deployment-manager**: Firebase App Hosting deployment specialist
- **firebase-specialist**: Firebase services integration expert
- **security-guardian**: Educational platform security specialist
- **test-engineer**: Comprehensive testing with Vitest and E2E

### Orchestration Best Practices

1. **Decomposition First**: Always break complex tasks into subtasks
2. **Parallel When Possible**: Use parallel agents for independent work
3. **Quality Gates**: Enforce validation between phases
4. **Context Preservation**: Use TodoWrite for cross-agent progress tracking
5. **Educational Platform Focus**: Remember this serves families and children

### Performance Optimization

- Use **claude-opus-4-1-20250805** for complex orchestration and planning
- Use **claude-3-5-sonnet-20241022** for implementation work
- Use **claude-3-5-haiku-20241022** for simple validation tasks
- Enable prompt caching for repeated workflows

### Project-Specific Orchestration

This project includes specialized workflows for:

- **Educational Platform Features**: Parent-centric, mobile-first design
- **Authentication Systems**: Multi-provider Firebase Auth + App Check
- **Firebase App Hosting Deployments**: Auto-deploy from main branch
- **Family Data Security**: COPPA compliance and privacy protection

**Orchestration Commands Available:**

```bash
/heh-feature-development "Build waitlist system"
/heh-debug-issue "Fix authentication failures"
/heh-deploy "Monitor production deployment"
```

**Agent Coordination Patterns:**

- **Feature Development**: heh-architect → ui-craftsman + auth-engineer → test-engineer → deployment-manager
- **Bug Investigation**: orchestrator → appropriate specialists (parallel) → solution implementation
- **Security Enhancement**: security-guardian → auth-engineer + firebase-specialist → test-engineer

### Educational Platform Context

**Core Philosophy**: Simple registration gateway for enrichment programs

- **Target Users**: Busy parents, often on mobile devices
- **NOT an LMS**: Avoid grade tracking, assignments, complex features
- **Trust-Building**: Professional, reliable experience
- **Accessibility-First**: WCAG 2.1 AA compliance minimum

**Current Architecture Status**: 75% production ready

- Authentication working (needs ToS modal fix)
- Firebase App Hosting deployed and functional
- reCAPTCHA Enterprise + App Check configured
- Push to main → automatic deployment (3-5 minutes)
