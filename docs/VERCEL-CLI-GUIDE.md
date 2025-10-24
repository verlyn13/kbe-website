---
title: Vercel CLI Integration Guide
category: deployment
status: active
version: 1.0.0
last_updated: 2025-10-23
tags: [vercel, deployment, cli, hosting, ci-cd]
---

# Vercel CLI Integration Guide

This guide covers how to use Vercel CLI with the Homer Enrichment Hub (kbe-website) project for deployment, environment management, and local development.

## Table of Contents

- [Overview](#overview)
- [Installation](#installation)
- [Configuration](#configuration)
- [Common Workflows](#common-workflows)
- [CI/CD Integration](#cicd-integration)
- [Troubleshooting](#troubleshooting)

## Overview

### What is Vercel?

Vercel is a cloud platform for static sites and Serverless Functions that provides:

- **Instant Deployments**: Git-based automatic deployments
- **Preview Deployments**: Every PR gets its own URL
- **Edge Network**: Global CDN for fast delivery
- **Serverless Functions**: API routes in Next.js
- **Environment Management**: Secure variable storage

### Project Context

- **Framework**: Next.js 15 with React 19
- **Build Tool**: Bun 1.2.21+
- **Database**: Supabase (PostgreSQL via Prisma)
- **Package Manager**: Bun
- **Current Vercel Config**: `vercel.json` (exists)

## Installation

### Prerequisites

Ensure you have the Vercel CLI installed:

```bash
# Check if installed
vercel --version

# Install via npm (if not already installed)
npm install -g vercel

# Or via the system setup
chezmoi apply  # If using the system-setup-update repo
```

### Project Setup

1. **Authenticate with Vercel**
   ```bash
   vercel login
   ```
   This opens your browser to authenticate.

2. **Link the Project** (if not already linked)
   ```bash
   vercel link
   ```
   This connects your local directory to the Vercel project.

3. **Store Token Securely** (for CI/CD)
   ```bash
   # Get your token from: https://vercel.com/account/tokens
   # Store in gopass
   gopass insert vercel/token

   # Verify it's stored
   gopass show vercel/token
   ```

## Configuration

### Existing Configuration

The project already has `vercel.json`:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "nextjs",
  "installCommand": "bun install",
  "buildCommand": "bun run build",
  "functions": {
    "app/api/webhooks/**/*.ts": {
      "maxDuration": 30
    }
  }
}
```

This configuration:
- Uses Next.js framework detection
- Uses Bun for installation and building
- Sets webhook timeout to 30 seconds

### Environment Variables

Add these to your `.envrc` file:

```bash
# Vercel Configuration
export VERCEL_ORG_ID="team_xxxxx"  # Get from: vercel project ls
export VERCEL_PROJECT_ID="prj_xxxxx"  # Get from: vercel project ls
export VERCEL_TOKEN="$(gopass show vercel/token)"

# Optional: For Sentry integration
export VERCEL_ENV="development"  # or production, preview
export VERCEL_GIT_COMMIT_SHA="$(git rev-parse HEAD)"
```

Then reload:
```bash
direnv allow
```

### Pull Environment Variables

Download environment variables from Vercel:

```bash
# Pull all environment variables
vercel env pull .env.vercel

# Pull for specific environment
vercel env pull .env.development.local --environment development
vercel env pull .env.production.local --environment production
```

### Verify Configuration

```bash
# Check configuration
vercel_status

# Or manually
vercel whoami
vercel list
```

## Common Workflows

### 1. Deploy to Preview

Preview deployments are created for every branch push (except main):

```bash
# Deploy to preview
vercel

# Or use the alias
vercel-preview

# With custom alias
vercel --alias my-feature.vercel.app
```

Expected output:
```
🔗  Linked to your-team/kbe-website
🔍  Inspect: https://vercel.com/...
✅  Preview: https://kbe-website-git-feature-team.vercel.app
```

### 2. Deploy to Production

Production deployments go to your custom domain:

```bash
# Deploy to production
vercel --prod

# Or use the alias
vercel-deploy

# With Sentry integration
vercel-prod
```

This deploys to:
- Production URL: `https://kbe.homerenrichment.com`
- Vercel URL: `https://kbe-website.vercel.app`

### 3. Local Development with Vercel

Use Vercel dev for serverless functions:

```bash
# Start Vercel dev server
vercel dev

# Or use the alias
vercel-dev

# Specify port
vercel dev --listen 9002
```

Benefits of `vercel dev`:
- Matches production environment
- Tests API routes locally
- Uses production environment variables
- Simulates serverless functions

### 4. Manage Environment Variables

#### List Variables

```bash
# List all environment variables
vercel env ls

# Filter by environment
vercel env ls production
vercel env ls preview
vercel env ls development
```

#### Add Variables

```bash
# Add interactively
vercel env add MY_VAR

# You'll be prompted for:
# - Value
# - Environment (production, preview, development)
# - Encrypted or not
```

#### Remove Variables

```bash
vercel env rm MY_VAR
```

#### Pull Variables Locally

```bash
# Pull to .env.local
vercel env pull

# Pull to custom file
vercel env pull .env.development.local --environment development
```

### 5. View Deployment Logs

```bash
# View latest deployment logs
vercel logs

# View specific deployment
vercel logs https://kbe-website-abc123.vercel.app

# Follow logs in real-time
vercel logs --follow

# Or use alias
vercel-logs
```

### 6. Inspect Deployments

```bash
# List recent deployments
vercel list

# Or use alias
vercel-list

# Inspect specific deployment
vercel inspect https://kbe-website-abc123.vercel.app

# Or use alias
vercel-inspect <url>
```

### 7. Complete Deployment Script

The project includes Sentry integration. Use these commands:

```bash
# Production deployment with Sentry
vercel-prod

# This runs:
# 1. vercel --prod
# 2. ./scripts/sentry-release.sh production

# Preview deployment with Sentry
vercel-staging

# This runs:
# 1. vercel
# 2. ./scripts/sentry-release.sh staging
```

## CI/CD Integration

### Current Setup

The project uses Vercel's Git integration:

1. **Push to any branch** → Preview deployment
2. **Push to main** → Production deployment
3. **Pull requests** → Preview URL in comments

### GitHub Actions (Optional)

For more control, use GitHub Actions:

Create `.github/workflows/vercel-production.yml`:

```yaml
name: Vercel Production Deployment

on:
  push:
    branches: [main]

env:
  VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
  VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Bun
        uses: oven-sh/setup-bun@v1
        with:
          bun-version: latest

      - name: Install Vercel CLI
        run: npm install -g vercel

      - name: Pull Vercel Environment
        run: vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}

      - name: Build Project
        run: vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}

      - name: Deploy to Vercel
        id: deploy
        run: |
          url=$(vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }})
          echo "url=$url" >> $GITHUB_OUTPUT

      - name: Create Sentry Release
        env:
          SENTRY_AUTH_TOKEN: ${{ secrets.SENTRY_AUTH_TOKEN }}
          SENTRY_ORG: ${{ secrets.SENTRY_ORG }}
          SENTRY_PROJECT: kbe-website
          SENTRY_RELEASE: ${{ github.sha }}
        run: |
          npm install -g @sentry/cli
          sentry-cli releases new "$SENTRY_RELEASE"
          sentry-cli releases set-commits "$SENTRY_RELEASE" --auto
          sentry-cli sourcemaps upload \
            --release "$SENTRY_RELEASE" \
            --url-prefix "~/_next" \
            .vercel/output/static/_next
          sentry-cli releases finalize "$SENTRY_RELEASE"
          sentry-cli releases deploys "$SENTRY_RELEASE" new -e production

      - name: Comment on commit
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.repos.createCommitComment({
              owner: context.repo.owner,
              repo: context.repo.repo,
              commit_sha: context.sha,
              body: `✅ Deployed to production: ${{ steps.deploy.outputs.url }}\n\n📊 Sentry: https://sentry.io/organizations/${{ secrets.SENTRY_ORG }}/releases/${context.sha}/`
            })
```

Create `.github/workflows/vercel-preview.yml`:

```yaml
name: Vercel Preview Deployment

on:
  pull_request:
    branches: [main]

env:
  VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
  VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Bun
        uses: oven-sh/setup-bun@v1
        with:
          bun-version: latest

      - name: Install Vercel CLI
        run: npm install -g vercel

      - name: Pull Vercel Environment
        run: vercel pull --yes --environment=preview --token=${{ secrets.VERCEL_TOKEN }}

      - name: Build Project
        run: vercel build --token=${{ secrets.VERCEL_TOKEN }}

      - name: Deploy to Vercel
        id: deploy
        run: |
          url=$(vercel deploy --prebuilt --token=${{ secrets.VERCEL_TOKEN }})
          echo "url=$url" >> $GITHUB_OUTPUT

      - name: Comment on PR
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.createComment({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: context.issue.number,
              body: `✅ Preview deployment ready!\n\n🔗 ${{ steps.deploy.outputs.url }}`
            })
```

Add secrets to GitHub:
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`
- `SENTRY_AUTH_TOKEN` (if using Sentry)
- `SENTRY_ORG` (if using Sentry)

## Project-Specific Features

### Database Migrations

Since this project uses Prisma, ensure migrations run before deployment:

In `package.json`:
```json
{
  "scripts": {
    "build": "prisma generate && next build",
    "postinstall": "prisma generate"
  }
}
```

Vercel automatically runs:
1. `bun install` (from `vercel.json`)
2. `postinstall` script (generates Prisma client)
3. `bun run build` (builds Next.js)

### Webhook Configuration

The current `vercel.json` sets webhook timeout to 30 seconds:

```json
{
  "functions": {
    "app/api/webhooks/**/*.ts": {
      "maxDuration": 30
    }
  }
}
```

If you need longer timeouts (up to 60s on Pro plan):

```json
{
  "functions": {
    "app/api/webhooks/**/*.ts": {
      "maxDuration": 60
    }
  }
}
```

### Custom Domains

Your custom domain `kbe.homerenrichment.com` is already configured.

To add more domains:

```bash
# Add domain via CLI
vercel domains add kbe.homerenrichment.com

# Or via dashboard: Settings → Domains
```

### Environment Variables Setup

Required environment variables for this project:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
DATABASE_URL
DIRECT_URL

# Application
NEXT_PUBLIC_APP_URL
NEXTAUTH_SECRET
JWT_SECRET

# SendGrid (optional for email)
SENDGRID_API_KEY
SENDGRID_TEMPLATE_MAGIC_LINK
SENDGRID_TEMPLATE_WELCOME

# Sentry (optional for error tracking)
NEXT_PUBLIC_SENTRY_DSN
SENTRY_AUTH_TOKEN  # Build-time only
```

Add via Vercel CLI:

```bash
# Add interactively
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production

# Or pull from local .env.local and push to Vercel
# (Use Vercel dashboard for this)
```

## Troubleshooting

### Build Failures

**Problem**: Build fails with Prisma errors

**Solutions**:

1. **Check Prisma generation**:
   ```json
   {
     "scripts": {
       "postinstall": "prisma generate"
     }
   }
   ```

2. **Verify DATABASE_URL is set**:
   ```bash
   vercel env ls | grep DATABASE_URL
   ```

3. **Check build logs**:
   ```bash
   vercel logs <deployment-url>
   ```

### Environment Variable Issues

**Problem**: Variables not available at runtime

**Solutions**:

1. **Check variable exposure**:
   - `NEXT_PUBLIC_*` → Available in browser
   - Other variables → Server-side only

2. **Verify environment assignment**:
   ```bash
   vercel env ls production
   ```

3. **Redeploy after adding variables**:
   ```bash
   vercel --prod
   ```

### Authentication Errors

**Problem**: `Error: Not authenticated`

**Solutions**:

1. **Login again**:
   ```bash
   vercel logout
   vercel login
   ```

2. **Check token** (for CI/CD):
   ```bash
   echo $VERCEL_TOKEN
   ```

3. **Verify project link**:
   ```bash
   cat .vercel/project.json
   ```

### Preview Deployment Issues

**Problem**: Preview deployments not working

**Solutions**:

1. **Check Git integration** in Vercel dashboard
2. **Ensure branch is pushed to remote**:
   ```bash
   git push origin feature-branch
   ```

3. **Manually deploy preview**:
   ```bash
   vercel
   ```

### Function Timeout

**Problem**: API routes timing out

**Solutions**:

1. **Increase timeout in `vercel.json`**:
   ```json
   {
     "functions": {
       "app/api/**/*.ts": {
         "maxDuration": 30
       }
     }
   }
   ```

2. **Check function logs**:
   ```bash
   vercel logs <deployment-url> | grep "Task timed out"
   ```

3. **Optimize slow queries**:
   - Add database indexes
   - Use connection pooling (already configured via Supabase)

## Best Practices

### 1. Use Environment-Specific Variables

```bash
# Development
vercel env add MY_VAR development

# Preview (for PR deployments)
vercel env add MY_VAR preview

# Production
vercel env add MY_VAR production
```

### 2. Test Before Production

```bash
# Always test preview first
vercel

# Check the preview URL
# Then promote to production
vercel --prod
```

### 3. Use Prebuilt Deployments

For faster deployments:

```bash
# Build locally
vercel build --prod

# Deploy the build
vercel deploy --prebuilt --prod
```

### 4. Monitor Deployments

```bash
# Check deployment status
vercel list

# View logs for errors
vercel logs --follow

# Inspect specific deployment
vercel inspect <url>
```

### 5. Manage Secrets Properly

```bash
# Never commit secrets to git
# Use Vercel environment variables
vercel env add DATABASE_URL production

# Pull locally for development
vercel env pull .env.local
```

### 6. Use Aliases for Testing

```bash
# Deploy with custom alias
vercel --alias my-test.vercel.app

# Test thoroughly
# Then deploy to production
vercel --prod
```

## Integration with Other Tools

### With Sentry CLI

See `docs/SENTRY-CLI-GUIDE.md` for full integration.

Quick usage:

```bash
# Production deployment with Sentry
vercel-prod

# Preview deployment with Sentry
vercel-staging
```

### With Prisma

Prisma is automatically handled via `postinstall` script:

```json
{
  "scripts": {
    "postinstall": "prisma generate",
    "build": "prisma generate && next build"
  }
}
```

### With Next.js

Vercel automatically detects Next.js configuration from `next.config.js`:

```javascript
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Vercel reads all Next.js config automatically
};
```

## Additional Resources

- **Official Documentation**: https://vercel.com/docs
- **CLI Reference**: https://vercel.com/docs/cli
- **Next.js on Vercel**: https://vercel.com/docs/frameworks/nextjs
- **Environment Variables**: https://vercel.com/docs/projects/environment-variables
- **Deployment**: https://vercel.com/docs/deployments/overview
- **System Vercel Setup**: `~/Development/personal/system-setup-update/docs/vercel-cli-setup.md`

## Quick Reference Commands

```bash
# Check installation
vercel --version
vercel_status

# Authentication
vercel login
vercel whoami

# Project setup
vercel link
vercel env pull

# Deployment
vercel              # Preview
vercel --prod       # Production
vercel-prod         # Production + Sentry
vercel-staging      # Preview + Sentry

# Management
vercel list         # List deployments
vercel logs         # View logs
vercel env ls       # List env vars

# Development
vercel dev          # Local dev with serverless
vercel build        # Build locally

# Updates
npm update -g vercel
vercel_check_updates
```

## Support

If you encounter issues:

1. Check the [Troubleshooting](#troubleshooting) section
2. Run `vercel_status` to verify configuration
3. Check Vercel dashboard logs
4. Review project-specific context in `tools/CLAUDE.md`
5. See system-wide setup: `~/Development/personal/system-setup-update/docs/vercel-cli-setup.md`

---

**Last Updated**: 2025-10-23
**Maintained By**: Project Team
**Version**: 1.0.0
