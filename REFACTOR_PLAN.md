# Homer Enrichment Hub - Complete Refactor Plan

## Overview
Complete architectural refactor from Firebase Studio template to modern Vercel-native stack.

**Timeline**: December 27, 2024 - January 3, 2025
**Current State**: Firebase Auth + Firestore (with Firebase Studio artifacts)
**Target State**: Modern auth provider + Vercel-native data layer

## Branch Strategy

```
main (stable)
├── refactor/phase-1-auth     ← Replace Firebase Auth
├── refactor/phase-2-data     ← Replace Firestore
├── refactor/phase-3-agents   ← Add agentic capabilities
└── refactor/phase-4-deploy   ← Final migration
```

## Phase 1: Authentication & Database Setup (Days 1-2)

### Selected Stack: Supabase + Prisma
- **Supabase**: Complete Firebase alternative with auth + PostgreSQL
- **Prisma**: Type-safe ORM with excellent DX
- **Migration Path**: Export Firestore → Import to Supabase PostgreSQL

### Why Supabase + Prisma?
- Similar auth patterns to Firebase (easier migration)
- Built-in PostgreSQL database
- Row Level Security (RLS) for data protection
- Real-time subscriptions if needed
- Prisma provides type safety and migrations
- Both are open source

### Tasks
- [ ] Create Supabase project
- [ ] Export Firestore data to JSON
- [ ] Set up Prisma with Supabase
- [ ] Create database schema with Prisma
- [ ] Import data to Supabase
- [ ] Implement Supabase Auth
- [ ] Update all auth hooks
- [ ] Configure Row Level Security
- [ ] Test OAuth flows (Google, Email, Magic Link)

## Phase 2: Data Migration (Days 3-4)

### Prisma Schema
```prisma
// schema.prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id            String         @id @default(uuid())
  email         String         @unique
  name          String?
  phone         String?
  role          Role           @default(PARENT)
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt
  students      Student[]
  registrations Registration[]
  waivers       Waiver[]
}

model Student {
  id            String         @id @default(uuid())
  userId        String
  user          User           @relation(fields: [userId], references: [id])
  name          String
  dateOfBirth   DateTime
  grade         String
  school        String?
  medicalNotes  String?
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt
  registrations Registration[]
  waivers       Waiver[]
}

model Program {
  id            String         @id @default(uuid())
  name          String
  description   String
  category      String
  startDate     DateTime
  endDate       DateTime
  schedule      Json           // Store complex schedule as JSON
  capacity      Int
  price         Decimal
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt
  registrations Registration[]
}

model Registration {
  id        String             @id @default(uuid())
  userId    String
  user      User               @relation(fields: [userId], references: [id])
  studentId String
  student   Student            @relation(fields: [studentId], references: [id])
  programId String
  program   Program            @relation(fields: [programId], references: [id])
  status    RegistrationStatus @default(PENDING)
  createdAt DateTime           @default(now())
  updatedAt DateTime           @updatedAt

  @@unique([studentId, programId])
}

model Waiver {
  id         String   @id @default(uuid())
  userId     String
  user       User     @relation(fields: [userId], references: [id])
  studentId  String
  student    Student  @relation(fields: [studentId], references: [id])
  documentUrl String?
  signedAt   DateTime
  expiresAt  DateTime
  createdAt  DateTime @default(now())
}

model Announcement {
  id          String    @id @default(uuid())
  title       String
  content     String
  priority    Priority  @default(NORMAL)
  publishedAt DateTime  @default(now())
  expiresAt   DateTime?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

enum Role {
  ADMIN
  PARENT
  INSTRUCTOR
}

enum RegistrationStatus {
  PENDING
  CONFIRMED
  WAITLIST
  CANCELLED
}

enum Priority {
  LOW
  NORMAL
  HIGH
  URGENT
}
```

### Tasks
- [ ] Set up Vercel Postgres
- [ ] Create Drizzle ORM schemas
- [ ] Migrate Firestore data structure
- [ ] Update all data queries
- [ ] Remove Firestore dependencies

## Phase 3: Agentic Architecture (Day 5)

### Structure
```
/app/api/agents/[...slug]/route.ts
/_agents/
  ├── orchestrator/
  ├── registration/
  ├── communication/
  └── reporting/
/lib/ai/
  ├── sdk.ts
  └── tools.ts
```

### Core Agents
1. **Registration Assistant**: Help parents through registration
2. **Program Recommender**: Suggest programs based on student profile
3. **Communication Bot**: Answer common questions
4. **Admin Reporter**: Generate reports and insights

### Tasks
- [ ] Install Vercel AI SDK
- [ ] Create agent structure
- [ ] Implement basic tools
- [ ] Add streaming UI components
- [ ] Configure function timeouts

## Phase 4: Deployment & Cutover (Day 6)

### Pre-Cutover Checklist
- [ ] All tests passing
- [ ] Environment variables migrated
- [ ]gopass secrets synced
- [ ] DNS verified
- [ ] SSL certificates active
- [ ] CI/CD pipelines updated

### Cutover Steps
1. Merge refactor branch to main
2. Deploy to production
3. Verify all functionality
4. Remove Firebase project
5. Archive legacy code

## Environment Variables Migration

### Current (Firebase)
```env
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
NEXT_PUBLIC_RECAPTCHA_ENTERPRISE_SITE_KEY
```

### Target (Vercel-Native)
```env
# Auth (Clerk example)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY
NEXT_PUBLIC_CLERK_SIGN_IN_URL
NEXT_PUBLIC_CLERK_SIGN_UP_URL

# Database
POSTGRES_URL
POSTGRES_URL_NON_POOLING
KV_REST_API_URL
KV_REST_API_TOKEN
BLOB_READ_WRITE_TOKEN

# AI
OPENAI_API_KEY
ANTHROPIC_API_KEY

# App
NEXT_PUBLIC_APP_URL
```

## Secrets Management Structure

```
gopass/
└── vercel/
    └── kbe-website/
        ├── production/
        │   ├── CLERK_SECRET_KEY
        │   ├── POSTGRES_URL
        │   ├── OPENAI_API_KEY
        │   └── ...
        ├── preview/
        │   └── ...
        └── development/
            └── ...
```

## Dependencies to Remove

```json
{
  "firebase": "^12.0.0",
  "firebase-admin": "^13.0.0",
  "@firebase/app-check": "*"
}
```

## Dependencies to Add

```json
{
  "@clerk/nextjs": "latest",
  "@vercel/postgres": "latest",
  "@vercel/kv": "latest",
  "@vercel/blob": "latest",
  "drizzle-orm": "latest",
  "ai": "latest",
  "@ai-sdk/openai": "latest",
  "zod": "latest"
}
```

## Risk Mitigation

1. **Data Backup**: Export all Firestore data before migration
2. **Rollback Plan**: Keep Firebase project active for 30 days
3. **Testing**: Comprehensive E2E tests at each phase
4. **Monitoring**: Set up Vercel Analytics from day 1

## Success Criteria

- [ ] Zero Firebase dependencies
- [ ] All auth flows working
- [ ] Data migrated successfully
- [ ] Page load time < 1s
- [ ] Lighthouse score > 95
- [ ] No console errors
- [ ] CI/CD fully automated

## Notes

- This refactor eliminates all Firebase Studio artifacts
- Moves to Vercel-native stack for better performance
- Adds AI capabilities from the start
- Uses modern patterns (App Router, Server Components, etc.)
- Implements proper secrets management with gopass

---

**Start Date**: December 27, 2024
**Target Completion**: January 3, 2025
**Status**: Planning Complete