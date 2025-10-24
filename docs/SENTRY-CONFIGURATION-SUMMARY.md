# Sentry Configuration Summary

**Date**: 2025-10-23  
**Status**: ✅ Configuration Complete  
**Sentry CLI Version**: 2.57.0

## What Was Configured

### 1. Next.js Source Maps ✅

**File**: `next.config.js`

```javascript
productionBrowserSourceMaps: true
```

This enables Sentry to map minified production errors back to your original source code.

### 2. Security Configuration ✅

**File**: `.gitignore`

Added:
```
# sentry
sentry.properties
```

This prevents accidentally committing sensitive auth tokens to version control.

### 3. Example Configuration Template ✅

**File**: `sentry.properties.example`

Created a template file that developers can copy and customize with their own Sentry credentials.

### 4. Package Scripts ✅

**File**: `package.json`

Added convenience scripts:
```json
{
  "sentry:release": "./scripts/sentry-release.sh",
  "sentry:status": "sentry-cli info"
}
```

Usage:
- `bun run sentry:release` - Create and upload a Sentry release
- `bun run sentry:status` - Check Sentry CLI configuration

### 5. Documentation ✅

Created/updated:
- ✅ `docs/SENTRY-QUICKSTART.md` - 5-minute setup guide (already existed)
- ✅ `docs/SENTRY-CLI-GUIDE.md` - Comprehensive CLI reference (already existed)
- ✅ `docs/SENTRY-SETUP-CHECKLIST.md` - **NEW** - Step-by-step verification checklist
- ✅ `README.md` - Added Sentry documentation links
- ✅ `docs/README.md` - Added Sentry to documentation index

### 6. Release Automation Script ✅

**File**: `scripts/sentry-release.sh` (already existed, verified executable)

This script automates the complete Sentry release workflow:
1. Creates a new release
2. Associates commits
3. Uploads source maps from multiple directories
4. Finalizes the release
5. Creates a deployment record

## What You Need to Do Next

### Required: Environment Setup

The Sentry CLI is installed and configured, but you need to set up your credentials:

#### Step 1: Sentry Account (Already Set Up!)

✅ Your Sentry project credentials are stored securely:
- **gopass**: `sentry/auth-token`
- **Infisical**: `SENTRY_ORG`, `SENTRY_PROJECT`, `SENTRY_AUTH_TOKEN`, `NEXT_PUBLIC_SENTRY_DSN`
- See `docs/INFISICAL_SETUP.md` for details

#### Step 2: Retrieve Auth Token

The auth token is already generated and stored. Retrieve it from:

```bash
# From gopass
gopass show sentry/auth-token

# Or from Infisical
infisical secrets get SENTRY_AUTH_TOKEN
```

#### Step 3: Configure Environment

Create or update `.envrc`:

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

#### Step 4: Verify Setup

```bash
bun run sentry:status
```

Expected output:
```
Sentry Server: https://sentry.io/
Default Organization: <your-org>
Default Project: <your-project>
Authentication Info:
  Auth token: present
```

### Optional: Vercel Integration

To enable automatic Sentry releases on Vercel deployments:

1. Add environment variables in Vercel project settings:
   - `SENTRY_ORG`
   - `SENTRY_PROJECT`
   - `SENTRY_AUTH_TOKEN`
   - `NEXT_PUBLIC_SENTRY_DSN` (optional, for runtime SDK)

2. Update build command in Vercel:
   ```bash
   bun run build && ./scripts/sentry-release.sh
   ```

See `docs/SENTRY-CLI-GUIDE.md` for detailed CI/CD integration instructions.

## Quick Reference

### Common Commands

```bash
# Check configuration
bun run sentry:status

# Create a release (after building)
bun run build
bun run sentry:release production

# List releases
sentry-cli releases list

# Get release info
sentry-cli releases info "release-version"
```

### Documentation Files

| File | Purpose |
|------|---------|
| `docs/SENTRY-QUICKSTART.md` | 5-minute setup guide |
| `docs/SENTRY-CLI-GUIDE.md` | Comprehensive CLI reference with examples |
| `docs/SENTRY-SETUP-CHECKLIST.md` | Step-by-step verification checklist |
| `docs/SENTRY-CONFIGURATION-SUMMARY.md` | This file - configuration overview |
| `scripts/sentry-release.sh` | Automated release workflow script |
| `sentry.properties.example` | Configuration template |

### File Locations

```
kbe-website/
├── next.config.js                          # ✅ Source maps enabled
├── .gitignore                              # ✅ sentry.properties ignored
├── sentry.properties.example               # ✅ NEW - Configuration template
├── package.json                            # ✅ Sentry scripts added
├── scripts/
│   └── sentry-release.sh                   # ✅ Release automation
└── docs/
    ├── SENTRY-QUICKSTART.md                # ✅ Quick start guide
    ├── SENTRY-CLI-GUIDE.md                 # ✅ Comprehensive guide
    ├── SENTRY-SETUP-CHECKLIST.md           # ✅ NEW - Verification checklist
    └── SENTRY-CONFIGURATION-SUMMARY.md     # ✅ NEW - This file
```

## Configuration Verification

Run these commands to verify the configuration:

```bash
# 1. Verify Sentry CLI is installed
sentry-cli --version
# Expected: sentry-cli 2.57.0

# 2. Verify Next.js source maps are enabled
grep productionBrowserSourceMaps next.config.js
# Expected: productionBrowserSourceMaps: true,

# 3. Verify sentry.properties is in .gitignore
grep sentry.properties .gitignore
# Expected: sentry.properties

# 4. Verify scripts exist
ls -la scripts/sentry-release.sh
# Expected: -rwxr-xr-x (executable)

# 5. Verify package.json scripts
grep -A 1 "sentry:" package.json
# Expected: "sentry:release" and "sentry:status"

# 6. Test build generates source maps
bun run build
find .next -name "*.map" | head -5
# Expected: List of .map files
```

## Troubleshooting

### "Auth token is required"

This is expected if you haven't set up your credentials yet. Follow the **Environment Setup** steps above.

### "sentry-cli: command not found"

Install the CLI globally:
```bash
npm install -g @sentry/cli
```

### Source maps not uploading

Ensure you've run `bun run build` before creating a release:
```bash
bun run build
bun run sentry:release production
```

### More Help

See the **Troubleshooting** section in `docs/SENTRY-CLI-GUIDE.md` for comprehensive troubleshooting guidance.

## Next Steps

1. ✅ **Configuration Complete** - All files and scripts are in place
2. ⏳ **Environment Setup** - Set up your Sentry account and credentials (see above)
3. ⏳ **Test Release** - Create a test release to verify everything works
4. ⏳ **Vercel Integration** - Configure automatic releases on deployment (optional)

## Summary

✅ **What's Done**:
- Next.js configured for source maps
- Security measures in place (.gitignore)
- Documentation comprehensive and clear
- Scripts ready to use
- Example configuration provided

⏳ **What's Needed**:
- Sentry account creation
- Auth token generation
- Environment variable configuration
- First test release

The Sentry CLI is fully configured and ready to use. Once you complete the environment setup steps, you'll be able to track errors in production with full source map support.

---

**For Questions**: See `docs/SENTRY-CLI-GUIDE.md` or `docs/SENTRY-SETUP-CHECKLIST.md`  
**Quick Start**: `docs/SENTRY-QUICKSTART.md`
