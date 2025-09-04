Got it—here’s a **clean, updated config-audit doc** aligned to your *current single rail*:

* **DNS:** Cloudflare (records only)
* **Hosting/Runtime:** Vercel (Next.js 15.5+, Bun build/runtime)
* **DB:** Supabase (Postgres) via **Prisma** (schema SoT)
* **Auth:** Supabase Auth (+ RLS)
* **Secrets:** gopass (local) + Vercel Project Env (preview/prod)

Copy this into `docs/migration/config-audit.md` (or replace the earlier version).

---

# Config Cleanup on the Single Rail (Phase 2-compatible)

## Where config cleanup fits (timing)

**See thang

**Wave A — Align & fence (run now, while you finish Phase 2)**
Goal: eliminate contradictions and stop new drift.

* Freeze a **single deployment rail**: **Vercel is canonical hosting/runtime**; **Cloudflare is DNS only**.
* Write ADR: `decisions/adr-0004-vercel-primary.md` (context → decision → consequences).
* Add **CI fences** to block edits/additions to **legacy** configs (Firebase, Cloudflare runtime) and disallow committed prod `.env*`.

**Wave B — Consolidate & document (during Phase 2 merges)**
Goal: centralize what stays; archive what doesn’t.

* Create a **Config Registry** (`docs/dev/config-registry.md`) as the authoritative index.
* For every config/dotfile: **keep / deprecate / archive** and link its **doc home** (matrix below).
* Update canonical docs to explicitly reference their owned configs.

**Wave C — Enforce & harden (end of Phase 2)**
Goal: no regressions.

* CI jobs: config audit, env policy, schema/type freshness, link checks.
* Remove/archive legacy toolchains after the stated sunset date.

---

## Config classification → action → doc mapping (Vercel primary)

