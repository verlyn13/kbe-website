# Safe CI Test Workflow Strategy

## Core Principle: Don't Touch Main Push Events
Firebase owns push-to-main. We'll test BEFORE code reaches main.

---

## Recommended Approach: PR-Based Testing

### Strategy Overview
```
Feature Branch → PR → Tests Run → Review → Merge to Main → Firebase Deploys
```

- **Tests run on PRs** - Catch issues before main
- **Tests run on feature branches** - Early feedback
- **NO tests on main push** - Firebase handles that
- **Manual trigger available** - For debugging

---

## Implementation: .github/workflows/test.yml

```yaml
name: Test Suite

# CRITICAL: No "push to main" trigger - Firebase owns that
on:
  pull_request:
    branches: [main]
    paths:
      - 'src/**'
      - 'app/**'
      - 'components/**'
      - 'lib/**'
      - '*.json'
      - '*.js'
      - '*.ts'
      - '*.mjs'
      - '.github/workflows/test.yml'
    # Ignore documentation and backup changes
    paths-ignore:
      - '**.md'
      - '**.backup'
      - 'docs/**'
      - 'audit/**'
      
  # Optional: Test on feature branches (not main)
  push:
    branches:
      - 'feature/**'
      - 'fix/**'
      - 'chore/**'
      - 'test/**'
    # Explicitly exclude main
    branches-ignore:
      - main
      
  # Manual trigger for debugging
  workflow_dispatch:
    inputs:
      debug_enabled:
        type: boolean
        description: 'Run with debug logging'
        required: false
        default: false

# Cancel in-progress runs when new commits pushed
concurrency:
  group: test-${{ github.ref }}
  cancel-in-progress: true

jobs:
  test:
    name: Type Check & Test
    runs-on: ubuntu-latest
    # Don't run on main branch pushes
    if: github.ref != 'refs/heads/main'
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'
          
      - name: Cache Dependencies
        uses: actions/cache@v4
        with:
          path: |
            ~/.npm
            node_modules
          key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
          restore-keys: |
            ${{ runner.os }}-node-
            
      - name: Install Dependencies
        run: npm ci --prefer-offline --no-audit
        
      - name: Type Check
        run: npm run typecheck
        continue-on-error: false
        
      - name: Run Tests
        run: npm run test:ci
        env:
          CI: true
          
      - name: Upload Test Results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: test-results
          path: |
            coverage/
            test-results/
            
      - name: Comment PR with Results
        if: github.event_name == 'pull_request' && always()
        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs');
            let comment = '## Test Results\n\n';
            
            // Add test summary if available
            if (fs.existsSync('test-results/summary.txt')) {
              const summary = fs.readFileSync('test-results/summary.txt', 'utf8');
              comment += summary;
            } else {
              comment += '✅ Tests completed';
            }
            
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: comment
            });
```

---

## Package.json Test Scripts

Add these scripts for CI testing:

```json
{
  "scripts": {
    // ... existing scripts
    "test": "vitest",
    "test:ci": "vitest run --reporter=junit --reporter=default --coverage",
    "test:watch": "vitest watch",
    "typecheck": "tsc --noEmit",
    "typecheck:watch": "tsc --noEmit --watch"
  }
}
```

---

## Vitest CI Configuration

Update `vitest.config.ts` for CI:

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    
    // CI-specific settings
    reporters: process.env.CI 
      ? ['default', 'junit', 'json'] 
      : ['default'],
    outputFile: {
      junit: './test-results/junit.xml',
      json: './test-results/results.json',
    },
    
    coverage: {
      enabled: process.env.CI === 'true',
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',
      exclude: [
        'node_modules/',
        '.next/',
        'test/',
        '*.config.*',
        '**/types/**',
      ],
      thresholds: {
        // Start low, increase over time
        statements: 20,
        branches: 20,
        functions: 20,
        lines: 20,
      },
    },
    
    // Fail fast in CI
    bail: process.env.CI ? 1 : 0,
    
    // Timeout for CI
    testTimeout: process.env.CI ? 10000 : 5000,
  },
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/lib': path.resolve(__dirname, './src/lib'),
    },
  },
});
```

---

## Branch Protection Rules (GitHub Settings)

To ensure tests run before merging to main:

1. Go to Settings → Branches
2. Add rule for `main`
3. Enable:
   - ✅ Require pull request reviews before merging
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging
   - Select "Test Suite" as required status check
   - ✅ Include administrators (optional but recommended)

---

## Safe Development Workflow

### For Developers:
```bash
# 1. Create feature branch
git checkout -b feature/add-new-component

