# Playbook

Designed for **ripgrep (rg)**, works on Markdown, code, and config files, and uses **category + confidence + action** outputs. Refine thresholds after the first sample pass.

---

# How to Use (quick)

1. Start with a random 50–100-file sample.
2. For each file, apply rules **in order** (higher sections = higher precedence).
3. Sum confidence weights for matched rules → pick **top category**; keep **second** if within 20% for “multi”.
4. Emit `{file, category, confidence, flags, action}`.

---

# Global precedence & scoring

* **Precedence order (highest → lowest):** `Secrets → ADR/Architecture → Ops/Runbooks → Deployment/Infra → Auth/Security → Database/API → Dev Setup/Environment → User Docs → Legacy/Archive → Junk/Scratch`
* **Confidence weights:** Strong match = 5, normal = 3, weak = 1. (Listed per rule below.)
* **Age bonus:** `< 24 months` +2; `>= 36 months` −2.
* **Current-stack bonus:** Mentions of `(Next.js 15|Tailwind 4|Bun 1.2|Prisma|Supabase|Cloudflare|gopass)` +1 each (max +3).
* **Legacy penalty:** Mentions `(Firebase|Firestore|Vercel auth)` without Supabase context −2.

---

# Red-flag / Secrets detector (always run first)

| Pattern (regex)                             |         Weight | Tag                 | Action           |                     |                                 |   |                    |        |
| ------------------------------------------- | -------------: | ------------------- | ---------------- | ------------------- | ------------------------------- | - | ------------------ | ------ |
| \`(?i)\b(secret                             |       password | passphrase          | api\[\_-]?key    | client\[\_-]?secret | service\[*-]?role\[*-]?key)\b\` | 5 | flag\:secret-terms | review |
| `(?i)\b(AKIA[0-9A-Z]{16})\b` (AWS key)      |              5 | flag\:aws-key       | quarantine       |                     |                                 |   |                    |        |
| `(?i)\beyJ[a-zA-Z0-9_=-]{10,}\b` (JWT-like) |              5 | flag\:jwt           | review           |                     |                                 |   |                    |        |
| `(?i)\bpostgres(?:ql)?://[^\s]+`            |              5 | flag\:db-url        | rotate if leaked |                     |                                 |   |                    |        |
| \`(?i)\bNEXT\_.\*=                          | DATABASE\_URL= | SUPABASE\_.\*=\`    | 3                | flag\:env-inline    | review                          |   |                    |        |
| \`-----BEGIN (RSA                           |        OPENSSH | PRIVATE KEY)-----\` | 5                | flag\:private-key   | quarantine                      |   |                    |        |

> If any **flag\:private-key** → force `action=quarantine` regardless of category.

---

# Category rules

## A. Architecture / Decisions (ADR)

| Pattern                                                                          |                    W | Notes                       |   |               |
| -------------------------------------------------------------------------------- | -------------------: | --------------------------- | - | ------------- |
| \`(?i)^#\s\*ADR\b                                                                | ^#\s\*Architecture\b | ^\s\*#*\s*Design Decision\` | 5 | Title markers |
| `(?i)\bContext\b.*\bDecision\b.*\bConsequences\b` (in any order within 2k chars) |                    5 | ADR structure               |   |               |
| \`(?i)\bdiagram\b                                                                |          \bmermaid\b | \bC4 model\b\`              | 3 | Diagrams      |
| **Action:** `category=architecture` (or `decisions` if “ADR” present)            |                      |                             |   |               |

## B. Ops / Runbooks / Monitoring

| Pattern                                            |              W | Notes          |                     |              |           |                    |            |   |            |
| -------------------------------------------------- | -------------: | -------------- | ------------------- | ------------ | --------- | ------------------ | ---------- | - | ---------- |
| \`(?i)\brunbook\b                                  | \bpostmortem\b | \bincident\b\` | 5                   | Ops doc core |           |                    |            |   |            |
| \`(?i)\brollback\b                                 |    \brestore\b | \bplaybook\b   | \bon\[-\s]?call\b\` | 3            | Ops verbs |                    |            |   |            |
| Imperative steps: \`(?m)^\s\*\[-*]?\s*(Step\s\*\d+ |          Check | Restart        | Verify              | Tail         | kubectl   | supabase\s+.\*logs | bunx?\s)\` | 3 | Procedural |
| **Action:** `category=ops-runbook`                 |                |                |                     |              |           |                    |            |   |            |

## C. Deployment / Infra (Cloudflare, CI/CD, DNS)

| Pattern                                               |               W | Notes       |                     |                  |                |        |          |   |            |
| ----------------------------------------------------- | --------------: | ----------- | ------------------- | ---------------- | -------------- | ------ | -------- | - | ---------- |
| \`(?i)\bcloudflare\b                                  |         \bTTL\b | \bCNAME\b   | \bA record\b        | \bZero\s?Trust\b | \bWorkers?\b   | \bKV\b | \bR2\b\` | 5 | Cloudflare |
| GitHub Actions YAML: `(?m)^\s*name:\s.*\n.*^\s*on:\s` |               5 | CI presence |                     |                  |                |        |          |   |            |
| \`(?i)\bdeploy\b                                      |     \brelease\b | \bpreview\b | \bprod(uction)?\b\` | 3                | General deploy |        |          |   |            |
| \`(?i)\bDNS\b                                         | \bcertificate\b | \bTLS\b     | \bSSL\b\`           | 3                | Infra          |        |          |   |            |
| **Action:** `category=deploy-infra`                   |                 |             |                     |                  |                |        |          |   |            |

## D. Auth & Security

| Pattern                                                                                           |                 W | Notes               |         |               |   |              |
| ------------------------------------------------------------------------------------------------- | ----------------: | ------------------- | ------- | ------------- | - | ------------ |
| \`(?i)\bauth\b                                                                                    |         \boauth\b | \bOIDC\b            | \bJWT\b | \bsession\b\` | 5 | General auth |
| Supabase auth libs: \`(?i)\b\@supabase/(?\:auth                                                   |    supabase-js)\b | \bsupabase.auth\b\` | 5       | Supabase      |   |              |
| Legacy auth: \`(?i)\bfirebase.auth\b                                                              | \bvercel auth\b\` | 3                   | Legacy  |               |   |              |
| \`(?i)\bgopass\b                                                                                  |    \bpass-store\b | \bGnuPG\b\`         | 3       | Secrets mgmt  |   |              |
| **Action:** `category=auth-security` (+legacy penalty if Firebase/Vercel appear without Supabase) |                   |                     |         |               |   |              |

## E. Database / Schema / API

| Pattern                                    |                 W | Notes             |                        |        |             |           |                 |   |     |
| ------------------------------------------ | ----------------: | ----------------- | ---------------------- | ------ | ----------- | --------- | --------------- | - | --- |
| \`(?i)\bprisma\b                           | \bschema.prisma\b | \bmigration(s)?\b | \bprisma\s+migrate\b\` | 5      | Prisma core |           |                 |   |     |
| Supabase SQL/types: \`(?i)\bcreate table\b |   \balter table\b | \bpolicy\b        | \bRLS\b\`              | 5      | DB/Policies |           |                 |   |     |
| OpenAPI/Endpoint: \`(?i)\bopenapi\b        |       \bswagger\b | \bendpoint\b      | \bHTTP\s+(GET          | POST   | PUT         | DELETE)\b | \bcurl\s+-X\b\` | 3 | API |
| \`(?i)\ber diagram\b                       |   \bforeign key\b | \bindex\b\`       | 3                      | Schema |             |           |                 |   |     |
| **Action:** `category=db-api`              |                   |                   |                        |        |             |           |                 |   |     |

## F. Dev Setup / Environment

| Pattern                          |                    W | Notes                 |                            |            |           |         |
| -------------------------------- | -------------------: | --------------------- | -------------------------- | ---------- | --------- | ------- |
| \`(?i)\bsetup\b                  |     \binstallation\b | \bprereq(uisite)?s?\b | \blocal dev(elopment)?\b\` | 5          | Setup     |         |
| Tools: \`(?i)\bbun(\s1.2.\d+)?\b |              \bnpm\b | \bpnpm\b              | \byarn\b                   | \bbrew\b\` | 3         | Tooling |
| `.env` style: `(?m)^[A-Z0-9_]+=` |                    3 | Env table             |                            |            |           |         |
| \`(?i)\bsupabase\s+start\b       | \bsupabase\s+login\b | \bgopass\s+(show      | insert)\b\`                | 3          | CLI usage |         |
| **Action:** `category=dev-setup` |                      |                       |                            |            |           |         |

## G. Tailwind / Next.js (Frontend Dev specifics)

| Pattern                                                                                                                                               |              W | Notes                 |                     |           |             |         |
| ----------------------------------------------------------------------------------------------------------------------------------------------------- | -------------: | --------------------- | ------------------- | --------- | ----------- | ------- |
| \`(?i)\bTailwind\s\*4\b                                                                                                                               | \b\@tailwind\b | \btailwind.config.(js | ts)\b\`             | 5         | Tailwind v4 |         |
| \`(?i)\bNext.js\b                                                                                                                                     |  \bapp/(layout | page).tsx?\b          | \bserver actions?\b | \bRSC\b\` | 3           | Next.js |
| **Action:** If doc is mostly frontend config/tutorial → `category=dev-setup` with `tag:frontend`; else contributes to **architecture** if conceptual. |                |                       |                     |           |             |         |

## H. User Docs / Guides

| Pattern                          |              W | Notes           |              |                  |           |          |            |
| -------------------------------- | -------------: | --------------- | ------------ | ---------------- | --------- | -------- | ---------- |
| \`(?i)\bonboarding\b             | \buser guide\b | \bwalkthrough\b | \btutorial\b | \bhow\[-\s]?to\b | \bFAQ\b\` | 5        | User focus |
| UI tone: \`(?i)\bclick\b         |   \bnavigate\b | \bprofile\b     | \bsettings\b | \bdashboard\b\`  | 3         | UX terms |            |
| **Action:** `category=user-docs` |                |                 |              |                  |           |          |            |

## I. Legacy / Archive (Firebase/Vercel era)

| Pattern                                                                                                   |       W | Notes            |                 |            |          |
| --------------------------------------------------------------------------------------------------------- | ------: | ---------------- | --------------- | ---------- | -------- |
| \`(?i)\bfirebase( blaze                                                                                   | hosting | auth             | firestore)?\b\` | 5          | Firebase |
| `(?i)\bvercel\b(?!.*supabase)`                                                                            |       3 | Vercel legacy    |                 |            |          |
| \`(?i)\bGoogle Cloud Console\b                                                                            | \bGCP\b | \bApp Engine\b\` | 3               | GCP legacy |          |
| **Action:** `category=legacy-archive` (unless doc also includes current stack → “mixed”: keep for manual) |         |                  |                 |            |          |

## J. Junk / Scratch

| Pattern                                                            |       W | Notes                      |            |             |            |            |   |            |
| ------------------------------------------------------------------ | ------: | -------------------------- | ---------- | ----------- | ---------- | ---------- | - | ---------- |
| \`(?i)\bTODO\b                                                     | \bWIP\b | \bdraft\b                  | \bnotes?\b | \bmeeting\b | \brandom\b | \btemp\b\` | 3 | Low signal |
| Repetitive bullets only (heuristic): `(?s)^(?:\s*[-*]\s.+\n){8,}$` |       3 | Long bullet not structured |            |             |            |            |   |            |
| Very small files `< 200 bytes` with none of the above              |       1 | Probably scratch           |            |             |            |            |   |            |
| **Action:** `category=junk-scratch` (unless secrets flags present) |         |                            |            |             |            |            |   |            |

---

# Filename & path heuristics (additive)

| Pattern                      |         W | Tag / Category              |                      |                    |                         |           |              |
| ---------------------------- | --------: | --------------------------- | -------------------- | ------------------ | ----------------------- | --------- | ------------ |
| \`(?i)^adr\[-\_ ]?\d+.\*.(md |   mdx)$\` | 5                           | `category=decisions` |                    |                         |           |              |
| `(?i)\bdocs\/archive\/`      |         3 | legacy tilt                 |                      |                    |                         |           |              |
| \`(?i)\b(runbook             |  incident | postmortem)\b\` in filename | 5                    | ops-runbook        |                         |           |              |
| \`(?i)\bdeploy               |   release | ci                          | cd                   | pipeline           | github\[-\_]actions\b\` | 5         | deploy-infra |
| \`(?i)\bsetup                |   install | environment                 | env                  | local\[-\_]dev\b\` | 5                       | dev-setup |              |
| \`(?i)\bapi                  |   openapi | swagger                     | endpoint\b\`         | 5                  | db-api                  |           |              |
| \`(?i)\bfirebase             | firestore | vercel\b\`                  | 5                    | legacy-archive     |                         |           |              |

---

# Tie-break & ambiguity rules

* If **Auth** and **Deploy/Infra** both score high, prefer **Auth** if tokens/flows are present; otherwise **Deploy/Infra**.
* If **Dev Setup** and **DB/API** both score, prefer **DB/API** if `schema.prisma|migration` appears.
* If **Architecture** structure is detected (Context/Decision/Consequences), it **wins**.
* If **Legacy** + **Current-stack** both present, tag `mixed-legacy` and route to manual review.

---

# Value scoring (Keep / Maybe / Archive)

* **KEEP** if:

  * Category in `{architecture, ops-runbook, deploy-infra, auth-security, db-api}` **and**
  * (Age < 24mo **or** mentions current stack)
* **MAYBE** if:

  * Mixed legacy/current, or category `{dev-setup, user-docs}` but age ≥ 24mo
* **ARCHIVE** if:

  * `legacy-archive` and no current-stack mentions, or `junk-scratch` with low confidence

Add a simple rule: `confidence >= 7 → high; 4–6 → medium; <=3 → low`.

---

# ripgrep snippets (copy/paste to sample)

```bash
# Secrets pass (JSON lines)
rg -n --json -e '(?i)(secret|password|api[_-]?key|client[_-]?secret|service[_-]?role[_-]?key|postgres(?:ql)?://|AKIA[0-9A-Z]{16}|eyJ[a-zA-Z0-9_=-]{10,}|BEGIN (?:RSA|OPENSSH|PRIVATE KEY))' > out/secrets.jsonl

