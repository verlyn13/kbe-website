# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Homer Enrichment Hub (HEH) is a registration and information gateway for enrichment programs in Homer, Alaska. Built with Next.js 15, TypeScript, Supabase Auth, and Prisma.

System uses Supabase + Prisma stack (migration completed Aug 2025).

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

### Secret Management

**Primary: Infisical** (centralized secrets management)

```bash
# Self-hosted instance: https://secrets.jefahnierocks.com
# Project: homer-enrichment-ms-js
# Environment: prod

# Run commands with secrets injected
infisical run --env=prod -- bun run dev
infisical run --env=prod -- bunx prisma migrate dev

# List secrets
infisical secrets list --env=prod

# Export to .env.local (offline work)
infisical export --env=prod --format=dotenv > .env.local

# See: docs/INFISICAL_SETUP.md for complete guide
```

**Secondary: gopass** (for local-only secrets like Cloudflare tokens)

```bash
# Project tokens
gopass show -o cloudflare/tokens/projects/homerenrichment/dns
gopass show -o cloudflare/tokens/projects/homerenrichment/terraform
gopass show -o infisical/tokens/homer-enrichment  # Infisical service token

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

## Claude Code Quick Commands

This project includes helpful slash commands for common workflows:

```bash
/dev                # Start dev server with environment checks
/db-migrate         # Run Prisma migrations safely
/db-studio          # Open Prisma Studio for database inspection
/test-all           # Run complete test suite (tests, types, lint, build)
/deploy-check       # Pre-deployment validation checklist
/fix-env            # Debug environment variable issues
/update-deps        # Update dependencies with safety checks
```

## Advanced Orchestration & MCP Integration

### Agent Team Structure

This project uses specialized Claude Code agents for coordinated workflows:

- **orchestrator** - Master coordination and decision routing
- **heh-architect** - Educational platform architecture specialist
- **auth-engineer** - Supabase Auth and security expert
- **ui-craftsman** - Next.js + shadcn/ui accessibility specialist
- **deployment-manager** - Vercel deployment expert

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
1. Browser automation tests all auth providers (Email, Google OAuth, Magic Link)
2. Validates Supabase Auth integration
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
2. Vercel deployment health via mcp__fetch__
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
- Data: database-specialist + security auditor
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

1. **Secrets Management**: This project uses **Infisical** for centralized secrets. See `docs/INFISICAL_SETUP.md` for setup. Fallback to `.env.local` if needed (not in repo).

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

**Details**: See `docs/migration/CONSOLIDATION_COMPLETE.md` for full migration details.

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

## Domain Configuration

### Primary Domain
- **Production**: homerenrichment.com (via Vercel)
- **Subdomain**: kbe.homerenrichment.com (if needed)
- **DNS Management**: Cloudflare (see Infrastructure Management section)

### DNS Records Configuration

```bash
# Using Cloudflare CLI tools
cf dns list                    # View current DNS records
cf dns add A @ <vercel-ip>     # Point to Vercel
cf dns add CNAME www @         # WWW redirect

# SendGrid email authentication
cf dns add CNAME em1234 u1234.wl.sendgrid.net
cf dns add TXT @ "v=spf1 include:sendgrid.net ~all"
```

### Vercel Domain Setup

```bash
# Link domain to Vercel project
vercel domains add homerenrichment.com
vercel alias set <deployment-url> homerenrichment.com

# Check domain status
vercel domains ls
```

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
- **auth-engineer**: Supabase Authentication specialist
- **ui-craftsman**: Next.js + shadcn/ui + accessibility expert
- **deployment-manager**: Vercel deployment specialist
- **database-specialist**: PostgreSQL + Prisma expert
- **security-guardian**: Educational platform security specialist
- **test-engineer**: Comprehensive testing with Vitest and E2E

### Orchestration Best Practices

1. **Decomposition First**: Always break complex tasks into subtasks
2. **Parallel When Possible**: Use parallel agents for independent work
3. **Quality Gates**: Enforce validation between phases
4. **Context Preservation**: Use TodoWrite for cross-agent progress tracking
5. **Educational Platform Focus**: Remember this serves families and children

### Performance Optimization

- This file is read on every conversation, so keep it concise
- Use slash commands for common workflows (see Quick Commands above)
- Leverage MCP servers for specialized tasks (7 configured)
- Enable TodoWrite for complex multi-step tasks

### Project-Specific Context

This project is designed for:

- **Educational Platform Features**: Parent-centric, mobile-first design
- **Authentication Systems**: Multi-provider Supabase Auth (Email, Google OAuth, Magic Link)
- **Vercel Deployments**: Auto-deploy from main branch via Git integration
- **Family Data Security**: Privacy-first with Supabase RLS policies

**Common Workflows:**

- **Feature Development**: Plan → Implement → Test → Deploy
- **Bug Investigation**: Reproduce → Debug → Fix → Verify
- **Security Enhancement**: Audit → Implement → Test → Document
- **Database Changes**: Schema → Migration → Deploy → Verify

### Educational Platform Context

**Core Philosophy**: Simple registration gateway for enrichment programs

- **Target Users**: Busy parents, often on mobile devices
- **NOT an LMS**: Avoid grade tracking, assignments, complex features
- **Trust-Building**: Professional, reliable experience
- **Accessibility-First**: WCAG 2.1 AA compliance minimum

**Current Architecture Status**: 90% production ready

- ✅ Supabase Auth fully migrated and working
- ✅ Vercel deployment configured
- ✅ Database schema with RLS policies
- ✅ Modern tooling (Bun, Next.js 15, React 19, Tailwind v4)
- ⚠️ **Missing**: Supabase environment variables in `.env.local` (see `.env.example`)
- ⚠️ **Missing**: Vercel project linking (`vercel link`)
- 📋 See `ops/PRODUCTION_READINESS.md` for complete deployment checklist
