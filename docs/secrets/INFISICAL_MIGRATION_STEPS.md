# Infisical Secrets Migration - Action Required

**Status**: Script ready, needs project ID to execute

---

## Issue

The service token you provided references project ID/slug `homer-enrichment-ms-js`, but this project either:
1. Doesn't exist yet in your Infisical instance
2. Has a different actual project ID (UUID format)

---

## Solution: 2 Options

### Option 1: Use Infisical Web UI (Fastest - 5 minutes)

1. **Go to Infisical Dashboard**:
   - Open: https://secrets.jefahnierocks.com
   - Login with your account

2. **Navigate to your project**:
   - Project name: `homer-enrichment`
   - If it doesn't exist, create it first

3. **Get the Project ID**:
   - Go to Project Settings
   - Copy the **Project ID** (UUID format like `6789abcd-1234-5678-90ab-cdef12345678`)

4. **Bulk import secrets**:
   - In the web UI, go to Environment: `prod`
   - Click "Add Secret" or "Import"
   - Copy/paste from template below
   - Save all

**Secrets Template** (copy this into Infisical):

```bash
# Authentication (set actual values in Infisical)
NEXTAUTH_SECRET=<set-in-infisical>
JWT_SECRET=<set-in-infisical>

# Application
NEXT_PUBLIC_APP_URL=https://homerenrichment.com

# SendGrid
SENDGRID_API_KEY=<set-in-infisical>
SENDGRID_TEMPLATE_MAGIC_LINK=<template-id>
SENDGRID_TEMPLATE_WELCOME=<template-id>
SENDGRID_TEMPLATE_PASSWORD_RESET=<template-id>
SENDGRID_TEMPLATE_ANNOUNCEMENT=<template-id>
SENDGRID_TEMPLATE_REGISTRATION_CONFIRMATION=<template-id>

# Sentry
NEXT_PUBLIC_SENTRY_DSN=<set-in-infisical>
SENTRY_ORG=<org>
SENTRY_PROJECT=<project>
SENTRY_AUTH_TOKEN=<set-in-infisical>

# Supabase (ADD YOUR ACTUAL VALUES)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
DATABASE_URL=postgresql://postgres:[password]@[host]:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres:[password]@[host]:5432/postgres
```

---

### Option 2: Use CLI Script (Automated)

1. **Store service token in gopass** (if not already):
   ```bash
   gopass insert infisical/tokens/homer-enrichment
   # Paste the token retrieved from your secrets manager
   ```

2. **Get Project ID from web UI**:
   - https://secrets.jefahnierocks.com → Settings → Copy Project ID

3. **Run migration script**:
   ```bash
   export INFISICAL_TOKEN=$(gopass show -o infisical/tokens/homer-enrichment)
   ./scripts/migrate-secrets-to-infisical.sh <PROJECT_ID>
   ```

   Replace `<PROJECT_ID>` with the UUID you copied.

4. **Manually add Supabase secrets** (via web UI or CLI):
   ```bash
   infisical secrets set \
     --env=prod \
     --projectId=<PROJECT_ID> \
     --domain=https://secrets.jefahnierocks.com \
     NEXT_PUBLIC_SUPABASE_URL=your-url

   # Repeat for other Supabase vars
   ```

---

## After Migration

### 1. Update .infisical.json

Create or update `.infisical.json` in project root:

```json
{
  "workspaceId": "<YOUR_PROJECT_ID>",
  "defaultEnvironment": "prod",
  "gitBranchToEnvironmentMapping": null
}
```

Replace `<YOUR_PROJECT_ID>` with the actual UUID.

### 2. Test Local Development

```bash
# Export token
export INFISICAL_TOKEN=$(gopass show -o infisical/tokens/homer-enrichment)

# Test secrets list
infisical secrets list --env=prod --domain=https://secrets.jefahnierocks.com

# Test development server
infisical run --env=prod --domain=https://secrets.jefahnierocks.com -- bun run dev
```

### 3. Set Up Vercel Integration

1. Go to: https://secrets.jefahnierocks.com/integrations
2. Click "Vercel"
3. Authorize with your Vercel account
4. Select project: `kbe-website`
5. Map environment: `prod` → `production`
6. Enable auto-sync

**OR** manually add to Vercel:

```bash
# Add Infisical token to Vercel (for build-time access)
vercel env add INFISICAL_TOKEN production
# When prompted, paste the token from gopass: $(gopass show infisical/service-token)

# Then all secrets auto-sync from Infisical
```

### 4. Verify Everything Works

```bash
# Check all secrets are set
infisical secrets list --env=prod --domain=https://secrets.jefahnierocks.com

# Test local build
infisical run --env=prod --domain=https://secrets.jefahnierocks.com -- bun run build

# Check Vercel environment
vercel env ls
```

---

## Secrets Checklist

Ensure these are all in Infisical `prod` environment:

### ✅ Already in Migration Script
- [x] NEXTAUTH_SECRET
- [x] JWT_SECRET
- [x] NEXT_PUBLIC_APP_URL
- [x] SENDGRID_API_KEY
- [x] SENDGRID_TEMPLATE_* (5 templates)
- [x] NEXT_PUBLIC_SENTRY_DSN
- [x] SENTRY_ORG
- [x] SENTRY_PROJECT
- [x] SENTRY_AUTH_TOKEN

### ⚠️ Need to Add Manually (from Supabase dashboard)
- [ ] NEXT_PUBLIC_SUPABASE_URL
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY
- [ ] DATABASE_URL (pooled, port 6543)
- [ ] DIRECT_URL (direct, port 5432)

**Get Supabase credentials**:
- URL & Keys: https://app.supabase.com/project/_/settings/api
- Database: https://app.supabase.com/project/_/settings/database

---

## Troubleshooting

### "Project not found"
- Verify project exists in web UI
- Check you're using the project ID (UUID), not slug
- Ensure service token has access to the project

### "Invalid token"
```bash
# Re-export token
export INFISICAL_TOKEN=$(gopass show -o infisical/tokens/homer-enrichment)

# Or set directly
export INFISICAL_TOKEN="$(gopass show infisical/service-token)"
```

### Can't find project ID
1. Go to https://secrets.jefahnierocks.com
2. Select project `homer-enrichment`
3. Go to Settings
4. Copy "Project ID" field

---

## What Happens Next

Once secrets are in Infisical:

1. **Local Development**:
   ```bash
   infisical run --env=prod -- bun run dev
   ```

2. **Vercel Builds**:
   - Automatically pull secrets from Infisical (if integration enabled)
   - Or use INFISICAL_TOKEN in build command

3. **Team Members**:
   - Can access secrets via web UI or CLI
   - No need to share .env files
   - Audit trail of who accessed what

4. **Secret Rotation**:
   - Update in Infisical web UI
   - Auto-syncs to Vercel (if integration enabled)
   - All developers get new secrets on next run

---

## Files Created

- ✅ `scripts/migrate-secrets-to-infisical.sh` - Automated migration script
- ✅ `docs/INFISICAL_SETUP.md` - Complete documentation
- ✅ `INFISICAL_QUICKSTART.md` - Quick reference
- ✅ `.claude/commands/infisical.md` - Claude Code command

---

## Summary

**What you need to do**:
1. Get project ID from Infisical web UI
2. Run migration script OR paste secrets in web UI
3. Add Supabase credentials (4 variables)
4. Test with `infisical run -- bun run dev`
5. Set up Vercel integration (optional but recommended)

**Estimated time**: 10 minutes

**Let me know once you have the project ID and I can help complete the migration!**
