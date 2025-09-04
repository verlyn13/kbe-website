# Documentation Triage Dashboard

**Generated**: 2025-08-29T01:27:02.160Z
**Source**: out/docs_report.json

## Summary

**Total scanned**: 251 markdown files

### Value Distribution
- **KEEP**: 137 files (high value, current stack)
- **MAYBE**: 97 files (mixed or moderate value)
- **ARCHIVE**: 17 files (legacy or low value)

### Security Flags
- **Files with secret flags**: 141
- **Quarantine**: 0

### Category Distribution
- **auth-security**: 68 files
- **dev-setup**: 56 files
- **db-api**: 40 files
- **legacy-archive**: 22 files
- **user-docs**: 19 files
- **deploy-infra**: 19 files
- **uncategorized**: 17 files
- **ops-runbook**: 10 files

## Filters Applied

- **Min confidence**: 0
- **Only values**: all
- **Flag filter**: none
- **Per-group limit**: unlimited

## Instructions

1. Review each category below
2. Copy commands from the **Command** column to move files
3. Run commands with `--dry-run` first to preview
4. Remove `--dry-run` when ready to execute

---


## auth-security

<details>
<summary>View 68 files</summary>

File | Primary | Conf | Value | Flags | Proposed Path | Command
--- | --- | ---: | --- | --- | --- | ---
docs/api/_intake_auth/REFACTOR_PLAN.md | auth-security | 18 | keep | flag:secret-terms | docs/api/_intake_auth/REFACTOR_PLAN.md | `mkdir -p docs/api/_intake_auth; git mv "docs/api/_intake_auth/REFACTOR_PLAN.md" "docs/api/_intake_auth/REFACTOR_PLAN.md"`
docs/api/auth.md | auth-security | 18 | keep | flag:secret-terms | docs/api/_intake_auth/auth.md | `mkdir -p docs/api/_intake_auth; git mv "docs/api/auth.md" "docs/api/_intake_auth/auth.md"`
docs/migration/classification-strategy.md | auth-security | 18 | keep | flag:secret-terms | docs/api/_intake_auth/classification-strategy.md | `mkdir -p docs/api/_intake_auth; git mv "docs/migration/classification-strategy.md" "docs/api/_intake_auth/classification-strategy.md"`
docs/migration/playbook.md | auth-security | 18 | keep | flag:secret-terms | docs/api/_intake_auth/playbook.md | `mkdir -p docs/api/_intake_auth; git mv "docs/migration/playbook.md" "docs/api/_intake_auth/playbook.md"`
docs/ops/runbooks/auth-errors.md | auth-security | 18 | keep | flag:secret-terms | docs/api/_intake_auth/auth-errors.md | `mkdir -p docs/api/_intake_auth; git mv "docs/ops/runbooks/auth-errors.md" "docs/api/_intake_auth/auth-errors.md"`
docs/api/_intake_auth/SENDGRID_SUPABASE_SETUP.md | auth-security | 17 | keep | flag:secret-terms,flag:env-inline | docs/api/_intake_auth/SENDGRID_SUPABASE_SETUP.md | `mkdir -p docs/api/_intake_auth; git mv "docs/api/_intake_auth/SENDGRID_SUPABASE_SETUP.md" "docs/api/_intake_auth/SENDGRID_SUPABASE_SETUP.md"`
AGENTS.md | auth-security | 13 | keep | flag:secret-terms | docs/api/_intake_auth/AGENTS.md | `mkdir -p docs/api/_intake_auth; git mv "AGENTS.md" "docs/api/_intake_auth/AGENTS.md"`
docs/api/_intake_auth/SUPABASE_AUTH_SETUP.md | auth-security | 13 | keep | flag:secret-terms,flag:env-inline | docs/api/_intake_auth/SUPABASE_AUTH_SETUP.md | `mkdir -p docs/api/_intake_auth; git mv "docs/api/_intake_auth/SUPABASE_AUTH_SETUP.md" "docs/api/_intake_auth/SUPABASE_AUTH_SETUP.md"`
docs/api/_intake_auth/SUPABASE_SENDGRID_INTEGRATION.md | auth-security | 13 | keep | flag:secret-terms,flag:env-inline | docs/api/_intake_auth/SUPABASE_SENDGRID_INTEGRATION.md | `mkdir -p docs/api/_intake_auth; git mv "docs/api/_intake_auth/SUPABASE_SENDGRID_INTEGRATION.md" "docs/api/_intake_auth/SUPABASE_SENDGRID_INTEGRATION.md"`
docs/api/_intake_auth/TYPESCRIPT_ERROR_STRATEGY.md | auth-security | 13 | keep |  | docs/api/_intake_auth/TYPESCRIPT_ERROR_STRATEGY.md | `mkdir -p docs/api/_intake_auth; git mv "docs/api/_intake_auth/TYPESCRIPT_ERROR_STRATEGY.md" "docs/api/_intake_auth/TYPESCRIPT_ERROR_STRATEGY.md"`
docs/migration/phase1-complete.md | auth-security | 13 | keep | flag:secret-terms | docs/api/_intake_auth/phase1-complete.md | `mkdir -p docs/api/_intake_auth; git mv "docs/migration/phase1-complete.md" "docs/api/_intake_auth/phase1-complete.md"`
docs/ops/runbooks/supabase-policies.md | auth-security | 13 | keep | flag:secret-terms | docs/api/_intake_auth/supabase-policies.md | `mkdir -p docs/api/_intake_auth; git mv "docs/ops/runbooks/supabase-policies.md" "docs/api/_intake_auth/supabase-policies.md"`
docs/api/_intake_auth/e2e-status.md | auth-security | 12 | keep | flag:secret-terms | docs/api/_intake_auth/e2e-status.md | `mkdir -p docs/api/_intake_auth; git mv "docs/api/_intake_auth/e2e-status.md" "docs/api/_intake_auth/e2e-status.md"`
docs/api/_intake_auth/RECAPTCHA_KEY_CORRECTION.md | auth-security | 12 | keep | flag:secret-terms | docs/api/_intake_auth/RECAPTCHA_KEY_CORRECTION.md | `mkdir -p docs/api/_intake_auth; git mv "docs/api/_intake_auth/RECAPTCHA_KEY_CORRECTION.md" "docs/api/_intake_auth/RECAPTCHA_KEY_CORRECTION.md"`
docs/api/_intake_auth/api-key-policy.md | auth-security | 11 | keep | flag:secret-terms | docs/api/_intake_auth/api-key-policy.md | `mkdir -p docs/api/_intake_auth; git mv "docs/api/_intake_auth/api-key-policy.md" "docs/api/_intake_auth/api-key-policy.md"`
docs/api/_intake_auth/SECRETS_MANAGEMENT.md | auth-security | 11 | keep | flag:secret-terms | docs/api/_intake_auth/SECRETS_MANAGEMENT.md | `mkdir -p docs/api/_intake_auth; git mv "docs/api/_intake_auth/SECRETS_MANAGEMENT.md" "docs/api/_intake_auth/SECRETS_MANAGEMENT.md"`
docs/api/_intake_auth/firebase-deployment.md | auth-security | 9 | keep | flag:secret-terms | docs/api/_intake_auth/firebase-deployment.md | `mkdir -p docs/api/_intake_auth; git mv "docs/api/_intake_auth/firebase-deployment.md" "docs/api/_intake_auth/firebase-deployment.md"`
docs/api/_intake_auth/product-context.md | auth-security | 9 | keep |  | docs/api/_intake_auth/product-context.md | `mkdir -p docs/api/_intake_auth; git mv "docs/api/_intake_auth/product-context.md" "docs/api/_intake_auth/product-context.md"`
docs/api/_intake_auth/.typescript-progress.md | auth-security | 8 | keep |  | docs/api/_intake_auth/.typescript-progress.md | `mkdir -p docs/api/_intake_auth; git mv "docs/api/_intake_auth/.typescript-progress.md" "docs/api/_intake_auth/.typescript-progress.md"`
docs/api/_intake_auth/01-project-context.md | auth-security | 8 | keep |  | docs/api/_intake_auth/01-project-context.md | `mkdir -p docs/api/_intake_auth; git mv "docs/api/_intake_auth/01-project-context.md" "docs/api/_intake_auth/01-project-context.md"`
docs/api/_intake_auth/agentic-workflow-summary.md | auth-security | 8 | keep |  | docs/api/_intake_auth/agentic-workflow-summary.md | `mkdir -p docs/api/_intake_auth; git mv "docs/api/_intake_auth/agentic-workflow-summary.md" "docs/api/_intake_auth/agentic-workflow-summary.md"`
docs/api/_intake_auth/API_KEY_ISSUE_SOLVED.md | auth-security | 8 | keep | flag:secret-terms | docs/api/_intake_auth/API_KEY_ISSUE_SOLVED.md | `mkdir -p docs/api/_intake_auth; git mv "docs/api/_intake_auth/API_KEY_ISSUE_SOLVED.md" "docs/api/_intake_auth/API_KEY_ISSUE_SOLVED.md"`
docs/api/_intake_auth/AUDIT_CHANGES_SUMMARY.md | auth-security | 8 | keep |  | docs/api/_intake_auth/AUDIT_CHANGES_SUMMARY.md | `mkdir -p docs/api/_intake_auth; git mv "docs/api/_intake_auth/AUDIT_CHANGES_SUMMARY.md" "docs/api/_intake_auth/AUDIT_CHANGES_SUMMARY.md"`
docs/api/_intake_auth/CHECK_GOOGLE_PROVIDER.md | auth-security | 8 | keep | flag:secret-terms | docs/api/_intake_auth/CHECK_GOOGLE_PROVIDER.md | `mkdir -p docs/api/_intake_auth; git mv "docs/api/_intake_auth/CHECK_GOOGLE_PROVIDER.md" "docs/api/_intake_auth/CHECK_GOOGLE_PROVIDER.md"`
docs/api/_intake_auth/CRITICAL_AUTH_DOMAIN_ISSUE.md | auth-security | 8 | keep |  | docs/api/_intake_auth/CRITICAL_AUTH_DOMAIN_ISSUE.md | `mkdir -p docs/api/_intake_auth; git mv "docs/api/_intake_auth/CRITICAL_AUTH_DOMAIN_ISSUE.md" "docs/api/_intake_auth/CRITICAL_AUTH_DOMAIN_ISSUE.md"`
docs/api/_intake_auth/DOMAIN_FIX_STEPS.md | auth-security | 8 | keep |  | docs/api/_intake_auth/DOMAIN_FIX_STEPS.md | `mkdir -p docs/api/_intake_auth; git mv "docs/api/_intake_auth/DOMAIN_FIX_STEPS.md" "docs/api/_intake_auth/DOMAIN_FIX_STEPS.md"`
docs/api/_intake_auth/FIREBASE_DEPENDENCIES.md | auth-security | 8 | keep | flag:secret-terms | docs/api/_intake_auth/FIREBASE_DEPENDENCIES.md | `mkdir -p docs/api/_intake_auth; git mv "docs/api/_intake_auth/FIREBASE_DEPENDENCIES.md" "docs/api/_intake_auth/FIREBASE_DEPENDENCIES.md"`
docs/api/_intake_auth/firebase-email-template-text.md | auth-security | 8 | keep | flag:secret-terms | docs/api/_intake_auth/firebase-email-template-text.md | `mkdir -p docs/api/_intake_auth; git mv "docs/api/_intake_auth/firebase-email-template-text.md" "docs/api/_intake_auth/firebase-email-template-text.md"`
docs/api/_intake_auth/FIRESTORE_COLLECTIONS.md | auth-security | 8 | keep |  | docs/api/_intake_auth/FIRESTORE_COLLECTIONS.md | `mkdir -p docs/api/_intake_auth; git mv "docs/api/_intake_auth/FIRESTORE_COLLECTIONS.md" "docs/api/_intake_auth/FIRESTORE_COLLECTIONS.md"`
docs/api/_intake_auth/firestore-rules.md | auth-security | 8 | keep |  | docs/api/_intake_auth/firestore-rules.md | `mkdir -p docs/api/_intake_auth; git mv "docs/api/_intake_auth/firestore-rules.md" "docs/api/_intake_auth/firestore-rules.md"`
docs/api/_intake_auth/FIX_API_KEY_NOW.md | auth-security | 8 | keep | flag:secret-terms | docs/api/_intake_auth/FIX_API_KEY_NOW.md | `mkdir -p docs/api/_intake_auth; git mv "docs/api/_intake_auth/FIX_API_KEY_NOW.md" "docs/api/_intake_auth/FIX_API_KEY_NOW.md"`
docs/api/_intake_auth/FIX_AUTHORIZED_DOMAINS.md | auth-security | 8 | keep |  | docs/api/_intake_auth/FIX_AUTHORIZED_DOMAINS.md | `mkdir -p docs/api/_intake_auth; git mv "docs/api/_intake_auth/FIX_AUTHORIZED_DOMAINS.md" "docs/api/_intake_auth/FIX_AUTHORIZED_DOMAINS.md"`
docs/api/_intake_auth/FIX_PROJECT_OWNERS.md | auth-security | 8 | keep |  | docs/api/_intake_auth/FIX_PROJECT_OWNERS.md | `mkdir -p docs/api/_intake_auth; git mv "docs/api/_intake_auth/FIX_PROJECT_OWNERS.md" "docs/api/_intake_auth/FIX_PROJECT_OWNERS.md"`
docs/api/_intake_auth/FIX_REDIRECT_URIS.md | auth-security | 8 | keep |  | docs/api/_intake_auth/FIX_REDIRECT_URIS.md | `mkdir -p docs/api/_intake_auth; git mv "docs/api/_intake_auth/FIX_REDIRECT_URIS.md" "docs/api/_intake_auth/FIX_REDIRECT_URIS.md"`
docs/api/_intake_auth/heh-architect.md | auth-security | 8 | keep |  | docs/api/_intake_auth/heh-architect.md | `mkdir -p docs/api/_intake_auth; git mv "docs/api/_intake_auth/heh-architect.md" "docs/api/_intake_auth/heh-architect.md"`
docs/api/_intake_auth/KBE_ORCHESTRATOR.md | auth-security | 8 | keep | flag:secret-terms | docs/api/_intake_auth/KBE_ORCHESTRATOR.md | `mkdir -p docs/api/_intake_auth; git mv "docs/api/_intake_auth/KBE_ORCHESTRATOR.md" "docs/api/_intake_auth/KBE_ORCHESTRATOR.md"`
docs/api/_intake_auth/MOBILE_OAUTH_FIX.md | auth-security | 8 | keep |  | docs/api/_intake_auth/MOBILE_OAUTH_FIX.md | `mkdir -p docs/api/_intake_auth; git mv "docs/api/_intake_auth/MOBILE_OAUTH_FIX.md" "docs/api/_intake_auth/MOBILE_OAUTH_FIX.md"`
docs/api/_intake_auth/NAVIGATE_TO_OAUTH_CONFIG.md | auth-security | 8 | keep | flag:secret-terms | docs/api/_intake_auth/NAVIGATE_TO_OAUTH_CONFIG.md | `mkdir -p docs/api/_intake_auth; git mv "docs/api/_intake_auth/NAVIGATE_TO_OAUTH_CONFIG.md" "docs/api/_intake_auth/NAVIGATE_TO_OAUTH_CONFIG.md"`
docs/api/_intake_auth/PRODUCTION_API_KEY_FIX.md | auth-security | 8 | keep | flag:secret-terms | docs/api/_intake_auth/PRODUCTION_API_KEY_FIX.md | `mkdir -p docs/api/_intake_auth; git mv "docs/api/_intake_auth/PRODUCTION_API_KEY_FIX.md" "docs/api/_intake_auth/PRODUCTION_API_KEY_FIX.md"`
docs/api/_intake_auth/REFACTOR-AUTH-UX-INTEGRATION.md | auth-security | 8 | keep | flag:secret-terms | docs/api/_intake_auth/REFACTOR-AUTH-UX-INTEGRATION.md | `mkdir -p docs/api/_intake_auth; git mv "docs/api/_intake_auth/REFACTOR-AUTH-UX-INTEGRATION.md" "docs/api/_intake_auth/REFACTOR-AUTH-UX-INTEGRATION.md"`
docs/api/_intake_auth/roo-setup.md | auth-security | 8 | keep | flag:secret-terms | docs/api/_intake_auth/roo-setup.md | `mkdir -p docs/api/_intake_auth; git mv "docs/api/_intake_auth/roo-setup.md" "docs/api/_intake_auth/roo-setup.md"`
docs/api/_intake_auth/staff_firebase.system.md | auth-security | 8 | keep |  | docs/api/_intake_auth/staff_firebase.system.md | `mkdir -p docs/api/_intake_auth; git mv "docs/api/_intake_auth/staff_firebase.system.md" "docs/api/_intake_auth/staff_firebase.system.md"`
docs/api/_intake_auth/ui-craftsman.md | auth-security | 8 | keep | flag:secret-terms | docs/api/_intake_auth/ui-craftsman.md | `mkdir -p docs/api/_intake_auth; git mv "docs/api/_intake_auth/ui-craftsman.md" "docs/api/_intake_auth/ui-craftsman.md"`
docs/api/_intake_auth/URGENT_AUTH_FIX.md | auth-security | 8 | keep |  | docs/api/_intake_auth/URGENT_AUTH_FIX.md | `mkdir -p docs/api/_intake_auth; git mv "docs/api/_intake_auth/URGENT_AUTH_FIX.md" "docs/api/_intake_auth/URGENT_AUTH_FIX.md"`
docs/api/_intake_auth/WEBDESIGN_AGENT.md | auth-security | 8 | keep | flag:secret-terms | docs/api/_intake_auth/WEBDESIGN_AGENT.md | `mkdir -p docs/api/_intake_auth; git mv "docs/api/_intake_auth/WEBDESIGN_AGENT.md" "docs/api/_intake_auth/WEBDESIGN_AGENT.md"`
docs/api/_intake_auth/biome-checklist.md | auth-security | 7 | keep |  | docs/api/_intake_auth/biome-checklist.md | `mkdir -p docs/api/_intake_auth; git mv "docs/api/_intake_auth/biome-checklist.md" "docs/api/_intake_auth/biome-checklist.md"`
docs/api/_intake_auth/blueprint.md | auth-security | 7 | keep | flag:secret-terms | docs/api/_intake_auth/blueprint.md | `mkdir -p docs/api/_intake_auth; git mv "docs/api/_intake_auth/blueprint.md" "docs/api/_intake_auth/blueprint.md"`
docs/api/_intake_auth/CHECK_BRANDING_TAB.md | auth-security | 7 | keep | flag:secret-terms | docs/api/_intake_auth/CHECK_BRANDING_TAB.md | `mkdir -p docs/api/_intake_auth; git mv "docs/api/_intake_auth/CHECK_BRANDING_TAB.md" "docs/api/_intake_auth/CHECK_BRANDING_TAB.md"`
docs/api/_intake_auth/CODE_QUALITY_STATUS.md | auth-security | 7 | keep |  | docs/api/_intake_auth/CODE_QUALITY_STATUS.md | `mkdir -p docs/api/_intake_auth; git mv "docs/api/_intake_auth/CODE_QUALITY_STATUS.md" "docs/api/_intake_auth/CODE_QUALITY_STATUS.md"`
docs/api/_intake_auth/EULA.md | auth-security | 7 | keep | flag:secret-terms | docs/api/_intake_auth/EULA.md | `mkdir -p docs/api/_intake_auth; git mv "docs/api/_intake_auth/EULA.md" "docs/api/_intake_auth/EULA.md"`
docs/api/_intake_auth/FIX_OAUTH_NOW.md | auth-security | 7 | keep |  | docs/api/_intake_auth/FIX_OAUTH_NOW.md | `mkdir -p docs/api/_intake_auth; git mv "docs/api/_intake_auth/FIX_OAUTH_NOW.md" "docs/api/_intake_auth/FIX_OAUTH_NOW.md"`
docs/api/_intake_auth/progress.md | auth-security | 7 | keep |  | docs/api/_intake_auth/progress.md | `mkdir -p docs/api/_intake_auth; git mv "docs/api/_intake_auth/progress.md" "docs/api/_intake_auth/progress.md"`
docs/api/_intake_auth/sendgrid-next-steps.md | auth-security | 7 | keep | flag:secret-terms | docs/api/_intake_auth/sendgrid-next-steps.md | `mkdir -p docs/api/_intake_auth; git mv "docs/api/_intake_auth/sendgrid-next-steps.md" "docs/api/_intake_auth/sendgrid-next-steps.md"`
docs/api/_intake_auth/SIDEBAR_DEBUG_SESSION.md | auth-security | 7 | keep |  | docs/api/_intake_auth/SIDEBAR_DEBUG_SESSION.md | `mkdir -p docs/api/_intake_auth; git mv "docs/api/_intake_auth/SIDEBAR_DEBUG_SESSION.md" "docs/api/_intake_auth/SIDEBAR_DEBUG_SESSION.md"`
docs/api/_intake_auth/waiver.md | auth-security | 7 | keep |  | docs/api/_intake_auth/waiver.md | `mkdir -p docs/api/_intake_auth; git mv "docs/api/_intake_auth/waiver.md" "docs/api/_intake_auth/waiver.md"`
docs/api/_intake_auth/add-auth-domain.md | auth-security | 5 | keep |  | docs/api/_intake_auth/add-auth-domain.md | `mkdir -p docs/api/_intake_auth; git mv "docs/api/_intake_auth/add-auth-domain.md" "docs/api/_intake_auth/add-auth-domain.md"`
docs/api/_intake_auth/ADMIN_QUICK_START.md | auth-security | 5 | keep | flag:secret-terms | docs/api/_intake_auth/ADMIN_QUICK_START.md | `mkdir -p docs/api/_intake_auth; git mv "docs/api/_intake_auth/ADMIN_QUICK_START.md" "docs/api/_intake_auth/ADMIN_QUICK_START.md"`
docs/api/_intake_auth/AUTH_ACTION_PLAN.md | auth-security | 5 | keep |  | docs/api/_intake_auth/AUTH_ACTION_PLAN.md | `mkdir -p docs/api/_intake_auth; git mv "docs/api/_intake_auth/AUTH_ACTION_PLAN.md" "docs/api/_intake_auth/AUTH_ACTION_PLAN.md"`
docs/api/_intake_auth/AUTH_AUDIT_SUMMARY.md | auth-security | 5 | keep | flag:secret-terms | docs/api/_intake_auth/AUTH_AUDIT_SUMMARY.md | `mkdir -p docs/api/_intake_auth; git mv "docs/api/_intake_auth/AUTH_AUDIT_SUMMARY.md" "docs/api/_intake_auth/AUTH_AUDIT_SUMMARY.md"`
docs/api/_intake_auth/AUTH_FIXES_VERIFICATION.md | auth-security | 5 | keep |  | docs/api/_intake_auth/AUTH_FIXES_VERIFICATION.md | `mkdir -p docs/api/_intake_auth; git mv "docs/api/_intake_auth/AUTH_FIXES_VERIFICATION.md" "docs/api/_intake_auth/AUTH_FIXES_VERIFICATION.md"`
docs/api/_intake_auth/auth-prep.md | auth-security | 5 | keep | flag:secret-terms | docs/api/_intake_auth/auth-prep.md | `mkdir -p docs/api/_intake_auth; git mv "docs/api/_intake_auth/auth-prep.md" "docs/api/_intake_auth/auth-prep.md"`
docs/api/_intake_auth/email-setup-options.md | auth-security | 5 | keep | flag:secret-terms | docs/api/_intake_auth/email-setup-options.md | `mkdir -p docs/api/_intake_auth; git mv "docs/api/_intake_auth/email-setup-options.md" "docs/api/_intake_auth/email-setup-options.md"`
docs/api/_intake_auth/heh-debug-issue.md | auth-security | 5 | keep |  | docs/api/_intake_auth/heh-debug-issue.md | `mkdir -p docs/api/_intake_auth; git mv "docs/api/_intake_auth/heh-debug-issue.md" "docs/api/_intake_auth/heh-debug-issue.md"`
docs/api/_intake_auth/heh-deploy.md | auth-security | 5 | keep |  | docs/api/_intake_auth/heh-deploy.md | `mkdir -p docs/api/_intake_auth; git mv "docs/api/_intake_auth/heh-deploy.md" "docs/api/_intake_auth/heh-deploy.md"`
docs/api/_intake_auth/heh-feature-development.md | auth-security | 5 | keep |  | docs/api/_intake_auth/heh-feature-development.md | `mkdir -p docs/api/_intake_auth; git mv "docs/api/_intake_auth/heh-feature-development.md" "docs/api/_intake_auth/heh-feature-development.md"`
docs/api/_intake_auth/sendgrid-setup-complete.md | auth-security | 5 | keep | flag:secret-terms | docs/api/_intake_auth/sendgrid-setup-complete.md | `mkdir -p docs/api/_intake_auth; git mv "docs/api/_intake_auth/sendgrid-setup-complete.md" "docs/api/_intake_auth/sendgrid-setup-complete.md"`
docs/api/_intake_auth/UPDATE_EMAIL_TEMPLATES.md | auth-security | 5 | keep | flag:secret-terms | docs/api/_intake_auth/UPDATE_EMAIL_TEMPLATES.md | `mkdir -p docs/api/_intake_auth; git mv "docs/api/_intake_auth/UPDATE_EMAIL_TEMPLATES.md" "docs/api/_intake_auth/UPDATE_EMAIL_TEMPLATES.md"`
docs/api/_intake_auth/WORKSPACE-SETUP.md | auth-security | 5 | keep | flag:secret-terms | docs/api/_intake_auth/WORKSPACE-SETUP.md | `mkdir -p docs/api/_intake_auth; git mv "docs/api/_intake_auth/WORKSPACE-SETUP.md" "docs/api/_intake_auth/WORKSPACE-SETUP.md"`

