# Secrets Management for KBE Website

## Overview

This project uses a dual-layer secrets management approach:
1. **Production**: Google Cloud Secret Manager (source of truth)
2. **Local Development**: gopass (fast, offline mirror)

## Architecture

```
Google Cloud Secret Manager (Production)
    ↓ sync
gopass (Local Mirror)
    ↓ generate
.env.local (Runtime)
```

## Quick Start

### 1. First Time Setup

```bash
# Sync secrets from Google Cloud to gopass
./sync-gopass-secrets.sh

# Generate .env.local from gopass
./generate-env-local-v2.sh

# Start development
npm run dev
```

### 2. Daily Development

```bash
# Just generate .env.local from cached gopass secrets
./generate-env-local-v2.sh
```

### 3. After Secret Updates

```bash
# Re-sync from Google Cloud
./sync-gopass-secrets.sh

# Regenerate .env.local
./generate-env-local-v2.sh
```

## Secret Structure

### In Google Cloud Secret Manager

All secrets are stored flat with descriptive names:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `SENDGRID_API_KEY`
- etc.

### In gopass

Secrets are organized hierarchically under `projects/kbe-website/`:

```
projects/kbe-website/
├── firebase/
│   ├── api-key
│   ├── auth-domain
│   ├── project-id
│   ├── storage-bucket
│   ├── messaging-sender-id
│   └── app-id
├── firebase-admin/
│   ├── project-id
│   ├── client-email
│   └── private-key
├── sendgrid/
│   ├── api-key
│   └── templates/
│       ├── announcement
│       ├── magic-link
│       ├── password-reset
│       ├── registration-confirmation
│       └── welcome
├── app/
│   ├── url
│   └── node-env
└── auth/
    ├── nextauth-secret
    └── jwt-secret
```

## Scripts

### `sync-gopass-secrets.sh`
- Pulls all secrets from Google Cloud Secret Manager
- Stores them in gopass under `projects/kbe-website/`
- Run when secrets are updated in production

### `generate-env-local-v2.sh`
- Generates `.env.local` file for local development
- Prefers gopass (fast, offline) over Google Cloud
- Falls back to Google Cloud if gopass unavailable
- Validates critical variables are present

### `generate-env-local.sh` (legacy)
- Original script that only uses Google Cloud
- Slower, requires internet connection
- Still works but `v2` is preferred

## Manual Secret Access

### View all project secrets
```bash
gopass ls projects/kbe-website
```

### Get a specific secret
```bash
# From gopass (fast)
gopass show projects/kbe-website/firebase/api-key

# From Google Cloud (authoritative)
gcloud secrets versions access latest \
  --secret="NEXT_PUBLIC_FIREBASE_API_KEY" \
  --project=kbe-website
```

### Update a secret
```bash
# 1. Update in Google Cloud (production)
echo -n "new-value" | gcloud secrets versions add \
  SENDGRID_API_KEY --project=kbe-website

# 2. Sync to gopass
./sync-gopass-secrets.sh

# 3. Regenerate .env.local
./generate-env-local-v2.sh
```

## Critical Secrets

The following secrets are **required** for the app to start:

1. **Firebase Configuration** (Public)
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`

2. **SendGrid** (for email functionality)
   - `SENDGRID_API_KEY`
   - `SENDGRID_TEMPLATE_*` (5 template IDs)

3. **Firebase Admin** (for server-side operations)
   - `FIREBASE_ADMIN_PROJECT_ID`
   - `FIREBASE_ADMIN_CLIENT_EMAIL`
   - `FIREBASE_ADMIN_PRIVATE_KEY`

## Security Notes

1. **Never commit `.env.local`** - It's in `.gitignore`
2. **Firebase public keys are safe to expose** - They're meant for client-side use
3. **Private keys must stay secret** - Never log or commit them
4. **Use gopass for local development** - Faster and more secure than repeatedly calling Google Cloud

## Troubleshooting

### Missing secrets in gopass
```bash
# Re-sync from Google Cloud
./sync-gopass-secrets.sh
```

### Can't access Google Cloud secrets
```bash
# Authenticate with gcloud
gcloud auth login

# Set the project
gcloud config set project kbe-website
```

### App won't start (missing Firebase config)
```bash
# Check what's in .env.local
grep FIREBASE .env.local

# If empty, regenerate
./generate-env-local-v2.sh

# If still empty, sync first
./sync-gopass-secrets.sh
./generate-env-local-v2.sh
```

### View current secret sources
```bash
# Check if secrets are in gopass
gopass ls projects/kbe-website | wc -l

# Check if you can access Google Cloud
gcloud secrets list --project=kbe-website --limit=5
```

## Production Deployment

Firebase App Hosting automatically pulls secrets from Google Cloud Secret Manager. No manual intervention needed for production deployments.

The secrets are configured in `apphosting.yaml` and accessed at runtime.

---

**Important**: After the security fix in Stage 1-4, the app now **requires** environment variables and will not fall back to hardcoded values. Always ensure `.env.local` is properly generated before starting development.