Great call. We’ll **keep** VS Code, Claude, and Codex configs—but bring them onto the same rail, document them, and validate them in CI so they don’t drift or leak secrets.

---

# What changes in the config-audit plan

## 1) Treat DX configs as “Keep (documented)”

Add these rows to your **Config Registry** (`docs/dev/config-registry.md`) and link them from `docs/README.md` → “Developer tools”.

| File / Area               | Status                  | Owner | Doc Home (canonical)       | Notes                                                                 |
| ------------------------- | ----------------------- | ----- | -------------------------- | --------------------------------------------------------------------- |
| `.vscode/settings.json`   | **Keep**                | Eng   | `docs/dev/tools.md#vscode` | Workspace-only settings; no user-specific paths.                      |
| `.vscode/extensions.json` | **Keep**                | Eng   | `docs/dev/tools.md#vscode` | Recommended extensions list (see below).                              |
| `.vscode/tasks.json`      | **Keep**                | Eng   | `docs/dev/tools.md#vscode` | Use **Bun** tasks (`docs:triage`, `docs:lint`, etc.).                 |
| `CLAUDE.md`               | **Keep (living guide)** | Eng   | `docs/dev/tools.md#claude` | Process guide; no secrets. Link to MCP policy.                        |
| `.mcp.json`               | **Keep**                | Eng   | `docs/dev/tools.md#mcp`    | Server allowlist + filesystem sandbox (no secrets/`docs/_generated`). |
| `codex.toml`              | **Keep**                | Eng   | `docs/dev/tools.md#codex`  | Role profiles, allowed commands (Bun scripts only).                   |

> Create `docs/dev/tools.md` if it doesn’t exist; it’s the canonical home for DX tooling.

---

## 2) Guardrails (CI) for DX configs

Extend your `config-audit` workflow:

* **Syntax checks**

  * `jq . .vscode/settings.json`
  * `jq . .vscode/extensions.json`
  * `jq . .vscode/tasks.json` (VS Code tasks are JSON)
  * `bun -e "import toml from 'toml'; import {readFileSync as r} from 'fs'; toml.parse(r('codex.toml','utf8'))"`
  * `jq . .mcp.json`

* **Policy checks**

  * **No secrets** patterns in `.vscode/*`, `CLAUDE.md`, `.mcp.json`, `codex.toml` (`DATABASE_URL=`, `SUPABASE_`, `AKIA`, `-----BEGIN`).
  * **Allowed commands** in `codex.toml`/`.mcp.json` limited to Bun scripts you already have: `docs:triage`, `docs:classify`, `docs:dashboard`, `docs:lint`, `prisma:generate`, `prisma:migrate:deploy`.
  * **Filesystem allowlist** in `.mcp.json`: read-only access to `docs/`, `scripts/`, `tools/`; **deny** `.env*`, `docs/_generated/`, `node_modules/`, `prisma/migrations/*` writes.

Add these two quick scripts:

```bash
# scripts/check-dx-syntax.sh
set -euo pipefail
jq . .vscode/settings.json >/dev/null 2>&1
jq . .vscode/extensions.json >/dev/null 2>&1
[ -f .vscode/tasks.json ] && jq . .vscode/tasks.json >/dev/null 2>&1 || true
jq . .mcp.json >/dev/null 2>&1
bun -e 'import toml from "toml";import {readFileSync as r} from "fs"; toml.parse(r("codex.toml","utf8"))' >/dev/null 2>&1 || { echo "codex.toml invalid"; exit 1; }
echo "✅ DX syntax OK"
```

```bash
# scripts/check-dx-policy.sh
set -euo pipefail
# forbid common secret patterns in DX configs
rg -n -i --glob ".vscode/**" --glob "CLAUDE.md" --glob ".mcp.json" --glob "codex.toml" \
  '(DATABASE_URL|SUPABASE_[A-Z0-9_]+|AKIA[0-9A-Z]{16}|-----BEGIN (RSA|OPENSSH|PRIVATE KEY)-----)' && {
  echo "❌ Potential secret in DX configs"; exit 1; } || echo "✅ No secrets in DX configs"

# require allowed commands only (adjust list as needed)
ALLOWED='docs:(triage|classify|dashboard|lint)|prisma:(generate|migrate:deploy)'
rg -n --glob ".mcp.json" --glob "codex.toml" -i 'bun (run )?([a-z:-]+)' | awk '{print $0}' | while read -r line; do
  cmd=$(echo "$line" | sed -n 's/.*bun \(run \)\?\([a-z0-9:-]\+\).*/\2/p')
  [[ "$cmd" =~ ^($ALLOWED)$ ]] || { echo "❌ Disallowed command in DX config: $cmd"; exit 1; }
done
echo "✅ DX policy OK"
```