</details>

## db-api

<details>
<summary>View 40 files</summary>

File | Primary | Conf | Value | Flags | Proposed Path | Command
--- | --- | ---: | --- | --- | --- | ---
docs/architecture.md | db-api | 18 | keep | flag:secret-terms | docs/api/architecture.md | `mkdir -p docs/api; git mv "docs/architecture.md" "docs/api/architecture.md"`
docs/changelog.md | db-api | 18 | keep | flag:secret-terms | docs/api/changelog.md | `mkdir -p docs/api; git mv "docs/changelog.md" "docs/api/changelog.md"`
docs/migration/bun-cli-runner.md | db-api | 18 | keep | flag:secret-terms | docs/api/bun-cli-runner.md | `mkdir -p docs/api; git mv "docs/migration/bun-cli-runner.md" "docs/api/bun-cli-runner.md"`
docs/migration/docs-migration-updated.md | db-api | 18 | keep | flag:secret-terms | docs/api/docs-migration-updated.md | `mkdir -p docs/api; git mv "docs/migration/docs-migration-updated.md" "docs/api/docs-migration-updated.md"`
docs/migration/index.md | db-api | 18 | keep | flag:secret-terms | docs/api/index.md | `mkdir -p docs/api; git mv "docs/migration/index.md" "docs/api/index.md"`
docs/migration/ops-docs-extraction.md | db-api | 18 | keep |  | docs/api/ops-docs-extraction.md | `mkdir -p docs/api; git mv "docs/migration/ops-docs-extraction.md" "docs/api/ops-docs-extraction.md"`
CLAUDE.md | db-api | 15 | keep | flag:secret-terms | docs/api/CLAUDE.md | `mkdir -p docs/api; git mv "CLAUDE.md" "docs/api/CLAUDE.md"`
docs/api/audit-08172025-stage4-addition.md | db-api | 15 | keep |  | docs/api/audit-08172025-stage4-addition.md | `mkdir -p docs/api; git mv "docs/api/audit-08172025-stage4-addition.md" "docs/api/audit-08172025-stage4-addition.md"`
docs/api/audit-stage4-report.md | db-api | 15 | keep |  | docs/api/audit-stage4-report.md | `mkdir -p docs/api; git mv "docs/api/audit-stage4-report.md" "docs/api/audit-stage4-report.md"`
docs/api/MIGRATION_COMPLETE.md | db-api | 15 | keep |  | docs/api/MIGRATION_COMPLETE.md | `mkdir -p docs/api; git mv "docs/api/MIGRATION_COMPLETE.md" "docs/api/MIGRATION_COMPLETE.md"`
docs/decisions/adr-0004-vercel-primary.md | db-api | 15 | keep | flag:secret-terms | docs/api/adr-0004-vercel-primary.md | `mkdir -p docs/api; git mv "docs/decisions/adr-0004-vercel-primary.md" "docs/api/adr-0004-vercel-primary.md"`
docs/dev/config-registry.md | db-api | 15 | keep | flag:secret-terms | docs/api/config-registry.md | `mkdir -p docs/api; git mv "docs/dev/config-registry.md" "docs/api/config-registry.md"`
docs/dev/tools.md | db-api | 15 | keep | flag:secret-terms,flag:jwt | docs/api/tools.md | `mkdir -p docs/api; git mv "docs/dev/tools.md" "docs/api/tools.md"`
docs/migration/config-files.md | db-api | 15 | keep | flag:secret-terms | docs/api/config-files.md | `mkdir -p docs/api; git mv "docs/migration/config-files.md" "docs/api/config-files.md"`
docs/migration/phase1-2-verification-report.md | db-api | 15 | keep | flag:secret-terms | docs/api/phase1-2-verification-report.md | `mkdir -p docs/api; git mv "docs/migration/phase1-2-verification-report.md" "docs/api/phase1-2-verification-report.md"`
docs/api/DATA_MIGRATION_CHECKLIST.md | db-api | 14 | keep | flag:secret-terms | docs/api/DATA_MIGRATION_CHECKLIST.md | `mkdir -p docs/api; git mv "docs/api/DATA_MIGRATION_CHECKLIST.md" "docs/api/DATA_MIGRATION_CHECKLIST.md"`
docs/api/DATABASE_DEVELOPMENT_FLOW.md | db-api | 14 | keep | flag:env-inline | docs/api/DATABASE_DEVELOPMENT_FLOW.md | `mkdir -p docs/api; git mv "docs/api/DATABASE_DEVELOPMENT_FLOW.md" "docs/api/DATABASE_DEVELOPMENT_FLOW.md"`
docs/migration/auth-docs-extraction.md | db-api | 14 | keep | flag:secret-terms | docs/api/auth-docs-extraction.md | `mkdir -p docs/api; git mv "docs/migration/auth-docs-extraction.md" "docs/api/auth-docs-extraction.md"`
docs/ops/DOMAIN_FIX_STEPS.md | db-api | 14 | keep |  | docs/api/DOMAIN_FIX_STEPS.md | `mkdir -p docs/api; git mv "docs/ops/DOMAIN_FIX_STEPS.md" "docs/api/DOMAIN_FIX_STEPS.md"`
docs/api/_intake_auth/CHECK_FIREBASE_SECURITY_SETTINGS.md | db-api | 13 | keep |  | docs/api/CHECK_FIREBASE_SECURITY_SETTINGS.md | `mkdir -p docs/api; git mv "docs/api/_intake_auth/CHECK_FIREBASE_SECURITY_SETTINGS.md" "docs/api/CHECK_FIREBASE_SECURITY_SETTINGS.md"`
docs/api/audit-fixes-1-3.md | db-api | 13 | keep | flag:secret-terms | docs/api/audit-fixes-1-3.md | `mkdir -p docs/api; git mv "docs/api/audit-fixes-1-3.md" "docs/api/audit-fixes-1-3.md"`
docs/api/cicd-pipeline.md | db-api | 13 | keep | flag:secret-terms | docs/api/cicd-pipeline.md | `mkdir -p docs/api; git mv "docs/api/cicd-pipeline.md" "docs/api/cicd-pipeline.md"`
docs/api/FEATURE_EMAIL_TEMPLATE_ADMIN.md | db-api | 13 | keep | flag:secret-terms | docs/api/FEATURE_EMAIL_TEMPLATE_ADMIN.md | `mkdir -p docs/api; git mv "docs/api/FEATURE_EMAIL_TEMPLATE_ADMIN.md" "docs/api/FEATURE_EMAIL_TEMPLATE_ADMIN.md"`
docs/api/firebase-magic-link-setup.md | db-api | 13 | keep | flag:secret-terms | docs/api/firebase-magic-link-setup.md | `mkdir -p docs/api; git mv "docs/api/firebase-magic-link-setup.md" "docs/api/firebase-magic-link-setup.md"`
docs/ops/auth-audit-08252025.md | db-api | 13 | keep | flag:secret-terms | docs/api/auth-audit-08252025.md | `mkdir -p docs/api; git mv "docs/ops/auth-audit-08252025.md" "docs/api/auth-audit-08252025.md"`
docs/api/REFACTOR-PRISMA-CONFIG.md | db-api | 12 | keep | flag:secret-terms,flag:db-url,flag:env-inline | docs/api/REFACTOR-PRISMA-CONFIG.md | `mkdir -p docs/api; git mv "docs/api/REFACTOR-PRISMA-CONFIG.md" "docs/api/REFACTOR-PRISMA-CONFIG.md"`
docs/api/_intake_auth/OAUTH_CONSENT_FIX.md | db-api | 11 | keep | flag:secret-terms | docs/api/OAUTH_CONSENT_FIX.md | `mkdir -p docs/api; git mv "docs/api/_intake_auth/OAUTH_CONSENT_FIX.md" "docs/api/OAUTH_CONSENT_FIX.md"`
docs/ops/runbooks/cold-starts-ssr.md | db-api | 11 | keep |  | docs/api/cold-starts-ssr.md | `mkdir -p docs/api; git mv "docs/ops/runbooks/cold-starts-ssr.md" "docs/api/cold-starts-ssr.md"`
docs/api/stage-1-2-fixes.md | db-api | 10 | keep | flag:secret-terms | docs/api/stage-1-2-fixes.md | `mkdir -p docs/api; git mv "docs/api/stage-1-2-fixes.md" "docs/api/stage-1-2-fixes.md"`
docs/api/arch_migration_plan.md | db-api | 8 | keep |  | docs/api/arch_migration_plan.md | `mkdir -p docs/api; git mv "docs/api/arch_migration_plan.md" "docs/api/arch_migration_plan.md"`
docs/api/move-to-vercel.md | db-api | 8 | keep | flag:secret-terms | docs/api/move-to-vercel.md | `mkdir -p docs/api; git mv "docs/api/move-to-vercel.md" "docs/api/move-to-vercel.md"`
docs/api/principal_arch.system.md | db-api | 8 | keep |  | docs/api/principal_arch.system.md | `mkdir -p docs/api; git mv "docs/api/principal_arch.system.md" "docs/api/principal_arch.system.md"`
docs/api/design_systems.system.md | db-api | 7 | keep |  | docs/api/design_systems.system.md | `mkdir -p docs/api; git mv "docs/api/design_systems.system.md" "docs/api/design_systems.system.md"`
docs/api/devex_biome_migration.md | db-api | 7 | keep |  | docs/api/devex_biome_migration.md | `mkdir -p docs/api; git mv "docs/api/devex_biome_migration.md" "docs/api/devex_biome_migration.md"`
docs/api/image-processing.md | db-api | 7 | keep |  | docs/api/image-processing.md | `mkdir -p docs/api; git mv "docs/api/image-processing.md" "docs/api/image-processing.md"`
docs/api/platform_devex.system.md | db-api | 7 | keep |  | docs/api/platform_devex.system.md | `mkdir -p docs/api; git mv "docs/api/platform_devex.system.md" "docs/api/platform_devex.system.md"`
docs/api/sre_slo.md | db-api | 7 | keep |  | docs/api/sre_slo.md | `mkdir -p docs/api; git mv "docs/api/sre_slo.md" "docs/api/sre_slo.md"`
docs/api/02-coding-standards.md | db-api | 5 | keep |  | docs/api/02-coding-standards.md | `mkdir -p docs/api; git mv "docs/api/02-coding-standards.md" "docs/api/02-coding-standards.md"`
docs/api/testing-type-fix-strategy.md | db-api | 5 | keep |  | docs/api/testing-type-fix-strategy.md | `mkdir -p docs/api; git mv "docs/api/testing-type-fix-strategy.md" "docs/api/testing-type-fix-strategy.md"`
docs/api/TYPE_MIGRATION_GUIDE.md | db-api | 5 | keep |  | docs/api/TYPE_MIGRATION_GUIDE.md | `mkdir -p docs/api; git mv "docs/api/TYPE_MIGRATION_GUIDE.md" "docs/api/TYPE_MIGRATION_GUIDE.md"`

