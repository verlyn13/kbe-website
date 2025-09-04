This is the authoritative, actionable SOP for our docs migration. It aligns with the project’s single rail (Cloudflare DNS → Vercel runtime, Supabase+Prisma, Supabase Auth, Bun/Next.js, gopass local + Vercel Env) and plugs into existing tools (classifier, dashboard, CI). It adds concrete checklists, owner workflow, and quality gates for smooth, high‑quality execution.

See also: docs/migration/docs-migration-updated.md for strategy and target structure.

---

# 0) Quickstart (Daily Flow)

1) Refresh triage dashboard: `bun run docs:triage`
2) Pick 5–10 KEEP items from high‑value clusters
3) For each, follow the Merge Checklist (section 3) end‑to‑end
4) Open a focused PR (canonical + tombstones)
5) Ensure docs CI checks pass (`bun run docs:check`), request review
6) Update keep-files-merge-plan.md tracking table

---

# 1) Roles, Ownership, and Ground Rules

- DRI: Docs Migration Lead (rotates weekly). Backup: Tech Lead.
- One fact = one home. Link to canonical; never duplicate.
- Secrets never in docs. Use gopass and Vercel Project Env only.
- Generated artifacts → `docs/_generated/` with a “Do not edit” banner.
- Every canonical page requires frontmatter: status, owner, last_verified, sources.

Frontmatter schema (copy/paste):

```
---
status: canonical|draft|archived
owner: @github-handle
last_verified: YYYY-MM-DD
sources:
  - https://link-to-official-doc
  - file://prisma/schema.prisma
---
```

---

# 2) Tooling & Commands (current repo)

- `bun run docs:triage`: Classify and regenerate triage dashboard
- `bun run docs:lint`: Markdown lint (markdownlint-cli2)
- `bun run docs:links`: Link check with `.markdown-link-check.json`
- `bun run docs:check`: Runs both lint and links

Planned additions (to be added when tools land):
- `docs:embeddings`, `docs:dedupe`, `docs:exec`, `docs:watch`, `docs:metrics`

References:
- `docs/migration/playbook.md`
- `docs/migration/classification-strategy.md`
- `docs/migration/docs-migration-updated.md`

---

# 3) Merge Checklist (per file)

Follow this sequence for each KEEP/MAYBE file:

1. Read & tag
   - Identify unique current‑stack facts (Next 15, Bun 1.2, Supabase, Prisma, Tailwind 4, Cloudflare DNS, Vercel runtime)
   - Remove/sanitize any secret material
2. Choose target canonical page
   - Use target structure in docs-migration-updated.md
   - Procedures → runbooks; invariants → standards/glossary; configs → doc that owns the SoT
3. Extract net‑new value only
   - Avoid duplication; link to existing anchors
   - Add “Why this is true” source links (official doc, ADR, or SoT file path)
4. Add/update frontmatter on the target page
   - Ensure `owner`, `last_verified: <today>`, and `sources`
5. Integrate content cleanly
   - Use existing headings/anchors; keep sections concise; add examples if helpful
   - Prefer fenced examples with `bash testable` (or language) for future harness
6. Add tombstone to the original
   - `> MERGED: Content integrated into <path>#<anchor> on YYYY-MM-DD`
   - Move legacy file to archive if not already there
7. Validate locally
   - `bun run docs:check` (lint + links)
   - Spot‑check anchors across updated pages
8. Update tracking
   - Edit docs/migration/keep-files-merge-plan.md status table
   - Add a docs line in docs/changelog.md if developer‑facing behavior changed
9. Open PR
   - Title: `docs(migration): merge <topic> into <canonical page>`
   - Include sources and list of tombstoned files

Definition of Done (per merge):
- No duplicated facts; links to SoT present
- Frontmatter complete and `last_verified` set
- Lint + link checks pass
- Tombstone added with anchor to new location
- Tracking table updated

---

# 4) Canonical Pages: Owner Matrix (initial)

These are placeholders; update as maintainers confirm.

| Path | Owner | Status |
|---|---|---|
| docs/architecture.md | @verlyn13 | draft |
| docs/dev/environment.md | @verlyn13 | draft |
| docs/dev/secrets-gopass.md | @verlyn13 | draft |
| docs/dev/database.md | @verlyn13 | draft |
| docs/dev/tools.md | @verlyn13 | draft |
| docs/ops/deploy.md | @verlyn13 | draft |
| docs/ops/cloudflare.md | @verlyn13 | draft |
| docs/api/auth.md | @verlyn13 | draft |
| docs/decisions/adr-0004-vercel-primary.md | @verlyn13 | draft |

Update this table as we finalize ownership and move pages to `status: canonical`.

---

# 5) Author & Reviewer Checklists (copy/paste)

Author (before PR):
- Frontmatter present and correct (status, owner, last_verified, sources)
- Net‑new facts only; link to SoT/ADR for assertions
- Examples added where helpful; fenced with language; `testable` where safe
- `bun run docs:check` passes locally
- Tombstone added to source with anchor

