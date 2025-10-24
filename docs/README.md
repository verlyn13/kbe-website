# Documentation Index

Comprehensive, accurate documentation for the Homer Enrichment Hub project.

## Project Status

✅ Current stack: Supabase + Prisma (Aug 31, 2025)

## Quick Navigation

- Getting Started: `dev/QUICKSTART.md`, `VERCEL-QUICKSTART.md`
- Architecture: `blueprint.md`

## Categories

### Development
- `dev/` — setup, workspace, tooling
- Code quality: `dev/biome-migration-guide.md`, `dev/biome-fixes-plan.md`, `dev/package-json-updates.md`
- Testing & types: `dev/testing-type-fix-strategy.md`, `dev/biome-checklist.md`

### Deployment & Ops
- Vercel: `VERCEL-QUICKSTART.md`, `VERCEL-CONFIG-REVIEW.md`
- Cloudflare: `cloudflare.md`, `cloudflare-sendgrid-dns.md`
- Production Readiness: `ops/PRODUCTION_READINESS.md`, `ops/PRODUCTION_READINESS_PLAN.md`

### Security & Secrets
- Secrets: `INFISICAL_SETUP.md` (primary)

### Authentication
- Current: Supabase Auth (see codebase under `src/lib`, `src/hooks`)

### Email & Communications
- SendGrid: `sendgrid-next-steps.md`, `sendgrid-domain-decisions.md`

### Updates & Changelog
- `updates/` — project updates and decisions
- Recent: `updates/STAGE4_OPTIMIZATION_COMPLETE.md`, `updates/UPDATES_2025-10-23.md`



### Tools & Agents
- MCP: `tools/MCP_INTEGRATION_GUIDE.md`
- Roo: `tools/roo-setup.md`, `tools/roo-example.md`
- Design agent: `tools/WEBDESIGN_AGENT.md`

### Administrative & Legal
- `EULA.md`, `waiver.md`



## Tech Stack

- Frontend: Next.js 15 + React 19 + TypeScript 5.8
- Backend: Prisma + Supabase (Postgres)
- Auth: Supabase Auth
- Styling: Tailwind CSS 4 + shadcn/ui
- Package Manager: Bun 1.x
- Deploy: Vercel

## Guidelines

- Keep docs accurate and concise; link to canonical pages.
- Place new docs in a category directory and add a link here when useful.
- Remove stale or legacy docs to avoid confusion.

## Help

- Dev: `dev/QUICKSTART.md`, `VERCEL-QUICKSTART.md`
- Email: `sendgrid-next-steps.md`, `sendgrid-domain-decisions.md`
- Infra: `cloudflare.md`, `VERCEL-QUICKSTART.md`

---

Last updated: Oct 24, 2025
Project: Homer Enrichment Hub
Status: Active development (post-migration)