</details>

## deploy-infra

<details>
<summary>View 19 files</summary>

File | Primary | Conf | Value | Flags | Proposed Path | Command
--- | --- | ---: | --- | --- | --- | ---
docs/migration/config-phase2-workflow.md | deploy-infra | 18 | keep | flag:secret-terms | docs/ops/config-phase2-workflow.md | `mkdir -p docs/ops; git mv "docs/migration/config-phase2-workflow.md" "docs/ops/config-phase2-workflow.md"`
docs/ops/deploy.md | deploy-infra | 18 | keep | flag:secret-terms | docs/ops/deploy.md | `mkdir -p docs/ops; git mv "docs/ops/deploy.md" "docs/ops/deploy.md"`
docs/ops/REFACTOR-PLAN-SUPA-PRISMA.md | deploy-infra | 18 | keep | flag:secret-terms,flag:db-url | docs/ops/REFACTOR-PLAN-SUPA-PRISMA.md | `mkdir -p docs/ops; git mv "docs/ops/REFACTOR-PLAN-SUPA-PRISMA.md" "docs/ops/REFACTOR-PLAN-SUPA-PRISMA.md"`
docs/dev/secrets-gopass.md | deploy-infra | 13 | keep | flag:secret-terms,flag:env-inline | docs/ops/secrets-gopass.md | `mkdir -p docs/ops; git mv "docs/dev/secrets-gopass.md" "docs/ops/secrets-gopass.md"`
docs/migration/final-extraction-summary.md | deploy-infra | 13 | keep | flag:secret-terms | docs/ops/final-extraction-summary.md | `mkdir -p docs/ops; git mv "docs/migration/final-extraction-summary.md" "docs/ops/final-extraction-summary.md"`
docs/ops/CLAUDE.md | deploy-infra | 13 | keep | flag:secret-terms | docs/ops/CLAUDE.md | `mkdir -p docs/ops; git mv "docs/ops/CLAUDE.md" "docs/ops/CLAUDE.md"`
docs/ops/CLOUDFLARE_MIGRATION.md | deploy-infra | 13 | keep | flag:secret-terms | docs/ops/CLOUDFLARE_MIGRATION.md | `mkdir -p docs/ops; git mv "docs/ops/CLOUDFLARE_MIGRATION.md" "docs/ops/CLOUDFLARE_MIGRATION.md"`
docs/ops/CF_QUICK_REFERENCE.md | deploy-infra | 12 | keep |  | docs/ops/CF_QUICK_REFERENCE.md | `mkdir -p docs/ops; git mv "docs/ops/CF_QUICK_REFERENCE.md" "docs/ops/CF_QUICK_REFERENCE.md"`
docs/ops/cloudflare.md | deploy-infra | 12 | keep | flag:secret-terms | docs/ops/cloudflare.md | `mkdir -p docs/ops; git mv "docs/ops/cloudflare.md" "docs/ops/cloudflare.md"`
docs/ops/custom-domain-setup.md | deploy-infra | 12 | keep |  | docs/ops/custom-domain-setup.md | `mkdir -p docs/ops; git mv "docs/ops/custom-domain-setup.md" "docs/ops/custom-domain-setup.md"`
docs/ops/sendgrid-email-setup.md | deploy-infra | 12 | keep | flag:secret-terms | docs/ops/sendgrid-email-setup.md | `mkdir -p docs/ops; git mv "docs/ops/sendgrid-email-setup.md" "docs/ops/sendgrid-email-setup.md"`
docs/migration/keep-files-merge-plan.md | deploy-infra | 11 | keep | flag:secret-terms | docs/ops/keep-files-merge-plan.md | `mkdir -p docs/ops; git mv "docs/migration/keep-files-merge-plan.md" "docs/ops/keep-files-merge-plan.md"`
docs/ops/cloudflare-sendgrid-dns.md | deploy-infra | 11 | keep |  | docs/ops/cloudflare-sendgrid-dns.md | `mkdir -p docs/ops; git mv "docs/ops/cloudflare-sendgrid-dns.md" "docs/ops/cloudflare-sendgrid-dns.md"`
docs/ops/project-standards.md | deploy-infra | 11 | keep | flag:secret-terms | docs/ops/project-standards.md | `mkdir -p docs/ops; git mv "docs/ops/project-standards.md" "docs/ops/project-standards.md"`
docs/ops/REFACTOR-PLAN-VERCEL.md | deploy-infra | 11 | keep | flag:secret-terms | docs/ops/REFACTOR-PLAN-VERCEL.md | `mkdir -p docs/ops; git mv "docs/ops/REFACTOR-PLAN-VERCEL.md" "docs/ops/REFACTOR-PLAN-VERCEL.md"`
docs/ops/sendgrid-domain-decisions.md | deploy-infra | 11 | keep |  | docs/ops/sendgrid-domain-decisions.md | `mkdir -p docs/ops; git mv "docs/ops/sendgrid-domain-decisions.md" "docs/ops/sendgrid-domain-decisions.md"`
docs/ops/cloudflare-dns-need-to-add.md | deploy-infra | 10 | keep |  | docs/ops/cloudflare-dns-need-to-add.md | `mkdir -p docs/ops; git mv "docs/ops/cloudflare-dns-need-to-add.md" "docs/ops/cloudflare-dns-need-to-add.md"`
docs/ops/02-accessibility.md | deploy-infra | 7 | keep | flag:secret-terms | docs/ops/02-accessibility.md | `mkdir -p docs/ops; git mv "docs/ops/02-accessibility.md" "docs/ops/02-accessibility.md"`
docs/ops/STAGE4_OPTIMIZATION_COMPLETE.md | deploy-infra | 7 | keep |  | docs/ops/STAGE4_OPTIMIZATION_COMPLETE.md | `mkdir -p docs/ops; git mv "docs/ops/STAGE4_OPTIMIZATION_COMPLETE.md" "docs/ops/STAGE4_OPTIMIZATION_COMPLETE.md"`

