# Documentation Migration Plan - Reference Guide

## Executive Summary

This guide defines the complete migration plan for consolidating and modernizing documentation around the **finalized tech stack**:

- **DNS:** Cloudflare (DNS/SSL termination only)
- **Hosting/Runtime:** Vercel (Next.js 15.5+, Bun)
- **Database:** Supabase (Postgres) via Prisma (schema SoT)
- **Auth:** Supabase Auth (+ RLS)
- **Secrets:** gopass (local) + Vercel Project Env (preview/prod)

---

## Core Principles

### Non-Negotiables (Must appear in main `README.md`)

- **One fact = one home.** Link to it; don't duplicate it.
- **Sources of truth:**
  - Configs: repo files (`/prisma/schema.prisma`, `/supabase/config/*`, `bunfig.toml`, `tailwind.config.ts`, `next.config.ts`)
  - Secrets: **gopass** (never in docs) + Vercel Project Env
  - Types/DB: Prisma schema; Supabase introspection/types
- **Generated docs** go under `docs/_generated/` with a banner: "Do not edit."
- Every PR that changes config, schema, or infra **must** update the corresponding doc and `docs/changelog.md`

---

## Target Documentation Structure

```text
docs/
  README.md
  architecture.md
  changelog.md
  glossary.md
  standards.md

  _contributing/
    docs-maintenance.md
    templates.md
    styleguide.md
    linting.md

  _generated/
    supabase-types.ts
    prisma-schema.md

  dev/
    setup.md
    environment.md
    secrets-gopass.md
    local-dev.md
    database.md
    supabase.md
    tailwind.md
    nextjs.md
    debugging.md
    tools.md              # VS Code, Claude/MCP, Codex usage & guardrails
    config-registry.md    # Index of all config files, owner, status

  ops/
    deploy.md            # Vercel-primary deployment
    cloudflare.md        # DNS-only configuration
    runtime.md
    monitoring.md
    backups.md
    incidents.md
    runbooks/
      auth-errors.md
      database-migration.md
      supabase-policies.md
      cold-starts-ssr.md

  api/
    README.md
    data-model.md
    auth.md
    endpoints.md
    rpc.md

  user/
    onboarding.md
    guides/
      feature-a.md
      feature-b.md
    faq.md

  decisions/
    adr-0001-initial-architecture.md
    adr-0002-switch-to-supabase.md
    adr-0003-bun-as-runtime.md
    adr-0004-vercel-primary.md
    TEMPLATE-ADR.md

  migration/
    index.md
    playbooks.md
    triage-dashboard.md
    firebase-archive.md
    checklists/
      cutover-checklist.md
      deprecation-checklist.md
    triage/              # MAYBE docs pending review

  archive/
    firebase/
    vercel/
    experiments/
```

---

## Migration Phases

### Current Status
- ✅ **Phase 1** (Inventory/Freeze): Complete - legacy docs in `docs/archive/`
- ✅ **Phase 1b** (Automated Triage): Classifier + dashboard operational
- 🚧 **Phase 2** (Rehydrating Canon): Core pages drafted, needs completion
- ⏳ **Phase 3** (Runbooks & Deprecations): Not started

### Phase 1: Inventory & Freeze [COMPLETE]
- All raw docs moved to `docs/archive/`
- Initial classification complete

### Phase 1b: Automated Classification [COMPLETE]
- **Tool:** `tools/doc-classifier.ts`
- **Output:** `out/docs_report.json` and `out/docs_report.csv`
- **Dashboard:** `docs/migration/triage-dashboard.md`
- **Categories:** KEEP, MAYBE, ARCHIVE, DELETE
- **Flags:** Secrets detection, mixed stack detection

### Phase 2: Rehydrate the Canon [IN PROGRESS]

#### A. Finalize Canonical Docs (Definition of Done)

| Document | Requirements | Status |
|----------|-------------|--------|
| `ops/deploy.md` | Vercel-primary flow, preview/prod, build & migrate steps, Vercel Env mapping | 🚧 |
| `ops/cloudflare.md` | DNS records, SSL mode, apex → Vercel notes, explicitly NO Workers/Pages | 🚧 |
| `dev/environment.md` | Full env table (public vs server), source (gopass/Vercel), load order | 🚧 |
| `dev/secrets-gopass.md` | Paths, get/insert commands, rotation policy | 🚧 |
| `dev/database.md` | Prisma workflow, migration policy, seeding, link to generated types | 🚧 |
| `api/auth.md` | Supabase providers, redirect origins, session/RLS model | 🚧 |
| `dev/tools.md` | VS Code, Claude/MCP, Codex configuration and guardrails | ⏳ |
| `dev/config-registry.md` | Complete index of config files with owner and status | ⏳ |

