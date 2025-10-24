# Quick Start Guide

Get the Homer Enrichment Hub running locally in 5 minutes.

## Prerequisites

- **Bun** 1.2.21+ ([install](https://bun.sh))
- **Node.js** 22+ (for compatibility)
- **Supabase account** ([sign up](https://supabase.com))
- **Vercel account** (optional, for deployment)

## Step 1: Install Dependencies

```bash
bun install
```

This will:
- Install all npm dependencies
- Auto-generate Prisma client
- Set up the project for development

## Step 2: Configure Environment Variables

### Get Supabase Credentials

1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **API**
3. Copy these values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **Anon/Public Key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

4. Navigate to **Settings** → **Database**
5. Copy these connection strings:
   - **Connection pooling** → `DATABASE_URL` (use Transaction mode, port 6543)
   - **Direct connection** → `DIRECT_URL` (port 5432)

### Create .env.local

```bash
# Copy the example file
cp .env.example .env.local

# Edit with your values
# Use your preferred editor (vim, nano, code, etc.)
code .env.local
```

**Required variables** (minimum for local dev):
```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
DATABASE_URL=postgresql://postgres:[password]@[host]:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres:[password]@[host]:5432/postgres
NEXT_PUBLIC_APP_URL=http://localhost:9002
```

**Optional** (for email features):
```bash
SENDGRID_API_KEY=SG.your-api-key
# ... SendGrid template IDs (see .env.example)
```

## Step 3: Set Up Database

```bash
# Run Prisma migrations
bunx prisma migrate deploy

# Or use the helper command
# /db-migrate (if using Claude Code)

# Optional: Open Prisma Studio to inspect database
bunx prisma studio
```

This will:
- Create all database tables
- Set up relationships and indexes
- Generate TypeScript types

## Step 4: Start Development Server

```bash
bun run dev

# Or use the Claude Code command:
# /dev
```

The app will be available at:
**http://localhost:9002**

## Common Issues

### "Supabase client error"
- Check that `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set correctly
- Verify the URL starts with `https://` and ends with `.supabase.co`
- Make sure there are no extra spaces in `.env.local`

### "Prisma Client not generated"
```bash
bunx prisma generate
```

### "Database connection failed"
- Verify `DATABASE_URL` is the **pooled connection** (port 6543, pgbouncer=true)
- Check that password doesn't contain special characters (or URL-encode them)
- Ensure database is accessible from your IP (Supabase → Settings → Database → Connection pooling)

### Port 9002 already in use
```bash
# Find and kill the process
lsof -ti:9002 | xargs kill -9

# Or use a different port
bun run dev -- -p 3000
```

## Development Workflow

### Make Database Changes

1. Edit `prisma/schema.prisma`
2. Create migration:
   ```bash
   bunx prisma migrate dev --name describe_your_change
   ```
3. Prisma Client will auto-regenerate

### Run Tests

```bash
# All tests
bun run test

# Watch mode
bun run test:watch

# With coverage
bun run test:coverage

# Type checking
bun run typecheck

# Linting
bun run lint
```

### Build for Production

```bash
# Test production build locally
bun run build
bun run start

# Or use the deploy checker
# /deploy-check (Claude Code command)
```

## Claude Code Commands

If using Claude Code, you have these helpful commands:

```bash
/dev          # Start dev with checks
/db-migrate   # Safe Prisma migrations
/db-studio    # Open database viewer
/test-all     # Run complete test suite
/deploy-check # Pre-deployment validation
/fix-env      # Debug environment issues
/update-deps  # Update dependencies safely
```

## Next Steps

1. **Explore the app**: Visit http://localhost:9002
2. **Create an account**: Test the registration flow
3. **Check the database**: Use Prisma Studio (`bunx prisma studio`)
4. **Read the docs**:
   - `tools/CLAUDE.md` - Full project documentation
   - `ops/PRODUCTION_READINESS.md` - Deployment checklist
   - `docs/migration/` - Migration documentation

## Deployment

See `ops/PRODUCTION_READINESS.md` for complete deployment guide.

**Quick deploy to Vercel**:
```bash
# Link to Vercel project
vercel link

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

## Getting Help

- **Environment issues**: `/fix-env` (Claude Code)
- **Database problems**: Check Supabase dashboard logs
- **Build errors**: Run `bun run typecheck` and `bun run lint`
- **Need help**: Check `tools/CLAUDE.md` for project context

## Project Structure

```
kbe-website/
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # React components (shadcn/ui)
│   ├── hooks/           # Custom React hooks
│   ├── lib/
│   │   ├── services/    # Prisma data services
│   │   ├── supabase/    # Auth clients
│   │   └── utils/       # Utilities
│   └── types/           # TypeScript types
├── prisma/
│   └── schema.prisma    # Database schema
├── .claude/             # Claude Code configuration
│   ├── commands/        # Slash commands
│   └── settings.local.json
├── .env.local          # Your secrets (create this)
├── .env.example        # Template for .env.local
└── package.json        # Dependencies and scripts
```

Happy coding! 🚀