</details>

## dev-setup

<details>
<summary>View 56 files</summary>

File | Primary | Conf | Value | Flags | Proposed Path | Command
--- | --- | ---: | --- | --- | --- | ---
docs/archive/deployment-notes/DEPLOYMENT_STRATEGY.md | dev-setup | 16 | maybe | flag:secret-terms,flag:env-inline | docs/dev/DEPLOYMENT_STRATEGY.md | `mkdir -p docs/dev; git mv "docs/archive/deployment-notes/DEPLOYMENT_STRATEGY.md" "docs/dev/DEPLOYMENT_STRATEGY.md"`
docs/archive/main-docs/SUPABASE_MIGRATION_GUIDE.md | dev-setup | 16 | maybe | flag:secret-terms,flag:db-url,flag:env-inline | docs/dev/SUPABASE_MIGRATION_GUIDE.md | `mkdir -p docs/dev; git mv "docs/archive/main-docs/SUPABASE_MIGRATION_GUIDE.md" "docs/dev/SUPABASE_MIGRATION_GUIDE.md"`
docs/dev/database.md | dev-setup | 16 | maybe | flag:secret-terms,flag:db-url,flag:env-inline | docs/dev/database.md | `mkdir -p docs/dev; git mv "docs/dev/database.md" "docs/dev/database.md"`
docs/migration/config-dx-consideration.md | dev-setup | 16 | maybe | flag:secret-terms,flag:jwt | docs/dev/config-dx-consideration.md | `mkdir -p docs/dev; git mv "docs/migration/config-dx-consideration.md" "docs/dev/config-dx-consideration.md"`
docs/migration/vetting-framework.md | dev-setup | 16 | maybe | flag:secret-terms | docs/dev/vetting-framework.md | `mkdir -p docs/dev; git mv "docs/migration/vetting-framework.md" "docs/dev/vetting-framework.md"`
docs/archive/audits/audit-08172025.md | dev-setup | 15 | maybe | flag:secret-terms | docs/dev/audit-08172025.md | `mkdir -p docs/dev; git mv "docs/archive/audits/audit-08172025.md" "docs/dev/audit-08172025.md"`
docs/archive/main-docs/SENDGRID_INTEGRATION_SUMMARY.md | dev-setup | 15 | maybe | flag:secret-terms | docs/dev/SENDGRID_INTEGRATION_SUMMARY.md | `mkdir -p docs/dev; git mv "docs/archive/main-docs/SENDGRID_INTEGRATION_SUMMARY.md" "docs/dev/SENDGRID_INTEGRATION_SUMMARY.md"`
docs/archive/legacy-firebase-docs/VERCEL_MIGRATION_CHECKLIST.md | dev-setup | 14 | maybe | flag:secret-terms | docs/dev/VERCEL_MIGRATION_CHECKLIST.md | `mkdir -p docs/dev; git mv "docs/archive/legacy-firebase-docs/VERCEL_MIGRATION_CHECKLIST.md" "docs/dev/VERCEL_MIGRATION_CHECKLIST.md"`
docs/archive/audits/AUDIT_COMPLETE_SUMMARY.md | dev-setup | 13 | maybe | flag:secret-terms | docs/dev/AUDIT_COMPLETE_SUMMARY.md | `mkdir -p docs/dev; git mv "docs/archive/audits/AUDIT_COMPLETE_SUMMARY.md" "docs/dev/AUDIT_COMPLETE_SUMMARY.md"`
docs/archive/main-docs/more-bun-stuff.md | dev-setup | 13 | maybe |  | docs/dev/more-bun-stuff.md | `mkdir -p docs/dev; git mv "docs/archive/main-docs/more-bun-stuff.md" "docs/dev/more-bun-stuff.md"`
docs/dev/environment.md | dev-setup | 12 | maybe | flag:secret-terms,flag:db-url,flag:env-inline | docs/dev/environment.md | `mkdir -p docs/dev; git mv "docs/dev/environment.md" "docs/dev/environment.md"`
docs/migration/api-docs-extraction.md | dev-setup | 12 | maybe | flag:secret-terms | docs/dev/api-docs-extraction.md | `mkdir -p docs/dev; git mv "docs/migration/api-docs-extraction.md" "docs/dev/api-docs-extraction.md"`
docs/migration/docs-triage-dashboard.md | dev-setup | 12 | maybe | flag:secret-terms | docs/dev/docs-triage-dashboard.md | `mkdir -p docs/dev; git mv "docs/migration/docs-triage-dashboard.md" "docs/dev/docs-triage-dashboard.md"`
docs/migration/extraction-summary.md | dev-setup | 12 | maybe | flag:secret-terms | docs/dev/extraction-summary.md | `mkdir -p docs/dev; git mv "docs/migration/extraction-summary.md" "docs/dev/extraction-summary.md"`
docs/archive/audits/audit-08172025-stage3-addition.md | dev-setup | 11 | maybe |  | docs/dev/audit-08172025-stage3-addition.md | `mkdir -p docs/dev; git mv "docs/archive/audits/audit-08172025-stage3-addition.md" "docs/dev/audit-08172025-stage3-addition.md"`
docs/archive/audits/audit-stage1-report.md | dev-setup | 11 | maybe | flag:secret-terms | docs/dev/audit-stage1-report.md | `mkdir -p docs/dev; git mv "docs/archive/audits/audit-stage1-report.md" "docs/dev/audit-stage1-report.md"`
docs/archive/auth/auth-configuration.md | dev-setup | 11 | maybe | flag:secret-terms | docs/dev/auth-configuration.md | `mkdir -p docs/dev; git mv "docs/archive/auth/auth-configuration.md" "docs/dev/auth-configuration.md"`
docs/archive/backups/FIREBASE_QUICK_REFERENCE.md | dev-setup | 11 | maybe | flag:secret-terms | docs/dev/FIREBASE_QUICK_REFERENCE.md | `mkdir -p docs/dev; git mv "docs/archive/backups/FIREBASE_QUICK_REFERENCE.md" "docs/dev/FIREBASE_QUICK_REFERENCE.md"`
docs/archive/backups/README.md | dev-setup | 11 | maybe | flag:secret-terms | docs/dev/README.md | `mkdir -p docs/dev; git mv "docs/archive/backups/README.md" "docs/dev/README.md"`
docs/archive/memory-bank/system-patterns.md | dev-setup | 11 | maybe | flag:secret-terms,flag:env-inline | docs/dev/system-patterns.md | `mkdir -p docs/dev; git mv "docs/archive/memory-bank/system-patterns.md" "docs/dev/system-patterns.md"`
docs/archive/roo-config/FIREBASE_QUICK_REFERENCE.md | dev-setup | 11 | maybe | flag:secret-terms | docs/dev/FIREBASE_QUICK_REFERENCE.md | `mkdir -p docs/dev; git mv "docs/archive/roo-config/FIREBASE_QUICK_REFERENCE.md" "docs/dev/FIREBASE_QUICK_REFERENCE.md"`
docs/archive/roo-config/README.md | dev-setup | 11 | maybe | flag:secret-terms | docs/dev/README.md | `mkdir -p docs/dev; git mv "docs/archive/roo-config/README.md" "docs/dev/README.md"`
docs/archive/setup/SETUP_INSTRUCTIONS.md | dev-setup | 11 | maybe |  | docs/dev/SETUP_INSTRUCTIONS.md | `mkdir -p docs/dev; git mv "docs/archive/setup/SETUP_INSTRUCTIONS.md" "docs/dev/SETUP_INSTRUCTIONS.md"`
docs/archive/audits/audit-stage2-report.md | dev-setup | 8 | maybe |  | docs/dev/audit-stage2-report.md | `mkdir -p docs/dev; git mv "docs/archive/audits/audit-stage2-report.md" "docs/dev/audit-stage2-report.md"`
docs/archive/audits/audit-stage4-fix-workflow.md | dev-setup | 8 | maybe |  | docs/dev/audit-stage4-fix-workflow.md | `mkdir -p docs/dev; git mv "docs/archive/audits/audit-stage4-fix-workflow.md" "docs/dev/audit-stage4-fix-workflow.md"`
docs/archive/auth-audit/FINAL_AUTH_AUDIT_REPORT.md | dev-setup | 8 | maybe | flag:secret-terms | docs/dev/FINAL_AUTH_AUDIT_REPORT.md | `mkdir -p docs/dev; git mv "docs/archive/auth-audit/FINAL_AUTH_AUDIT_REPORT.md" "docs/dev/FINAL_AUTH_AUDIT_REPORT.md"`
docs/archive/backups/01-design-system.md | dev-setup | 8 | maybe |  | docs/dev/01-design-system.md | `mkdir -p docs/dev; git mv "docs/archive/backups/01-design-system.md" "docs/dev/01-design-system.md"`
docs/archive/backups/api-key-architecture.md | dev-setup | 8 | maybe | flag:secret-terms | docs/dev/api-key-architecture.md | `mkdir -p docs/dev; git mv "docs/archive/backups/api-key-architecture.md" "docs/dev/api-key-architecture.md"`
docs/archive/backups/development-workflow.md | dev-setup | 8 | maybe | flag:secret-terms | docs/dev/development-workflow.md | `mkdir -p docs/dev; git mv "docs/archive/backups/development-workflow.md" "docs/dev/development-workflow.md"`
docs/archive/backups/domain-email-setup.md | dev-setup | 8 | maybe |  | docs/dev/domain-email-setup.md | `mkdir -p docs/dev; git mv "docs/archive/backups/domain-email-setup.md" "docs/dev/domain-email-setup.md"`
docs/archive/backups/FIREBASE_LESSONS_LEARNED.md | dev-setup | 8 | maybe | flag:secret-terms | docs/dev/FIREBASE_LESSONS_LEARNED.md | `mkdir -p docs/dev; git mv "docs/archive/backups/FIREBASE_LESSONS_LEARNED.md" "docs/dev/FIREBASE_LESSONS_LEARNED.md"`
docs/archive/backups/FIREBASE_SETUP.md | dev-setup | 8 | maybe | flag:secret-terms | docs/dev/FIREBASE_SETUP.md | `mkdir -p docs/dev; git mv "docs/archive/backups/FIREBASE_SETUP.md" "docs/dev/FIREBASE_SETUP.md"`
docs/archive/backups/FIRESTORE_SETUP.md | dev-setup | 8 | maybe |  | docs/dev/FIRESTORE_SETUP.md | `mkdir -p docs/dev; git mv "docs/archive/backups/FIRESTORE_SETUP.md" "docs/dev/FIRESTORE_SETUP.md"`
docs/archive/backups/sendgrid-template-management.md | dev-setup | 8 | maybe | flag:secret-terms | docs/dev/sendgrid-template-management.md | `mkdir -p docs/dev; git mv "docs/archive/backups/sendgrid-template-management.md" "docs/dev/sendgrid-template-management.md"`
docs/archive/biome/biome-migration-guide.md | dev-setup | 8 | maybe |  | docs/dev/biome-migration-guide.md | `mkdir -p docs/dev; git mv "docs/archive/biome/biome-migration-guide.md" "docs/dev/biome-migration-guide.md"`
docs/archive/firebase/FIREBASE_LESSONS_LEARNED.md | dev-setup | 8 | maybe | flag:secret-terms | docs/dev/FIREBASE_LESSONS_LEARNED.md | `mkdir -p docs/dev; git mv "docs/archive/firebase/FIREBASE_LESSONS_LEARNED.md" "docs/dev/FIREBASE_LESSONS_LEARNED.md"`
docs/archive/main-docs/api-key-architecture.md | dev-setup | 8 | maybe | flag:secret-terms | docs/dev/api-key-architecture.md | `mkdir -p docs/dev; git mv "docs/archive/main-docs/api-key-architecture.md" "docs/dev/api-key-architecture.md"`
docs/archive/main-docs/development-workflow.md | dev-setup | 8 | maybe | flag:secret-terms | docs/dev/development-workflow.md | `mkdir -p docs/dev; git mv "docs/archive/main-docs/development-workflow.md" "docs/dev/development-workflow.md"`
docs/archive/main-docs/domain-email-setup.md | dev-setup | 8 | maybe |  | docs/dev/domain-email-setup.md | `mkdir -p docs/dev; git mv "docs/archive/main-docs/domain-email-setup.md" "docs/dev/domain-email-setup.md"`
docs/archive/main-docs/FIREBASE_SETUP.md | dev-setup | 8 | maybe | flag:secret-terms | docs/dev/FIREBASE_SETUP.md | `mkdir -p docs/dev; git mv "docs/archive/main-docs/FIREBASE_SETUP.md" "docs/dev/FIREBASE_SETUP.md"`
docs/archive/main-docs/FIRESTORE_SETUP.md | dev-setup | 8 | maybe |  | docs/dev/FIRESTORE_SETUP.md | `mkdir -p docs/dev; git mv "docs/archive/main-docs/FIRESTORE_SETUP.md" "docs/dev/FIRESTORE_SETUP.md"`
docs/archive/main-docs/sendgrid-template-management.md | dev-setup | 8 | maybe | flag:secret-terms | docs/dev/sendgrid-template-management.md | `mkdir -p docs/dev; git mv "docs/archive/main-docs/sendgrid-template-management.md" "docs/dev/sendgrid-template-management.md"`
docs/archive/memory-bank/decision-log.md | dev-setup | 8 | maybe | flag:secret-terms | docs/dev/decision-log.md | `mkdir -p docs/dev; git mv "docs/archive/memory-bank/decision-log.md" "docs/dev/decision-log.md"`
docs/archive/roo-config/01-design-system.md | dev-setup | 8 | maybe |  | docs/dev/01-design-system.md | `mkdir -p docs/dev; git mv "docs/archive/roo-config/01-design-system.md" "docs/dev/01-design-system.md"`
docs/archive/testing/implement-these-tests.md | dev-setup | 8 | maybe | flag:secret-terms | docs/dev/implement-these-tests.md | `mkdir -p docs/dev; git mv "docs/archive/testing/implement-these-tests.md" "docs/dev/implement-these-tests.md"`
docs/archive/testing/pr-based-testing.md | dev-setup | 8 | maybe | flag:secret-terms | docs/dev/pr-based-testing.md | `mkdir -p docs/dev; git mv "docs/archive/testing/pr-based-testing.md" "docs/dev/pr-based-testing.md"`
docs/archive/testing/README-AUTH-TESTING.md | dev-setup | 8 | maybe | flag:secret-terms | docs/dev/README-AUTH-TESTING.md | `mkdir -p docs/dev; git mv "docs/archive/testing/README-AUTH-TESTING.md" "docs/dev/README-AUTH-TESTING.md"`
docs/archive/audits/audit-stage3-report.md | dev-setup | 6 | maybe | flag:secret-terms | docs/dev/audit-stage3-report.md | `mkdir -p docs/dev; git mv "docs/archive/audits/audit-stage3-report.md" "docs/dev/audit-stage3-report.md"`
docs/archive/audits/audit-08172025-stage2-addition.md | dev-setup | 5 | maybe |  | docs/dev/audit-08172025-stage2-addition.md | `mkdir -p docs/dev; git mv "docs/archive/audits/audit-08172025-stage2-addition.md" "docs/dev/audit-08172025-stage2-addition.md"`
docs/archive/backups/ADMIN_EMAILS.md | dev-setup | 5 | maybe |  | docs/dev/ADMIN_EMAILS.md | `mkdir -p docs/dev; git mv "docs/archive/backups/ADMIN_EMAILS.md" "docs/dev/ADMIN_EMAILS.md"`
docs/archive/backups/copilot-instructions.md | dev-setup | 5 | maybe | flag:secret-terms | docs/dev/copilot-instructions.md | `mkdir -p docs/dev; git mv "docs/archive/backups/copilot-instructions.md" "docs/dev/copilot-instructions.md"`
docs/archive/codex-config/perf_plan.md | dev-setup | 5 | maybe |  | docs/dev/perf_plan.md | `mkdir -p docs/dev; git mv "docs/archive/codex-config/perf_plan.md" "docs/dev/perf_plan.md"`
docs/archive/codex-config/staff_fe_arch.system.md | dev-setup | 5 | maybe |  | docs/dev/staff_fe_arch.system.md | `mkdir -p docs/dev; git mv "docs/archive/codex-config/staff_fe_arch.system.md" "docs/dev/staff_fe_arch.system.md"`
docs/archive/configuration/ADMIN_EMAILS.md | dev-setup | 5 | maybe |  | docs/dev/ADMIN_EMAILS.md | `mkdir -p docs/dev; git mv "docs/archive/configuration/ADMIN_EMAILS.md" "docs/dev/ADMIN_EMAILS.md"`
docs/archive/github/copilot-instructions.md | dev-setup | 5 | maybe | flag:secret-terms | docs/dev/copilot-instructions.md | `mkdir -p docs/dev; git mv "docs/archive/github/copilot-instructions.md" "docs/dev/copilot-instructions.md"`
docs/archive/legacy-firebase-docs/FIREBASE_CONFIG_SECURITY.md | dev-setup | 5 | maybe | flag:secret-terms | docs/dev/FIREBASE_CONFIG_SECURITY.md | `mkdir -p docs/dev; git mv "docs/archive/legacy-firebase-docs/FIREBASE_CONFIG_SECURITY.md" "docs/dev/FIREBASE_CONFIG_SECURITY.md"`