Reviewer (PR):
- One fact = one home honored; no duplication
- Anchors stable and descriptive
- Security posture preserved (no secrets, no inline API keys)
- Sources credible and minimal (official docs or local SoT)
- Changelog updated if behavior changed

---

# 6) Alignment With Project Rules (quick refs)

- Dev server port: `9002` (already configured in `package.json`)
- Biome replaces ESLint/Prettier; prefer `bun run lint` for code files
- Tailwind v4 syntax; avoid `@tailwind` directives; use `@config` and `@import "tailwindcss"`
- Keep `typescript`, `tailwindcss`, `postcss`, `@tailwindcss/postcss` in `dependencies` (Firebase deploy requirement)

---

Fantastic momentum. Here’s a **serious, compute-heavy DocOps plan** to take you from “Phase-2 complete” to “best-in-class docs,” fully aligned to your **single rail** (Cloudflare DNS → Vercel hosting/runtime, Supabase+Prisma, Supabase Auth, Bun/Next.js, gopass local + Vercel Env). It plugs into the tools you already built (classifier + dashboard + CI) and adds automation where it matters: **dedupe, synthesis, fact-checking, command testing, and drift control**.

---

# A) Objectives & success criteria

**Objectives**

1. Merge all **KEEP** content into the canon with **zero duplication**.
2. Convert **MAYBE** into either net-new value or clean archive.
3. Keep docs **provably correct** against official sources and your repo state.
4. Make docs **self-healing** (CI catches drift; bots suggest fixes).

**What “done” looks like**

* 0 conflicting facts across docs (“one fact = one home” holds).
* Every canonical page has a “How to change” + SoT links.
* CI enforces style, links, types, secrets, and **factual drift watchlist**.
* A **DocOps dashboard** shows coverage, freshness, open actions.

---

# B) Workstream 1 — Prioritized merge of KEEP/MAYBE (automation-first)

**1. Upgrade your classifier to “V2” scoring**

* Inputs: current rules + **recency (git)** + **link-graph centrality** + **SoT references**.
* Output fields to add to `out/docs_report.json`:

  * `age_months`, `links_out`, `links_in`, `touches_sot` (boolean when referencing schema.prisma/next.config/tailwind.config/etc.), `dup_cluster_id` (see W2).
* Prioritize merge order by: `value = conf * (1 + touches_sot) * (1 + ln(links_in+1)) / (1+age_months/12)`.

**2. Mechanical merge loop**

* Use `docs/migration/keep-files-merge-plan.md` as the queue of record.
* For each item:

  * Extract **net-new “facts”** (see W2 synthesis) → insert into canonical doc.
  * Leave a **tombstone** in the archived file with the exact anchor link to the new location.
  * Add a minimal, testable example if applicable (see W4).

> Tip: keep PRs **small and topical** (5–10 files) to preserve reviewer quality.

---

# C) Workstream 2 — Compute-assisted dedupe, synthesis, and clustering

**1. Semantic clustering (fast, cheap, local store)**

* Compute embeddings for all `docs/archive/**/*.md` + canon pages.
* Store in **Supabase (pgvector)**; index on `(dup_cluster_id, path)`.
* Cluster by cosine similarity; threshold to flag near-duplicates (`>0.86`) and partial overlaps (`0.78–0.86`).

**2. Automatic “delta extract”**

* For each cluster, diff archived doc → target canon:

  * **Keep only net-new facts** (sentences not semantically present in target).
  * Tag with a **statement ID (SID)** and **source pointer** (file+line).

**3. Synthesis rules**

* Promote **procedures** into runbooks; **invariants** into standards/glossary; **config facts** into the page that owns the SoT and nowhere else.
* Add “Why this is true” links (SoT file, ADR, or official doc URL) to each new paragraph.

---

# D) Workstream 3 — Factual drift watchlist (prevent rot)

Create `tools/fact-watch.json` (hand-curated list; **official sources only**):

* Next.js 15, Bun 1.2, Tailwind v4, Prisma, Supabase, Vercel, Cloudflare DNS docs pages that you cite in canon.
* CI job `docs:watch` runs daily:

  1. Fetch `etag/last-modified` for each URL.
  2. If changed since last capture, open a PR:

     * Add a comment on affected doc sections (SIDs) recommending review.
     * Include a **diff-of-diffs** (cached snapshot vs. new page) to speed validation.

**Policy:** any normative statement that could change (version support, CLI flags, API names) must carry a **source link** and SID.

---

# E) Workstream 4 — Executable docs (make examples provable)

**1. Code-block test harness**

* Add `tools/doc-exec.ts` that:

  * Walks docs, finds fenced blocks with ` ```bash testable ` or ` ```sql testable `, etc.
  * Executes in CI with sandboxed env: **no network** unless `allow-net` tag present.
  * Supports `DRY_RUN` commands (e.g., `prisma migrate status --preview-feature`), and validates exit code/regex output.

**2. Config parsers**

