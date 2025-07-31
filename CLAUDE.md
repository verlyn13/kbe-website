# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

KBE Website is a parent and student portal for Kachemak Bay Enrichment (formerly Kachemak Bay Explorers) in Homer, Alaska. Built with Next.js 15, TypeScript, Firebase Auth, and GenKit AI integration.

## Essential Commands

### Development
```bash
npm run dev          # Start dev server on port 9002 with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run typecheck    # TypeScript type checking (tsc --noEmit)
```

### AI Development
```bash
npm run genkit:dev    # Start GenKit development server
npm run genkit:watch  # GenKit with file watching for hot reload
```

## Architecture Overview

### Tech Stack
- **Frontend**: Next.js 15.3.3 with App Router, React 18.3.1, TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components (Radix UI primitives)
- **Backend**: Firebase Auth with multiple providers (Email, Google, Magic Link)
- **AI**: GenKit 1.15.5 with Google AI (Gemini 2.0 Flash) for content generation
- **Forms**: React Hook Form with Zod validation

### Key Directories
- `/src/app/` - Next.js App Router pages
- `/src/components/` - Reusable React components (shadcn/ui based)
- `/src/hooks/` - Custom React hooks (auth, mobile, toast)
- `/src/lib/` - Utilities and configurations
- `/src/ai/` - GenKit AI flows and development server

### Route Structure
- `/` - Login/authentication page
- `/dashboard` - Parent dashboard with widgets
- `/admin` - Auto-redirects to `/admin/content-generator`
- `/admin/content-generator` - AI-powered content generation tools

### Authentication Flow
- `AuthProvider` wraps the app with Firebase Auth context
- `use-auth` hook provides authentication state
- Protected routes automatically redirect to login
- 30-day session persistence with "Remember me" option

### AI Integration
GenKit flows are defined in `/src/ai/` for:
- Program description generation with creative titles
- Weekly challenge content for different grade levels
- Server-side processing for security

### Component Architecture
- All UI components follow shadcn/ui patterns with Radix UI
- Components use CSS variables for theming (light/dark modes)
- Form components integrate React Hook Form + Zod validation
- Dashboard uses widget-based architecture for modularity

## Important Notes

1. **Firebase Configuration**: Currently using example config. Real Firebase credentials needed in `/src/lib/firebase.ts.example`

2. **Port Configuration**: Dev server runs on port 9002 (not default 3000)

3. **TypeScript Path Alias**: Use `@/` for imports from `/src/`

4. **No Test Setup**: No testing framework configured yet

5. **Deployment**: Firebase App Hosting with max 1 instance (see apphosting.yaml)

6. **Build Errors**: Next.js config ignores TypeScript/ESLint errors during build

## Design System

- **Primary Color**: #008080 (Deep teal - bay waters)
- **Background**: #E0EEEE (Light grayish-teal)
- **Accent**: #B8860B (Muted gold - "Kachemak Gold")
- **Font**: Inter for all typography
- CSS variables support theme switching