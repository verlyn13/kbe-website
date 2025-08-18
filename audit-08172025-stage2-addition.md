# Stage 2: Type Safety & Code Quality Audit

## Context from Stage 1

- **Package Manager**: npm (not pnpm)
- **Node Version**: 22.12.0
- **Framework**: Next.js with TypeScript
- **Known Issues**: 3 deprecation warnings, 2 low vulnerabilities

---

## 2.1 TypeScript Compilation Health

### Full Type Check

```bash
# Check if TypeScript is configured
cat tsconfig.json | head -20

# Run full type check with detailed diagnostics
time npx tsc --noEmit --extendedDiagnostics 2>&1 | tee typecheck-output.log

# Count and categorize errors
grep -c "error TS" typecheck-output.log || echo "0 errors"
grep "error TS" typecheck-output.log | head -10

# Extract compilation metrics
grep -E "Files:|Lines:|Nodes:|Identifiers:|Symbols:|Types:|Instantiations:|Memory used:|Time:" typecheck-output.log
```

**Expected Output to Capture:**

- Total error count
- Error categories (if any)
- Compilation time
- Memory usage
- File count

**Pass Criteria:**

- 0 TypeScript errors
- Compilation time < 30 seconds
- No out-of-memory errors

### Check for 'any' Usage

```bash
# Find explicit 'any' types
grep -r ": any" src/ app/ --include="*.ts" --include="*.tsx" | grep -v "node_modules" | head -20

# Count total 'any' usage
grep -r ": any" src/ app/ --include="*.ts" --include="*.tsx" | wc -l

# Find implicit any (functions without return types)
grep -r "^export.*function.*{$" src/ app/ --include="*.ts" --include="*.tsx" | head -10
```

**Document:** Files with excessive 'any' usage for refactoring

---

## 2.2 ESLint Analysis

### Run ESLint

```bash
# Check ESLint configuration
cat .eslintrc.json 2>/dev/null || cat .eslintrc.js 2>/dev/null || echo "No ESLint config found"

# Run linting with detailed output
npm run lint 2>&1 | tee lint-output.log

# If lint script doesn't exist, try directly
npx eslint . --ext .ts,.tsx,.js,.jsx 2>&1 | tee lint-direct-output.log

# Count errors vs warnings
grep -c "error" lint-output.log || echo "0 errors"
grep -c "warning" lint-output.log || echo "0 warnings"

# Get top 5 most common issues
grep -E "error|warning" lint-output.log | sed 's/.*://' | sort | uniq -c | sort -rn | head -5
```

**Capture:**

- Total errors and warnings
- Most common rule violations
- Files with most issues

### Check for React 19 Specific Rules

```bash
# Check if React Hooks rules are enabled
cat .eslintrc.* | grep -E "react-hooks|exhaustive-deps"

# Look for useEffect dependencies issues
npx eslint src/ app/ --rule 'react-hooks/exhaustive-deps: error' --no-eslintrc 2>&1 | head -20
```

---

## 2.3 Prettier Formatting

### Check Formatting Configuration

```bash
# Check Prettier config
cat .prettierrc 2>/dev/null || cat .prettierrc.json 2>/dev/null || cat prettier.config.js 2>/dev/null || echo "No Prettier config"

# Check if format script exists
grep '"format"' package.json

# Run format check
npm run format 2>&1 | tee format-output.log || npx prettier --check "**/*.{js,jsx,ts,tsx,css,md}" 2>&1 | tee format-direct.log

# Count unformatted files
grep -c "\.tsx\?\|\.jsx\?" format-output.log || grep -c "\.tsx\?\|\.jsx\?" format-direct.log || echo "0"
```

**Pass Criteria:** All files formatted consistently

---

## 2.4 Import Organization

### Check for Circular Dependencies

```bash
# Install madge for circular dependency detection (if not present)
npx madge --circular src/ 2>&1 | tee circular-deps.log

# Check for unused exports
npx ts-prune 2>&1 | head -50 || echo "ts-prune not available"
```

### Check Import Paths

```bash
# Look for relative import hell (../../../)
grep -r "from ['\"]\.\.\/\.\.\/\.\.\/" src/ app/ --include="*.ts" --include="*.tsx" | head -10

# Check if path aliases are configured
cat tsconfig.json | grep -A 10 '"paths"'

# Check for absolute imports usage
grep -r "from ['\"]@/" src/ app/ --include="*.tsx" | head -5
```