</details>

## legacy-archive

<details>
<summary>View 22 files</summary>

File | Primary | Conf | Value | Flags | Proposed Path | Command
--- | --- | ---: | --- | --- | --- | ---
docs/migration/lessons-learned.md | legacy-archive | 16 | maybe | flag:secret-terms | docs/archive/lessons-learned.md | `mkdir -p docs/archive; git mv "docs/migration/lessons-learned.md" "docs/archive/lessons-learned.md"`
docs/migration/vetting-status.md | legacy-archive | 16 | maybe | flag:secret-terms | docs/archive/vetting-status.md | `mkdir -p docs/archive; git mv "docs/migration/vetting-status.md" "docs/archive/vetting-status.md"`
docs/archive/typescript/TYPESCRIPT_VICTORY.md | legacy-archive | 12 | maybe |  | docs/archive/TYPESCRIPT_VICTORY.md | `mkdir -p docs/archive; git mv "docs/archive/typescript/TYPESCRIPT_VICTORY.md" "docs/archive/TYPESCRIPT_VICTORY.md"`
docs/archive/memory-bank/active-context.md | legacy-archive | 11 | maybe |  | docs/archive/active-context.md | `mkdir -p docs/archive; git mv "docs/archive/memory-bank/active-context.md" "docs/archive/active-context.md"`
docs/archive/sprints/SPRINT_HANDOFF.md | legacy-archive | 11 | maybe | flag:secret-terms | docs/archive/SPRINT_HANDOFF.md | `mkdir -p docs/archive; git mv "docs/archive/sprints/SPRINT_HANDOFF.md" "docs/archive/SPRINT_HANDOFF.md"`
docs/archive/auth-audit/AUTH_AUDIT_ORCHESTRATION_PLAN.md | legacy-archive | 8 | archive | flag:secret-terms | docs/archive/AUTH_AUDIT_ORCHESTRATION_PLAN.md | `mkdir -p docs/archive; git mv "docs/archive/auth-audit/AUTH_AUDIT_ORCHESTRATION_PLAN.md" "docs/archive/AUTH_AUDIT_ORCHESTRATION_PLAN.md"`
docs/archive/backups/fix-api-key-restrictions.md | legacy-archive | 8 | archive | flag:secret-terms | docs/archive/fix-api-key-restrictions.md | `mkdir -p docs/archive; git mv "docs/archive/backups/fix-api-key-restrictions.md" "docs/archive/fix-api-key-restrictions.md"`
docs/archive/backups/oauth-setup.md | legacy-archive | 8 | archive |  | docs/archive/oauth-setup.md | `mkdir -p docs/archive; git mv "docs/archive/backups/oauth-setup.md" "docs/archive/oauth-setup.md"`
docs/archive/claude-config/auth-engineer.md | legacy-archive | 8 | archive | flag:secret-terms | docs/archive/auth-engineer.md | `mkdir -p docs/archive; git mv "docs/archive/claude-config/auth-engineer.md" "docs/archive/auth-engineer.md"`
docs/archive/claude-config/recaptcha-domain-solution.md | legacy-archive | 8 | archive |  | docs/archive/recaptcha-domain-solution.md | `mkdir -p docs/archive; git mv "docs/archive/claude-config/recaptcha-domain-solution.md" "docs/archive/recaptcha-domain-solution.md"`
docs/archive/codex-config/sre_obs.system.md | legacy-archive | 8 | archive |  | docs/archive/sre_obs.system.md | `mkdir -p docs/archive; git mv "docs/archive/codex-config/sre_obs.system.md" "docs/archive/sre_obs.system.md"`
docs/archive/legacy-firebase-docs/GOOGLE_CLOUD_DOMAIN_UPDATE.md | legacy-archive | 8 | archive | flag:secret-terms | docs/archive/GOOGLE_CLOUD_DOMAIN_UPDATE.md | `mkdir -p docs/archive; git mv "docs/archive/legacy-firebase-docs/GOOGLE_CLOUD_DOMAIN_UPDATE.md" "docs/archive/GOOGLE_CLOUD_DOMAIN_UPDATE.md"`
docs/archive/main-docs/FIREBASE_APP_HOSTING_REMOVAL.md | legacy-archive | 8 | archive |  | docs/archive/FIREBASE_APP_HOSTING_REMOVAL.md | `mkdir -p docs/archive; git mv "docs/archive/main-docs/FIREBASE_APP_HOSTING_REMOVAL.md" "docs/archive/FIREBASE_APP_HOSTING_REMOVAL.md"`
docs/archive/main-docs/fix-api-key-restrictions.md | legacy-archive | 8 | archive | flag:secret-terms | docs/archive/fix-api-key-restrictions.md | `mkdir -p docs/archive; git mv "docs/archive/main-docs/fix-api-key-restrictions.md" "docs/archive/fix-api-key-restrictions.md"`
docs/archive/main-docs/oauth-setup.md | legacy-archive | 8 | archive |  | docs/archive/oauth-setup.md | `mkdir -p docs/archive; git mv "docs/archive/main-docs/oauth-setup.md" "docs/archive/oauth-setup.md"`
docs/archive/recaptcha/recaptcha-entireprise-firebase-info.md | legacy-archive | 8 | archive | flag:secret-terms | docs/archive/recaptcha-entireprise-firebase-info.md | `mkdir -p docs/archive; git mv "docs/archive/recaptcha/recaptcha-entireprise-firebase-info.md" "docs/archive/recaptcha-entireprise-firebase-info.md"`
docs/archive/sprints/SPRINT_SUMMARY.md | legacy-archive | 8 | archive | flag:secret-terms | docs/archive/SPRINT_SUMMARY.md | `mkdir -p docs/archive; git mv "docs/archive/sprints/SPRINT_SUMMARY.md" "docs/archive/SPRINT_SUMMARY.md"`
docs/archive/codex-config/firebase_rules_audit.md | legacy-archive | 7 | archive |  | docs/archive/firebase_rules_audit.md | `mkdir -p docs/archive; git mv "docs/archive/codex-config/firebase_rules_audit.md" "docs/archive/firebase_rules_audit.md"`
docs/archive/legacy-firebase-docs/STAGE4_FIX_TRACKER.md | legacy-archive | 7 | archive |  | docs/archive/STAGE4_FIX_TRACKER.md | `mkdir -p docs/archive; git mv "docs/archive/legacy-firebase-docs/STAGE4_FIX_TRACKER.md" "docs/archive/STAGE4_FIX_TRACKER.md"`
docs/archive/backups/MIGRATE_DOMAIN_NOW.md | legacy-archive | 5 | archive |  | docs/archive/MIGRATE_DOMAIN_NOW.md | `mkdir -p docs/archive; git mv "docs/archive/backups/MIGRATE_DOMAIN_NOW.md" "docs/archive/MIGRATE_DOMAIN_NOW.md"`
docs/archive/codex-config/appsec_cloudsec.system.md | legacy-archive | 5 | archive | flag:secret-terms | docs/archive/appsec_cloudsec.system.md | `mkdir -p docs/archive; git mv "docs/archive/codex-config/appsec_cloudsec.system.md" "docs/archive/appsec_cloudsec.system.md"`
docs/archive/legacy-firebase-docs/MIGRATE_DOMAIN_NOW.md | legacy-archive | 5 | archive |  | docs/archive/MIGRATE_DOMAIN_NOW.md | `mkdir -p docs/archive; git mv "docs/archive/legacy-firebase-docs/MIGRATE_DOMAIN_NOW.md" "docs/archive/MIGRATE_DOMAIN_NOW.md"`

