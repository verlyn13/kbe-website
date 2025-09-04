# Firebase Usage Report and Migration Plan

Generated: 2025-08-31
Repository: kbe-website (Homer Enrichment Hub)

## Executive Summary

The application is in transition from Firebase (Auth, Firestore, App Check) to the target stack defined in AGENTS.md:
- Runtime: Bun 1.2.21+
- Framework: Next.js 15 (App Router)
- Language: TypeScript (strict)
- Lint/Format: Biome 2.2.x
- Data: Prisma (latest) + Supabase (Postgres)
- Hosting: Vercel / Firebase App Hosting (legacy)

Core data features are already implemented with Prisma services in `src/lib/services/*`. However, several active UI pages, hooks, and utilities still import Firebase client SDKs. Tests currently provide Firebase mocks. This report inventories all current Firebase usages, the surrounding context, and concrete migration tasks to fully adopt Prisma + Supabase + Vercel.

---

## Inventory: Active Firebase Usage (src/*)

Legend: [A] Auth SDK, [F] Firestore SDK, [C] Config/env

1) Auth and Session
- src/hooks/use-auth.tsx [A,C]
  - Uses `onAuthStateChanged`, `signOut` from `firebase/auth` and `auth` from `@/lib/firebase`.
  - Controls global auth state and redirects.
  - Target: Replace with Supabase Auth client and a small wrapper (e.g., `@/lib/supabase-client`) + session context. Map `User` usages to Supabase session/user shape.

- src/components/login-form.tsx [A,F]
  - Uses `signInWithEmailAndPassword`, `sendPasswordResetEmail`, `GoogleAuthProvider`, etc.; dynamically imports Firestore to fetch profile.
  - Target: Supabase email/password and OAuth flows; profile lookups via `profileService` (Prisma).

- src/app/signup/page.tsx [A,F]
  - Uses `createUserWithEmailAndPassword`, Firestore profile existence check, and `auth` from our Firebase wrapper.
  - Target: Supabase sign-up + email verification; initial profile via `profileService.create`.

- src/app/signout/page.tsx [A]
  - Uses `signOut` from `firebase/auth` and `auth` from our wrapper.
  - Target: Supabase `auth.signOut()`.

- src/app/auth-status/page.tsx [C]
  - Reads `NEXT_PUBLIC_FIREBASE_*` to display configured values.
  - Target: Remove or convert to Supabase diagnostic page.

2) Firestore Data Access
- src/app/page.tsx [F]
  - On authenticated users, lazily imports Firestore and checks profile completion.
  - Target: Use `profileService` (Prisma) for profile status; remove dynamic Firestore import.

- src/app/dashboard/layout.tsx [F]
  - Reads admin/profile via Firestore.
  - Target: Use `useAdmin()` and `profileService`.

- src/app/system-status/page.tsx [F]
  - Reads Firestore collections for a status view.
  - Target: Replace with Prisma-backed status or remove.

- src/app/students/add/page.tsx [F]
  - Adds a Firestore doc with `serverTimestamp`.
  - Target: Prisma create for `student` (and related) via a `studentService` (pattern matches `registrationService`).

- src/app/admin/waivers/page.tsx [F]
  - Queries, updates waiver docs via Firestore.
  - Target: Use Prisma models/relations (table: `waiver`) with a `waiverService` or add methods to `profileService`/`registrationService`.

- src/components/simple-header.tsx [F]
  - Checks admin doc via Firestore.
  - Target: Use `useAdmin()` (Prisma).

- src/components/profile-completion-check.tsx [F]
  - Reads profile completion from Firestore.
  - Target: `profileService.getById(userId)` in Prisma.

- src/components/waiver-status-widget.tsx [F]
  - Subscribes to waiver collection via `onSnapshot`.
  - Target: Convert to server component + fetch via Prisma; or add an API route if live updates are required.

- src/components/portal/welcome-guide.tsx [F]
  - Reads and updates user docs.
  - Target: Prisma `profileService.update`.

- src/components/portal/student-roster.tsx [F]
  - Queries Firestore for student roster.
  - Target: Prisma queries via `registrationService` and `student` relations.

- src/components/registration/registration-flow.tsx [A,F]
  - Uses Auth and Firestore writes for new registrations.
  - Target: Supabase Auth + `registrationService.create`.

