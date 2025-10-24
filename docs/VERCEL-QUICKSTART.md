# Vercel CLI Quick Start

Get Vercel deployment set up in 5 minutes.

## 1. Install Vercel CLI

```bash
# Check if installed
vercel --version

# If not installed
npm install -g vercel
```

## 2. Authenticate

```bash
# Interactive login (opens browser)
vercel login
```

## 3. Link Project

```bash
# Link to existing Vercel project
vercel link

# Follow prompts:
# - Select your team/scope
# - Link to existing project: Yes
# - Project name: kbe-website
```

## 4. Pull Environment Variables

```bash
# Pull all environment variables to .env.local
vercel env pull

# Check what was pulled
cat .env.local
```

## 5. Test Locally

```bash
# Option 1: Use Next.js dev (faster)
bun run dev

# Option 2: Use Vercel dev (matches production)
vercel dev
```

## 6. Deploy

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod

# Or use aliases
vercel-preview    # Preview
vercel-deploy     # Production
vercel-prod       # Production + Sentry
```

## Common Commands

```bash
# Check status
vercel whoami
vercel_status

# List deployments
vercel list

# View logs
vercel logs

# Manage env vars
vercel env ls
vercel env add MY_VAR
vercel env pull

# Inspect deployment
vercel inspect <url>
```

## Environment Variables Needed

Required for this project:

```bash
# Supabase (required)
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
DATABASE_URL
DIRECT_URL

# Application (required)
NEXT_PUBLIC_APP_URL
NEXTAUTH_SECRET
JWT_SECRET

# SendGrid (optional)
SENDGRID_API_KEY
SENDGRID_TEMPLATE_*

# Sentry (optional)
NEXT_PUBLIC_SENTRY_DSN
```

Add via:
```bash
vercel env add VARIABLE_NAME production
```

## Troubleshooting

**Not authenticated**:
```bash
vercel logout
vercel login
```

**Build errors**:
```bash
# Check logs
vercel logs <deployment-url>

# Test build locally
bun run build
```

**Missing env vars**:
```bash
# List variables
vercel env ls production

# Pull locally
vercel env pull
```

**Function timeout**:
Edit `vercel.json`:
```json
{
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  }
}
```

## Next Steps

- Read full guide: `docs/VERCEL-CLI-GUIDE.md`
- Set up CI/CD automation
- Configure custom domains
- Set up Sentry integration

## Resources

- Full Guide: `docs/VERCEL-CLI-GUIDE.md`
- Vercel Docs: https://vercel.com/docs
- System Setup: `~/Development/personal/system-setup-update/docs/vercel-cli-setup.md`
