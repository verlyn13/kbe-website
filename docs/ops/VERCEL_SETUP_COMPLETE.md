# ✅ Vercel CLI Setup Complete

**Date**: October 23, 2025
**Status**: ✅ **READY** - Vercel CLI configured and project linked

---

## Configuration Summary

### Vercel Project
- **Project Name**: kbe-website
- **Project ID**: `prj_WAt5IlHTlS9e3Ee7BJAW94vChMAv`
- **Organization**: jeffrey-johnsons-projects-4efd9acb
- **Team ID**: `team_gvgzBkX242v2UQMCiWa9iyam`
- **CLI Version**: 48.5.0
- **Authenticated As**: verlyn13

### Project Linked
✅ **Status**: Linked successfully
- Configuration stored in `.vercel/project.json`
- Ready for CLI deployments

---

## Environment Variables in Vercel (Production)

### ✅ Already Configured (15 variables)
- DIRECT_URL
- DATABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- NEXT_PUBLIC_SUPABASE_URL
- SENDGRID_TEMPLATE_REGISTRATION_CONFIRMATION
- SENDGRID_TEMPLATE_ANNOUNCEMENT
- SENDGRID_TEMPLATE_PASSWORD_RESET
- SENDGRID_TEMPLATE_WELCOME
- SENDGRID_TEMPLATE_MAGIC_LINK
- SENDGRID_API_KEY
- NODE_ENV
- NEXT_PUBLIC_RECAPTCHA_ENTERPRISE_SITE_KEY
- NEXT_PUBLIC_APP_URL
- JWT_SECRET
- NEXTAUTH_SECRET

### ✅ Just Added (4 Sentry variables)
- NEXT_PUBLIC_SENTRY_DSN
- SENTRY_ORG
- SENTRY_PROJECT
- SENTRY_AUTH_TOKEN

**Total**: 19 environment variables configured for production

---

## Available Commands

### Deployment Commands

```bash
# Preview deployment (test before production)
vercel

# Production deployment
vercel --prod

# Deploy with alias
vercel --prod --alias=homerenrichment.com
```

### Environment Variable Management

```bash
# List all environment variables
vercel env ls

# Pull environment variables to local file
vercel env pull .env.vercel.local

# Add new environment variable
vercel env add VARIABLE_NAME production
# Then paste the value when prompted

# Remove environment variable
vercel env rm VARIABLE_NAME production
```

### Project Management

```bash
# View project info
vercel inspect

# View recent deployments
vercel ls

# View deployment logs
vercel logs <deployment-url>

# Check project domains
vercel domains ls
```

### Development

```bash
# Run local Vercel dev server (simulates Vercel environment)
vercel dev

# Link to different project
vercel link

# Unlink project
vercel unlink
```

---

## Integration with Infisical

You have two options for managing secrets:

### Option 1: Manual Sync (Current Setup)
- Secrets stored in both Infisical and Vercel
- Update Vercel manually when secrets change
- Good for: Stable secrets that rarely change

### Option 2: Infisical Vercel Integration (Recommended)
- Auto-sync from Infisical → Vercel
- Update once in Infisical, applies to Vercel automatically
- Better for: Frequently rotated secrets

**To set up auto-sync**:
1. Go to: https://secrets.jefahnierocks.com/integrations
2. Click "Vercel"
3. Authorize
4. Select project: `kbe-website`
5. Map: `prod` → `production`

---

## Deployment Workflow

### Standard Deployment

```bash
# 1. Make your changes
git add .
git commit -m "Your changes"
git push origin main

# 2. Deploy to preview first
vercel

# 3. Test the preview URL
# (Vercel will give you a URL like: kbe-website-abc123.vercel.app)

# 4. Deploy to production
vercel --prod
```

### Using Git Integration (Automatic)

If you have Vercel GitHub integration:
- Push to `main` → Auto-deploys to production
- Push to feature branch → Auto-creates preview
- Open PR → Preview deployment link in PR

### With Sentry Release Tracking

```bash
# Deploy and create Sentry release
export SENTRY_ORG=happy-patterns-llc
export SENTRY_PROJECT=javascript-nextjs
export SENTRY_AUTH_TOKEN=$(gopass show -o sentry/auth-token)

# Deploy
vercel --prod

# Get deployment URL, then create Sentry release
RELEASE=$(git rev-parse HEAD)
sentry-cli releases new $RELEASE
sentry-cli releases set-commits $RELEASE --auto
sentry-cli releases finalize $RELEASE
```

---

## Vercel + Sentry Integration

### Build-Time (Automatic)

With Sentry environment variables configured:
- Source maps automatically uploaded during build
- Release tracking enabled
- Error context includes deployment info

