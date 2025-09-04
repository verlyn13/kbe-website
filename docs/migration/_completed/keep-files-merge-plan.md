# KEEP Files Merge Plan

This document tracks the plan for merging 152 KEEP files from the archive into canonical documentation.

## Summary

- **Total KEEP Files**: 152
- **Status**: Not yet merged
- **Priority**: High-value content that should be incorporated

## Merge Strategy

### Phase 1: Critical Content (Immediate)
Merge files that contain unique, critical information not yet in canonical docs.

### Phase 2: Enhancement Content (Short-term)
Content that enhances existing canonical docs with additional details.

### Phase 3: Reference Content (Medium-term)
Historical or reference content that provides context.

## Priority Categories

### 1. Setup & Development (High Priority)
- `setup/WORKSPACE-SETUP.md` → Merge into `docs/dev/setup.md`
- `database/DATABASE_DEVELOPMENT_FLOW.md` → Merge into `docs/dev/database.md`
- `development/agentic-workflow-summary.md` → Merge into `docs/dev/tools.md`

### 2. Security & Auth (High Priority)
- `api/API_KEY_ISSUE_SOLVED.md` → Extract lessons into `docs/api/auth.md`
- `fixes/FIX_USER_PROFILE_SETUP.md` → Add to troubleshooting in `docs/api/auth.md`

### 3. Infrastructure (Medium Priority)
- `cloudflare/CF_QUICK_REFERENCE.md` → Already covered in `docs/ops/cloudflare.md`
- `cloudflare/cloudflare-dns-need-to-add.md` → Check for missing DNS records

### 4. Quality & Testing (Medium Priority)
- `linting/LINTING_STRATEGY.md` → Merge into `docs/standards.md`
- `code-quality/CODE_QUALITY_STATUS.md` → Create quality metrics section

### 5. Migration Notes (Low Priority - Historical)
- Various audit files → Keep as historical reference
- Migration tracking files → Archive after Phase 3

## Merge Process

For each KEEP file:

1. **Review Content**: Read file to identify unique information
2. **Find Target**: Determine which canonical doc should receive content
3. **Extract Value**: Pull out non-duplicate, valuable content
4. **Integrate**: Add to canonical doc with proper formatting
5. **Mark Complete**: Add tombstone to archived file
6. **Update Index**: Mark as merged in migration index

## Sample Merge

### Example: DATABASE_DEVELOPMENT_FLOW.md

**Unique Content Found**:
- Database backup procedures
- Performance optimization queries
- Migration rollback strategies

**Target**: `docs/dev/database.md`

**Action**: Added sections for backup, performance, and rollback

**Tombstone Added**:
```markdown
> **MERGED**: Content integrated into docs/dev/database.md on 2025-08-28
```

## Automation Potential

Could create a script to:
1. Parse KEEP files
2. Extract sections
3. Suggest merge targets
4. Track completion

## Current Progress

### Completed Merges
- ✅ Core documentation structure established
- ✅ Main workflows documented
- ✅ Integrated Supabase auth setup into `docs/api/auth.md` (from `docs/api/_intake_auth/SUPABASE_AUTH_SETUP.md`) — 2025-08-28
- ✅ Integrated SendGrid + Supabase patterns into `docs/api/auth.md` (from `docs/api/_intake_auth/SUPABASE_SENDGRID_INTEGRATION.md`) — 2025-08-28
- ✅ Integrated TypeScript auth error strategy into `docs/ops/runbooks/auth-errors.md` (from `docs/api/_intake_auth/TYPESCRIPT_ERROR_STRATEGY.md`) — 2025-08-28
- ✅ Archived Firebase artifacts to `docs/archive/auth/` with tombstones:
  - `PRODUCTION_API_KEY_FIX.md`
  - `firestore-rules.md`
  - `URGENT_AUTH_FIX.md`
  - `NAVIGATE_TO_OAUTH_CONFIG.md`
  - `OAUTH_CONSENT_FIX.md`
  - `FIRESTORE_COLLECTIONS.md`
  - `firebase-deployment.md`
  - `staff_firebase.system.md`
  - `firebase-email-template-text.md`
  - `add-auth-domain.md`
  - `FIX_REDIRECT_URIS.md`
  - `FIREBASE_DEPENDENCIES.md`
  - `MOBILE_OAUTH_FIX.md`
  - `CHECK_FIREBASE_SECURITY_SETTINGS.md`
  - `CHECK_BRANDING_TAB.md`
  - `DOMAIN_FIX_STEPS.md`