# 2. Make changes and test locally
npm run test:watch
npm run typecheck:watch

# 3. Commit and push to feature branch
git add .
git commit -m "feat: add new component"
git push origin feature/add-new-component

# 4. Create PR
# Tests run automatically on PR

# 5. After PR approval and tests pass
# Merge to main → Firebase deploys automatically
```

### For Hotfixes:
```bash
# 1. Create hotfix branch
git checkout -b hotfix/critical-bug

# 2. Fix and test
npm run test

# 3. Push and create PR
git push origin hotfix/critical-bug

# 4. Tests run on PR
# 5. Emergency merge if needed (with approval)
```

---

## Gradual Rollout Strategy

### Phase 1: Information Only (Week 1)
- Tests run but don't block
- Add `continue-on-error: true` to test step
- Monitor test reliability

### Phase 2: Soft Enforcement (Week 2)
- Remove `continue-on-error`
- Tests block merge but can be overridden
- Fix any flaky tests

### Phase 3: Full Enforcement (Week 3+)
- Tests must pass to merge
- No overrides except emergencies
- Coverage requirements increase

---

## Emergency Procedures

### If Tests Block Critical Fix:
```yaml
# In PR description, add:
[EMERGENCY] Skip Tests

# Or temporarily add to workflow:
if: github.event.pull_request.title != '[EMERGENCY]'
```

### If Firebase Build Fails:
```bash
# Tests don't interfere since they're separate
# Revert main branch commit
git revert HEAD
git push origin main

# Firebase will rebuild with reverted code
```

---

## Monitoring & Alerts

### Add Slack/Discord Notification (Optional):
```yaml
- name: Notify on Failure
  if: failure() && github.event_name == 'pull_request'
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    text: 'Tests failed on PR #${{ github.event.pull_request.number }}'
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

---

## Cost Considerations

### GitHub Actions Minutes (Free Tier):
- 2,000 minutes/month for private repos
- ~5 minutes per test run
- ~400 test runs per month possible

### Optimization Tips:
1. Cache dependencies aggressively
2. Run only affected tests
3. Skip tests on documentation changes
4. Use matrix strategy sparingly

---

## Implementation Checklist

### Immediate (Safe):
- [ ] Create `.github/workflows/test.yml`
- [ ] Add test scripts to package.json
- [ ] Update vitest.config.ts for CI
- [ ] Test on a feature branch first

### After Verification:
- [ ] Enable branch protection for main
- [ ] Add required status checks
- [ ] Document workflow in README

### Later:
- [ ] Add coverage badges
- [ ] Increase coverage thresholds
- [ ] Add performance benchmarks
- [ ] Add visual regression tests

---

## Why This Is Safe

1. **No main branch interference** - Firebase owns push-to-main
2. **PR-based testing** - Catch issues before they reach main
3. **Escape hatches** - Manual overrides for emergencies
4. **Gradual rollout** - Start informational, then enforce
5. **Path filters** - Don't run on docs/config changes
6. **Concurrency control** - Cancel outdated runs
7. **Fast feedback** - Cached, optimized runs

## Final Command to Add Workflow

```bash
# Create the workflow file
mkdir -p .github/workflows
cat > .github/workflows/test.yml << 'EOF'
[paste the workflow content from above]
EOF

# Test on a feature branch FIRST
git checkout -b chore/add-test-workflow
git add .github/workflows/test.yml
git commit -m "chore: add test workflow for PRs only"
git push origin chore/add-test-workflow

# Create PR to test it works
# Then merge to main
```

This approach ensures your Firebase deployments remain untouched while adding quality gates before code reaches main.
