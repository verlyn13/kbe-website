Here’s a compact **Bun CLI** It:

* reads a **rules JSON** (or uses built-ins),
* walks the repo (skipping `.git`, `node_modules`, etc.),
* classifies each doc with scores + flags,
* outputs **JSON** and **CSV** reports,
* and proposes **`git mv` destinations** that match the docs tree we designed.

---

# 1) File: `tools/doc-classifier.ts`

```ts
#!/usr/bin/env bun
/**
 * Doc Classifier (Bun 1.2.21+)
 * - Ingests JSON rules (or uses defaults)
 * - Walks repo, classifies files via regex + metadata
 * - Emits JSON + CSV reports
 * - Proposes `git mv` destinations for KEEP items
 *
 * Usage:
 *   bun tools/doc-classifier.ts \
 *     --rules rules.json \
 *     --out-json out/docs_report.json \
 *     --out-csv out/docs_report.csv \
 *     --root . \
 *     --print-mv \
 *     --dry-run
 */

import { readdirSync, statSync, readFileSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join, extname, relative, dirname, sep } from "node:path";

// ---------- Types ----------
type RuleSet = {
  weights: {
    strong: number; normal: number; weak: number;
    age_bonus: number; age_penalty: number;
    current_bonus_each: number; current_bonus_cap: number;
    legacy_penalty: number;
  };
  current_stack: string[];         // regex strings
  categories: Array<{
    name: string;
    patterns: string[];            // regex strings
    weight: number[];              // per-pattern weights
  }>;
  flags: { [flagName: string]: string[] }; // regex strings
};

type FileResult = {
  file_path: string;
  size_bytes: number;
  mtime_iso: string;
  months_old: number;

  category_primary: string | null;
  confidence_primary: number;
  category_secondary?: string | null;
  confidence_secondary?: number;

  flags: string[];
  confidence_breakdown: Record<string, number>;
  current_stack_hits: string[];
  legacy_penalty_applied: boolean;

  value_score: "keep" | "maybe" | "archive";
  action: string; // e.g., move:<dest>, archive, quarantine, review
  proposed_dest?: string;
};

// ---------- Defaults (you can tweak or supply --rules) ----------
const defaultRules: RuleSet = {
  weights: {
    strong: 5, normal: 3, weak: 1,
    age_bonus: 2, age_penalty: -2,
    current_bonus_each: 1, current_bonus_cap: 3,
    legacy_penalty: -2,
  },
  current_stack: [
    "Next\\.js\\s*15", "Tailwind\\s*4", "Bun\\s*1\\.2\\.", "Prisma", "Supabase", "Cloudflare", "gopass"
  ],
  categories: [
    { name: "architecture", patterns: ["(?i)^#\\s*ADR\\b", "(?i)\\bContext\\b.*\\bDecision\\b.*\\bConsequences\\b", "(?i)\\bdiagram\\b|\\bmermaid\\b|\\bC4 model\\b"], weight: [5,5,3] },
    { name: "ops-runbook", patterns: ["(?i)\\brunbook\\b|\\bpostmortem\\b|\\bincident\\b", "(?i)\\brollback\\b|\\brestore\\b|\\bplaybook\\b|\\bon[-\\s]?call\\b", "(?m)^\\s*[-*]?\\s*(Step\\s*\\d+|Check|Restart|Verify|Tail|kubectl|supabase\\s+.*logs|bunx?\\s)"], weight: [5,3,3] },
    { name: "deploy-infra", patterns: ["(?i)cloudflare|CNAME|Zero\\s?Trust|Workers?|KV|R2", "(?i)DNS|TLS|SSL", "(?m)^\\s*name:\\s.*\\n.*^\\s*on:\\s"], weight: [5,3,5] },
    { name: "auth-security", patterns: ["(?i)auth|oauth|OIDC|JWT|session", "(?i)@supabase/(auth|supabase-js)|supabase\\.auth", "(?i)gopass|pass-store|GnuPG"], weight: [5,5,3] },
    { name: "db-api", patterns: ["(?i)prisma|schema\\.prisma|migration", "(?i)create table|alter table|policy|RLS", "(?i)openapi|swagger|endpoint|curl\\s+-X"], weight: [5,5,3] },
    { name: "dev-setup", patterns: ["(?i)setup|installation|prereq|local dev", "(?i)bun|pnpm|brew", "(?m)^[A-Z0-9_]+="], weight: [5,3,3] },
    { name: "user-docs", patterns: ["(?i)onboarding|user guide|walkthrough|tutorial|how[-\\s]?to|FAQ", "(?i)click|navigate|profile|settings|dashboard"], weight: [5,3] },
    { name: "legacy-archive", patterns: ["(?i)firebase( blaze| hosting| auth| firestore)?", "(?i)vercel(?!.*supabase)", "(?i)Google Cloud Console|\\bGCP\\b|App Engine"], weight: [5,3,3] },
    { name: "junk-scratch", patterns: ["(?i)\\bTODO\\b|\\bWIP\\b|\\bdraft\\b|\\bnotes?\\b|\\bmeeting\\b|\\brandom\\b|\\btemp\\b"], weight: [3] }
  ],
  flags: {
    "flag:secret-terms": ["(?i)(secret|password|passphrase|api[_-]?key|client[_-]?secret|service[_-]?role[_-]?key)"],
    "flag:db-url": ["(?i)postgres(?:ql)?://[^\\s]+"],
    "flag:aws-key": ["(?i)AKIA[0-9A-Z]{16}"],
    "flag:jwt": ["(?i)eyJ[a-zA-Z0-9_=-]{10,}"],
    "flag:env-inline": ["(?i)NEXT_.*=|DATABASE_URL=|SUPABASE_.*="],
    "flag:private-key": ["-----BEGIN (RSA|OPENSSH|PRIVATE KEY)-----"]
  }
};

// precedence to break ties
const PRECEDENCE = [
  "architecture", "ops-runbook", "deploy-infra", "auth-security", "db-api",
  "dev-setup", "user-docs", "legacy-archive", "junk-scratch"
];

const IGNORE_DIRS = new Set([
  ".git", "node_modules", ".next", ".vercel", "dist", "build", ".turbo",
  ".idea", ".vscode", ".pnpm-store", "out", "coverage", "docs/_generated"
]);

// ---------- CLI args ----------
const argv = new Map<string, string | boolean>();
for (let i = 2; i < process.argv.length; i++) {
  const a = process.argv[i];
  if (a.startsWith("--")) {
    const [k, v] = a.split("=");
    if (v !== undefined) argv.set(k, v);
    else {
      const next = process.argv[i + 1];
      if (next && !next.startsWith("--")) { argv.set(a, next); i++; }
      else argv.set(a, true);
    }
  }
}
const root = String(argv.get("--root") ?? ".");
const rulesPath = argv.get("--rules") ? String(argv.get("--rules")) : "";
const outJson = String(argv.get("--out-json") ?? "out/docs_report.json");
const outCsv  = String(argv.get("--out-csv")  ?? "out/docs_report.csv");
const printMv = Boolean(argv.get("--print-mv") ?? false);
const dryRun  = Boolean(argv.get("--dry-run")  ?? false);

// ---------- Helpers ----------
function ensureDirFor(filePath: string) {
  const dir = dirname(filePath);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}
function isLikelyBinary(buf: Buffer) {
  // crude: detect NUL bytes
  const len = Math.min(buf.length, 2048);
  for (let i = 0; i < len; i++) if (buf[i] === 0) return true;
  return false;
}
function monthsBetween(d: Date, now: Date) {
  const years = now.getFullYear() - d.getFullYear();
  const months = years * 12 + (now.getMonth() - d.getMonth());
  return Math.max(0, months);
}
function compileRegs(rx: string[]) { return rx.map(s => new RegExp(s, "m")); }
function safeReadText(fp: string): string | null {
  try {
    const buf = readFileSync(fp);
    if (isLikelyBinary(buf)) return null;
    return buf.toString("utf8");
  } catch { return null; }
}
function walkDir(dir: string, out: string[] = [], base = dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) {
      if (IGNORE_DIRS.has(entry.name)) continue;
    }
    const p = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (IGNORE_DIRS.has(entry.name)) continue;
      walkDir(p, out, base);
    } else {
      out.push(p);
    }
  }
  return out;
}

// map categories to destination folders (matching earlier plan)
function proposeDestination(file: string, category: string): string {
  const baseName = file.split(sep).pop() || "untitled.md";
  const lower = baseName.toLowerCase();

  switch (category) {
    case "architecture":
      // ADR? -> decisions/, else architecture/
      if (/^adr[-_ ]?\d+/.test(lower)) return join("docs", "decisions", baseName);
      return join("docs", "architecture", baseName);
    case "ops-runbook":
      return join("docs", "ops", "runbooks", baseName);
    case "deploy-infra":
      return join("docs", "ops", baseName);
    case "auth-security":
      // funnel into API/auth intake
      return join("docs", "api", "_intake_auth", baseName);
    case "db-api":
      return join("docs", "api", baseName);
    case "dev-setup":
      return join("docs", "dev", baseName);
    case "user-docs":
      return join("docs", "user", "guides", baseName);
    case "legacy-archive":
      return join("docs", "archive", baseName);
    case "junk-scratch":
      return join("docs", "migration", "triage", baseName);
    default:
      return join("docs", "migration", "triage", baseName);
  }
}

function evalValueScore(
  cat: string,
  monthsOld: number,
  hasCurrentHits: boolean
): "keep" | "maybe" | "archive" {
  const core = new Set(["architecture","ops-runbook","deploy-infra","auth-security","db-api"]);
  if (core.has(cat) && (monthsOld < 24 || hasCurrentHits)) return "keep";
  if (cat === "legacy-archive" && !hasCurrentHits) return "archive";
  if (cat === "junk-scratch") return "archive";
  return "maybe";
}

function toCsvRow(fr: FileResult): string {
  const esc = (s: any) => `"${String(s ?? "").replace(/"/g, '""')}"`;
  const sec = fr.category_secondary ?? "";
  const secC = fr.confidence_secondary ?? "";
  const flags = fr.flags.join("|");
  const dest = fr.proposed_dest ?? "";
  const bd = JSON.stringify(fr.confidence_breakdown);
  const curHits = fr.current_stack_hits.join("|");
  return [
    fr.file_path, fr.category_primary ?? "", fr.confidence_primary,
    sec, secC, flags, fr.value_score, fr.action, dest,
    fr.mtime_iso, fr.months_old, fr.size_bytes, curHits, bd
  ].map(esc).join(",");
}