3) Firebase Client Wrapper and Admin File
- src/lib/firebase.ts [C]
  - Initializes Firebase app, Auth, Firestore, App Check (ReCaptcha Enterprise), sets persistence.
  - Target: Remove once callers migrate to Supabase/Auth + Prisma.

- src/lib/firebase-config.ts [C]
  - Commentary file pointing to `@/lib/firebase` as the single access point.
  - Target: Remove after migration.

- src/lib/firebase-admin.ts [F]
  - Large Firestore abstraction containing: registrations, programs, admins, attendance, announcements, profiles, etc.
  - Current app code already uses Prisma services that supersede this. Target: delete after final migration, or split into Prisma services (most already exist).

4) API Routes (migrated)
- src/app/api/webhooks/sendgrid/route.ts
  - Previously wrote to Firestore; now refactored to log only, ready for Prisma persistence.

---

## Inventory: Tests and Test Utilities

- src/test/setup.ts
  - Mocks `@/lib/firebase` and `firebase/firestore` to avoid real initialization.
  - Target: Remove Firebase mocks once code paths are fully migrated; mock Prisma services instead (e.g., `@/lib/services`).

- src/app/__tests__/smoke.routes.test.tsx
  - Updated to mock `@/lib/services.registrationService.getStats` so Admin dashboard renders without Firestore.
  - Target: Continue using service-level mocks post-migration.

---

## Inventory: Scripts, Config, and Documentation

- package.json
  - Dependencies: `firebase` present in `dependencies`. Target: remove once code has no Firebase imports.
  - Scripts: `fb:*` scripts exist (e.g., `fb:rules:test`). Target: remove or relocate to legacy folder.

- firebase.json (root)
  - Legacy hosting config. Target: remove if no longer deploying via Firebase hosting.

- docs/ and backups/
  - Multiple documents and backup projects reference Firebase and `firebase-admin` (historical context). Keep for history or move under `docs/legacy-firebase/`.

- scripts/setup-admin.js (and `firebase-import/` tooling)
  - Legacy admin bootstrap using `firebase-admin`.
  - Target: deprecate post-migration.

- Environment
  - `.env*` files and code reference: `NEXT_PUBLIC_FIREBASE_*`, `NEXT_PUBLIC_RECAPTCHA_ENTERPRISE_SITE_KEY`.
  - Target: Replace with Supabase (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) and server-side service credentials as needed. Remove App Check references.

---

## Replacement Architecture (Target Stack)

1) Authentication (Supabase)
- Client: Initialize Supabase in `src/lib/supabase-client.ts` (browser) and `src/lib/supabase-server.ts` (server actions / RSC).
- Hook: Replace `use-auth` with a thin wrapper over Supabase session listener; expose `{ user, session, signIn, signOut }`.
- Pages: Migrate sign-in/up/reset flows to Supabase Auth. Remove reCAPTCHA Enterprise/App Check.
- Protected Routes: Use `server` components or middleware to assert session via Supabase on sensitive pages.

2) Data (Prisma + Supabase Postgres)
- Collections → Tables mapping (indicative):
  - `profiles` → `User`/`Profile` tables (already in `profile-service.ts`).
  - `registrations` → `Registration` + relations (already in `registration-service.ts`).
  - `programs` → `Program` (already in `calendar-service.ts`).
  - `announcements` → `Announcement` (already in `announcement-service.ts`).
  - `admins` → `User` with `role`/`permissions` or dedicated `Admin` table (already in `admin-service.ts`).
  - `attendance` → `Attendance` (new Prisma model/service likely needed).
  - `waivers` → `Waiver` (new Prisma model/service likely needed).
- Services: Prefer calling `src/lib/services/*` from UI. Add missing services (`attendanceService`, `waiverService`) mirroring the existing patterns.

3) API Routes
- Replace client-side Firestore mutations with server actions or API routes that call Prisma services.
- Example conversions:
  - Student creation: new API route `POST /api/students` → `prisma.student.create`.
  - Waiver updates: `PATCH /api/waivers/:id` → `prisma.waiver.update`.

4) Environment and Config
- Remove `NEXT_PUBLIC_FIREBASE_*` and App Check keys.
- Add Supabase envs in `.env.local` and Secret Manager for production.
- Ensure critical build dependencies remain under `dependencies` per project rules.