---

## 2.5 Component Structure Analysis

### Check Component Patterns

```bash
# Find components using forwardRef (React 19 compatibility)
grep -r "forwardRef" src/ app/ components/ --include="*.tsx" | head -10

# Check for proper component exports
find src/components app/components -name "*.tsx" 2>/dev/null | xargs grep -L "export default\|export const" | head -10

# Look for components with too many props (>7)
grep -r "interface.*Props {" src/ app/ --include="*.tsx" -A 15 | grep -c ";" | sort -rn | head -5
```

---

## 2.6 Data Validation with Zod

### Check Zod Schema Coverage

```bash
# Find Zod schemas
grep -r "z\." src/ lib/ app/ --include="*.ts" | grep -E "object|string|number|array" | head -20

# Count schema files
find . -name "*schema*.ts" -o -name "*validation*.ts" | wc -l

# Check if API routes use validation
for file in $(find app/api -name "route.ts" 2>/dev/null); do
  echo "Checking $file for validation:"
  grep -l "parse\|safeParse" "$file" || echo "  ⚠️ No validation found"
done
```

**Pass Criteria:** All API routes have input validation

---

## 2.7 Test Coverage Check (if tests exist)

```bash
# Check for test files
find . -name "*.test.ts" -o -name "*.test.tsx" -o -name "*.spec.ts" | wc -l

# Check test configuration
cat jest.config.js 2>/dev/null || cat vitest.config.ts 2>/dev/null || echo "No test config found"

# If tests exist, run them
npm test -- --coverage 2>&1 | tee test-output.log || echo "No test script found"
```

---

## 2.8 Code Complexity Analysis

### Check File Sizes

```bash
# Find large TypeScript files (>500 lines)
find src/ app/ -name "*.tsx" -o -name "*.ts" | xargs wc -l | sort -rn | head -10

# Find complex functions (if complexity analyzer available)
npx eslint src/ --rule 'complexity: ["error", 10]' --no-eslintrc 2>&1 | head -20 || echo "Complexity check skipped"
```

---

## Report Template for Stage 2

```markdown
# Stage 2 Audit Report: Type Safety & Code Quality

**Date**: [DATE]
**Status**: ✅/⚠️/❌

## 2.1 TypeScript Compilation

- **Errors**: [COUNT]
- **Warnings**: [COUNT]
- **Compile Time**: [TIME]s
- **Files Checked**: [COUNT]
- **Memory Used**: [MB]

### Critical Issues

[List any TS errors with file:line]

## 2.2 Linting Results

- **ESLint Errors**: [COUNT]
- **ESLint Warnings**: [COUNT]
- **Most Common Issues**:
  1. [RULE]: [COUNT] occurrences
  2. [RULE]: [COUNT] occurrences

## 2.3 Code Quality Metrics

- **Files with 'any'**: [COUNT]
- **Circular Dependencies**: [COUNT]
- **Unformatted Files**: [COUNT]
- **Zod Schemas Found**: [COUNT]
- **API Routes with Validation**: [X/Y]

## Recommendations

### Priority 1: Type Safety

- [ ] Fix TypeScript errors in: [FILES]
- [ ] Replace 'any' types with proper types

### Priority 2: Validation

- [ ] Add Zod schemas to: [API_ROUTES]

### Priority 3: Code Organization

- [ ] Break up large files: [FILES]
- [ ] Fix circular dependencies: [MODULES]

## Fix Commands

\`\`\`bash

# Auto-fix ESLint issues

npm run lint -- --fix

# Format all files

npm run format

# Type-check in watch mode for fixing

npx tsc --noEmit --watch
\`\`\`
```

---

## Execution Instructions

1. **Run each command block** sequentially
2. **Capture full output** even if long
3. **Note execution time** for compilation steps
4. **Document any commands that fail** with error messages
5. **Take screenshots** of any visual tools (if using)
6. **Create fix list** with specific file paths

## Decision Gate for Stage 3

**Proceed to Stage 3 if:**

- ✅ TypeScript compiles (0 errors)
- ✅ No critical ESLint errors
- ✅ Core files are properly typed

**Stop and fix if:**

- ❌ TypeScript compilation fails
- ❌ > 100 ESLint errors
- ❌ No type safety in API routes