// ---------- Load rules ----------
const rules: RuleSet = (() => {
  if (rulesPath) {
    const txt = readFileSync(rulesPath, "utf8");
    return JSON.parse(txt);
  }
  return defaultRules;
})();

const currentRegs = compileRegs(rules.current_stack);
const flagRegs: Array<[string, RegExp[]]> = Object.entries(rules.flags)
  .map(([name, arr]) => [name, compileRegs(arr)] as [string, RegExp[]]);

const catRegs = rules.categories.map(c => ({
  name: c.name,
  regs: compileRegs(c.patterns),
  weights: c.weight
}));

// ---------- Main ----------
(async function main() {
  const now = new Date();
  const files = walkDir(root).filter(p => {
    const rel = relative(root, p);
    // ignore our own outputs & non-doc heavy extensions
    if (rel.startsWith("out/")) return false;
    const ext = extname(p).toLowerCase();
    // we still scan most text-like files; skip obvious binaries
    if ([".png",".jpg",".jpeg",".gif",".webp",".ico",".pdf",".ttf",".otf",".woff",".woff2",".zip",".gz"].includes(ext)) return false;
    return true;
  });

  const results: FileResult[] = [];

  for (const fp of files) {
    let content = safeReadText(fp);
    if (content === null) continue; // binary-ish
    const st = statSync(fp);
    const monthsOld = monthsBetween(st.mtime, now);

    // Flags (secrets, etc.)
    const flags: string[] = [];
    for (const [fname, regs] of flagRegs) {
      for (const r of regs) {
        if (r.test(content) || r.test(fp)) { flags.push(fname); break; }
      }
    }

    // Category scoring
    const breakdown: Record<string, number> = {};
    for (const c of catRegs) {
      let score = 0;
      c.regs.forEach((r, idx) => {
        if (r.test(content) || r.test(fp)) {
          score += c.weights[idx] ?? rules.weights.normal;
        }
      });
      if (score > 0) breakdown[c.name] = score;
    }

    // Age bonus / penalty
    const ageAdj = monthsOld < 24 ? rules.weights.age_bonus
                 : monthsOld >= 36 ? rules.weights.age_penalty
                 : 0;
    if (ageAdj !== 0) {
      for (const k of Object.keys(breakdown)) breakdown[k] += ageAdj;
    }

    // Current stack bonus
    const curHits: string[] = [];
    let curBonus = 0;
    for (const r of currentRegs) {
      if (r.test(content)) {
        curHits.push(r.source);
        curBonus += rules.weights.current_bonus_each;
        if (curBonus >= rules.weights.current_bonus_cap) break;
      }
    }
    if (curBonus > 0) {
      for (const k of Object.keys(breakdown)) breakdown[k] += curBonus;
    }

    // Legacy penalty (only when legacy matched and NOT alongside Supabase/Prisma/Bun/etc.)
    const legacyMatched = /(?i)firebase|firestore|vercel(?!.*supabase)/m.test(content);
    const hasCurrent = curHits.length > 0;
    let legacyPenaltyApplied = false;
    if (legacyMatched && !hasCurrent) {
      for (const k of Object.keys(breakdown)) breakdown[k] += rules.weights.legacy_penalty;
      legacyPenaltyApplied = true;
    }

    // Choose primary/secondary with precedence and tie-breaking
    const entries = Object.entries(breakdown).sort((a,b) => {
      if (b[1] !== a[1]) return b[1] - a[1];
      // tie -> precedence
      const pa = PRECEDENCE.indexOf(a[0]);
      const pb = PRECEDENCE.indexOf(b[0]);
      return pa - pb;
    });
    const primary = entries[0]?.[0] ?? null;
    const primaryScore = entries[0]?.[1] ?? 0;
    let secondary: string | null = null;
    let secondaryScore = 0;
    if (entries.length > 1) {
      const cand = entries[1];
      if (cand[1] >= primaryScore * 0.8) {
        secondary = cand[0]; secondaryScore = cand[1];
      }
    }

    // Determine action/value/destination
    let action = "review";
    let proposed: string | undefined;
    let value: "keep" | "maybe" | "archive" = "maybe";

    const hasPrivateKey = flags.includes("flag:private-key");
    if (hasPrivateKey) {
      action = "quarantine";
    } else if (primary) {
      const keepMaybeArchive = evalValueScore(primary, monthsOld, hasCurrent);
      value = keepMaybeArchive;

      if (primary === "legacy-archive" && value !== "keep") {
        action = "archive";
        proposed = proposeDestination(fp, "legacy-archive");
      } else if (primary === "junk-scratch" && value === "archive") {
        action = "archive";
        proposed = proposeDestination(fp, "junk-scratch");
      } else {
        if (value === "keep" || value === "maybe") {
          action = `move`;
          proposed = proposeDestination(fp, primary);
        }
      }
    }

    results.push({
      file_path: relative(root, fp),
      size_bytes: st.size,
      mtime_iso: st.mtime.toISOString(),
      months_old: monthsOld,

      category_primary: primary,
      confidence_primary: primaryScore,
      category_secondary: secondary ?? undefined,
      confidence_secondary: secondary ? secondaryScore : undefined,

      flags,
      confidence_breakdown: breakdown,
      current_stack_hits: curHits,
      legacy_penalty_applied: legacyPenaltyApplied,

      value_score: value,
      action: proposed ? `move:${proposed}` : action,
      proposed_dest: proposed
    });
  }

  // Output
  ensureDirFor(outJson);
  ensureDirFor(outCsv);

  writeFileSync(outJson, JSON.stringify(results, null, 2), "utf8");

  // CSV header
  const header = [
    "file_path","category_primary","confidence_primary",
    "category_secondary","confidence_secondary","flags",
    "value_score","action","proposed_dest",
    "mtime_iso","months_old","size_bytes","current_stack_hits","confidence_breakdown"
  ].join(",");
  const csv = [header, ...results.map(toCsvRow)].join("\n");
  writeFileSync(outCsv, csv, "utf8");

  // Print proposed git mv commands (KEEP/MAYBE moves only)
  if (printMv) {
    const movers = results.filter(r =>
      r.proposed_dest && r.action.startsWith("move") &&
      (r.value_score === "keep" || r.value_score === "maybe")
    );
    for (const r of movers) {
      const src = r.file_path.replaceAll(" ", "\\ ");
      const dst = String(r.proposed_dest).replaceAll(" ", "\\ ");
      const dir = dirname(dst);
      // emit mkdir then git mv
      console.log(`# ${r.category_primary} (${r.value_score})  ${r.flags.join(" ")}`);
      console.log(`mkdir -p ${dir}`);
      console.log(`git mv "${r.file_path}" "${r.proposed_dest}"${dryRun ? "  # --dry-run" : ""}`);
      console.log();
    }
  }

  console.log(`\nScanned ${results.length} files.`);
  console.log(`JSON: ${outJson}`);
  console.log(`CSV : ${outCsv}`);
})();
```

---

# 2) (Optional) Rules file: `tools/rules.example.json`

Use this if you want to tweak patterns without editing the CLI:

```json
{
  "weights": {
    "strong": 5, "normal": 3, "weak": 1,
    "age_bonus": 2, "age_penalty": -2,
    "current_bonus_each": 1, "current_bonus_cap": 3,
    "legacy_penalty": -2
  },
  "current_stack": [
    "Next\\.js\\s*15", "Tailwind\\s*4", "Bun\\s*1\\.2\\.", "Prisma", "Supabase", "Cloudflare", "gopass"
  ],
  "categories": [
    { "name": "architecture",   "patterns": ["(?i)^#\\s*ADR\\b", "(?i)\\bContext\\b.*\\bDecision\\b.*\\bConsequences\\b", "(?i)\\bdiagram\\b|\\bmermaid\\b|\\bC4 model\\b"], "weight": [5,5,3] },
    { "name": "ops-runbook",    "patterns": ["(?i)\\brunbook\\b|\\bpostmortem\\b|\\bincident\\b", "(?i)\\brollback\\b|\\brestore\\b|\\bplaybook\\b|\\bon[-\\s]?call\\b", "(?m)^\\s*[-*]?\\s*(Step\\s*\\d+|Check|Restart|Verify|Tail|kubectl|supabase\\s+.*logs|bunx?\\s)"], "weight": [5,3,3] },
    { "name": "deploy-infra",   "patterns": ["(?i)cloudflare|CNAME|Zero\\s?Trust|Workers?|KV|R2", "(?i)DNS|TLS|SSL", "(?m)^\\s*name:\\s.*\\n.*^\\s*on:\\s"], "weight": [5,3,5] },
    { "name": "auth-security",  "patterns": ["(?i)auth|oauth|OIDC|JWT|session", "(?i)@supabase/(auth|supabase-js)|supabase\\.auth", "(?i)gopass|pass-store|GnuPG"], "weight": [5,5,3] },
    { "name": "db-api",         "patterns": ["(?i)prisma|schema\\.prisma|migration", "(?i)create table|alter table|policy|RLS", "(?i)openapi|swagger|endpoint|curl\\s+-X"], "weight": [5,5,3] },
    { "name": "dev-setup",      "patterns": ["(?i)setup|installation|prereq|local dev", "(?i)bun|pnpm|brew", "(?m)^[A-Z0-9_]+="], "weight": [5,3,3] },
    { "name": "user-docs",      "patterns": ["(?i)onboarding|user guide|walkthrough|tutorial|how[-\\s]?to|FAQ", "(?i)click|navigate|profile|settings|dashboard"], "weight": [5,3] },
    { "name": "legacy-archive", "patterns": ["(?i)firebase( blaze| hosting| auth| firestore)?", "(?i)vercel(?!.*supabase)", "(?i)Google Cloud Console|\\bGCP\\b|App Engine"], "weight": [5,3,3] },
    { "name": "junk-scratch",   "patterns": ["(?i)\\bTODO\\b|\\bWIP\\b|\\bdraft\\b|\\bnotes?\\b|\\bmeeting\\b|\\brandom\\b|\\btemp\\b"], "weight": [3] }
  ],
  "flags": {
    "flag:secret-terms": ["(?i)(secret|password|passphrase|api[_-]?key|client[_-]?secret|service[_-]?role[_-]?key)"],
    "flag:db-url": ["(?i)postgres(?:ql)?://[^\\s]+"],
    "flag:aws-key": ["(?i)AKIA[0-9A-Z]{16}"],
    "flag:jwt": ["(?i)eyJ[a-zA-Z0-9_=-]{10,}"],
    "flag:env-inline": ["(?i)NEXT_.*=|DATABASE_URL=|SUPABASE_.*="],
    "flag:private-key": ["-----BEGIN (RSA|OPENSSH|PRIVATE KEY)-----"]
  }
}
```

---

# 3) Add a script to `package.json` (optional)

```json
{
  "scripts": {
    "docs:classify": "bun tools/doc-classifier.ts --rules tools/rules.example.json --root . --out-json out/docs_report.json --out-csv out/docs_report.csv --print-mv --dry-run"
  }
}
```

Run:

```bash
bun run docs:classify
```

This will:

* scan your repo,
* create `out/docs_report.json` and `out/docs_report.csv`,
* print **proposed** `git mv` commands (without executing; remove `--dry-run` when you’re ready).

---

## Notes & Tweaks

* **Destinations**: The CLI maps categories → the docs tree we set earlier:

  * `architecture` → `docs/architecture/` (or `docs/decisions/` if ADR-style filename)
  * `ops-runbook` → `docs/ops/runbooks/`
  * `deploy-infra` → `docs/ops/`
  * `auth-security` → `docs/api/_intake_auth/` (so you can merge into `api/auth.md` later)
  * `db-api` → `docs/api/`
  * `dev-setup` → `docs/dev/`
  * `user-docs` → `docs/user/guides/`
  * `legacy-archive` → `docs/archive/`
  * `junk-scratch` → `docs/migration/triage/`
* **Secrets**: if a file trips `flag:private-key`, it’s auto-marked `quarantine` and won’t propose a move.
* **Confidence**: primary vs secondary is decided by score and the 20% proximity rule; precedence list breaks ties.
* **Performance**: this is synchronous for simplicity; Bun is fast enough for thousands of files. If needed, we can parallelize.
