# Auth Prep Checklist

This document outlines immediate prep tasks to stabilize and improve Firebase Auth integration.

## Current Findings

- Duplicate Firebase init modules:
  - `src/lib/firebase.ts` (session persistence, includes hardcoded default keys — needs removal)
  - `src/lib/firebase-config.ts` (env-only, local persistence commented out)
- Hooks and pages import from both modules, causing inconsistency and risk of multiple initializations.
- Auth-related routes/components exist: `src/hooks/use-auth.tsx`, `src/app/signout`, `src/app/debug-auth*`, `src/app/test-auth`, `src/app/auth-diagnostics`.
- Tests mock both `@/lib/firebase` and `@/lib/firebase-config`, reinforcing duplication.

## Action Items

- [ ] Remove hardcoded Firebase config defaults from `src/lib/firebase.ts` (security risk). Use env vars only.
- [ ] Consolidate to a single Firebase module (recommend `src/lib/firebase.ts`) exporting `app`, `auth`, and `db`.
- [ ] Delete or deprecate `src/lib/firebase-config.ts` and update imports to the unified module.
- [ ] Decide persistence strategy: `browserSessionPersistence` vs `browserLocalPersistence` based on product needs; implement consistently.
- [ ] Ensure client-only usage for auth APIs (guard with `typeof window !== 'undefined'` where needed).
- [ ] Update tests/mocks in `src/test/setup.ts` to match the unified module.
- [ ] Verify `.env.example` lists all required `NEXT_PUBLIC_FIREBASE_*` keys (no secrets committed).
- [ ] Validate allowed auth domains in Firebase Console match current domains.
- [ ] Enforce API key restrictions per policy (see `docs/api-key-policy.md`):
  - Inspect: `scripts/keys/verify-api-key.sh <KEY_ID>`
  - Apply: `scripts/keys/enforce-firebase-web-key.sh --key-id <KEY_ID> --env <dev|preview|prod>`
- [ ] Manual QA: sign-in link flow, Google OAuth, and sign-out across fresh tab/session.

## Verification Steps

- Run `npm run typecheck` and `npm run lint`.
- Test flows on dev server (`npm run dev -p 9002`):
  - Magic link via `src/app/test-auth`.
  - Google via `src/app/auth-diagnostics`.
  - Sign-out and state reset via `src/app/signout` and `src/app/debug-auth*`.

## Notes / Decisions

- Persistence decision:
  - [ ] Session-only (safer for shared devices)
  - [ ] Local (persist across restarts)
- Any SSR boundaries needed for auth usage in layouts/providers.