### Runtime Error Tracking

All production errors will:
- Be captured by Sentry
- Include source maps for debugging
- Show which deployment version
- Track user sessions

---

## Common Workflows

### Deploy with Environment Check

```bash
# Pull latest env vars
vercel env pull .env.vercel.local

# Check what changed
diff .env.vercel.local .env.local

# Deploy
vercel --prod
```

### Rollback Deployment

```bash
# List deployments
vercel ls

# Promote previous deployment to production
vercel promote <deployment-url> --prod
```

### View Logs

```bash
# Real-time logs for production
vercel logs --follow

# Logs for specific deployment
vercel logs <deployment-url>
```

### Manage Domains

```bash
# List domains
vercel domains ls

# Add domain
vercel domains add homerenrichment.com

# Remove domain
vercel domains rm old-domain.com
```

---

## Project Structure

```
kbe-website/
├── .vercel/
│   ├── project.json          # Project linking info
│   └── README.txt            # Auto-generated
├── vercel.json               # Deployment configuration
├── .env.local                # Local development
├── .env.vercel.local         # Pulled from Vercel (gitignored)
└── .gitignore                # Ignores .vercel/
```

**Important**: `.vercel/` directory is gitignored automatically

---

## Troubleshooting

### "Not linked to project"

```bash
vercel link --yes
```

### Environment variables not updating

```bash
# Pull latest from Vercel
vercel env pull .env.vercel.local --force

# Or restart dev server
vercel dev
```

### Build failing on Vercel

```bash
# Test build locally
vercel build

# Check build logs
vercel logs <deployment-url>
```

### Domain not working

```bash
# Check domain status
vercel domains ls

# Inspect domain configuration
vercel domains inspect homerenrichment.com

# Check DNS settings
vercel domains verify homerenrichment.com
```

---

## Security Best Practices

### ✅ Do's

- ✅ Use `vercel env add` for secrets (never commit)
- ✅ Pull env vars to `.env.vercel.local` (gitignored)
- ✅ Use preview deployments to test before production
- ✅ Keep Vercel and Infisical secrets in sync
- ✅ Rotate SENTRY_AUTH_TOKEN regularly

### ❌ Don'ts

- ❌ Never commit `.env.vercel.local`
- ❌ Don't share deployment URLs with sensitive data
- ❌ Don't expose SENTRY_AUTH_TOKEN in client code
- ❌ Don't bypass preview deployments for production
- ❌ Don't store secrets in vercel.json

---

## Sentry Integration Details

### Environment Variables Set

```bash
NEXT_PUBLIC_SENTRY_DSN=https://4f44009c4ef6950362e6cba83db7c7ab@o4510172424699904.ingest.us.sentry.io/4510242089795584
SENTRY_ORG=happy-patterns-llc
SENTRY_PROJECT=javascript-nextjs
SENTRY_AUTH_TOKEN=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
```

### What Happens on Build

1. Next.js builds application
2. Sentry wizard/CLI uploads source maps
3. Creates release in Sentry
4. Associates deployment with release
5. Production errors link to source code

---

## Next Steps

### 1. Test Deployment

```bash
# Deploy to preview
vercel

# Check the preview URL works
# Then deploy to production
vercel --prod
```

### 2. Set Up Infisical Vercel Integration (Optional)

Auto-sync secrets from Infisical to Vercel for easier management.

### 3. Configure Domain (if not already)

```bash
# Add custom domain
vercel domains add homerenrichment.com

# Set up DNS (follow Vercel instructions)
```

### 4. Monitor with Sentry

After deploying, errors will appear in:
https://sentry.io/organizations/happy-patterns-llc/projects/javascript-nextjs/

---

## Quick Reference

```bash
# Common commands
vercel                    # Preview deployment
vercel --prod             # Production deployment
vercel env ls             # List environment variables
vercel env pull           # Download env vars locally
vercel logs --follow      # Real-time logs
vercel ls                 # List deployments
vercel domains ls         # List domains

# With Infisical (for local dev)
infisical run --env=prod --domain=https://secrets.jefahnierocks.com -- vercel dev
```

---

## Documentation

- **Vercel Docs**: https://vercel.com/docs
- **Vercel CLI**: https://vercel.com/docs/cli
- **Project Dashboard**: https://vercel.com/jeffrey-johnsons-projects-4efd9acb/kbe-website
- **Sentry Integration**: https://vercel.com/integrations/sentry

---

**Status**: ✅ **READY FOR PRODUCTION DEPLOYMENT**

Your Vercel CLI is fully configured with all environment variables. Deploy with `vercel --prod`! 🚀