| Category                       | Files / Patterns                                         | Action on Single Rail    | Doc Home (canonical)                             | Notes                                                    |                                                   |
| ------------------------------ | -------------------------------------------------------- | ------------------------ | ------------------------------------------------ | -------------------------------------------------------- | ------------------------------------------------- |
| **App core**                   | `package.json`, `bunfig.toml`, \`next.config.(js         | ts)`, `tsconfig.json\`   | **Keep**                                         | `docs/dev/nextjs.md`, `docs/standards.md`                | Lock Bun/TS/Next targets here and mirror in docs. |
| **Styling**                    | `tailwind.config.ts`, `postcss.config.js`                | **Keep**                 | `docs/dev/tailwind.md`                           | Tailwind v4 conventions reflected here.                  |                                                   |
| **Quality**                    | `biome.json`, `.editorconfig`                            | **Keep**                 | `docs/_contributing/linting.md`                  | Biome is SoT for lint/format; ESLint/Prettier legacy.    |                                                   |
| **Vercel (canonical hosting)** | `vercel.json` (if used), project env                     | **Keep (canonical)**     | `docs/ops/deploy.md`                             | Describe preview/prod, env mapping, build commands.      |                                                   |
| **Cloudflare (DNS-only)**      | Zone records (no repo files typically)                   | **Keep (DNS only)**      | `docs/ops/cloudflare.md`                         | Document CNAME/Apex routing to Vercel; no Workers/Pages. |                                                   |
| **CI/CD**                      | `.github/workflows/*.yml`                                | **Keep & fence**         | `docs/ops/deploy.md`                             | Add job that rejects legacy config edits & prod `.env*`. |                                                   |
| **Supabase/DB**                | `prisma/schema.prisma`, `supabase/config/*` (if tracked) | **Keep**                 | `docs/dev/database.md`, `docs/api/data-model.md` | Prisma is schema SoT; Supabase types in `_generated/`.   |                                                   |
| **IDE/Hooks**                  | `.vscode/`, `.husky/`, `.gitignore`                      | **Keep**                 | `docs/_contributing/docs-maintenance.md`         | Keep minimal, project-scoped.                            |                                                   |
| **Legacy platform**            | `firebase.json`, `.firebaserc`, `*.rules`                | **Deprecate → Archive**  | `docs/archive/firebase/*`                        | Tombstone → Vercel/Supabase docs.                        |                                                   |
| **Legacy runtime (CF)**        | `wrangler.toml`, CF Pages/Workers config                 | **Deprecate → Archive**  | `docs/migration/index.md`                        | Sunset if any remains; DNS is the only Cloudflare role.  |                                                   |
| **Env template**               | `.env.example`                                           | **Keep (template only)** | `docs/dev/environment.md`                        | Must match the env table; never secrets.                 |                                                   |
| **Env files**                  | `.env.local`, `.env.production*`, other `.env*`          | **Consolidate/Remove**   | `docs/dev/environment.md`                        | Local stays; **prod via Vercel Env** (not in repo).      |                                                   |
| **MCP/Codex**                  | `.mcp.json`, `codex.toml`                                | **Keep (documented)**    | `docs/dev/tools.md` (new)                        | Summarize roles/servers and safety boundaries.           |                                                   |

> If a tool **must** live at repo root by convention, keep it—but document it in the registry.

---

## The Config Registry (single source of truth)

Create `docs/dev/config-registry.md`:

```md
# Config Registry (Canonical)

| File | Owner | Used By | Status | Doc Home | Generated? | Deprecates | Notes |
|------|-------|---------|--------|----------|------------|------------|-------|
| `vercel.json` | Ops | Deploy | **Canonical** | ops/deploy.md | No | firebase.json, wrangler.toml | Build/runtime settings; preview/prod. |
| (Cloudflare DNS) | Ops | DNS | **Canonical (DNS only)** | ops/cloudflare.md | N/A | — | Document CNAME/A records, SSL mode. |
| `biome.json` | Eng | Dev | **Canonical** | _contributing/linting.md | No | eslint/prettier | Single formatter. |
| `.env.example` | Eng | Dev | **Canonical (template)** | dev/environment.md | No | other env templates | Mirrors env table; no secrets. |
| `prisma/schema.prisma` | Eng | DB | **Canonical** | dev/database.md | No | — | Schema SoT; triggers codegen in CI. |
```

Make this the **one sheet** to touch when configs change.

---

## Guardrails (CI you can add now)

### 1) Legacy edit fence

Block edits to Firebase/Cloudflare-runtime configs without an allow label:

```bash
# scripts/check-legacy-config.sh
set -euo pipefail
LEGACY=("firebase.json" ".firebaserc" "wrangler.toml")
CHANGED=$(git diff --name-only origin/main...HEAD)
for f in "${LEGACY[@]}"; do
  if echo "$CHANGED" | grep -qx "$f"; then
    echo "❌ Legacy config edited: $f (use label allow-legacy-cleanup if intentional)"
    exit 1
  fi
done
echo "✅ No legacy config edits"
```

### 2) Env policy

Only `.env.example` is allowed in repo; prod env lives in **Vercel Project Env**.

```bash
# scripts/check-env-files.sh
set -euo pipefail
BAD=$(git ls-files | grep -E '^\.env(\..+)?$' | grep -v '^\.env\.example$' || true)
if [ -n "$BAD" ]; then
  echo "❌ Disallowed env files in repo:"
  echo "$BAD"
  exit 1
fi
echo "✅ Env files policy OK"
```

### 3) Type freshness (Prisma + optional Supabase)

Run on schema change; fail if generated artifacts changed but weren’t committed.

```bash
# scripts/check-types.sh
set -euo pipefail
if git diff --name-only origin/main...HEAD | grep -q '^prisma/schema\.prisma$'; then
  bunx --bun prisma validate
  bunx --bun prisma generate
  # Optional Supabase types when project ref available:
  # supabase gen types typescript --schema public > docs/_generated/supabase-types.ts
  if ! git diff --quiet -- docs/_generated/; then
    echo "❌ Generated types changed. Commit updated files in docs/_generated/."
    git status -- docs/_generated/
    exit 1
  fi
fi
echo "✅ Types fresh"
```

### 4) Wire into GitHub Actions

```yaml
# .github/workflows/config-audit.yml
name: Config Audit
on:
  pull_request:
jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
        with: { bun-version: "1.2.21" }
      - run: bash scripts/check-legacy-config.sh
      - run: bash scripts/check-env-files.sh
      - run: bash scripts/check-types.sh
```

---

## Safe cleanup waves (what to do, and when)

**Wave A (now)**

* Update `docs/ops/deploy.md` to **Vercel-primary**; move Cloudflare runtime mentions (if any) to **archive**; keep **DNS** instructions in `ops/cloudflare.md`.
* Commit `adr-0004-vercel-primary.md`.
* Remove any committed prod `.env*`; confirm `.env.example` matches `dev/environment.md`.

**Wave B (during Phase 2 merges)**

* Complete `docs/dev/config-registry.md`.
* For every **kept** config: add a short **“How to change”** section in its doc home and link back to the registry.
* Normalize versions (Bun, Prisma, Supabase CLI) in `package.json` to match docs.

**Wave C (end of Phase 2)**

* Archive/delete `firebase.*`, `.firebaserc`, `wrangler.toml` (or keep read-only with a sunset date if still referenced).
* Tighten CI fences to block re-introduction of legacy configs.
* Add entries to `docs/changelog.md` whenever canonical configs change.

---

## Decision corrections (to keep everything on one rail)

* **Secrets:** gopass (local) + **Vercel Project Env** (preview/prod). Do **not** add GCP Secret Manager unless you move hosting to GCP.
* **Cloudflare:** **DNS only**. No Workers/Pages/R2/KV unless a new ADR authorizes it.
* **Firebase:** fully legacy—archive configs; add tombstones pointing to Vercel/Supabase docs.

---

## Optional: add a tiny config auditor (same dashboard pattern)

Extend your Bun tooling with `tools/config-auditor.ts` (or a `--configs-only` mode) that:

* Scans a **known allowlist** of config files,
* Flags unknown root configs and legacy files,
* Emits `docs/migration/config-dashboard.md` with **File → Status → Owner → Action** and ready-to-run `git mv`/archive commands.

---

## Fast end-of-Phase-2 checklist

* [ ] `deploy.md` shows **Vercel-first** deploy + env mapping; `cloudflare.md` is DNS-only.
* [ ] ADR-0004 (Vercel primary) merged.
* [ ] `config-registry.md` complete and linked from `docs/README.md`.
* [ ] CI: `config-audit` + env policy + type freshness green.
* [ ] Legacy configs archived or sunset-dated.
* [ ] `.env.example` matches `dev/environment.md`; no prod `.env*` in repo.

This keeps your config story perfectly aligned with the docs canon and prevents backsliding as you wrap Phase 2.
