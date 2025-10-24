# Infisical Secrets Management Setup

**Project**: Homer Enrichment Hub
**Infisical Instance**: https://secrets.jefahnierocks.com
**Project Name**: homer-enrichment
**Project Slug**: homer-enrichment-ms-js
**Environment**: Production (slug: `prod`)

---

## Overview

This project uses **Infisical** for centralized secrets management across all environments. This provides:
- ✅ Single source of truth for secrets
- ✅ Audit logging of secret access
- ✅ Easy rotation without code changes
- ✅ Integration with Vercel, local dev, CI/CD
- ✅ Role-based access control

---

## Service Token

**Token Name**: homer-enrichment-infisical
**Access**: Read/Write to Production environment
**Token**: Stored securely in gopass at `infisical/service-token`

⚠️ **Security**: The service token is stored securely:
- Local dev: Retrieved from gopass (`infisical/service-token`)
- Vercel: In environment variables (for Infisical integration)
- CI/CD: In GitHub Secrets or equivalent

---

## Quick Start

### 1. Install Infisical CLI

```bash
# macOS
brew install infisical/get-cli/infisical

# Or download directly
curl -1sLf 'https://dl.cloudsmith.io/public/infisical/infisical-cli/setup.brew.sh' | bash
brew install infisical
```

### 2. Login to Your Instance

```bash
# Login to your self-hosted instance
infisical login --domain=https://secrets.jefahnierocks.com

# Or use service token from gopass
export INFISICAL_TOKEN="$(gopass show infisical/service-token)"
```

### 3. Initialize Project

```bash
# Navigate to project directory
cd /Users/verlyn13/Development/personal/kbe-website

# Initialize Infisical (creates .infisical.json)
infisical init \
  --domain=https://secrets.jefahnierocks.com \
  --project-id=homer-enrichment-ms-js
```

This creates `.infisical.json`:
```json
{
  "workspaceId": "homer-enrichment-ms-js",
  "defaultEnvironment": "prod",
  "gitBranchToEnvironmentMapping": null
}
```

⚠️ **Add to .gitignore**: The `.infisical.json` is already ignored (safe to commit with project ID only)

### 4. Run Development Server with Secrets

```bash
# Run any command with Infisical secrets injected
infisical run --env=prod -- bun run dev

# Or export to environment
infisical export --env=prod --format=dotenv > .env.local
```

---

## Secrets to Store in Infisical

### Required Secrets (Production Environment)

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
DATABASE_URL=postgresql://postgres:[password]@[host]:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres:[password]@[host]:5432/postgres

# Sentry Configuration
NEXT_PUBLIC_SENTRY_DSN=<your-sentry-dsn>
SENTRY_ORG=<your-sentry-org>
SENTRY_PROJECT=<your-sentry-project>
SENTRY_AUTH_TOKEN=<your-sentry-auth-token>

# Application Configuration
NEXT_PUBLIC_APP_URL=https://homerenrichment.com

# Authentication Secrets
NEXTAUTH_SECRET=your-nextauth-secret
JWT_SECRET=your-jwt-secret

# SendGrid Email Service
SENDGRID_API_KEY=SG.your-sendgrid-api-key
SENDGRID_TEMPLATE_MAGIC_LINK=d-253a56e3a26b406fa81bb825bfdbf724
SENDGRID_TEMPLATE_WELCOME=d-042422ef902d44ac92f8742b73236b00
SENDGRID_TEMPLATE_PASSWORD_RESET=d-cc635b94eea047dab31768e8aa06675e
SENDGRID_TEMPLATE_ANNOUNCEMENT=d-8099c86a29224852ba10fc3142b989e0
SENDGRID_TEMPLATE_REGISTRATION_CONFIRMATION=d-d9b6ac26e2db4cbd8d0a587a865c0f9e
```

### Adding Secrets via CLI

```bash
# Add individual secrets
infisical secrets set NEXT_PUBLIC_SUPABASE_URL "https://your-project.supabase.co" --env=prod

# Add from file (bulk import)
infisical secrets set --from-file=.env.local --env=prod

# Or use the web UI at https://secrets.jefahnierocks.com
```

---

## Local Development Workflow

### Option 1: Infisical Run (Recommended)

```bash
# Start dev server with injected secrets
infisical run --env=prod -- bun run dev

