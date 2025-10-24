# Infisical Quick Start

**TL;DR**: Use Infisical for all secrets instead of `.env.local`

---

## 5-Minute Setup

### 1. Install Infisical CLI

```bash
brew install infisical/get-cli/infisical
```

### 2. Store Service Token

```bash
# Option A: In gopass (recommended)
gopass insert infisical/tokens/homer-enrichment
# Paste the token retrieved from your secrets manager

# Option B: Export from gopass
export INFISICAL_TOKEN="$(gopass show infisical/service-token)"
```

### 3. Initialize Project

```bash
cd /Users/verlyn13/Development/personal/kbe-website

infisical init \
  --domain=https://secrets.jefahnierocks.com \
  --project-id=homer-enrichment-ms-js
```

### 4. Run Development Server

```bash
# With Infisical (recommended)
infisical run --env=prod -- bun run dev

# Or export to .env.local
infisical export --env=prod --format=dotenv > .env.local
bun run dev
```

---

## Daily Usage

```bash
# Start dev server
infisical run --env=prod -- bun run dev

# Run database migrations
infisical run --env=prod -- bunx prisma migrate dev

# Open Prisma Studio
infisical run --env=prod -- bunx prisma studio

# Run tests
infisical run --env=prod -- bun run test

# Build for production
infisical run --env=prod -- bun run build
```

---

## Shell Alias (Optional)

Add to `~/.zshrc` or `~/.bashrc`:

```bash
alias infrun="infisical run --env=prod --"

# Then use:
infrun bun run dev
infrun bunx prisma migrate dev
```

---

## Managing Secrets

### View all secrets
```bash
infisical secrets list --env=prod
```

### Get a specific secret
```bash
infisical secrets get DATABASE_URL --env=prod
```

### Update a secret
```bash
infisical secrets set SENDGRID_API_KEY "new-value" --env=prod
```

### Web UI
Open: https://secrets.jefahnierocks.com

---

## Vercel Integration

### Option 1: Infisical Integration (Recommended)

1. Go to: https://secrets.jefahnierocks.com/integrations
2. Click "Vercel"
3. Authorize and select project: `kbe-website`
4. Map: `prod` → `production`
5. Secrets auto-sync on every change ✨

### Option 2: Manual Environment Variables

Add to Vercel dashboard:
- All secrets from Infisical
- Plus `INFISICAL_TOKEN` for build-time access

---

## Troubleshooting

### "Token invalid"
```bash
# Re-export token
export INFISICAL_TOKEN=$(gopass show -o infisical/tokens/homer-enrichment)

# Or login interactively
infisical login --domain=https://secrets.jefahnierocks.com
```

### "Project not found"
```bash
# Verify .infisical.json exists and has correct project ID
cat .infisical.json

# Re-initialize if needed
infisical init --domain=https://secrets.jefahnierocks.com
```

---

## Key Information

- **Instance**: https://secrets.jefahnierocks.com
- **Project**: homer-enrichment (slug: homer-enrichment-ms-js)
- **Environment**: prod
- **Service Token**: Stored in gopass at `infisical/tokens/homer-enrichment`

**Full Documentation**: See `docs/INFISICAL_SETUP.md`

---

## Why Infisical?

✅ **Single source of truth** - All secrets in one place
✅ **Audit logging** - Know who accessed what, when
✅ **Easy rotation** - Update once, applies everywhere
✅ **Team collaboration** - Share access securely
✅ **Vercel integration** - Auto-sync to production
✅ **Never commit secrets** - No `.env.local` in git

---

**Ready?** Run: `infisical run --env=prod -- bun run dev` 🚀
