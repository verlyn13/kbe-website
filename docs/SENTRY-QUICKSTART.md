# Sentry CLI Quick Start

Get Sentry error tracking set up in 5 minutes.

## 1. Install Sentry CLI

```bash
# Check if installed
sentry-cli --version

# If not installed
npm install -g @sentry/cli
```

## 2. Get Your Sentry Credentials

**Already configured!** Your Sentry project credentials are stored in:
- **gopass**: `sentry/auth-token`
- **Infisical**: `SENTRY_ORG`, `SENTRY_PROJECT`, `SENTRY_AUTH_TOKEN`, `NEXT_PUBLIC_SENTRY_DSN`

## 3. Store Credentials Securely

```bash
# Store token in gopass
gopass insert sentry/auth-token
# Paste your token when prompted
```

## 4. Configure Environment

Add to `.envrc`:

```bash
# Sentry Configuration (retrieve from secrets management)
export SENTRY_ORG="$(infisical secrets get SENTRY_ORG --plain)"
export SENTRY_PROJECT="$(infisical secrets get SENTRY_PROJECT --plain)"
export SENTRY_AUTH_TOKEN="$(gopass show sentry/auth-token)"
export NEXT_PUBLIC_SENTRY_DSN="$(infisical secrets get NEXT_PUBLIC_SENTRY_DSN --plain)"
```

Reload:
```bash
direnv allow
```

## 5. Verify Setup

```bash
# Check configuration
sentry_status

# Or
sentry-cli info
```

## 6. Build and Release

```bash
# Build the app
bun run build

# Create Sentry release and upload source maps
./scripts/sentry-release.sh production
```

## 7. Enable Production Source Maps

Edit `next.config.js`:

```javascript
const nextConfig = {
  productionBrowserSourceMaps: true,  // Add this line
  // ... rest of config
};
```

## Common Commands

```bash
# Create release
sentry-cli releases new "v1.0.0"

# Upload source maps
sentry-cli sourcemaps upload --release "v1.0.0" .next/static/chunks

# Create deploy
sentry-cli releases deploys "v1.0.0" new -e production

# Check status
sentry_status

# Full workflow
./scripts/sentry-release.sh production
```

## Next Steps

- Read full guide: `docs/SENTRY-CLI-GUIDE.md`
- Set up CI/CD integration (Vercel, GitHub Actions)
- Configure error alerts in Sentry dashboard
- Test error tracking with a sample error

## Troubleshooting

**CLI not found**:
```bash
npm install -g @sentry/cli
```

**Auth errors**:
```bash
# Verify token is set
echo $SENTRY_AUTH_TOKEN

# Regenerate token in Sentry UI if needed
gopass edit sentry/auth-token
direnv reload
```

**Source maps not working**:
```bash
# Ensure production source maps enabled
grep productionBrowserSourceMaps next.config.js

# Verify build generates .map files
ls .next/static/chunks/*.map | head -3
```

## Resources

- Full Guide: `docs/SENTRY-CLI-GUIDE.md`
- Sentry Docs: https://docs.sentry.io/cli/
- System Setup: `~/Development/personal/system-setup-update/docs/sentry-cli-setup.md`
