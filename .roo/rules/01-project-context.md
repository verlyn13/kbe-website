# KBE Portal Context

This is an educational enrichment portal for Kachemak Bay families in Homer, Alaska.

## Key Features

- Parent dashboard for tracking student progress
- Student portal for accessing enrichment activities
- AI-powered content generation for educators
- Real-time collaboration features

## Technical Stack

- Next.js 15 with App Router
- TypeScript with strict mode
- Tailwind CSS 4 + shadcn/ui
- React Hook Form + Zod for forms
- Server Components for performance
- Firebase for authentication and hosting
- Google AI Studio for content generation

## Project Structure

- `src/app/` - Next.js App Router pages and layouts
- `src/components/` - Shared React components
- `src/components/ui/` - shadcn/ui components
- `src/hooks/` - Custom React hooks
- `src/lib/` - Utility functions and configurations
- `src/ai/` - AI integration and flows
- `docs/` - Project documentation
- `scripts/` - Utility scripts

## Key User Flows

1. **Parent Authentication**: Magic link login via Firebase
2. **Student Dashboard**: Access to enrichment activities and challenges
3. **Progress Tracking**: Real-time updates on student achievements
4. **Content Generation**: AI-powered educational content creation
5. **Admin Panel**: Content management and user administration

## Design System

- Primary Colors: Teal (#008080), Gold (#B8860B)
- Responsive design with mobile-first approach
- WCAG 2.1 AA accessibility compliance
- Consistent spacing using Tailwind's scale