</details>

## ops-runbook

<details>
<summary>View 10 files</summary>

File | Primary | Conf | Value | Flags | Proposed Path | Command
--- | --- | ---: | --- | --- | --- | ---
docs/migration/process-docs.md | ops-runbook | 16 | keep | flag:secret-terms | docs/ops/runbooks/process-docs.md | `mkdir -p docs/ops/runbooks; git mv "docs/migration/process-docs.md" "docs/ops/runbooks/process-docs.md"`
docs/migration/triage-dashboard.md | ops-runbook | 16 | keep | flag:secret-terms | docs/ops/runbooks/triage-dashboard.md | `mkdir -p docs/ops/runbooks; git mv "docs/migration/triage-dashboard.md" "docs/ops/runbooks/triage-dashboard.md"`
docs/ops/runbooks/docs-migration.md | ops-runbook | 16 | keep | flag:secret-terms | docs/ops/runbooks/docs-migration.md | `mkdir -p docs/ops/runbooks; git mv "docs/ops/runbooks/docs-migration.md" "docs/ops/runbooks/docs-migration.md"`
docs/ops/runbooks/database-migration.md | ops-runbook | 15 | keep |  | docs/ops/runbooks/database-migration.md | `mkdir -p docs/ops/runbooks; git mv "docs/ops/runbooks/database-migration.md" "docs/ops/runbooks/database-migration.md"`
docs/migration/phase1b-complete.md | ops-runbook | 13 | keep | flag:secret-terms | docs/ops/runbooks/phase1b-complete.md | `mkdir -p docs/ops/runbooks; git mv "docs/migration/phase1b-complete.md" "docs/ops/runbooks/phase1b-complete.md"`
docs/ops/runbooks/orchestrator.md | ops-runbook | 12 | keep | flag:secret-terms | docs/ops/runbooks/orchestrator.md | `mkdir -p docs/ops/runbooks; git mv "docs/ops/runbooks/orchestrator.md" "docs/ops/runbooks/orchestrator.md"`
docs/ops/runbooks/FIX_USER_PROFILE_SETUP.md | ops-runbook | 9 | keep |  | docs/ops/runbooks/FIX_USER_PROFILE_SETUP.md | `mkdir -p docs/ops/runbooks; git mv "docs/ops/runbooks/FIX_USER_PROFILE_SETUP.md" "docs/ops/runbooks/FIX_USER_PROFILE_SETUP.md"`
docs/ops/runbooks/deployment-manager.md | ops-runbook | 8 | keep | flag:secret-terms | docs/ops/runbooks/deployment-manager.md | `mkdir -p docs/ops/runbooks; git mv "docs/ops/runbooks/deployment-manager.md" "docs/ops/runbooks/deployment-manager.md"`
docs/ops/runbooks/roo-enhancement-plan.md | ops-runbook | 6 | keep |  | docs/ops/runbooks/roo-enhancement-plan.md | `mkdir -p docs/ops/runbooks; git mv "docs/ops/runbooks/roo-enhancement-plan.md" "docs/ops/runbooks/roo-enhancement-plan.md"`
docs/ops/runbooks/LINTING_STRATEGY.md | ops-runbook | 5 | keep |  | docs/ops/runbooks/LINTING_STRATEGY.md | `mkdir -p docs/ops/runbooks; git mv "docs/ops/runbooks/LINTING_STRATEGY.md" "docs/ops/runbooks/LINTING_STRATEGY.md"`