#### B. Merge KEEP Content
1. Use `docs/migration/triage-dashboard.md` to identify highest-confidence KEEP files
2. Start with `auth-security` and `db-api` categories
3. For each KEEP file:
   - Merge net-new facts into appropriate canonical doc
   - Add tombstone link in archived original
   - Mark complete in migration index

#### C. Update Classifier Rules
```javascript
// Current stack (KEEP)
- Vercel (hosting/runtime only, not legacy auth)
- Supabase, Prisma, Bun
- Next.js 15.5+, Tailwind v4

// Legacy stack (ARCHIVE)
- Firebase/GCP
- Cloudflare Workers/Pages
- Vercel Auth (legacy)
```

#### D. Supabase Types Strategy
- If project ref available: Add local command + CI job for `docs/_generated/supabase-types.ts`
- If not: Keep placeholder with "DO NOT EDIT" banner
- CI: Warning (not failure) when ref unavailable

### Phase 3: Runbooks & Deprecations [PLANNED]

#### A. Priority Runbooks
1. `ops/runbooks/auth-errors.md` - Supabase auth failures, redirect mismatch, RLS deny
2. `ops/runbooks/database-migration.md` - Safe deploy, hotfix, rollback
3. `ops/runbooks/supabase-policies.md` - RLS audit + typical patterns
4. `ops/runbooks/cold-starts-ssr.md` - SSR timeouts, caching/revalidation

**Format:** Symptoms → Checks → Commands → Rollback → Verification

#### B. Platform Decision Record
- Create `decisions/adr-0004-vercel-primary.md`
- Document alternatives considered, consequences, deprecation timeline

#### C. Execute Deprecations
- Set sunset date for Firebase/Cloudflare runtime artifacts
- Move files to `docs/archive/` with tombstones
- Tighten CI to block re-introduction

---

## Configuration Alignment

| Category | Files/Patterns | Action | Doc Home | Notes |
|----------|---------------|--------|----------|-------|
| **App Core** | `package.json`, `bunfig.toml`, `next.config.*`, `tsconfig.json` | Keep | `dev/nextjs.md`, `standards.md` | Mirror version targets |
| **Styling** | `tailwind.config.ts`, `postcss.config.js` | Keep | `dev/tailwind.md` | Tailwind v4 conventions |
| **Vercel** | `vercel.json`, Vercel Project Env | Keep (canonical) | `ops/deploy.md` | Build/runtime flow |
| **Cloudflare** | Zone records only | Keep | `ops/cloudflare.md` | DNS only, no Workers |
| **CI/CD** | `.github/workflows/*.yml` | Keep & fence | `ops/deploy.md` | Add audit jobs |
| **DB/Types** | `prisma/schema.prisma`, `docs/_generated/*` | Keep | `dev/database.md` | Prisma is SoT |
| **Env Template** | `.env.example` | Keep | `dev/environment.md` | No secrets |
| **Forbidden** | `.env.production*`, prod `.env*` | Remove | — | Use Vercel Env |
| **Legacy** | `firebase.json`, `.firebaserc`, `wrangler.toml` | Archive | `migration/index.md` | Tombstone to new docs |
| **DX Tools** | `.vscode/*`, `CLAUDE.md`, `.mcp.json`, `codex.toml` | Keep | `dev/tools.md` | Document & guard |

---

## CI/CD Guardrails

### Required CI Checks

```yaml
# 1. Legacy Config Fence
check-legacy-config:
  - Block edits to: firebase.*, .firebaserc, wrangler.toml
  - Exception: PRs labeled 'allow-legacy-cleanup'

# 2. Environment Policy
check-env-files:
  - Only .env.example allowed in repo
  - Block .env.production*, .env.local

# 3. Type Freshness
check-types:
  - On prisma/schema.prisma changes: validate + generate
  - If Supabase ref present: regenerate types
  - Fail if uncommitted changes in docs/_generated/

# 4. Docs Quality
check-docs:
  - markdownlint '**/*.md' --ignore node_modules --ignore docs/_generated
  - markdown-link-check

# 5. DX Config Validation
check-dx-syntax:
  - Validate JSON/TOML syntax in .vscode/*, .mcp.json, codex.toml

check-dx-policy:
  - No secrets patterns
  - Commands restricted to allowed Bun scripts
  - Filesystem allowlist (no .env*, no docs/_generated/)
```

