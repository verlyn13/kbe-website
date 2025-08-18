# GitHub Copilot Instructions

## Critical Firebase App Hosting Requirements

### ⚠️ NEVER move these packages to devDependencies

- `typescript` - Required for build process
- `@tailwindcss/postcss` - Required for CSS processing
- `postcss` - Required for CSS processing
- `tailwindcss` - Required for CSS processing

### Why:

Firebase App Hosting runs `npm ci --omit=dev` which skips devDependencies. Moving build tools to devDependencies will cause deployment failures.

### Safe for devDependencies:

- ESLint and plugins
- Prettier and plugins
- @types/\* packages
- Testing frameworks
- Development-only tools

## Auto-Fixing Development Environment (2025 Setup)

### 🎯 Comprehensive Auto-Fix Stack

This project uses a state-of-the-art 2025 auto-fixing environment. **DO NOT** modify these configurations unless explicitly requested:

#### Core Tools & Versions

- **ESLint 9.x** with Next.js core-web-vitals (legacy .eslintrc.json format)
- **Prettier 3.x** with Tailwind CSS plugin
- **Trunk meta-linter** with markdownlint, shellcheck
- **cSpell** with 100+ technical terms whitelist
- **TypeScript 5.8.x** (NOT 5.9+ due to ESLint compatibility)
- **Node.js 22** via fnm workspace isolation

#### Critical Configuration Files

- `.eslintrc.json` - Uses legacy format (NOT flat config) for Next.js compatibility
- `.prettierrc.json` - Modern 2025 config without deprecated options
- `.cspell.json` - Comprehensive technical dictionary
- `.vscode/settings.json` - Auto-fix on save/paste/type
- `.vscode/tasks.json` - "Fix All Issues" workflow
- `setup-dev-env.sh` - Environment setup script

### 🚨 TypeScript Version Constraint

**CRITICAL**: TypeScript must stay at `^5.8.4` (NOT 5.9+) because:

- `@typescript-eslint/eslint-plugin@8.38.0` requires TypeScript `>=4.8.4 <5.9.0`
- Firebase App Hosting build fails with TypeScript 5.9.2
- This was discovered during deployment testing

### 🔧 Auto-Fix Workflow

When code issues arise, use this priority order:

1. **Save file** - Auto-fixes ESLint + Prettier issues
2. **VS Code Task**: "Fix All Issues" - Runs ESLint + Prettier + Trunk + cSpell
3. **Terminal**: `trunk check --fix` - Additional markdown/shell fixes
4. **Manual review** - Only for style preferences that can't auto-fix

### 📝 Spelling & Markdown

- **cSpell** handles 100+ technical terms (Turbopack, GenKit, tailwindcss, etc.)
- **markdownlint** via Trunk auto-fixes heading punctuation, spacing
- **shellcheck** via Trunk enforces shell script best practices
- All configured to auto-fix where possible

### 🎮 VS Code Integration

- **Auto-fix on save**: ESLint + Prettier + import organization
- **Auto-fix on paste**: Instant formatting
- **Tasks available**: Cmd+Shift+P → "Tasks: Run Task"
  - "Fix All Issues" (recommended)
  - "Lint & Fix", "Format Code", "Spell Check"
- **Problem matchers**: Integrated error highlighting

## Project Specific Rules

1. **Zod Version**: Always use Zod v3 (not v4) for GenKit compatibility
2. **Tailwind CSS Imports**: Use `@import 'tailwindcss/base'` syntax (not `@tailwind`)
3. **TypeScript Paths**: Use `@/*` for src directory imports
4. **Node Version**: Use Node.js 22 to match Firebase deployment
5. **Port**: Development server runs on port 9002 (not 3000)
6. **Auto-fix first**: Always try auto-fixing before manual code changes

## When suggesting dependency changes:

- ALWAYS keep build dependencies in `dependencies`
- ONLY suggest moving true dev tools to `devDependencies`
- Check Firebase deployment requirements before suggesting moves
- **NEVER upgrade TypeScript above 5.8.x** without testing ESLint compatibility
- Use `--legacy-peer-deps` for npm installs to handle peer dependency conflicts

## Build & Deployment Lessons Learned

### Firebase App Hosting Compatibility

- Uses `npm ci --omit=dev` (no devDependencies available)
- Requires exact TypeScript version compatibility
- Auto-overwrites next.config.js (expected behavior)
- Secrets managed via Google Cloud Secret Manager

### Common Build Failures & Solutions

1. **TypeScript version conflicts**: Downgrade to 5.8.x
2. **Peer dependency issues**: Use `--legacy-peer-deps`
3. **Missing build deps**: Move from devDependencies to dependencies
4. **ESLint flat config**: Use legacy .eslintrc.json format

## Do NOT:

- Auto-fix by moving TypeScript to devDependencies
- Suggest npm audit fix --force (can break version compatibility)
- Change Zod from v3 to v4
- Add custom webpack configs to next.config.js
- Upgrade TypeScript to 5.9+ without testing
- Switch to ESLint flat config (breaks Next.js integration)
- Remove or modify .cspell.json whitelist without testing
- Suggest formatting fixes that are already auto-handled

## Working with the Auto-Fix Environment

### For Code Changes

1. Make changes in VS Code
2. Save (auto-fixes apply)
3. Run "Fix All Issues" task if needed
4. Commit with confidence

### For New Dependencies

1. Add to correct section (dependencies vs devDependencies)
2. Use `npm install --legacy-peer-deps`
3. Test build locally: `npm run build`
4. Check for TypeScript/ESLint conflicts

### For Configuration Changes

1. Understand the auto-fix pipeline first
2. Test changes don't break auto-fixing
3. Update documentation if modifying core configs
4. Verify Firebase deployment compatibility

This environment achieves 95%+ auto-fix success rate. Preserve it!
