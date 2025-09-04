Great call. Pure Markdown can’t “load” JSON dynamically, so the practical approach is: **generate** a Markdown dashboard from `out/docs_report.json` whenever you run the classifier. Here’s a tiny Bun script that builds a triage dashboard (`docs/triage-dashboard.md`) with:

* per-file rows (filename → category, confidence, flags, value score),
* copy-pasteable `git mv` suggestions,
* collapsible sections for each category,
* optional filters (only KEEP/MAYBE, only items with secrets flags, min confidence, etc.).

---

# 1) Script — `tools/docs-dashboard.ts`

```ts
#!/usr/bin/env bun
/**
 * Generate a Markdown triage dashboard from out/docs_report.json
 *
 * Usage:
 *   bun tools/docs-dashboard.ts \
 *     --in out/docs_report.json \
 *     --out docs/triage-dashboard.md \
 *     [--min-confidence 5] [--only keep,maybe] [--flags secret] [--limit 200]
 *
 * Typical:
 *   bun tools/docs-dashboard.ts --in out/docs_report.json --out docs/triage-dashboard.md
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

type Row = {
  file_path: string;
  category_primary: string | null;
  confidence_primary: number;
  category_secondary?: string | null;
  confidence_secondary?: number;
  flags: string[];
  value_score: "keep" | "maybe" | "archive";
  action: string; // e.g., move:docs/dev/foo.md | archive | quarantine | review
  proposed_dest?: string;
  mtime_iso: string;
  months_old: number;
  size_bytes: number;
};

const args = new Map<string, string | boolean>();
for (let i = 2; i < process.argv.length; i++) {
  const a = process.argv[i];
  if (a.startsWith("--")) {
    const [k, v] = a.split("=");
    if (v !== undefined) args.set(k, v);
    else {
      const next = process.argv[i + 1];
      if (next && !next.startsWith("--")) { args.set(a, next); i++; }
      else args.set(a, true);
    }
  }
}

const input = String(args.get("--in") ?? "out/docs_report.json");
const output = String(args.get("--out") ?? "docs/triage-dashboard.md");
const minConf = Number(args.get("--min-confidence") ?? 0);
const onlyVals = String(args.get("--only") ?? "").split(",").map(s => s.trim()).filter(Boolean);
const flagFilter = String(args.get("--flags") ?? "").toLowerCase();
const limit = Number(args.get("--limit") ?? 0);

if (!existsSync(input)) {
  console.error(`Input JSON not found: ${input}`);
  process.exit(1);
}

const data: Row[] = JSON.parse(readFileSync(input, "utf8"));

function valueFilter(r: Row) {
  if (onlyVals.length && !onlyVals.includes(r.value_score)) return false;
  if (r.confidence_primary < minConf) return false;
  if (flagFilter) {
    const has = r.flags.some(f => f.toLowerCase().includes(flagFilter));
    if (!has) return false;
  }
  return true;
}

// group by primary category for collapsible sections
const groups = new Map<string, Row[]>();
for (const r of data.filter(valueFilter)) {
  const key = r.category_primary ?? "uncategorized";
  if (!groups.has(key)) groups.set(key, []);
  groups.get(key)!.push(r);
}

// sort within groups by confidence desc, then file name
for (const [k, arr] of groups) {
  arr.sort((a, b) => {
    if (b.confidence_primary !== a.confidence_primary) return b.confidence_primary - a.confidence_primary;
    return a.file_path.localeCompare(b.file_path);
  });
  if (limit > 0 && arr.length > limit) groups.set(k, arr.slice(0, limit));
}

// Markdown helpers
const esc = (s: string) => s.replace(/\|/g, "\\|");
const code = (s: string) => "`" + s + "`";

function renderRow(r: Row): string {
  const mv = r.proposed_dest && r.action.startsWith("move")
    ? `mkdir -p ${r.proposed_dest.split("/").slice(0, -1).join("/")}; git mv "${r.file_path}" "${r.proposed_dest}"`
    : "";
  const actionShort = r.action.startsWith("move:") ? "move" : r.action;

  return [
    esc(r.file_path),
    esc(r.category_primary ?? ""),
    r.confidence_primary,
    esc(r.value_score),
    esc(r.flags.join(",")),
    esc(r.proposed_dest ?? ""),
    code(mv || "")
  ].join(" | ");
}

function renderTable(rows: Row[]): string {
  const header = [
    "File", "Primary", "Conf", "Value", "Flags", "Proposed Path", "Command"
  ].join(" | ");
  const sep = ["---","---","---:","---","---","---","---"].join(" | ");
  const body = rows.map(renderRow).join("\n");
  return `${header}\n${sep}\n${body}\n`;
}

// Summary counts
let total = 0, keep = 0, maybe = 0, archive = 0, secrets = 0, quarantine = 0;
for (const r of data) {
  total++;
  if (r.value_score === "keep") keep++;
  else if (r.value_score === "maybe") maybe++;
  else archive++;
  if (r.flags.some(f => f.toLowerCase().includes("private-key") || f.toLowerCase().includes("secret") || f.toLowerCase().includes("db-url") || f.toLowerCase().includes("jwt"))) secrets++;
  if (r.action === "quarantine") quarantine++;
}

// Render Markdown
let md = `# Documentation Triage Dashboard