5) Deployment
- Vercel as primary hosting (per docs). Remove Firebase hosting files and CI hooks once unused.

---

## File-by-File Migration Tasks (High Priority First)

1) Remove Firestore from UI Shell
- src/components/dashboard-header.tsx (DONE)
  - Now powered by `useAdmin()`

2) Replace Profile Checks
- src/app/page.tsx
  - Replace Firestore profile check with `profileService.getById` and a boolean `profileCompleted`.
- src/components/profile-completion-check.tsx
  - Fetch via Prisma service; remove Firestore import.

3) Auth Migration
- src/hooks/use-auth.tsx, src/components/login-form.tsx, src/app/signup/page.tsx, src/app/signout/page.tsx
  - Implement Supabase client wrappers; update components to call Supabase methods and read session state.

4) Registration Flow
- src/components/registration/registration-flow.tsx
  - Replace Firebase Auth usage with Supabase signup or ensure user exists; persist registration via `registrationService`.

5) Waivers and Roster
- src/app/admin/waivers/page.tsx, src/components/waiver-status-widget.tsx, src/components/portal/student-roster.tsx
  - Create `waiverService` + `studentService` or extend existing services. Replace queries and subscriptions with Prisma reads; if live updates are needed, consider polling or websocket channels.

6) Cleanup Legacy and Env
- Remove `src/lib/firebase.ts`, `src/lib/firebase-config.ts` after callers are migrated.
- Remove `src/lib/firebase-admin.ts` once fully replaced by `src/lib/services/*`.
- Remove Firebase env keys from `.env*`.
- Remove Firebase dependencies and hosting configs.

---

## Risks and Considerations
- Auth shape differences: Firebase `User` vs Supabase `User`/`Session` require careful typing updates.
- Real-time features: Firestore `onSnapshot` patterns should be rethought (Server Components, SWR polling, or Supabase Realtime if needed).
- Email flows: Ensure SendGrid webhooks and email utilities rely solely on Prisma for persistence (we adjusted the webhook route already).
- Secrets: Migrate to using Supabase keys and Google Cloud Secret Manager per project rules.

---

## Current Progress Check (as of this report)
- Typecheck: passing (`bun typecheck`).
- Lint: passing (`bun lint`).
- Tests: passing when run with Vitest scripts (`bun run test:run`).
- Firestore removed from: SendGrid webhook route, Dashboard header.

---

## Suggested Next Steps
1) Implement Supabase client/server wrappers and migrate `use-auth` + auth pages.
2) Replace profile checks and completion state with `profileService`.
3) Convert registration flow to Prisma writes (already available in `registration-service`).
4) Build `waiverService` and, if necessary, `studentService`; migrate waiver pages and roster.
5) Delete Firebase client and admin files; remove Firebase deps/scripts/config.
6) Update docs to reflect Supabase-only stack and remove Firebase-specific instructions.

---

## Appendix: Raw Matches (Active src/*)

Auth SDK imports
```
src/app/signup/page.tsx
src/app/signout/page.tsx
src/components/login-form.tsx
src/components/registration/registration-flow.tsx
src/hooks/use-auth.tsx
```

Firestore SDK imports
```
src/app/dashboard/layout.tsx
src/app/signup/page.tsx
src/app/signout/page.tsx (auth only)
src/app/system-status/page.tsx
src/app/students/add/page.tsx
src/app/admin/waivers/page.tsx
src/app/page.tsx (dynamic import)
src/components/simple-header.tsx
src/components/profile-completion-check.tsx
src/components/waiver-status-widget.tsx
src/components/portal/welcome-guide.tsx
src/components/portal/student-roster.tsx
src/components/registration/registration-flow.tsx
```

Firebase wrapper / config
```
src/lib/firebase.ts
src/lib/firebase-config.ts
src/lib/firebase-admin.ts
```

Tests referencing Firebase
```
src/test/setup.ts
```

Environment references
```
src/lib/firebase.ts
src/app/auth-status/page.tsx
```

---

If you want, I can start with the Supabase Auth migration and PR the `use-auth` + auth pages update, or begin replacing the profile completion checks with calls to `profileService`.