And wire them into your GH Action after the existing checks:

```yaml
- run: bash scripts/check-dx-syntax.sh
- run: bash scripts/check-dx-policy.sh
```

---

## 3) Minimal, safe **recommended** VS Code setup

**`.vscode/extensions.json`**

```json
{
  "recommendations": [
    "biomejs.biome",
    "bradlc.vscode-tailwindcss",
    "prisma.prisma",
    "esbenp.prettier-vscode",        // optional; disable format-on-save if using Biome
    "streetsidesoftware.code-spell-checker",
    "dbaeumer.vscode-eslint"         // optional if some deps still use ESLint
  ]
}
```

**`.vscode/settings.json`**

```json
{
  "editor.formatOnSave": true,
  "files.eol": "\n",
  "biome.enabled": true,
  "editor.defaultFormatter": "biomejs.biome",
  "tailwindCSS.experimental.classRegex": [["class\\Name\\(([^)]*)\\)", "[`'\"`]([^`'\"`]*)[`'\"`]"]],
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.preferences.importModuleSpecifier": "non-relative",
  "prisma.format": true,
  // DX hygiene
  "search.exclude": { "node_modules": true, ".next": true, "dist": true, "docs/_generated": true },
  "files.watcherExclude": { "**/.next/**": true, "**/node_modules/**": true }
}
```

**`.vscode/tasks.json`**

```json
{
  "version": "2.0.0",
  "tasks": [
    { "label": "Docs: Triage", "type": "shell", "command": "bun run docs:triage", "problemMatcher": [] },
    { "label": "Docs: Lint",   "type": "shell", "command": "bun run docs:lint",   "problemMatcher": [] },
    { "label": "DB: Generate", "type": "shell", "command": "bun run prisma:generate", "problemMatcher": [] }
  ]
}
```

> If you keep Prettier around for legacy, set `"editor.defaultFormatter": "biomejs.biome"` and disable Prettier’s format-on-save at the workspace level to avoid fights.

---

## 4) Claude / MCP / Codex alignment

* **CLAUDE.md** remains a **living guide** (keep), but it must:

  * Point to canonical docs (`docs/…`), not archived paths.
  * List allowed Bun commands (same allowlist as CI).
  * State “no secrets in prompts or files” and link to `dev/secrets-gopass.md`.

* **`.mcp.json`** (servers & tools):

  * **Filesystem scope**: read-only access to `docs/`, `tools/`, `scripts/`, plus `prisma/schema.prisma`; deny `.env*`, `docs/_generated/`, `node_modules/`.
  * **Commands**: map tools to the **allowed Bun scripts** only.
  * Add comments/fields that reference `docs/dev/tools.md#mcp`.

* **`codex.toml`** (roles & commands):

  * Update role profiles to reflect your **Vercel-primary** rail and **Supabase Auth + Prisma** story.
  * Ensure `commands = ["bun run docs:triage", "bun run docs:lint", ...]` only from the allowlist.
  * Include a note: “Changes to codex roles must link to an ADR when they affect stack choices.”

---

## 5) Workflow placement (end of Phase 2)

* Finish merging **KEEP** docs → then update `.vscode/*`, `CLAUDE.md`, `.mcp.json`, `codex.toml` to point at the **final doc locations** (avoid churn).
* Add `docs/dev/tools.md` with short sections for VS Code, Claude/MCP, Codex (copy the settings/allowlists above).
* Enable the two new CI checks.
* Log the DX changes in `docs/changelog.md`.

---

### Quick checklist

* [ ] Add registry rows for `.vscode/*`, `CLAUDE.md`, `.mcp.json`, `codex.toml`.
* [ ] Create `docs/dev/tools.md` and populate VS Code + Claude/MCP + Codex sections.
* [ ] Drop in the **extensions/settings/tasks** snippets (tweak as needed).
* [ ] Wire **`check-dx-syntax.sh`** and **`check-dx-policy.sh`** into CI.
* [ ] Ensure allowlists include only Bun scripts you’ve defined.
* [ ] Verify no secrets patterns appear in DX configs.

This keeps all three DX surfaces **kept, updated, and safe**—fully consistent with your stack and the Phase-2 workflow.
