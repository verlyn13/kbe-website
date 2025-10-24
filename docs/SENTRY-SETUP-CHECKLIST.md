# Sentry Setup Checklist

This checklist ensures your Sentry integration is properly configured for the Homer Enrichment Hub project.

## ✅ Configuration Status

### 1. Sentry CLI Installation

- [x] Sentry CLI installed globally (`sentry-cli --version`)
- [x] Version: 2.57.0+

### 2. Next.js Configuration

- [x] `productionBrowserSourceMaps: true` enabled in `next.config.js`
- This allows Sentry to map production errors back to source code

### 3. Security Configuration

- [x] `sentry.properties` added to `.gitignore`
- [x] Example configuration file created: `sentry.properties.example`
- Prevents accidentally committing auth tokens

### 4. Scripts & Automation

- [x] Release script created: `scripts/sentry-release.sh` (executable)
- [x] Package.json scripts added:
  - `bun run sentry:release` - Create and upload Sentry release
  - `bun run sentry:status` - Check Sentry CLI configuration

### 5. Documentation

- [x] Quick start guide: `docs/SENTRY-QUICKSTART.md`
- [x] Comprehensive CLI guide: `docs/SENTRY-CLI-GUIDE.md`
- [x] Main README updated with Sentry links

## 🔧 Required Setup Steps

To complete your Sentry setup, follow these steps:

### Step 1: Sentry Account & Project ✅

**Already complete!** Your Sentry project credentials are stored securely:
- **gopass**: `sentry/auth-token`
- **Infisical**: `SENTRY_ORG`, `SENTRY_PROJECT`, `SENTRY_AUTH_TOKEN`, `NEXT_PUBLIC_SENTRY_DSN`

See `docs/INFISICAL_SETUP.md` for secrets management details.

### Step 2: Retrieve Auth Token ✅

**Already stored!** The auth token is in:
- **gopass**: `gopass show sentry/auth-token`
- **Infisical**: `SENTRY_AUTH_TOKEN`

If you need to retrieve it:
```bash
gopass show sentry/auth-token
# Or
infisical secrets get SENTRY_AUTH_TOKEN
```

### Step 3: Verify Credentials Are Stored ✅

```bash
# Verify token is in gopass
gopass show sentry/auth-token

# Verify in Infisical
infisical secrets get SENTRY_AUTH_TOKEN
```

### Step 4: Configure Environment Variables

Add to your `.envrc` file:

```bash
# Sentry Configuration (retrieve from secrets management)
export SENTRY_ORG="$(infisical secrets get SENTRY_ORG --plain)"
export SENTRY_PROJECT="$(infisical secrets get SENTRY_PROJECT --plain)"
export SENTRY_AUTH_TOKEN="$(gopass show sentry/auth-token)"
export NEXT_PUBLIC_SENTRY_DSN="$(infisical secrets get NEXT_PUBLIC_SENTRY_DSN --plain)"
```

Then reload:

```bash
direnv allow
```

### Step 5: Verify Configuration

```bash
# Check Sentry CLI configuration
bun run sentry:status

# Or directly
sentry-cli info
```

Expected output:
```
Sentry Server: https://sentry.io/
Default Organization: happy-patterns-llc
Default Project: javascript-nextjs
Authentication Info:
  Auth token: present
```

### Step 6: Test the Integration

```bash
# Build the application
bun run build

# Create a test release
bun run sentry:release production

# Check in Sentry dashboard
open "https://sentry.io/organizations/$SENTRY_ORG/releases/"
```

## 📋 Pre-Deployment Checklist

Before deploying to production, ensure:

- [ ] Sentry account created and project configured
- [ ] Auth token generated with correct scopes
- [ ] Environment variables set in `.envrc` (local)
- [ ] Environment variables set in Vercel (production)
  - `SENTRY_ORG`
  - `SENTRY_PROJECT`
  - `SENTRY_AUTH_TOKEN`
  - `NEXT_PUBLIC_SENTRY_DSN` (optional, for runtime SDK)
- [ ] `productionBrowserSourceMaps: true` in `next.config.js`
- [ ] Test release created successfully
- [ ] Source maps uploaded and verified

## 🚀 Usage

### Create a Release (Manual)

```bash
# Build the app first
bun run build

# Create and upload release
bun run sentry:release production
```

### Create a Release (Automated - Vercel)

The release will be created automatically during Vercel builds if:

1. Environment variables are set in Vercel project settings
2. Build command includes the release script

Update Vercel build command to:
```bash
bun run build && ./scripts/sentry-release.sh
```

Or use the `vercel-build` script approach documented in `docs/SENTRY-CLI-GUIDE.md`.

### Check Configuration

```bash
# Quick status check
bun run sentry:status

# List recent releases
sentry-cli releases list

# Get release details
sentry-cli releases info "release-version"
```

## 🔍 Verification Commands

```bash
# 1. Verify CLI is installed
sentry-cli --version

# 2. Verify environment variables are set
echo $SENTRY_ORG
echo $SENTRY_PROJECT
echo $SENTRY_AUTH_TOKEN | head -c 20  # Show first 20 chars only

# 3. Verify Next.js config
grep productionBrowserSourceMaps next.config.js

# 4. Verify build generates source maps
bun run build
find .next -name "*.map" | head -5

# 5. Test release creation
SENTRY_RELEASE="test-$(date +%s)" ./scripts/sentry-release.sh preview
```

## 📚 Documentation Reference

- **Quick Start**: `docs/SENTRY-QUICKSTART.md` - 5-minute setup guide
- **CLI Guide**: `docs/SENTRY-CLI-GUIDE.md` - Comprehensive reference
- **Release Script**: `scripts/sentry-release.sh` - Automated workflow
- **Example Config**: `sentry.properties.example` - Configuration template

## 🆘 Troubleshooting

### Common Issues

**Issue**: `sentry-cli: command not found`
```bash
npm install -g @sentry/cli
```

**Issue**: `401 Unauthorized`
```bash
# Verify token is set
echo $SENTRY_AUTH_TOKEN

# Regenerate token in Sentry UI if needed
gopass edit sentry/auth-token
direnv reload
```

**Issue**: Source maps not working
```bash
# Verify source maps are enabled
grep productionBrowserSourceMaps next.config.js

# Check for .map files after build
find .next -name "*.map" | head -5
```

**Issue**: Release already exists
```bash
# List existing releases
sentry-cli releases list

# Delete old release (use with caution)
sentry-cli releases delete "release-version"
```

For more troubleshooting, see the **Troubleshooting** section in `docs/SENTRY-CLI-GUIDE.md`.

## 🔗 External Resources

- Sentry Documentation: https://docs.sentry.io/
- Sentry CLI Docs: https://docs.sentry.io/cli/
- Next.js Integration: https://docs.sentry.io/platforms/javascript/guides/nextjs/
- Source Maps Guide: https://docs.sentry.io/platforms/javascript/sourcemaps/

---

**Last Updated**: 2025-10-23  
**Status**: Configuration Complete ✅  
**Next Steps**: Complete environment variable setup and test release creation