</details>

## uncategorized

<details>
<summary>View 17 files</summary>

File | Primary | Conf | Value | Flags | Proposed Path | Command
--- | --- | ---: | --- | --- | --- | ---
docs/archive/backups/roo-example.md |  | 0 | maybe |  |  | ``
docs/archive/codex-config/a11y_checklist.md |  | 0 | maybe |  |  | ``
docs/archive/codex-config/a11y_engineer.system.md |  | 0 | maybe |  |  | ``
docs/archive/codex-config/arch_rsc_boundaries.md |  | 0 | maybe |  |  | ``
docs/archive/codex-config/data_analytics.system.md |  | 0 | maybe |  |  | ``
docs/archive/codex-config/ds_architecture.md |  | 0 | maybe |  |  | ``
docs/archive/codex-config/email_comms.system.md |  | 0 | maybe |  |  | ``
docs/archive/codex-config/eng_manager.system.md |  | 0 | maybe |  |  | ``
docs/archive/codex-config/eng_weekly_brief.md |  | 0 | maybe |  |  | ``
docs/archive/codex-config/feature_slice.md |  | 0 | maybe |  |  | ``
docs/archive/codex-config/fullstack.system.md |  | 0 | maybe |  |  | ``
docs/archive/codex-config/qa_lead.system.md |  | 0 | maybe |  |  | ``
docs/archive/codex-config/qa_test_matrix.md |  | 0 | maybe |  |  | ``
docs/archive/codex-config/sendgrid_templates.md |  | 0 | maybe |  |  | ``
docs/archive/codex-config/senior_ux.system.md |  | 0 | maybe |  |  | ``
docs/archive/package-management/package-json-updates.md |  | 0 | maybe |  |  | ``
docs/archive/roo/roo-example.md |  | 0 | maybe |  |  | ``

