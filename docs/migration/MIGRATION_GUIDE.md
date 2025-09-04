# Documentation Migration Guide

**Purpose**: Consolidated guide for documentation migration work  
**Stack**: Vercel + Cloudflare DNS + Supabase + Prisma + Bun  
**Status**: Active reference for ongoing migration

## Quick Start

### Current Tech Stack (Canonical)
```yaml
Hosting: Vercel (Next.js 15.5+ deployment)
DNS: Cloudflare (zone management only - NO Workers/Pages/KV)
Database: Supabase (PostgreSQL with RLS)
ORM: Prisma (source of truth for data model)
Auth: Supabase Auth with Row Level Security
Runtime: Bun 1.2.21
Styling: Tailwind CSS v4
Secrets: gopass (local), Vercel Environment Variables (production)
```

### Migration Principles

1. **One fact = one home** - Link to it; don't duplicate it
2. **Sources of truth are config files** - Not documentation
3. **Generated docs go in `docs/_generated/`** - With "Do not edit" banner
4. **Every PR that changes config must update docs** - And changelog

## Document Classification Strategy

### Categories & Patterns

| Category | Patterns | Action |
|----------|----------|--------|
| **auth-security** | `/auth/`, `firebase.*auth`, `supabase.*auth`, RLS, JWT | Extract patterns → `docs/api/auth.md` |
| **db-api** | `prisma`, `supabase`, `postgres`, `/api/`, schema | Keep current → `docs/dev/database.md` |
| **deploy-infra** | `vercel`, `cloudflare`, DNS, hosting, CI/CD | Update stack → `docs/ops/deploy.md` |
| **dev-setup** | environment, config, tools, IDE, development | Consolidate → `docs/dev/*` |
| **ops-runbook** | runbook, troubleshoot, recovery, incident | Expand → `docs/ops/runbooks/*` |
| **legacy-archive** | Firebase hosting, Cloudflare Workers, old stack | Archive with tombstone |

### Value Scoring

```javascript
// High Value (KEEP)
- Current stack mentions (Supabase, Vercel, Prisma)
- Universal patterns (auth flows, error handling)
- Active configuration

// Medium Value (MAYBE)
- Mixed stack references
- Partially applicable patterns
- Historical context needed

// Low Value (ARCHIVE)
- Pure Firebase content
- Obsolete configurations
- Superseded approaches
```

## Migration Workflow

### Phase 1: Discovery & Classification
```bash
# Run classifier
bun tools/doc-classifier.ts --root docs/archive --out-json out/docs_report.json

# Generate dashboard
bun tools/docs-dashboard.ts --in out/docs_report.json --out docs/migration/triage-dashboard.md

# Review classifications
cat docs/migration/triage-dashboard.md
```

### Phase 2: Extract & Integrate
```bash
# For each KEEP file:
1. Read content and identify valuable patterns
2. Find or create canonical destination
3. Integrate content with proper attribution
4. Add tombstone to source file
5. Update frontmatter in destination
```

### Phase 3: Verify & Clean
```bash
# Run verification
bun run docs:metrics

# Check broken links
bun run docs:links

# Validate frontmatter
bun run docs:check
```

## Frontmatter Standards

All canonical documentation must include:

```yaml
---
status: canonical | draft | deprecated
owner: "@username"
last_verified: "YYYY-MM-DD"
sources: [optional list of merged docs]
stack: [optional specific stack components]
---
```

## File Organization

### Canonical Structure
```
docs/
├── README.md              # Project overview
├── architecture.md        # System architecture
├── changelog.md          # All changes
├── api/
│   └── auth.md          # Authentication & authorization
├── dev/
│   ├── config-registry.md  # Configuration index
│   ├── database.md         # Database setup
│   ├── environment.md      # Environment variables
│   ├── secrets-gopass.md   # Secret management
│   └── tools.md           # Development tools
├── ops/
│   ├── cloudflare.md      # DNS management
│   ├── deploy.md          # Deployment guide
│   └── runbooks/
│       ├── auth-errors.md
│       ├── database-migration.md
│       ├── supabase-policies.md
│       └── cold-starts-ssr.md
└── _generated/
    └── supabase-types.ts  # Generated, do not edit
```

### Archive Structure
```
docs/archive/
├── _intake_auth/     # Processed auth documentation
├── legacy-firebase/  # Firebase-specific content
└── [categories]/     # Other archived content
```

## Processing Checklist

For each document being migrated:

- [ ] Classify using patterns (auth, db, deploy, etc.)
- [ ] Score value (KEEP, MAYBE, ARCHIVE)
- [ ] Extract universal patterns
- [ ] Find canonical destination
- [ ] Integrate with attribution
- [ ] Add/update frontmatter
- [ ] Create tombstone in source
- [ ] Update changelog
- [ ] Verify no broken links

## Common Patterns to Extract

### From Firebase → Supabase
- Authentication flows → Apply to Supabase Auth
- Security rules → Convert to RLS policies
- Cloud Functions → Edge Functions or API routes
- Firestore queries → PostgreSQL with Prisma

### Universal Patterns (Always Extract)
- Environment variable management
- Secret rotation procedures
- Error handling strategies
- Performance optimization
- Security best practices
- CI/CD workflows
- Monitoring approaches

## Tombstone Format

When archiving or moving content:

```markdown
> **⚠️ ARCHIVED: YYYY-MM-DD**
> [Reason for archival]
> [Where content was moved/merged]
```

Example:
```markdown
> **⚠️ ARCHIVED: 2025-08-28**
> Firebase-specific auth content. 
> Universal patterns extracted to docs/api/auth.md
```

## Tools & Commands

### Classification Tools
```bash
# Classify documents
bun tools/doc-classifier.ts --root docs --out-json report.json

# Generate dashboard
bun tools/docs-dashboard.ts --in report.json --out dashboard.md

# Check metrics
bun tools/docs-metrics.ts --root docs --out metrics.json
```

### Validation Tools
```bash
# Lint markdown
bun run docs:lint

# Check links
bun run docs:links

# Full check
bun run docs:check
```

### Migration Scripts
```bash
# Located in scripts/
scripts/check-legacy-config.sh  # Block legacy configs
scripts/check-env-files.sh      # Prevent secrets
scripts/check-types.sh          # Validate generation
```

## Related Documents

- `MIGRATION_STATUS.md` - Current migration status
- `lessons-learned.md` - Patterns and insights
- `vetting-framework.md` - Document evaluation criteria
- `classification-strategy.md` - Detailed classification rules