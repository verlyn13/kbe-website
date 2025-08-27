# AGENTS.md - Homer Enrichment Hub Configuration

This file provides project-specific configuration for AI agents when working with the Homer Enrichment Hub (kbe-website) codebase.

## Project Overview

Homer Enrichment Hub is a Next.js 15 educational portal for enrichment programs in Homer, Alaska, serving families with comprehensive registration and learning management capabilities.

## Tech Stack

### Core Framework
- **Runtime**: Bun 1.2.21+ (replaced npm)
- **Framework**: Next.js 15.4.5 with App Router
- **Language**: TypeScript 5.8.3 (strict mode)
- **React**: Version 19.1.1

### Styling & UI
- **CSS**: Tailwind CSS 4.0.0 (using @config directive, NOT @tailwind)
- **Components**: shadcn/ui (Radix UI primitives)
- **Icons**: Lucide React
- **Themes**: Dark mode support via next-themes

### Backend & Data
- **Auth**: Firebase Auth (Email, Google, Magic Link)
- **Database**: Firestore
- **Email**: SendGrid API
- **Hosting**: Firebase App Hosting
- **Forms**: React Hook Form + Zod validation

### Development Tools
- **Linter/Formatter**: Biome 2.2.0 (replaced ESLint/Prettier)
- **Testing**: Vitest + React Testing Library
- **Package Manager**: Bun (10x faster than npm)

## Essential Commands

```bash
# Development (Bun)
bun dev              # Start dev server on port 9002
bun run build        # Production build
bun start            # Start production server

# Testing
bun test            # Run Vitest tests
bun test:watch      # Watch mode
bun test:coverage   # Coverage report
bun test:ui         # Vitest UI

# Code Quality
bun lint            # Biome linting
bun lint:fix        # Auto-fix issues
bun format          # Format code
bun typecheck       # TypeScript checking

# Deployment (automatic via GitHub push to main)
git push origin main # Triggers Firebase App Hosting deployment
```

## Project Structure

```
/src/
├── app/              # Next.js App Router pages
│   ├── (auth)/      # Auth group routes
│   ├── (dashboard)/ # Dashboard routes
│   ├── admin/       # Admin panel
│   └── api/         # API routes
├── components/       # React components
│   ├── ui/          # shadcn/ui base components
│   ├── forms/       # Form components
│   └── admin/       # Admin-specific components
├── hooks/           # Custom React hooks
├── lib/             # Utilities and configurations
│   ├── firebase/    # Firebase configs
│   └── email/       # Email utilities
├── providers/       # Context providers
└── types/           # TypeScript definitions

/memory-bank/        # Agent context persistence
├── active-context.md
├── product-context.md
├── progress.md
├── decision-log.md
├── system-patterns.md
└── agent-handoffs.md
```

## Critical Project Rules

### 1. Port Configuration
- Dev server MUST run on port **9002** (not 3000)
- Configured in package.json: `next dev --turbopack -p 9002`

### 2. Firebase Deployment Requirements
- **CRITICAL**: ALL production dependencies MUST be in `dependencies`
- These packages MUST stay in `dependencies` (NOT devDependencies):
  - `typescript`
  - `@tailwindcss/postcss`
  - `postcss`
  - `tailwindcss`
- Moving them breaks Firebase deployment

### 3. Tailwind CSS 4 Syntax
- **USE**: `@config "./tailwind.config.ts"`
- **USE**: `@import "tailwindcss"`
- **DON'T USE**: `@tailwind` directives (deprecated)
- Check globals.css has proper imports

### 4. TypeScript Configuration
- **Paths**: Use `@/` for imports from `/src/`
- **Strict Mode**: Enabled by default
- **Target**: ES2022
- **Module**: ESNext with bundler resolution

### 5. Biome Configuration
- Replaces ESLint and Prettier
- 20x faster linting
- Single configuration in `biome.json`
- Automatic formatting on save

### 6. Environment Variables
- **Development**: Use `.env.local`
- **Production**: Google Cloud Secret Manager
- **Firebase Config**: Never commit API keys directly

## Domain Information

- **Production**: homerenrichment.com
- **Previous**: homerconnect.com (migrated)
- **Development**: localhost:9002

## Security Requirements

1. **API Keys**:
   - Separate keys for Firebase Auth and other services
   - Never share keys between services
   - Use environment variables

2. **Secrets Management**:
   - Local: gopass or .env.local
   - Production: Google Cloud Secret Manager
   - Run `firebase apphosting:secrets:grantaccess` for new secrets

3. **Auth Configuration**:
   - Domains must be configured in Firebase Console
   - Browser keys need HTTP referrer restrictions
   - actionCodeSettings.url must match window.location.origin

## Memory Bank System

