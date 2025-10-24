---
title: Sentry CLI Integration Guide
category: monitoring
status: active
version: 1.0.0
last_updated: 2025-10-23
tags: [sentry, monitoring, error-tracking, source-maps, releases]
---

# Sentry CLI Integration Guide

This guide covers how to use Sentry CLI with the Homer Enrichment Hub (kbe-website) project for error tracking, release management, and source map uploads.

## Table of Contents

- [Overview](#overview)
- [Installation](#installation)
- [Configuration](#configuration)
- [Common Workflows](#common-workflows)
- [CI/CD Integration](#cicd-integration)
- [Troubleshooting](#troubleshooting)

## Overview

### What is Sentry?

Sentry is an error tracking and performance monitoring platform that helps identify and debug issues in production. The Sentry CLI enables:

- **Release Management**: Track which code version is deployed
- **Source Map Uploads**: Debug minified production code
- **Deploy Tracking**: Associate errors with specific deployments
- **Commit Tracking**: Link errors to specific code changes

### Project Context

- **Framework**: Next.js 15 with React 19
- **Build Tool**: Next.js with Turbopack (dev) / Webpack (prod)
- **Deployment**: Vercel
- **Package Manager**: Bun 1.2.21+
- **Database**: Supabase (PostgreSQL via Prisma)

## Installation

### Prerequisites

Ensure you have the Sentry CLI installed:

```bash
# Check if installed
sentry-cli --version

# Install via npm (if not already installed)
npm install -g @sentry/cli

# Or via the system setup
chezmoi apply  # If using the system-setup-update repo
```

### Project Setup

1. **Create a Sentry Account**
   - Sign up at https://sentry.io
   - Create a new project (select Next.js)
   - Note your organization and project slugs

2. **Generate an Auth Token**
   - Go to: Settings → Account → API → Auth Tokens
   - Click "Create New Token"
   - Scopes needed:
     - `project:read`
     - `project:releases`
     - `org:read`
   - Copy the generated token

3. **Store Token Securely**
   ```bash
   # Store in gopass (recommended)
   gopass insert sentry/auth-token
   # Paste your token when prompted

   # Verify it's stored
   gopass show sentry/auth-token
   ```

## Configuration

### Environment Variables

Add these to your `.envrc` file:

```bash
# Sentry Configuration
export SENTRY_ORG="your-org-slug"
export SENTRY_PROJECT="kbe-website"
export SENTRY_AUTH_TOKEN="$(gopass show sentry/auth-token)"

# Optional: Use self-hosted Sentry
# export SENTRY_URL="https://sentry.yourdomain.com"

# Next.js Sentry Integration (if using @sentry/nextjs)
export NEXT_PUBLIC_SENTRY_DSN="https://your-dsn@sentry.io/project-id"
export SENTRY_RELEASE="$(git describe --tags --always)"
```

Then reload:
```bash
direnv allow
```

### Project Configuration File

Create `sentry.properties` in the project root:

```properties
defaults.url=https://sentry.io/
defaults.org=your-org-slug
defaults.project=kbe-website

# Auth token (will be overridden by env var)
# auth.token=your-token-here
```

**Note**: Do NOT commit `sentry.properties` with your auth token. Add to `.gitignore`:

```bash
echo "sentry.properties" >> .gitignore
```

### Verify Configuration

```bash
# Check configuration
sentry-cli info

# Or use the helper function
sentry_status
```

Expected output:
```
Sentry Server: https://sentry.io/
Default Organization: your-org-slug
Default Project: kbe-website
Authentication Info:
  Auth token: present
```

## Common Workflows

### 1. Create a Release

Releases help track which version of your code is deployed and associate errors with specific commits.

```bash
# Create a new release (use git commit SHA or semantic version)
export RELEASE_VERSION="$(git rev-parse --short HEAD)"
sentry-cli releases new "$RELEASE_VERSION"

# Or use semantic versioning
sentry-cli releases new "v1.2.3"

# Associate commits with the release (automatic commit detection)
sentry-cli releases set-commits "$RELEASE_VERSION" --auto

# Or specify a commit range manually
sentry-cli releases set-commits "$RELEASE_VERSION" --commit "your-repo@<start>..<end>"
```

### 2. Upload Source Maps

Source maps allow Sentry to show you the original source code when errors occur in minified production code.

```bash
# Build your Next.js app (generates source maps in .next/)
bun run build

# Upload source maps to Sentry
sentry-cli sourcemaps upload \
  --release "$RELEASE_VERSION" \
  --org "$SENTRY_ORG" \
  --project "$SENTRY_PROJECT" \
  .next/static/chunks

# For Next.js, you may also need to upload the server chunks
sentry-cli sourcemaps upload \
  --release "$RELEASE_VERSION" \
  --org "$SENTRY_ORG" \
  --project "$SENTRY_PROJECT" \
  .next/server/app
```

**Important Next.js Notes**:
- Source maps are in `.next/static/chunks/` (client-side)
- Server-side maps are in `.next/server/`
- Add `--url-prefix "~/_next"` to match the deployed URL structure

### 3. Finalize a Release

Mark a release as deployed:

```bash
# Finalize the release
sentry-cli releases finalize "$RELEASE_VERSION"
```

### 4. Track Deployments

Associate a release with a specific environment:

```bash
# Create a deploy for production
sentry-cli releases deploys "$RELEASE_VERSION" new -e production

# Create a deploy for staging
sentry-cli releases deploys "$RELEASE_VERSION" new -e staging

# Create a deploy for preview (Vercel previews)
sentry-cli releases deploys "$RELEASE_VERSION" new -e preview
```

### 5. Complete Workflow Script

Create `scripts/sentry-release.sh`:

```bash
#!/usr/bin/env bash
# Complete Sentry release workflow for kbe-website

set -euo pipefail

RELEASE_VERSION="${SENTRY_RELEASE:-$(git rev-parse --short HEAD)}"
ENVIRONMENT="${DEPLOY_ENV:-production}"

echo "📦 Creating Sentry release: $RELEASE_VERSION"

# 1. Create release
sentry-cli releases new "$RELEASE_VERSION"

# 2. Associate commits
sentry-cli releases set-commits "$RELEASE_VERSION" --auto

# 3. Upload source maps (Next.js)
echo "📤 Uploading source maps..."
sentry-cli sourcemaps upload \
  --release "$RELEASE_VERSION" \
  --url-prefix "~/_next" \
  .next/static/chunks

# 4. Finalize release
sentry-cli releases finalize "$RELEASE_VERSION"

# 5. Create deploy
echo "🚀 Creating deploy for environment: $ENVIRONMENT"
sentry-cli releases deploys "$RELEASE_VERSION" new -e "$ENVIRONMENT"

echo "✅ Sentry release complete!"
echo "View at: https://sentry.io/organizations/$SENTRY_ORG/releases/$RELEASE_VERSION/"
```

Make it executable:
```bash
chmod +x scripts/sentry-release.sh
```

## CI/CD Integration

### Vercel Deployment

Add Sentry CLI integration to your Vercel deployment:

#### Option 1: Vercel Build Settings

In your Vercel project settings:

1. Go to **Settings** → **Environment Variables**
2. Add these variables:
   ```
   SENTRY_ORG=your-org-slug
   SENTRY_PROJECT=kbe-website
   SENTRY_AUTH_TOKEN=<your-token>
   NEXT_PUBLIC_SENTRY_DSN=<your-dsn>
   ```

3. In **Settings** → **Build & Development Settings**:
   - Build Command: `bun run build && ./scripts/sentry-release.sh`
   - Or create a custom build script

#### Option 2: Use Vercel Deploy Hooks

Create `.vercel/build.sh`:

```bash
#!/usr/bin/env bash
set -euo pipefail

# Build the app
echo "🔨 Building Next.js app..."
bun run build

# Get Vercel-specific environment info
RELEASE_VERSION="${VERCEL_GIT_COMMIT_SHA:-$(git rev-parse HEAD)}"
DEPLOY_ENV="${VERCEL_ENV:-production}"  # production, preview, or development

# Create Sentry release
if [ -n "${SENTRY_AUTH_TOKEN:-}" ]; then
  echo "📦 Creating Sentry release: $RELEASE_VERSION"

  # Install sentry-cli if not available
  if ! command -v sentry-cli &> /dev/null; then
    npm install -g @sentry/cli
  fi

  # Create and upload
  sentry-cli releases new "$RELEASE_VERSION"
  sentry-cli releases set-commits "$RELEASE_VERSION" --auto || true
  sentry-cli sourcemaps upload \
    --release "$RELEASE_VERSION" \
    --url-prefix "~/_next" \
    .next/static/chunks || true
  sentry-cli releases finalize "$RELEASE_VERSION"
  sentry-cli releases deploys "$RELEASE_VERSION" new -e "$DEPLOY_ENV"

  echo "✅ Sentry release complete"
else
  echo "⚠️  SENTRY_AUTH_TOKEN not set, skipping Sentry release"
fi
```

Make it executable:
```bash
chmod +x .vercel/build.sh
```

Update `package.json`:
```json
{
  "scripts": {
    "build": "prisma generate && next build",
    "vercel-build": "./.vercel/build.sh"
  }
}
```

### GitHub Actions

Create `.github/workflows/sentry-release.yml`:

```yaml
name: Sentry Release

on:
  push:
    branches: [main, production]
  workflow_dispatch:

jobs:
  sentry-release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0  # Full history for commit tracking

      - name: Setup Bun
        uses: oven-sh/setup-bun@v1
        with:
          bun-version: latest

      - name: Install dependencies
        run: bun install

      - name: Build application
        run: bun run build
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          DIRECT_URL: ${{ secrets.DIRECT_URL }}

      - name: Install Sentry CLI
        run: npm install -g @sentry/cli

      - name: Create Sentry Release
        env:
          SENTRY_AUTH_TOKEN: ${{ secrets.SENTRY_AUTH_TOKEN }}
          SENTRY_ORG: ${{ secrets.SENTRY_ORG }}
          SENTRY_PROJECT: kbe-website
        run: |
          RELEASE_VERSION="${{ github.sha }}"

          sentry-cli releases new "$RELEASE_VERSION"
          sentry-cli releases set-commits "$RELEASE_VERSION" --auto
          sentry-cli sourcemaps upload \
            --release "$RELEASE_VERSION" \
            --url-prefix "~/_next" \
            .next/static/chunks
          sentry-cli releases finalize "$RELEASE_VERSION"
          sentry-cli releases deploys "$RELEASE_VERSION" new -e production

      - name: Comment on commit
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.repos.createCommitComment({
              owner: context.repo.owner,
              repo: context.repo.repo,
              commit_sha: context.sha,
              body: `✅ Sentry release created: https://sentry.io/organizations/${{ secrets.SENTRY_ORG }}/releases/${context.sha}/`
            })
```

Add secrets to GitHub:
- `SENTRY_AUTH_TOKEN`
- `SENTRY_ORG`

## Troubleshooting

### Source Maps Not Working

**Problem**: Errors in Sentry show minified code instead of original source.

**Solutions**:

1. **Verify source maps are generated**:
   ```bash
   # Check for .map files after build
   find .next -name "*.map" | head -5
   ```

2. **Ensure correct URL prefix**:
   ```bash
   # For Next.js, use ~/_next prefix
   sentry-cli sourcemaps upload \
     --release "$RELEASE_VERSION" \
     --url-prefix "~/_next" \
     .next/static/chunks
   ```

3. **Validate source maps**:
   ```bash
   sentry-cli sourcemaps explain \
     --release "$RELEASE_VERSION" \
     "/_next/static/chunks/app/page-hash.js"
   ```

4. **Check Next.js config**:
   ```javascript
   // next.config.js
   const nextConfig = {
     productionBrowserSourceMaps: true,  // Enable source maps in production
     // ... rest of config
   };
   ```

### Authentication Errors

**Problem**: `401 Unauthorized` or `Invalid token`

**Solutions**:

1. **Verify token is set**:
   ```bash
   echo $SENTRY_AUTH_TOKEN
   # Or
   sentry_status
   ```

2. **Check token permissions** in Sentry:
   - Go to Settings → Auth Tokens
   - Ensure token has `project:releases` and `project:write` scopes

3. **Regenerate token**:
   ```bash
   # Create new token in Sentry UI
   # Store in gopass
   gopass edit sentry/auth-token

   # Reload environment
   direnv reload
   ```

### Organization/Project Not Found

**Problem**: `Error: Could not find organization` or `Project not found`

**Solutions**:

1. **Verify org and project slugs**:
   ```bash
   # List your organizations
   sentry-cli organizations list

   # List projects in an org
   sentry-cli projects list
   ```

2. **Update environment variables**:
   ```bash
   # Edit .envrc
   export SENTRY_ORG="correct-org-slug"
   export SENTRY_PROJECT="correct-project-slug"

   # Reload
   direnv allow
   ```

### Release Already Exists

**Problem**: `Error: Release ... already exists`

**Solutions**:

1. **Check if release exists**:
   ```bash
   sentry-cli releases list | grep "$RELEASE_VERSION"
   ```

2. **Use existing release** (skip creation):
   ```bash
   # Just upload source maps to existing release
   sentry-cli sourcemaps upload \
     --release "$RELEASE_VERSION" \
     .next/static/chunks
   ```

3. **Delete and recreate** (use with caution):
   ```bash
   sentry-cli releases delete "$RELEASE_VERSION"
   sentry-cli releases new "$RELEASE_VERSION"
   ```

### Slow Upload Times

**Problem**: Source map uploads take a long time

**Solutions**:

1. **Upload specific directories**:
   ```bash
   # Only upload main chunks, not vendor bundles
   sentry-cli sourcemaps upload \
     --release "$RELEASE_VERSION" \
     .next/static/chunks/app
   ```

2. **Use multiple workers**:
   ```bash
   sentry-cli sourcemaps upload \
     --release "$RELEASE_VERSION" \
     --workers 8 \
     .next/static/chunks
   ```

3. **Exclude large files**:
   ```bash
   # Skip files larger than 2MB
   sentry-cli sourcemaps upload \
     --release "$RELEASE_VERSION" \
     --ignore "*.map" \
     --ignore-file .sentryignore \
     .next/static/chunks
   ```

## Best Practices

### 1. Release Naming

Use consistent release names:

```bash
# Git SHA (recommended for Vercel)
export SENTRY_RELEASE="$(git rev-parse HEAD)"

# Semantic version (for tagged releases)
export SENTRY_RELEASE="v1.2.3"

# Branch + SHA (for previews)
export SENTRY_RELEASE="$(git branch --show-current)-$(git rev-parse --short HEAD)"
```

### 2. Environment Tracking

Use environment names consistently:

- `production` - Main production deployment
- `staging` - Staging environment
- `preview` - Vercel preview deployments
- `development` - Local development (don't track)

### 3. Commit Association

Always associate commits with releases:

```bash
# Automatic detection (recommended)
sentry-cli releases set-commits "$RELEASE_VERSION" --auto

# Manual specification
sentry-cli releases set-commits "$RELEASE_VERSION" \
  --commit "github:username/kbe-website@<previous-sha>..<current-sha>"
```

### 4. Clean Up Old Releases

Archive old releases to keep your project organized:

```bash
# List old releases
sentry-cli releases list | tail -n 20

# Delete a specific release
sentry-cli releases delete "old-release-id"
```

### 5. Testing Locally

Test your Sentry integration locally before CI/CD:

```bash
# Build locally
bun run build

# Set test environment
export SENTRY_RELEASE="test-$(git rev-parse --short HEAD)"
export DEPLOY_ENV="preview"

# Run release script
./scripts/sentry-release.sh

# Check in Sentry UI
open "https://sentry.io/organizations/$SENTRY_ORG/releases/$SENTRY_RELEASE/"
```

## Additional Resources

- **Sentry CLI Documentation**: https://docs.sentry.io/cli/
- **Next.js Integration**: https://docs.sentry.io/platforms/javascript/guides/nextjs/
- **Source Maps Guide**: https://docs.sentry.io/platforms/javascript/sourcemaps/
- **Vercel Integration**: https://vercel.com/integrations/sentry
- **System Sentry CLI Setup**: `~/Development/personal/system-setup-update/docs/sentry-cli-setup.md`

## Quick Reference Commands

```bash
# Check installation
sentry-cli --version
sentry_status

# Create release
sentry-cli releases new "v1.0.0"

# Upload source maps
sentry-cli sourcemaps upload --release "v1.0.0" .next/static/chunks

# Create deploy
sentry-cli releases deploys "v1.0.0" new -e production

# List releases
sentry-cli releases list

# Get release info
sentry-cli releases info "v1.0.0"

# Check configuration
sentry-cli info

# Update CLI
npm update -g @sentry/cli
# Or
sentry_check_updates
```

## Support

If you encounter issues:

1. Check the [Troubleshooting](#troubleshooting) section
2. Run `sentry_status` to verify configuration
3. Enable verbose logging: `export SENTRY_LOG_LEVEL=debug`
4. Check Sentry documentation: https://docs.sentry.io/
5. Review project-specific context in `tools/CLAUDE.md`

---

**Last Updated**: 2025-10-23
**Maintained By**: Project Team
**Version**: 1.0.0