# Run database migrations
infisical run --env=prod -- bunx prisma migrate dev

# Run tests
infisical run --env=prod -- bun run test

# Any command
infisical run --env=prod -- <your-command>
```

**Pros**: Secrets never written to disk, always fresh from Infisical

### Option 2: Export to .env.local

```bash
# Export secrets to .env.local (one-time)
infisical export --env=prod --format=dotenv > .env.local

# Then run commands normally
bun run dev
```

**Pros**: Faster startup, works offline
**Cons**: Secrets can get stale, stored on disk

### Option 3: Shell Integration

```bash
# Add to your shell profile (~/.zshrc or ~/.bashrc)
alias infrun="infisical run --env=prod --"

# Then use
infrun bun run dev
infrun bunx prisma migrate dev
```

---

## Vercel Integration

### Option 1: Infisical Vercel Integration (Recommended)

1. **Install Infisical Vercel Integration**:
   - Go to: https://secrets.jefahnierocks.com/integrations
   - Click "Vercel"
   - Authorize with Vercel account
   - Select project: `kbe-website`
   - Map environment: `prod` → `production`
   - Enable auto-sync

2. **Secrets automatically sync** to Vercel on every change

**Pros**: Automatic sync, no manual updates, audit trail

### Option 2: Manual Sync via CLI

```bash
# Sync secrets to Vercel
infisical export --env=prod --format=vercel | vercel env add

# Or use Infisical's Vercel integration command
infisical integrations sync vercel --env=prod --vercel-project-id=prj_...
```

### Option 3: Use Service Token in Vercel

```bash
# Add Infisical token to Vercel (retrieve from gopass)
vercel env add INFISICAL_TOKEN production
# When prompted, paste: $(gopass show infisical/service-token)

# Then use in build command (vercel.json):
{
  "buildCommand": "infisical run --env=prod -- bun run build"
}
```

---

## CI/CD Integration (GitHub Actions)

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install Infisical CLI
        run: |
          curl -1sLf 'https://dl.cloudsmith.io/public/infisical/infisical-cli/setup.deb.sh' | sudo -E bash
          sudo apt-get update && sudo apt-get install -y infisical

      - name: Run tests with secrets
        env:
          INFISICAL_TOKEN: ${{ secrets.INFISICAL_TOKEN }}
        run: |
          infisical run --domain=https://secrets.jefahnierocks.com --env=prod -- bun run test

      - name: Deploy to Vercel
        run: vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
```

**Setup**:
1. Add `INFISICAL_TOKEN` to GitHub Secrets
2. Use `infisical run` for any commands needing secrets

---

## Best Practices

### 1. Environment Strategy

Create multiple environments in Infisical:
- **`dev`**: Local development secrets (can be less sensitive)
- **`staging`**: Preview/staging environment
- **`prod`**: Production secrets (strict access control)

```bash
# Use different environments
infisical run --env=dev -- bun run dev
infisical run --env=staging -- bun run build
infisical run --env=prod -- bun run build  # Production only
```

### 2. Secret Rotation

```bash
# Update a secret
infisical secrets set SENDGRID_API_KEY "new-api-key" --env=prod

# If using Vercel integration, it syncs automatically
# Otherwise, manually sync
vercel env pull .env.vercel.local
```

### 3. Access Control

- Use **service tokens** for automation (CI/CD, Vercel)
- Use **user accounts** for team members
- Create **read-only tokens** for monitoring tools
- Rotate tokens regularly (at least quarterly)

### 4. Audit Logging

Check Infisical dashboard for:
- Who accessed which secrets
- When secrets were modified
- Which service tokens are active

---

## Migration from .env.local

### Step 1: Backup Current Secrets

```bash
# Save current .env.local
cp .env.local .env.local.backup
```

### Step 2: Import to Infisical

```bash
# Import all secrets from .env.local
infisical secrets set --from-file=.env.local --env=prod

# Verify import
infisical secrets list --env=prod
```

### Step 3: Test with Infisical

```bash
# Test dev server
infisical run --env=prod -- bun run dev

# Test build
infisical run --env=prod -- bun run build

# Test database access
infisical run --env=prod -- bunx prisma studio
```

