# Repository Guidelines

Concise contributor guide for the Homer Enrichment Hub (Next.js 15 + Bun + TypeScript).

## Project Structure & Module Organization
- `src/app/`: App Router routes (`(auth)`, `(dashboard)`, `admin`, `api`).
- `src/components/`: UI, forms, and admin components (`ui/`, `forms/`, `admin/`).
- `src/lib/`: Utilities and config (auth, email, db).
- `src/hooks/`, `src/providers/`, `src/types/`.
- `memory-bank/`: Agent context and handoffs.
- `public/`: Static assets. Place tests near code as `*.test.ts(x)`.

## Build, Test, and Development Commands
- `bun dev`: Start dev server on port 9002 (Turbopack).
- `bun run build`: Production build.
- `bun start`: Run the built app.
- `bun test`, `bun test:watch`, `bun test:coverage`, `bun test:ui`: Vitest.
- `bun lint`, `bun lint:fix`, `bun format`: Biome lint/format.
- `bun typecheck`: TypeScript diagnostics.

## Coding Style & Naming Conventions
- TypeScript strict mode; import via `@/` alias from `src/`.
- Indentation: 2 spaces for web code.
- Naming: PascalCase components, camelCase variables/functions, kebab-case route segments.
- Tailwind CSS 4: use `@config "./tailwind.config.ts"` and `@import "tailwindcss"` in `globals.css` (do not use `@tailwind`).
- Biome handles formatting; keep imports tidy and consistent.

## Testing Guidelines
- Framework: Vitest + React Testing Library; target ≥ 80% coverage.
- Place tests next to source as `*.test.ts`/`*.test.tsx`.
- Write unit tests for utilities, component tests for UI, and integration tests for key flows.
- Mock external services (Firebase, Firestore, SendGrid) in tests.

## Commit & Pull Request Guidelines
- Branches: `feature/<summary>`; pull latest main before starting.
- Commits: Conventional Commits (e.g., `feat:`, `fix:`, `docs:`, `chore:`).
- PRs: clear description, linked issues, screenshots for UI, test notes, and checklist of affected areas.
- Before push: run `bun test` and `bun lint` and ensure typecheck passes.

## Security & Configuration Tips
- Never commit secrets; use `.env.local` for local dev and Vercel Environment Variables for deployed environments.
- Secrets management: Infisical is supported for local/CI sync (`docs/secrets/`).
- Authentication: Supabase Auth is canonical; legacy Firebase docs are archived in `docs/legacy-firebase/`.
- Deployment: Vercel is the deployment target; see `docs/VERCEL-QUICKSTART.md` and `vercel.json`.