</details>

## user-docs

<details>
<summary>View 19 files</summary>

File | Primary | Conf | Value | Flags | Proposed Path | Command
--- | --- | ---: | --- | --- | --- | ---
docs/archive/backups/email-deliverability.md | user-docs | 11 | maybe | flag:secret-terms | docs/user/guides/email-deliverability.md | `mkdir -p docs/user/guides; git mv "docs/archive/backups/email-deliverability.md" "docs/user/guides/email-deliverability.md"`
docs/archive/backups/MCP_INTEGRATION_GUIDE.md | user-docs | 11 | maybe | flag:secret-terms | docs/user/guides/MCP_INTEGRATION_GUIDE.md | `mkdir -p docs/user/guides; git mv "docs/archive/backups/MCP_INTEGRATION_GUIDE.md" "docs/user/guides/MCP_INTEGRATION_GUIDE.md"`
docs/archive/main-docs/email-deliverability.md | user-docs | 11 | maybe | flag:secret-terms | docs/user/guides/email-deliverability.md | `mkdir -p docs/user/guides; git mv "docs/archive/main-docs/email-deliverability.md" "docs/user/guides/email-deliverability.md"`
docs/archive/orchestration/MCP_INTEGRATION_GUIDE.md | user-docs | 11 | maybe | flag:secret-terms | docs/user/guides/MCP_INTEGRATION_GUIDE.md | `mkdir -p docs/user/guides; git mv "docs/archive/orchestration/MCP_INTEGRATION_GUIDE.md" "docs/user/guides/MCP_INTEGRATION_GUIDE.md"`
docs/archive/legacy-firebase-docs/BIOME_MIGRATION_SUMMARY.md | user-docs | 10 | maybe |  | docs/user/guides/BIOME_MIGRATION_SUMMARY.md | `mkdir -p docs/user/guides; git mv "docs/archive/legacy-firebase-docs/BIOME_MIGRATION_SUMMARY.md" "docs/user/guides/BIOME_MIGRATION_SUMMARY.md"`
docs/archive/main-docs/REFACTOR-UX-WORKFLOW.md | user-docs | 10 | maybe | flag:secret-terms | docs/user/guides/REFACTOR-UX-WORKFLOW.md | `mkdir -p docs/user/guides; git mv "docs/archive/main-docs/REFACTOR-UX-WORKFLOW.md" "docs/user/guides/REFACTOR-UX-WORKFLOW.md"`
docs/archive/memory-bank/agent-handoffs.md | user-docs | 10 | maybe |  | docs/user/guides/agent-handoffs.md | `mkdir -p docs/user/guides; git mv "docs/archive/memory-bank/agent-handoffs.md" "docs/user/guides/agent-handoffs.md"`
docs/archive/auth-audit/AUTH_FIXES_VALIDATED.md | user-docs | 8 | maybe | flag:secret-terms | docs/user/guides/AUTH_FIXES_VALIDATED.md | `mkdir -p docs/user/guides; git mv "docs/archive/auth-audit/AUTH_FIXES_VALIDATED.md" "docs/user/guides/AUTH_FIXES_VALIDATED.md"`
docs/archive/backups/AUTO-FIXING-SETUP.md | user-docs | 8 | maybe | flag:secret-terms | docs/user/guides/AUTO-FIXING-SETUP.md | `mkdir -p docs/user/guides; git mv "docs/archive/backups/AUTO-FIXING-SETUP.md" "docs/user/guides/AUTO-FIXING-SETUP.md"`
docs/archive/backups/FIREBASE_ADMIN_SETUP.md | user-docs | 8 | maybe |  | docs/user/guides/FIREBASE_ADMIN_SETUP.md | `mkdir -p docs/user/guides; git mv "docs/archive/backups/FIREBASE_ADMIN_SETUP.md" "docs/user/guides/FIREBASE_ADMIN_SETUP.md"`
docs/archive/backups/OAUTH_VS_FIREBASE_EXPLAINED.md | user-docs | 8 | maybe | flag:secret-terms | docs/user/guides/OAUTH_VS_FIREBASE_EXPLAINED.md | `mkdir -p docs/user/guides; git mv "docs/archive/backups/OAUTH_VS_FIREBASE_EXPLAINED.md" "docs/user/guides/OAUTH_VS_FIREBASE_EXPLAINED.md"`
docs/archive/legacy-firebase-docs/APP_CHECK_OAUTH_ISSUE.md | user-docs | 8 | maybe | flag:secret-terms | docs/user/guides/APP_CHECK_OAUTH_ISSUE.md | `mkdir -p docs/user/guides; git mv "docs/archive/legacy-firebase-docs/APP_CHECK_OAUTH_ISSUE.md" "docs/user/guides/APP_CHECK_OAUTH_ISSUE.md"`
docs/archive/legacy-firebase-docs/AUTO-FIXING-SETUP.md | user-docs | 8 | maybe | flag:secret-terms | docs/user/guides/AUTO-FIXING-SETUP.md | `mkdir -p docs/user/guides; git mv "docs/archive/legacy-firebase-docs/AUTO-FIXING-SETUP.md" "docs/user/guides/AUTO-FIXING-SETUP.md"`
docs/archive/legacy-firebase-docs/OAUTH_VS_FIREBASE_EXPLAINED.md | user-docs | 8 | maybe | flag:secret-terms | docs/user/guides/OAUTH_VS_FIREBASE_EXPLAINED.md | `mkdir -p docs/user/guides; git mv "docs/archive/legacy-firebase-docs/OAUTH_VS_FIREBASE_EXPLAINED.md" "docs/user/guides/OAUTH_VS_FIREBASE_EXPLAINED.md"`
docs/archive/main-docs/FIREBASE_ADMIN_SETUP.md | user-docs | 8 | maybe |  | docs/user/guides/FIREBASE_ADMIN_SETUP.md | `mkdir -p docs/user/guides; git mv "docs/archive/main-docs/FIREBASE_ADMIN_SETUP.md" "docs/user/guides/FIREBASE_ADMIN_SETUP.md"`
docs/archive/backups/theme-images.md | user-docs | 5 | maybe |  | docs/user/guides/theme-images.md | `mkdir -p docs/user/guides; git mv "docs/archive/backups/theme-images.md" "docs/user/guides/theme-images.md"`
docs/archive/biome/biome-fixes-plan.md | user-docs | 5 | maybe |  | docs/user/guides/biome-fixes-plan.md | `mkdir -p docs/user/guides; git mv "docs/archive/biome/biome-fixes-plan.md" "docs/user/guides/biome-fixes-plan.md"`
docs/archive/deployment/DEPLOYMENT_METHOD.md | user-docs | 5 | maybe |  | docs/user/guides/DEPLOYMENT_METHOD.md | `mkdir -p docs/user/guides; git mv "docs/archive/deployment/DEPLOYMENT_METHOD.md" "docs/user/guides/DEPLOYMENT_METHOD.md"`
docs/archive/main-docs/theme-images.md | user-docs | 5 | maybe |  | docs/user/guides/theme-images.md | `mkdir -p docs/user/guides; git mv "docs/archive/main-docs/theme-images.md" "docs/user/guides/theme-images.md"`

</details>

---

## Next Steps

1. **Review quarantine files** for secrets that need removal
2. **Process KEEP files** - move to new canonical locations
3. **Review MAYBE files** - decide case-by-case
4. **Leave ARCHIVE files** in docs/archive/

### Quick Commands

```bash
# Generate fresh classification
bun tools/doc-classifier.ts --print-mv --dry-run

# Filter by value
bun tools/docs-dashboard.ts --only keep

# Filter by confidence
bun tools/docs-dashboard.ts --min-confidence 7

# Check for secrets
bun tools/docs-dashboard.ts --flags secret
```