# Category probes
rg -n --json -e '(?i)^#\s*ADR\b|Context.*Decision.*Consequences' > out/architecture.jsonl
rg -n --json -e '(?i)\brunbook\b|postmortem|incident|rollback|restore|playbook|on[-\s]?call' > out/ops.jsonl
rg -n --json -e '(?i)cloudflare|CNAME|Zero\s?Trust|Workers?|KV|R2|DNS|TLS|SSL' > out/deploy.jsonl
rg -n --json -e '(?i)auth|oauth|OIDC|JWT|session|@supabase/(auth|supabase-js)|supabase\.auth|gopass' > out/auth.jsonl
rg -n --json -e '(?i)prisma|schema\.prisma|migration|create table|policy|RLS|openapi|swagger|endpoint|curl\s+-X' > out/dbapi.jsonl
rg -n --json -e '(?i)setup|installation|prereq|local dev|bun|pnpm|brew|^([A-Z0-9_]+=)$' > out/devsetup.jsonl
rg -n --json -e '(?i)Tailwind\s*4|@tailwind|tailwind\.config\.(js|ts)|Next\.js|app/(layout|page)\.tsx?|server actions?|RSC' > out/frontend.jsonl
rg -n --json -e '(?i)onboarding|user guide|walkthrough|tutorial|how[-\s]?to|FAQ' > out/userdocs.jsonl
rg -n --json -e '(?i)firebase|firestore|vercel(?!.*supabase)' > out/legacy.jsonl
rg -n --json -e '(?i)\bTODO\b|\bWIP\b|\bdraft\b|\bnotes?\b|\bmeeting\b|\brandom\b|\btemp\b' > out/junk.jsonl
```

---

# Machine-readable rules (starter JSON)

```json
{
  "weights": { "strong": 5, "normal": 3, "weak": 1, "age_bonus": 2, "age_penalty": -2, "current_bonus_each": 1, "current_bonus_cap": 3, "legacy_penalty": -2 },
  "current_stack": ["Next\\.js\\s*15", "Tailwind\\s*4", "Bun\\s*1\\.2\\.", "Prisma", "Supabase", "Cloudflare", "gopass"],
  "categories": [
    { "name": "architecture", "patterns": ["(?i)^#\\s*ADR\\b", "(?i)\\bContext\\b.*\\bDecision\\b.*\\bConsequences\\b", "(?i)\\bdiagram\\b|\\bmermaid\\b|\\bC4 model\\b"], "weight": [5,5,3] },
    { "name": "ops-runbook", "patterns": ["(?i)\\brunbook\\b|\\bpostmortem\\b|\\bincident\\b", "(?i)\\brollback\\b|\\brestore\\b|\\bplaybook\\b|\\bon[-\\s]?call\\b", "(?m)^\\s*[-*]?\\s*(Step\\s*\\d+|Check|Restart|Verify|Tail|kubectl|supabase\\s+.*logs|bunx?\\s)"], "weight": [5,3,3] },
    { "name": "deploy-infra", "patterns": ["(?i)cloudflare|CNAME|Zero\\s?Trust|Workers?|KV|R2", "(?i)DNS|TLS|SSL", "(?m)^\\s*name:\\s.*\\n.*^\\s*on:\\s"], "weight": [5,3,5] },
    { "name": "auth-security", "patterns": ["(?i)auth|oauth|OIDC|JWT|session", "(?i)@supabase/(auth|supabase-js)|supabase\\.auth", "(?i)gopass|pass-store|GnuPG"], "weight": [5,5,3] },
    { "name": "db-api", "patterns": ["(?i)prisma|schema\\.prisma|migration", "(?i)create table|alter table|policy|RLS", "(?i)openapi|swagger|endpoint|curl\\s+-X"], "weight": [5,5,3] },
    { "name": "dev-setup", "patterns": ["(?i)setup|installation|prereq|local dev", "(?i)bun|pnpm|brew", "(?m)^[A-Z0-9_]+="], "weight": [5,3,3] },
    { "name": "user-docs", "patterns": ["(?i)onboarding|user guide|walkthrough|tutorial|how[-\\s]?to|FAQ", "(?i)click|navigate|profile|settings|dashboard"], "weight": [5,3] },
    { "name": "legacy-archive", "patterns": ["(?i)firebase( blaze| hosting| auth| firestore)?", "(?i)vercel(?!.*supabase)", "(?i)Google Cloud Console|\\bGCP\\b|App Engine"], "weight": [5,3,3] },
    { "name": "junk-scratch", "patterns": ["(?i)\\bTODO\\b|\\bWIP\\b|\\bdraft\\b|\\bnotes?\\b|\\bmeeting\\b|\\brandom\\b|\\btemp\\b"], "weight": [3] }
  ],
  "flags": {
    "secrets": ["(?i)(secret|password|api[_-]?key|client[_-]?secret|service[_-]?role[_-]?key)", "(?i)postgres(?:ql)?://[^\\s]+", "(?i)AKIA[0-9A-Z]{16}", "(?i)eyJ[a-zA-Z0-9_=-]{10,}", "-----BEGIN (RSA|OPENSSH|PRIVATE KEY)-----"]
  }
}
```

---

# Output fields you’ll want

* `file_path`
* `category_primary`, `confidence_primary`
* `category_secondary?`, `confidence_secondary?`
* `flags` (array)
* `value_score` (`keep|maybe|archive`)
* `action` (`move:<path> | archive | quarantine | review`)
