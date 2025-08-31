# Development Setup

**Status**: ✅ Current | **Last Updated**: August 31, 2025

## Quick Start

```bash
# 1. Prerequisites
# - Bun 1.2.21+ (recommended runtime)
# - Node.js 22+ (fallback)
# - PostgreSQL (or Supabase account)

# 2. Clone and install
git clone git@github.com:verlyn13/kbe-website.git
cd kbe-website
bun install

# 3. Environment setup
cp .env.local.example .env.local
# Edit .env.local with your configuration

# 4. Database setup
bun run prisma:push
bun run prisma:seed

# 5. Start development
bun run dev
```

Open [http://localhost:9002](http://localhost:9002) to view the application.

## Modern Stack Overview

### Runtime & Package Management
- **Bun 1.2.21+**: Primary runtime (5x faster than npm)
- **Node.js 22+**: Fallback compatibility
- **Package Manager**: Bun (with npm fallback)

### Core Framework
- **Next.js 15.4.5**: React framework with App Router
- **React 19**: Latest React with concurrent features
- **TypeScript 5.7.3**: Strict type checking enabled

### Database & Backend
- **Supabase**: PostgreSQL with built-in auth and realtime
- **Prisma**: Type-safe ORM and database toolkit
- **Row Level Security**: Database-level access control

### Styling & UI
- **Tailwind CSS 4.0**: Utility-first styling
- **shadcn/ui**: High-quality component library
- **Radix UI**: Accessible primitive components

## Environment Configuration

### Required Environment Variables

```bash
# Database (Supabase)
DATABASE_URL="postgresql://postgres:[password]@[host]:5432/postgres"
DIRECT_URL="postgresql://postgres:[password]@[host]:5432/postgres" 

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Application
NEXT_PUBLIC_APP_URL="http://localhost:9002"

# Email (Optional - for testing)
SENDGRID_API_KEY="your-sendgrid-key"
SENDGRID_FROM_EMAIL="noreply@yourdomain.com"
```

### Getting Supabase Keys

1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Go to Settings → API
4. Copy `URL` and `anon key` for public variables
5. Copy `service_role key` for server-side operations

## Database Setup

### Using Supabase (Recommended)

```bash
# 1. Create Supabase project at https://supabase.com

# 2. Configure environment variables (see above)

# 3. Push schema to database
bun run prisma:push

# 4. Generate Prisma client
bun run prisma:generate

# 5. Seed with initial data
bun run prisma:seed
```

### Local PostgreSQL (Alternative)

```bash
# 1. Install PostgreSQL locally
brew install postgresql  # macOS
sudo apt install postgresql  # Ubuntu

# 2. Create database
createdb kbe_website

# 3. Update DATABASE_URL in .env.local
DATABASE_URL="postgresql://postgres:password@localhost:5432/kbe_website"

# 4. Continue with Prisma setup as above
```

## Development Commands

### Primary Commands (Bun)
```bash
bun run dev          # Start development server (port 9002)
bun run build        # Build for production
bun run start        # Start production server
bun run lint         # Run ESLint
bun run typecheck    # TypeScript type checking
```

### Database Commands
```bash
bun run prisma:generate    # Generate Prisma client
bun run prisma:push        # Push schema to database
bun run prisma:migrate     # Create migration
bun run prisma:seed        # Seed database
bun run prisma:studio      # Open Prisma Studio
```

### Utility Commands
```bash
bun run clean        # Clean build artifacts
bun run type-check   # Check TypeScript errors
bun run format       # Format code with Prettier
```

## Development Workflow

### 1. Feature Development
```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes, test locally
bun run dev

# Type check and lint
bun run typecheck
bun run lint

# Build to verify production
bun run build
```

### 2. Database Changes
```bash
# Update schema.prisma file
nano prisma/schema.prisma

# Push changes to database
bun run prisma:push

# Generate updated client
bun run prisma:generate

# Optional: Create migration for production
bun run prisma:migrate dev --name your-migration-name
```

### 3. Adding Dependencies
```bash
# Production dependency
bun add package-name

# Development dependency
bun add -D package-name

# Update existing dependencies
bun update
```

## Editor Setup

### VS Code (Recommended)
Required extensions:
- **Prisma**: Syntax highlighting and IntelliSense
- **TypeScript Importer**: Auto-import management  
- **Tailwind CSS IntelliSense**: Class name completion
- **ESLint**: Code linting
- **Prettier**: Code formatting

### Settings (`.vscode/settings.json`)
```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "typescript.suggest.autoImports": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ]
}
```

## Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Find process using port 9002
lsof -i :9002
kill -9 <PID>

# Or use different port
PORT=9003 bun run dev
```

#### Database Connection Issues
```bash
# Verify environment variables
grep DATABASE_URL .env.local

# Test Prisma connection
bun run prisma db pull
```

#### Build Errors
```bash
# Clear Next.js cache
rm -rf .next

# Clear node_modules and reinstall
rm -rf node_modules bun.lockb
bun install
```

#### TypeScript Errors
```bash
# Regenerate Prisma client
bun run prisma:generate

# Check for type errors
bun run typecheck

# Restart TypeScript language server in VS Code
Cmd+Shift+P → "TypeScript: Restart TS Server"
```

### Performance Optimization

#### Development Speed
```bash
# Use Bun for maximum performance
bun run dev  # Instead of npm run dev

# Enable Turbopack (experimental)
bun run dev --turbo
```

#### Database Performance
```bash
# Index optimization
bun run prisma:studio
# Check query performance in Supabase dashboard
```

## Testing

### Running Tests
```bash
# Run all tests
bun test

# Run specific test file
bun test src/components/Button.test.tsx

# Run tests in watch mode
bun test --watch
```

### Writing Tests
- Unit tests: `*.test.ts` or `*.test.tsx`
- Integration tests: `__tests__/` directory
- Test utilities: `src/test-utils/`

## Deployment

See [Deployment Guide](../ops/deploy.md) for production deployment instructions.

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Bun Documentation](https://bun.sh/docs)