---

## Tooling & Commands

### Package.json Scripts

```json
{
  "scripts": {
    "docs:lint": "markdownlint '**/*.md' --ignore node_modules --ignore docs/_generated",
    "docs:gen:supabase": "supabase gen types typescript --schema public > docs/_generated/supabase-types.ts",
    "docs:classify": "bun tools/doc-classifier.ts --rules tools/rules.json --root . --out-json out/docs_report.json --out-csv out/docs_report.csv --print-mv --dry-run",
    "docs:dashboard": "bun tools/build-dashboard.ts",
    "prisma:generate": "bunx --bun prisma generate",
    "prisma:migrate:deploy": "bunx --bun prisma migrate deploy"
  }
}
```

### Useful Commands

```bash
# Reclassify archive + rebuild dashboard
bun run docs:classify && bun run docs:dashboard

# List KEEP files for batch moving
jq -r '.[] | select(.value_score=="keep" and (.action|startswith("move:"))) |
"mkdir -p \(.proposed_dest | split("/")[:-1] | join("/"))\n" +
"git mv \"\(.file_path)\" \"\(.proposed_dest)\""' out/docs_report.json

# Dry run to preview moves
jq -r '.[] | select(.value_score=="keep") | "Would move: \(.file_path) → \(.proposed_dest)"' out/docs_report.json

# Run CI checks locally
bash scripts/check-legacy-config.sh
bash scripts/check-env-files.sh
bash scripts/check-types.sh
bash scripts/check-dx-syntax.sh
bash scripts/check-dx-policy.sh
```

---

## Definition of Done

### Phase 2 Completion Checklist
- [ ] All KEEP docs merged into canonical locations
- [ ] MAYBE docs triaged (promote or archive)
- [ ] Core docs meet Definition of Done:
  - [ ] `architecture.md` - system overview with diagrams
  - [ ] `dev/environment.md` - complete env table
  - [ ] `dev/secrets-gopass.md` - all paths documented
  - [ ] `dev/database.md` - Prisma workflow complete
  - [ ] `ops/deploy.md` - Vercel flow documented
  - [ ] `api/auth.md` - Supabase auth complete
  - [ ] `dev/tools.md` - DX tools documented
  - [ ] `dev/config-registry.md` - all configs indexed

### Phase 3 Completion Checklist
- [ ] Top 4 runbooks created and tested
- [ ] ADR-0004 (Vercel-primary) documented
- [ ] Legacy configs archived with sunset dates
- [ ] All CI guardrails green

### Migration Complete Criteria
- [ ] **Docs:** Canon complete, archive organized, migration index closed
- [ ] **Configs:** Registry complete, legacy sunset, .env.example matches docs
- [ ] **Tooling:** Classifier stable, dashboard functional
- [ ] **CI:** All checks passing (config, env, types, docs, DX)
- [ ] **Changelog:** All changes documented with dates

---

## Quick Reference

### File Locations
- **Classifier:** `tools/doc-classifier.ts`
- **Dashboard:** `docs/migration/triage-dashboard.md`
- **Report:** `out/docs_report.json`, `out/docs_report.csv`
- **Rules:** `tools/rules.json`

### Key Paths
- **Canonical docs:** `/docs/`
- **Archive:** `/docs/archive/`
- **Triage queue:** `/docs/migration/triage/`
- **Generated:** `/docs/_generated/`

### Stack Reference
- **Runtime:** Bun + Next.js 15.5+ on Vercel
- **Database:** Supabase Postgres + Prisma ORM
- **Auth:** Supabase Auth + RLS
- **Secrets:** gopass (local) + Vercel Env (deployed)
- **DNS:** Cloudflare (DNS only, no Workers/Pages)

---

## Next Actions

1. **Immediate:** Complete Phase 2 canonical docs using Definition of Done criteria
2. **This week:** Process all KEEP files from dashboard
3. **Next week:** Create priority runbooks, implement CI guardrails
4. **Two weeks:** Complete deprecations, close migration

---

*Last Updated: Migration Phase 2 in progress*