### Step 4: Remove .env.local (Optional)

```bash
# Once confident, remove local file
rm .env.local

# Always use Infisical run
alias dev="infisical run --env=prod -- bun run dev"
```

---

## Troubleshooting

### "Infisical token is invalid"

```bash
# Re-login
infisical login --domain=https://secrets.jefahnierocks.com

# Or set token from gopass
export INFISICAL_TOKEN="$(gopass show infisical/service-token)"
```

### "Project not found"

```bash
# Verify project ID
cat .infisical.json

# Re-initialize if needed
rm .infisical.json
infisical init --domain=https://secrets.jefahnierocks.com
```

### Secrets not syncing to Vercel

1. Check Vercel integration is enabled in Infisical dashboard
2. Verify environment mapping (prod → production)
3. Manually trigger sync or wait for next update
4. Check Vercel logs for integration errors

### SSL/TLS errors with self-hosted instance

```bash
# If using self-signed certificate
export NODE_TLS_REJECT_UNAUTHORIZED=0

# Or add your CA certificate
export NODE_EXTRA_CA_CERTS=/path/to/ca-certificate.crt
```

---

## CLI Commands Reference

```bash
# Authentication
infisical login --domain=https://secrets.jefahnierocks.com
infisical logout

# Project Management
infisical init --domain=https://secrets.jefahnierocks.com
infisical projects list

# Secrets Management
infisical secrets list --env=prod
infisical secrets get DATABASE_URL --env=prod
infisical secrets set KEY "value" --env=prod
infisical secrets delete KEY --env=prod

# Running Commands
infisical run --env=prod -- <command>
infisical run --env=prod --projectId=homer-enrichment-ms-js -- <command>

# Exporting Secrets
infisical export --env=prod --format=dotenv
infisical export --env=prod --format=json
infisical export --env=prod --format=csv

# Service Tokens
infisical service-token
```

---

## Security Considerations

### ✅ Do's

- Store service token in secure location (gopass, 1Password)
- Use read-only tokens for monitoring/reporting
- Rotate tokens regularly
- Use separate environments for dev/staging/prod
- Enable audit logging
- Use least-privilege access

### ❌ Don'ts

- Don't commit `.env.local` with real secrets
- Don't share service tokens in Slack/email
- Don't use production tokens in development
- Don't disable audit logging
- Don't use same secrets across environments
- Don't commit `.infisical.json` if it contains tokens

---

## Claude Code Integration

### New Slash Command: /infisical

Create `.claude/commands/infisical.md`:
```markdown
---
description: Manage secrets with Infisical
---

Interact with Infisical secrets for this project:

1. List all secrets: `infisical secrets list --env=prod`
2. Get a specific secret: `infisical secrets get <KEY> --env=prod`
3. Update a secret: `infisical secrets set <KEY> "value" --env=prod`
4. Run command with secrets: `infisical run --env=prod -- <command>`

Project: homer-enrichment-ms-js
Environment: prod
Instance: https://secrets.jefahnierocks.com
```

### Update Development Command

Modify `.claude/commands/dev.md`:
```bash
# Start dev server with Infisical secrets
infisical run --env=prod -- bun run dev
```

---

## Resources

- **Infisical Documentation**: https://infisical.com/docs
- **Your Instance**: https://secrets.jefahnierocks.com
- **CLI Reference**: https://infisical.com/docs/cli/overview
- **Vercel Integration**: https://infisical.com/docs/integrations/platforms/vercel

---

## Quick Reference Card

```bash
# Daily Development
infrun bun run dev              # Start dev server
infrun bunx prisma studio       # Open database UI
infrun bun run test             # Run tests

# Secret Management
infisical secrets list --env=prod                    # List all
infisical secrets get DATABASE_URL --env=prod        # Get one
infisical secrets set API_KEY "new-value" --env=prod # Update

# Export (when needed offline)
infisical export --env=prod --format=dotenv > .env.local

# Emergency: Rotate a compromised secret
1. Update in Infisical dashboard
2. If using Vercel integration, auto-syncs
3. Otherwise: vercel env pull
4. Restart app: vercel --prod
```

---

**Setup Complete!** 🎉

Run: `infisical login --domain=https://secrets.jefahnierocks.com` to get started.
