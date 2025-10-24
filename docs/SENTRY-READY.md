# Sentry Integration - Ready to Use

**Status**: ✅ **CONFIGURED AND READY**  
**Date**: 2025-10-23  
**Project**: Homer Enrichment Hub (kbe-website)

## Your Sentry Project Details

All credentials are already set up and stored in your secrets management systems.

### Project Information

- **Organization**: Stored in Infisical as `SENTRY_ORG`
- **Project Name**: Stored in Infisical as `SENTRY_PROJECT`
- **Project ID**: Available in Sentry dashboard
- **DSN**: Stored in Infisical as `NEXT_PUBLIC_SENTRY_DSN`
- **Auth Token**: Stored in gopass (`sentry/auth-token`) and Infisical (`SENTRY_AUTH_TOKEN`)

### Credentials Storage

Your Sentry credentials are stored in:

1. **gopass** (local secrets):
   ```bash
   gopass show sentry/auth-token
   ```

2. **Infisical** (team secrets):
   ```bash
   # Retrieve from Infisical
   infisical secrets get SENTRY_ORG
   infisical secrets get SENTRY_PROJECT
   infisical secrets get SENTRY_AUTH_TOKEN
   infisical secrets get NEXT_PUBLIC_SENTRY_DSN
   ```

## What's Already Configured

✅ **Next.js Source Maps**: Enabled in `next.config.js`  
✅ **Security**: `sentry.properties` in `.gitignore`  
✅ **Scripts**: `bun run sentry:release` and `bun run sentry:status`  
✅ **Documentation**: Complete guides in `docs/`  
✅ **Example Configs**: `sentry.properties.example`, `envrc.example`  
✅ **Release Script**: `scripts/sentry-release.sh` (executable)

## Quick Start (3 Steps)

### 1. Set Up Environment Variables

Create `.envrc` (or copy from `envrc.example`):

```bash
# Sentry Configuration (retrieve values from secrets management)
export SENTRY_ORG="$(infisical secrets get SENTRY_ORG --plain)"
export SENTRY_PROJECT="$(infisical secrets get SENTRY_PROJECT --plain)"
export SENTRY_AUTH_TOKEN="$(gopass show sentry/auth-token)"
export NEXT_PUBLIC_SENTRY_DSN="$(infisical secrets get NEXT_PUBLIC_SENTRY_DSN --plain)"
```

Then:
```bash
direnv allow
```

### 2. Verify Configuration

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

### 3. Create Your First Release

```bash
# Build the app
bun run build

# Create and upload release
bun run sentry:release production
```

## Common Commands

```bash
# Check configuration
bun run sentry:status

# Create a release
bun run build
bun run sentry:release production

# List releases
sentry-cli releases list

# View in Sentry dashboard
open "https://sentry.io/organizations/$SENTRY_ORG/projects/$SENTRY_PROJECT/"
```

## Vercel Integration

To enable automatic releases on Vercel deployments:

1. Add environment variables in Vercel project settings (get values from Infisical):
   - `SENTRY_ORG` = (from Infisical)
   - `SENTRY_PROJECT` = (from Infisical)
   - `SENTRY_AUTH_TOKEN` = (from gopass or Infisical)
   - `NEXT_PUBLIC_SENTRY_DSN` = (from Infisical)

2. Update build command in Vercel:
   ```bash
   bun run build && ./scripts/sentry-release.sh
   ```

See `docs/SENTRY-CLI-GUIDE.md` for detailed CI/CD integration.

## Documentation

| Document | Purpose |
|----------|---------|
| **SENTRY-READY.md** | This file - quick reference |
| `SENTRY-CONFIGURATION-SUMMARY.md` | Complete configuration overview |
| `SENTRY-QUICKSTART.md` | 5-minute setup guide |
| `SENTRY-CLI-GUIDE.md` | Comprehensive CLI reference |
| `SENTRY-SETUP-CHECKLIST.md` | Step-by-step verification |
| `INFISICAL_SETUP.md` | All secrets including Sentry (lines 104-108) |

## Links

- **Sentry Dashboard**: https://sentry.io/organizations/$SENTRY_ORG/
- **Project Issues**: https://sentry.io/organizations/$SENTRY_ORG/projects/$SENTRY_PROJECT/
- **Releases**: https://sentry.io/organizations/$SENTRY_ORG/releases/

## Troubleshooting

### "Auth token is required"

Set up your `.envrc` file (see step 1 above), then:
```bash
direnv allow
```

### "Organization not found"

Verify your environment variables:
```bash
echo $SENTRY_ORG        # Should show your organization slug
echo $SENTRY_PROJECT    # Should show your project slug
```

### Source maps not uploading

Ensure you built the app first:
```bash
bun run build
find .next -name "*.map" | head -5  # Should show .map files
```

For more help, see `docs/SENTRY-CLI-GUIDE.md` (Troubleshooting section).

## Summary

🎉 **Everything is ready!** Your Sentry integration is fully configured. All you need to do is:

1. Set up `.envrc` with the environment variables
2. Run `direnv allow`
3. Test with `bun run sentry:status`

All credentials are stored in your secrets management systems (gopass and Infisical).

---

**Project**: Homer Enrichment Hub
**Status**: ✅ Ready to use