- ✅ Moved merged Supabase intake docs to archive with tombstones:
  - `SUPABASE_AUTH_SETUP.md`
  - `SUPABASE_SENDGRID_INTEGRATION.md`
  - `SENDGRID_SUPABASE_SETUP.md`
  - `TYPESCRIPT_ERROR_STRATEGY.md`
  - `CHECK_GOOGLE_PROVIDER.md`
  - `e2e-status.md`
- ✅ Email templates consolidation into `docs/api/auth.md#email-templates--smtp` and archived:
  - `email-setup-options.md`
  - `UPDATE_EMAIL_TEMPLATES.md`
  - `sendgrid-next-steps.md`
  - `sendgrid-setup-complete.md`
- ✅ API key troubleshooting consolidated in runbook and archived:
  - `API_KEY_ISSUE_SOLVED.md`
  - `FIX_API_KEY_NOW.md`
  - `FIX_PROJECT_OWNERS.md`
- ✅ Non-auth intake artifacts archived with tombstones:
  - `SIDEBAR_DEBUG_SESSION.md` → `docs/archive/ui/`
  - `SECRETS_MANAGEMENT.md` → `docs/archive/ops/` (see `docs/dev/secrets-gopass.md`)
  - Remaining intake files archived by domain with tombstones (2025-08-28):
    - `ADMIN_QUICK_START.md` → `docs/archive/admin/`
    - `agentic-workflow-summary.md`, `heh-architect.md`, `KBE_ORCHESTRATOR.md` → `docs/archive/agents/`
    - `ui-craftsman.md`, `WEBDESIGN_AGENT.md` → `docs/archive/ui/`
    - `heh-deploy.md`, `api-key-policy.md` → `docs/archive/ops/`
    - `01-project-context.md`, `blueprint.md`, `product-context.md`, `progress.md`, `heh-feature-development.md`, `REFACTOR_PLAN.md` → `docs/archive/project/`
    - `EULA.md`, `waiver.md` → `docs/archive/legal/`
    - `CRITICAL_AUTH_DOMAIN_ISSUE.md`, `FIX_OAUTH_NOW.md`, `RECAPTCHA_KEY_CORRECTION.md`, `REFACTOR-AUTH-UX-INTEGRATION.md`, `AUDIT_CHANGES_SUMMARY.md` → `docs/archive/auth/`
    - `roo-setup.md` → `docs/archive/tools/`
    - `.typescript-progress.md`, `README.md` → `docs/archive/misc/`

### Foundation Stubs Added

- `docs/dev/setup.md`, `docs/dev/local-dev.md`
- `docs/ops/monitoring.md`
- `docs/api/data-model.md`, `docs/api/endpoints.md`
- `docs/decisions/adr-0001-initial-architecture.md`, `adr-0002-switch-to-supabase.md`, `adr-0003-bun-as-runtime.md`

### Next Steps
1. Continue integrating `_intake_auth` Supabase-focused files (providers, RLS/session, redirect origins)
2. Process 10–15 files per session; keep PRs small and topical
3. Track progress here; add tombstones with anchors
4. Target completion within 2 weeks

## Tracking Table

| File | Category | Target Doc | Status | Date |
|------|----------|------------|--------|------|
| setup/WORKSPACE-SETUP.md | Setup | dev/setup.md | Pending | - |
| database/DATABASE_DEVELOPMENT_FLOW.md | Database | dev/database.md | Pending | - |
| linting/LINTING_STRATEGY.md | Quality | standards.md | Pending | - |
| ... | ... | ... | ... | ... |

## Notes

- Many KEEP files contain duplicate information
- Focus on extracting unique value
- Some files may be better as appendices
- Consider creating a "cookbook" for specific solutions

---

*This plan will guide the systematic merging of KEEP content into canonical documentation.*
