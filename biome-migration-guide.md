# Biome Migration Guide - KBE Website

## Overview

Complete migration guide for replacing ESLint + Prettier with Biome in the KBE Website Next.js + TypeScript project. This workflow ensures zero downtime and safe, incremental migration.

## Current Setup Analysis

### ESLint Configuration

- **Base**: `next/core-web-vitals` (Next.js recommended rules)
- **Disabled Rules**:
  - `react/display-name`: off
  - `no-unused-vars`: off
  - `@typescript-eslint/no-unused-vars`: off
- **Known Issues**: Multiple `react/no-unescaped-entities` warnings

### Prettier Configuration

- **Settings**:
  - Semi-colons: true
  - Single quotes: true
  - Print width: 100
  - Tab width: 2 spaces
  - Trailing comma: ES5
  - Arrow parens: always
  - Bracket spacing: true
  - End of line: auto
- **Plugins**: `prettier-plugin-tailwindcss` for class sorting
- **Tailwind Functions**: `cn`, `cva`

### Package Dependencies

- **ESLint**: v9.32.0 with Next.js plugin
- **Prettier**: v3.6.2 with Tailwind plugin
- **TypeScript**: v5.8.3
- **Scripts**:
  - `lint`: ESLint check
  - `lint:fix`: ESLint auto-fix
  - `format`: Prettier write
  - `typecheck`: TypeScript check

## Prerequisites

- Git repository with clean working tree
- Node.js 22+ (project requirement)
- npm 11+ (project requirement)
- Backup of current lint/format configuration
- 2-3 hours for complete migration

---

## Phase 1: Preparation & Analysis (30 min)

### 1.1 Create Migration Branch

```bash
# Ensure clean working tree
git status
git checkout -b feature/migrate-to-biome-2.2.0
```

### 1.2 Document Current State

```bash
# Capture current lint/format issues for comparison
npm run lint > migration/eslint-baseline.log 2>&1 || true
npm run format:check > migration/prettier-baseline.log 2>&1 || true

# List current ESLint/Prettier dependencies
npm ls | grep -E "eslint|prettier" > migration/current-deps.txt
```

### 1.3 Install Biome (Pinned Version)

```bash
# Install and pin to 2.2.0 for stability
pnpm add -D @biomejs/biome@2.2.0
# or: npm i -D @biomejs/biome@2.2.0
```

**Checkpoint**: ✅ Biome installed, baseline captured

---

## Phase 2: Configuration Setup (45 min)

### 2.1 Initialize Biome

```bash
pnpm biome init
```

### 2.2 Replace with Production Config

Create `biome.jsonc` with this v2.2.0-optimized configuration:

```jsonc
{
  "$schema": "https://biomejs.dev/schemas/2.2.0/schema.json",

  // VCS integration for Git-aware operations
  "vcs": {
    "enabled": true,
    "clientKind": "git",
    "useIgnoreFile": true,
    "defaultBranch": "main",
  },

  // File handling with 2.2.0 ignore semantics (no /** suffix)
  "files": {
    "ignoreUnknown": false,
    "ignore": [
      ".next",
      ".turbo",
      ".vercel",
      "coverage",
      "dist",
      "build",
      "node_modules",
      ".firebase",
      "firebase-debug.log",
      "functions/lib",
      "storage_export",
    ],
  },

  // Formatter configuration
  "formatter": {
    "enabled": true,
    "indentWidth": 2,
    "indentStyle": "space",
    "lineWidth": 100,
  },

  // Import organization (2.2.0 feature)
  "organizeImports": {
    "enabled": true,
    "identifierOrder": "natural",
  },

  // Linter with recommended rules
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "suspicious": {
        "noImportCycles": {
          "level": "error",
          "options": { "ignoreTypes": true },
        },
      },
    },
  },

  // Project-specific overrides
  "overrides": [
    {
      "include": ["**/*.test.*", "**/*.spec.*", "**/__tests__/**"],
      "linter": {
        "rules": {
          "correctness": {
            "noUndeclaredVariables": "off",
          },
        },
      },
    },
    {
      "include": ["app/**", "src/app/**"],
      "linter": {
        "rules": {
          "correctness": {
            "noNextAsyncClientComponent": "warn",
          },
        },
      },
    },
  ],
}
```

### 2.3 Migrate Existing Configs

```bash
# Auto-migrate ESLint configuration
pnpm dlx @biomejs/biome@2.2.0 migrate eslint --write

# Auto-migrate Prettier configuration
pnpm dlx @biomejs/biome@2.2.0 migrate prettier --write

# Review migration output
git diff biome.jsonc
```

**Checkpoint**: ✅ Configuration migrated and customized

---

## Phase 3: Script Migration (30 min)

### 3.1 Update package.json Scripts

```json
{
  "scripts": {
    // Biome replacements
    "lint": "biome check .",
    "lint:fix": "biome check --write --unsafe .",
    "format": "biome format --write .",
    "format:check": "biome format .",

    // Git-aware commands
    "lint:staged": "biome check --staged --error-on-warnings",
    "check:ci": "biome ci --changed .",

    // Legacy aliases (temporary)
    "eslint:legacy": "eslint .",
    "prettier:legacy": "prettier --check ."
  }
}
```

### 3.2 Test New Scripts

```bash
# Dry run to see what would change
pnpm biome check . --dry-run

# Check formatting differences
pnpm biome format . --dry-run

# Count issues
pnpm biome check . 2>&1 | grep -E "error|warning" | wc -l
```

**Checkpoint**: ✅ Scripts working, differences documented