**Source:** ${input}

**Summary**
- Total scanned: **${total}**
- KEEP: **${keep}** · MAYBE: **${maybe}** · ARCHIVE: **${archive}**
- Files with secret flags: **${secrets}**
- Quarantine: **${quarantine}**

**Filters applied in this view**
- min confidence: \`${minConf}\`
- only values: \`${onlyVals.join(", ") || "—"}\`
- flag filter: \`${flagFilter || "—"}\`
- per-group limit: \`${limit || "∞"}\`

> Tip: Copy a line from the **Command** column to move a file. Run “batch moves” by selecting multiple commands.

`;

const cats = Array.from(groups.keys()).sort();
for (const cat of cats) {
  const rows = groups.get(cat)!;
  md += `\n<details open>\n<summary><strong>${cat}</strong> — ${rows.length} files</summary>\n\n`;
  md += renderTable(rows);
  md += `\n</details>\n`;
}

// write file
const dir = dirname(output);
if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
writeFileSync(output, md, "utf8");

console.log(`Wrote ${output}`);
```

---

# 2) Add a script to `package.json`

```json
{
  "scripts": {
    "docs:classify": "bun tools/doc-classifier.ts --rules tools/rules.example.json --root . --out-json out/docs_report.json --out-csv out/docs_report.csv --print-mv --dry-run",
    "docs:dashboard": "bun tools/docs-dashboard.ts --in out/docs_report.json --out docs/triage-dashboard.md"
  }
}
```

Run this flow:

```bash
# 1) classify (dry run; inspect proposed moves)
bun run docs:classify

# 2) generate the dashboard markdown
bun run docs:dashboard

# 3) open docs/triage-dashboard.md in your editor/GitHub to triage
```

---

# 3) What the generated dashboard looks like

Top summary + collapsible sections (one per primary category). Each section has a GitHub-friendly Markdown table:

```
# Documentation Triage Dashboard

**Source:** out/docs_report.json

**Summary**
- Total scanned: **1037**
- KEEP: **312** · MAYBE: **421** · ARCHIVE: **304**
- Files with secret flags: **9**
- Quarantine: **2**

**Filters applied in this view**
- min confidence: `0`
- only values: `—`
- flag filter: `—`
- per-group limit: `∞`

<details open>
<summary><strong>db-api</strong> — 188 files</summary>

File | Primary | Conf | Value | Flags | Proposed Path | Command
--- | --- | ---: | --- | --- | --- | ---
docs/archive/2023/prisma-notes.md | db-api | 11 | keep |  | docs/api/prisma-notes.md | `mkdir -p docs/api; git mv "docs/archive/2023/prisma-notes.md" "docs/api/prisma-notes.md"`
docs/notes/supabase-policies.md | db-api | 10 | maybe |  | docs/api/supabase-policies.md | `mkdir -p docs/api; git mv "docs/notes/supabase-policies.md" "docs/api/supabase-policies.md"`

</details>

<details open>
<summary><strong>legacy-archive</strong> — 142 files</summary>

File | Primary | Conf | Value | Flags | Proposed Path | Command
--- | --- | ---: | --- | --- | --- | ---
docs/misc/firebase-auth-flow.md | legacy-archive | 12 | archive |  | docs/archive/firebase-auth-flow.md | `mkdir -p docs/archive; git mv "docs/misc/firebase-auth-flow.md" "docs/archive/firebase-auth-flow.md"`

</details>
```

* The **Command** column gives you a one-liner to create the target directory and `git mv` the file.
* Use the script flags for “interactive” variants:

  * `--min-confidence 6` (show only strong matches)
  * `--only keep,maybe`
  * `--flags secret` (review only secret-flagged files)
  * `--limit 100` (cap rows per category to keep it readable)

---

# 4) (Optional) CI refresh

Add a tiny GitHub Action to refresh the dashboard whenever `out/docs_report.json` changes:

```yaml
# .github/workflows/docs-triage.yml
name: Docs Triage Dashboard
on:
  push:
    paths:
      - "out/docs_report.json"
      - "tools/**"
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
        with: { bun-version: "1.2.21" }
      - run: bun install || true
      - run: bun tools/docs-dashboard.ts --in out/docs_report.json --out docs/triage-dashboard.md
      - name: Commit dashboard
        run: |
          git config user.name "docs-bot"
          git config user.email "docs-bot@example.com"
          git add docs/triage-dashboard.md
          git commit -m "chore(docs): refresh triage dashboard" || echo "No changes"
          git push || true
```

---

This gives you a **repeatable, lightweight triage UI** that lives right in your repo, plays nicely with GitHub/GitLab renderers, and keeps the “move commands” one click away.