* Parse all embedded JSON/TOML/YAML snippets in canon to ensure they are syntactically valid (`jq`, `toml.parse`, `yaml-lint`).

**3. Link & anchor checker (strict)**

* You already have `markdownlint`/`markdown-link-check`; enable **anchored headings** (fail on broken `#anchors` across pages).

---

# F) Workstream 5 — Editorial excellence (fast human passes)

**1. Vale (style linter)**

* Add `vale.ini` with rules: headings, imperative titles, active voice, “don’t anthropomorphize services,” consistent term list (Glossary SoT).
* Fail PR if **critical** rules trip; warn on stylistic ones.

**2. Patterns & templates**

* Enforce doc templates for: runbook, standard, ADR, API page, user guide.
* Add **frontmatter** to all pages:

  * `status: canonical|draft|archived`, `owner`, `last_verified`, `sources: [urls]`.

**3. Review checklists**

* Each doc type has a 6–10 line reviewer checklist (facts sourced? examples runnable? anchors stable?).

---

# G) Workstream 6 — Metrics & dashboards

**DocOps dashboard** (rendered from JSON in CI to Markdown and a simple HTML):

* Coverage: % of canon pages with `last_verified <= 90 days`.
* Dedupe: # clusters merged / remaining.
* Testability: #/total testable code blocks passing.
* Drift: # watchlist URLs changed awaiting review.
* Secrets: flags by type (should be 0 true positives).

---

# H) Two-week execution schedule (high-throughput)

**Week 1**

* W2 embeddings+clustering; W3 watchlist skeleton; W4 harness MVP; W5 Vale baseline.
* Merge 6–10 **high-value clusters** (auth/security, db-api).
* Lightly tag 30–40 docs with SIDs + sources.

**Week 2**

* Expand harness to SQL/HTTP examples; turn on strict link anchors.
* Merge 30–40 more KEEP docs (now that clusters exist, merges accelerate).
* Enable daily **watch** CI + DocOps dashboard; add “last\_verified” to top canon pages.

> After Week 2, remaining merges are mostly mechanical and can continue in parallel with normal work.

---

# I) CI wiring (jobs to add/ensure)

* `docs:classify` + `docs:dashboard` (already there).
* `docs:embeddings` (compute + cluster IDs).
* `docs:dedupe` (emit merge suggestions + deltas).
* `docs:exec` (run testable code fences).
* `docs:lint` (markdownlint + Vale).
* `docs:links` (strict anchors).
* `docs:watch` (factual drift watchlist + PR bot).
* `docs:metrics` (export dashboard JSON/MD).

All jobs **read-only** on prod resources; anything that could write uses **DRY\_RUN** or targets a **throwaway DB/schema**.

---

# J) Concrete “next 10 commands” to kick this off

```bash
# 1) Add frontmatter + SIDs to canon (one quick pass)
bun tools/doc-classifier.ts --annotate-sids --root docs

# 2) Compute embeddings + clusters
bun tools/doc-embeddings.ts --in docs --out out/embeddings.json
bun tools/doc-dedupe.ts --in out/embeddings.json --out out/clusters.json

# 3) Generate merge suggestions per cluster
bun tools/doc-dedupe.ts --suggest --clusters out/clusters.json --report out/merge_suggestions.md

# 4) Turn on strict link/anchor checks
npx -y markdown-link-check "docs/**/*.md" -q
bun run docs:lint

# 5) Run testable code fences (MVP)
bun tools/doc-exec.ts --root docs --tags testable

# 6) Seed watchlist (official URLs only; one JSON file)
echo '{ "sources": [/* add Next.js, Vercel, Supabase, Prisma, Tailwind, Bun docs URLs */] }' > tools/fact-watch.json

# 7) Wire CI jobs in .github/workflows/docops.yml (parallelize where safe)
git add . && git commit -m "docops: clustering + exec harness + watchlist"
```

---

# K) Risks & mitigations

* **False dedupe (semantic near-misses):** keep a **human confirm** step; never delete—archive with tombstones.
* **Command execution hazards:** default to **DRY\_RUN**, no network, or a disposable test DB/schema; whitelist commands.
* **Factual drift noise:** keep watchlist tight (official pages only); require at least `etag`/`last-modified` changes before PRs trigger.
* **Style fatigue:** let Vale block only critical rules; warn on the rest.

---

# L) Governance (to keep it world-class)

* Every doc must list: **owner**, **status**, **last\_verified**, and **sources**.
* Docs without an owner or last\_verified older than 90 days get a **bot ping** weekly.
* Changes to stack or platform require an **ADR** and an update to **Config Registry** and at least one affected canonical doc.

---

If you want, I can draft the minimal Bun stubs for:

* `tools/doc-embeddings.ts` (Supabase pgvector writer),
* `tools/doc-dedupe.ts` (cluster+delta report),
* `tools/doc-exec.ts` (testable code fences),
* `tools/docs-metrics.ts` (dashboard JSON).

But the plan above is ready to run with your existing structure—switch on the new jobs, seed the watchlist, and start merging **by cluster**.