---

## Phase 4: Code Fixes & Validation (1 hour)

### 4.1 Apply Safe Fixes

```bash
# Apply only safe fixes first
pnpm biome check --write .

# Review changes
git diff --stat
git diff | head -200

# Commit safe fixes
git add -A
git commit -m "chore: apply Biome safe fixes"
```

### 4.2 Apply Unsafe Fixes (Review Carefully)

```bash
# Create separate commit for unsafe fixes
pnpm biome check --write --unsafe .

# Carefully review each change
git diff

# Test application still works
pnpm dev
# Run manual smoke tests

# Commit if satisfied
git add -A
git commit -m "chore: apply Biome unsafe fixes (reviewed)"
```

### 4.3 Verify Functionality

```bash
# Build should succeed
pnpm build

# Tests should pass
pnpm test

# Type checking should pass
pnpm typecheck
```

**Checkpoint**: ✅ All fixes applied, app functional

---

## Phase 5: Editor Integration (15 min)

### 5.1 VS Code Setup

1. Install Biome extension: `biomejs.biome`
2. Update workspace settings:

```json
// .vscode/settings.json
{
  "editor.defaultFormatter": "biomejs.biome",
  "editor.formatOnSave": true,
  "[javascript]": {
    "editor.defaultFormatter": "biomejs.biome"
  },
  "[typescript]": {
    "editor.defaultFormatter": "biomejs.biome"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "biomejs.biome"
  },
  "[json]": {
    "editor.defaultFormatter": "biomejs.biome"
  },

  // Disable ESLint/Prettier extensions for this workspace
  "eslint.enable": false,
  "prettier.enable": false
}
```

3. Reload VS Code window
4. Test format-on-save works

**Checkpoint**: ✅ Editor integration working

---

## Phase 6: CI/CD Integration (30 min)

### 6.1 Update GitHub Actions

```yaml
# .github/workflows/biome.yml
name: Code Quality
on:
  pull_request:
  push:
    branches: [main]

jobs:
  biome:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: 9

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'pnpm'

      - run: pnpm i --frozen-lockfile

      # For PRs, only check changed files
      - run: pnpm run check:ci
        if: github.event_name == 'pull_request'

      # For main, check everything
      - run: pnpm biome ci .
        if: github.ref == 'refs/heads/main'
```

### 6.2 Test CI Pipeline

```bash
# Push to feature branch
git push origin feature/migrate-to-biome-2.2.0

# Create PR and verify CI passes
```

**Checkpoint**: ✅ CI pipeline green

---

## Phase 7: Cleanup & Documentation (15 min)

### 7.1 Remove ESLint/Prettier (After Stability Period)

```bash
# Remove configurations
rm -f .eslintrc* .prettierrc* .eslintignore .prettierignore

# Remove dependencies
pnpm remove eslint prettier eslint-config-* eslint-plugin-* prettier-plugin-*

# Keep only what's needed
# Note: Keep markdownlint-cli2 for Markdown files
```

### 7.2 Update Documentation

```markdown
# Add to README.md

## Code Quality

This project uses [Biome](https://biomejs.dev) v2.2.0 for linting, formatting, and import organization.

### Commands

- `pnpm lint` - Check for issues
- `pnpm lint:fix` - Fix all issues
- `pnpm format` - Format code
- `pnpm check:ci` - CI validation

### Editor Setup

Install the Biome extension for VS Code: `biomejs.biome`
```

### 7.3 Final Commit

```bash
git add -A
git commit -m "chore: complete migration to Biome 2.2.0

- Replace ESLint + Prettier with Biome 2.2.0
- Migrate all lint/format rules
- Update CI/CD pipeline
- Configure VS Code integration
- Add Git-aware checking for PRs

BREAKING CHANGE: Developers need to install Biome VS Code extension"
```

**Checkpoint**: ✅ Migration complete

---

## Rollback Plan

If issues arise at any phase:

```bash
# Quick rollback
git checkout main
git branch -D feature/migrate-to-biome-2.2.0

# Restore ESLint/Prettier scripts in package.json
# Re-enable extensions in VS Code
```

---

## Success Metrics

- [ ] Zero build failures
- [ ] CI pipeline green
- [ ] Format-on-save working in VS Code
- [ ] No regression in code quality
- [ ] Faster lint/format times (measure before/after)
- [ ] Team onboarded to new tooling

---

## Migration Timeline

- **Day 1**: Phases 1-4 (Setup & fixes)
- **Day 2**: Phases 5-6 (Integration)
- **Week 1**: Run in parallel with ESLint/Prettier
- **Week 2**: Remove old tooling (Phase 7)

---

## Troubleshooting

### Common Issues & Solutions

**Issue**: "Biome reports errors ESLint didn't catch"

- This is expected; Biome has different/stricter rules
- Review and fix, or disable specific rules if needed

**Issue**: "Format differs from Prettier"

- Biome has its own formatter; small differences are normal
- Adjust `formatter` settings in `biome.jsonc` if needed

**Issue**: "CI fails on unchanged files"

- Use `--changed` flag for PR checks
- Ensure `vcs.defaultBranch` matches your repo

**Issue**: "VS Code not formatting"

- Verify Biome extension is installed
- Check workspace settings override user settings
- Reload VS Code window

---

## Post-Migration Monitoring

Track these metrics for 2 weeks:

- CI run times (should be faster)
- Developer feedback on DX
- False positive rate
- Format consistency across team

This completes the migration to Biome 2.2.0. The new setup provides faster, more consistent code quality checks with a single tool replacing two.