The project uses a Memory Bank for context persistence across agent sessions:

- **Location**: `/memory-bank/` directory
- **Purpose**: Maintain context between AI agent interactions
- **Core Files**:
  - `active-context.md` - Current task and session info
  - `product-context.md` - Project overview and goals
  - `progress.md` - Task tracking and completion status
  - `decision-log.md` - Architectural decisions (ADRs)
  - `system-patterns.md` - Reusable patterns and practices
  - `agent-handoffs.md` - Inter-agent collaboration log

## Available Agent Modes

### Core Modes
- **🏗️ Architect** (architect) - System design and planning
- **💻 Code** (code) - Implementation and refactoring
- **❓ Ask** (ask) - Explanations and documentation
- **🪲 Debug** (debug) - Troubleshooting and diagnostics
- **🪃 Orchestrator** (orchestrator) - Multi-step project coordination

### KBE-Specific Modes
- **🎨 KBE UI Designer** (kbe-ui) - UI/UX implementation
- **🔌 KBE API Developer** (kbe-api) - Backend and API development
- **🧪 KBE Test Engineer** (kbe-test) - Testing and coverage
- **🐛 KBE Debugger** (kbe-debug) - Specialized debugging
- **📝 KBE Documentation** (kbe-docs) - Documentation maintenance
- **⚡ KBE Performance** (kbe-performance) - Performance optimization
- **🎯 KBE Orchestrator** (kbe-orchestrator) - Project-specific coordination

## Common Tasks

### Add a New Page
```bash
# 1. Create page file
touch src/app/new-feature/page.tsx

# 2. Add server component
# 3. Import from @/components/
# 4. Follow existing patterns
```

### Update Firebase Configuration
```bash
# 1. Edit .env.local for development
# 2. Update secrets in Google Cloud
# 3. Grant access to secrets
firebase apphosting:secrets:grantaccess
```

### Fix Type Errors
```bash
# 1. Run type checking
bun typecheck

# 2. Check audit files
cat audit/testing-type-fix-strategy.md

# 3. Fix errors following patterns
```

### Run Tests
```bash
# Unit tests
bun test

# With coverage
bun test:coverage

# Watch mode
bun test:watch

# UI mode
bun test:ui
```

### Deploy to Production
```bash
# 1. Ensure all changes committed
git status

# 2. Push to main branch
git push origin main

# 3. Monitor deployment
# Check GitHub Actions or Firebase Console
```

## Performance Guidelines

### Core Web Vitals Targets
- **LCP**: < 2.5s
- **FID**: < 100ms
- **CLS**: < 0.1

### Optimization Strategies
1. Use Next.js Image component
2. Implement code splitting
3. Server components by default
4. Lazy load heavy components
5. Optimize bundle size

## Testing Standards

- **Framework**: Vitest + React Testing Library
- **Coverage Target**: 80% minimum
- **Test Types**:
  - Unit tests for utilities
  - Component tests for UI
  - Integration tests for workflows
  - E2E tests for critical paths

## Debugging Tips

1. **Hydration Issues**: Check server/client boundaries
2. **Performance**: Use React DevTools Profiler
3. **Firebase**: Check browser console for auth errors
4. **Build Errors**: Verify dependencies in correct section
5. **Type Errors**: Run `bun typecheck`

## Agent Collaboration Patterns

### Handoff Protocol
When switching between modes, use this format:
```markdown
## Handoff: [From Mode] → [To Mode]
**Task**: [Clear description]
**Context**: See memory-bank/active-context.md
**Requirements**: [Specific needs]
**Success Criteria**: [How to verify]
```

### Mode Selection Guide
- **Planning/Design**: Use Architect mode
- **Implementation**: Use Code or KBE-specific modes
- **Questions**: Use Ask mode
- **Issues**: Use Debug mode
- **Testing**: Use Test mode
- **Coordination**: Use Orchestrator mode

## Quick Reference

### Bun Commands
```bash
bun add [package]        # Add dependency
bun remove [package]     # Remove dependency
bun install             # Install all dependencies
bun update              # Update dependencies
bun run [script]        # Run package.json script
bun [file.ts]           # Execute TypeScript directly
```

### Firebase Commands
```bash
firebase deploy --only hosting
firebase deploy --only firestore:rules
firebase emulators:start
firebase apphosting:secrets:set [KEY]
```

### Git Workflow
```bash
git checkout -b feature/[name]
git add .
git commit -m "feat: [description]"
git push origin feature/[name]
# Create PR for review
```

## Contact & Support

- **Project**: Homer Enrichment Hub
- **Domain**: homerenrichment.com
- **Firebase Project**: kbe-website
- **Repository**: [GitHub URL]

---

*Last Updated: December 26, 2024*
*Memory Bank Status: ACTIVE*
