# Stage 4: Framework Compatibility & Modern Stack Verification

## Context from Previous Stages

- **Build**: ✅ Success in 13s, 45/46 static routes
- **Bundle Issues**: 3 pages > 290KB (calendar, register, admin/communications)
- **Missing**: Code splitting, error boundaries, Suspense
- **Framework**: Next.js 15 + React 19 + Tailwind 4
- **UI Libraries**: Radix UI, shadcn/ui, embla-carousel, recharts

---

## 4.1 React 19 Compatibility Deep Dive

### Check React Version and Features

```bash
# Verify React 19 installation
cat package.json | grep -E '"react":|"react-dom":'

# Check for React 19 deprecated features
grep -r "componentWillMount\|componentWillReceiveProps\|componentWillUpdate\|UNSAFE_" src/ app/ --include="*.tsx" --include="*.jsx"

# Look for Legacy Context API
grep -r "childContextTypes\|contextTypes\|getChildContext" src/ app/ --include="*.tsx"

# Check for findDOMNode usage (removed in React 19)
grep -r "findDOMNode" src/ app/ --include="*.tsx"

# Check for string refs (long deprecated)
grep -r 'ref="' src/ app/ --include="*.tsx"
```

### React 19 New Features Usage

```bash
# Check for use() hook usage (new in React 19)
grep -r "use(" src/ app/ --include="*.tsx" | grep -v "useState\|useEffect\|useCallback\|useMemo\|useRef"

# Check for React Server Components patterns
grep -r "async function.*Page\|export default async function" app/ --include="*.tsx"

# Look for Form Actions (new pattern)
grep -r "<form action=" app/ --include="*.tsx"

# Check for useFormStatus hook
grep -r "useFormStatus" src/ app/ --include="*.tsx"

# Check for useOptimistic hook
grep -r "useOptimistic" src/ app/ --include="*.tsx"
```

### Hydration and Streaming

```bash
# Check for Suspense usage with SSR
grep -r "<Suspense" src/ app/ --include="*.tsx"

# Look for streaming patterns
grep -r "loading.tsx" app/

# Check for generateMetadata (async metadata)
grep -r "generateMetadata" app/ --include="*.tsx"
```

---

## 4.2 Next.js 15 Specific Features

### App Router Patterns

```bash
# Check for route groups
find app -type d -name "(*)"

# Check for parallel routes
find app -type d -name "@*"

# Check for intercepting routes
find app -type d -name "(.)*"

# Look for route handlers
find app -name "route.ts" -o -name "route.js"

# Check for metadata API usage
grep -r "export const metadata\|export async function generateMetadata" app/ --include="*.tsx"
```

### Next.js 15 Optimizations

```bash
# Check for Partial Prerendering config
cat next.config.mjs | grep -E "experimental:|ppr:"

# Look for dynamic = 'force-static' or 'force-dynamic'
grep -r "export const dynamic" app/ --include="*.tsx" --include="*.ts"

# Check for revalidate settings
grep -r "export const revalidate" app/ --include="*.tsx" --include="*.ts"

# Check for fetchCache settings
grep -r "export const fetchCache" app/ --include="*.tsx" --include="*.ts"
```

### Server Actions Analysis

```bash
# Find all server actions
grep -r "^'use server'" app/ lib/ src/ --include="*.ts" --include="*.tsx"

# Check for action imports
grep -r "import.*from.*actions" app/ --include="*.tsx"

# Look for form actions using server actions
grep -r "action={" app/ --include="*.tsx" | grep -v "action=\""
```

---

## 4.3 Tailwind 4 Migration Status

### Tailwind Configuration

```bash
# Check Tailwind version
cat package.json | grep tailwindcss

# Verify PostCSS setup for v4
cat postcss.config.mjs

# Check for CSS file structure
find . -name "*.css" | grep -v node_modules | head -20

# Look for @import in CSS (v4 pattern)
grep -r "@import" src/ app/ --include="*.css"

# Check for theme() and screen() functions (v4 changes)
grep -r "theme(\|screen(" src/ app/ --include="*.css"
```

### Deprecated Tailwind 3 Patterns

```bash
# Check for @apply with complex utilities
grep -r "@apply" src/ app/ --include="*.css" | head -20

# Look for removed utilities
grep -rE "decoration-slice|decoration-clone|filter-none|backdrop-filter" src/ app/ --include="*.tsx"

# Check for JIT-only patterns that changed
grep -rE "\[&:.*\]\:|group-\[.*\]:" src/ app/ --include="*.tsx" | head -10

# Verify arbitrary value usage
grep -rE "w-\[|h-\[|m-\[|p-\[" src/ app/ --include="*.tsx" | head -10
```

---

## 4.4 UI Library Compatibility (Radix/shadcn)

### Radix UI React 19 Compatibility

```bash
# Check Radix versions
cat package.json | grep "@radix-ui"

# Count Radix component usage
grep -r "@radix-ui" src/components/ui --include="*.tsx" | cut -d'"' -f2 | sort -u | wc -l

# Check for forwardRef usage (React 19 changes)
grep -r "forwardRef" src/components/ui --include="*.tsx" | wc -l

# Look for displayName (required for forwardRef)
grep -r "displayName" src/components/ui --include="*.tsx" | wc -l
```

### shadcn/ui Pattern Verification

```bash
# Check cn utility usage
grep -r "cn(" src/ --include="*.tsx" | wc -l

# Verify component exports pattern
for file in src/components/ui/*.tsx; do
  echo "Checking $file:"
  grep -E "export \{ .* \}|export default" "$file" | head -1
done | head -20

# Check for CSS variables usage (shadcn pattern)
grep -r "hsl(var(" src/ --include="*.css"
```

---

## 4.5 Heavy Component Analysis (Bundle Size Focus)

### Identify Heavy Dependencies

```bash
# Find recharts usage (heavy library)
grep -r "recharts" src/ app/ --include="*.tsx" | cut -d: -f1 | sort -u

# Find embla-carousel usage
grep -r "embla-carousel" src/ app/ --include="*.tsx" | cut -d: -f1 | sort -u

# Check react-day-picker usage
grep -r "react-day-picker" src/ app/ --include="*.tsx" | cut -d: -f1 | sort -u

# Look for potential lazy load candidates
echo "=== Files importing heavy libraries ==="
grep -rE "recharts|embla|day-picker" src/ app/ --include="*.tsx" | cut -d: -f1 | sort -u
```

### Code Splitting Opportunities

```bash
# Check if dynamic imports are used for heavy components
grep -r "dynamic(" src/ app/ --include="*.tsx"

# Check if lazy/Suspense is used
grep -r "lazy(" src/ app/ --include="*.tsx"

# Analyze the heavy pages from Stage 3
echo "=== Analyzing /calendar page ==="
grep -E "import.*from|require\(" app/calendar/page.tsx 2>/dev/null | head -20

echo "=== Analyzing /register page ==="
grep -E "import.*from|require\(" app/register/page.tsx 2>/dev/null | head -20

echo "=== Analyzing /admin/communications page ==="
grep -E "import.*from|require\(" app/admin/communications/page.tsx 2>/dev/null | head -20
```

---

## 4.6 Database & Firebase Integration

### Firebase Client Usage

```bash
# Check Firebase SDK version
cat package.json | grep "firebase"

# Analyze Firebase imports
grep -r "firebase/auth\|firebase/firestore\|firebase/storage" src/ --include="*.ts" --include="*.tsx" | cut -d: -f2 | sort -u

# Check for proper auth state management
grep -r "onAuthStateChanged\|onIdTokenChanged" src/ --include="*.tsx"

# Look for Firestore real-time listeners
grep -r "onSnapshot" src/ --include="*.tsx"
```

### Firebase Admin SDK

```bash
# Check admin SDK usage
grep -r "firebase-admin" src/lib --include="*.ts"

# Look for service account usage
grep -r "serviceAccount\|getAuth\|getFirestore" src/lib/firebase-admin.ts

# Check for proper error handling
grep -A 2 -B 2 "catch" src/lib/firebase-admin.ts | head -30
```

---

## 4.7 Performance Patterns

### Check for Performance Anti-patterns

```bash
# Look for useEffect with missing dependencies
npx eslint src/ app/ --rule 'react-hooks/exhaustive-deps: error' --no-eslintrc 2>&1 | grep -c "error"

# Check for large inline functions in JSX
grep -r "onClick={() => {" src/ app/ --include="*.tsx" | wc -l

# Look for array index as key
grep -r "key={index}\|key={i}" src/ app/ --include="*.tsx"

# Check for unnecessary re-renders (inline objects/arrays)
grep -r "style={{" src/ app/ --include="*.tsx" | wc -l
```

---

## 4.8 Production Readiness Checks

### Security Headers (Next.js 15)

```bash
# Check security headers configuration
cat next.config.mjs | grep -A 30 "headers"

# Look for Content Security Policy
cat next.config.mjs | grep -i "content-security-policy"

# Check for API rate limiting
grep -r "rate.*limit\|throttle" src/ app/api --include="*.ts"
```

### SEO and Metadata

```bash
# Check sitemap
ls -la app/sitemap.ts app/sitemap.xml 2>/dev/null

# Check robots.txt
ls -la app/robots.ts public/robots.txt 2>/dev/null

# Count pages with metadata
grep -r "export const metadata\|generateMetadata" app/ --include="*.tsx" | wc -l

# Check for Open Graph images
find app -name "opengraph-image.*" -o -name "twitter-image.*"
```

---

## Report Template for Stage 4

```markdown
# Stage 4 Audit Report: Framework Compatibility

**Date**: [DATE]
**React Version**: [VERSION]
**Next.js Version**: [VERSION]
**Tailwind Version**: [VERSION]

## 4.1 React 19 Compatibility

- **Deprecated Features Found**: [COUNT]
- **New Features Used**: [LIST]
- **Hydration Issues**: [YES/NO]
- **Server Components**: [COUNT]

## 4.2 Next.js 15 Features

- **App Router**: ✅
- **Server Actions**: [COUNT]
- **Metadata API**: [USAGE]
- **Route Types**: [BREAKDOWN]

## 4.3 Tailwind 4 Status

- **Version**: [VERSION]
- **Deprecated Patterns**: [COUNT]
- **Migration Complete**: [YES/NO]

## 4.4 Bundle Optimization Opportunities

### Heavy Components Found:

- [COMPONENT]: [SIZE/LOCATION]

### Code Splitting Candidates:

1. /calendar - Uses: [LIBRARIES]
2. /register - Uses: [LIBRARIES]
3. /admin/communications - Uses: [LIBRARIES]

## 4.5 Performance Issues

- **Missing Dependencies**: [COUNT]
- **Anti-patterns**: [LIST]
- **Optimization Opportunities**: [LIST]

## Critical Compatibility Issues

[Any breaking changes or incompatibilities]

## Recommendations

### Immediate Actions:

1. [Action with specific command/code]

### Performance Optimizations:

1. [Specific optimization with code example]

### Framework Updates:

1. [Any needed version updates]
```

---

## Decision Gate for Stage 5

**Proceed to Stage 5 (Security & Firebase) if:**

- ✅ No React 19 breaking changes
- ✅ Tailwind 4 working properly
- ✅ UI libraries compatible

**Stop and fix if:**

- ❌ React 19 incompatibilities found
- ❌ Tailwind 4 migration incomplete
- ❌ Critical performance anti-patterns

---

## Fix Script for Common Issues

```bash
#!/bin/bash
# Stage 4 Quick Fixes

# 1. Add code splitting for heavy pages
cat > implement-code-splitting.md << 'EOF'
# Code Splitting Implementation

## For Calendar Page (with recharts):
\`\`\`tsx
import dynamic from 'next/dynamic';

const DynamicChart = dynamic(
  () => import('@/components/CalendarChart'),
  {
    loading: () => <div>Loading calendar...</div>,
    ssr: false
  }
);
\`\`\`

## For Register Page:
\`\`\`tsx
const DynamicRegistrationForm = dynamic(
  () => import('@/components/RegistrationForm'),
  { loading: () => <Skeleton /> }
);
\`\`\`
EOF

# 2. Add Suspense boundaries
cat > add-suspense.tsx << 'EOF'
// app/calendar/page.tsx
import { Suspense } from 'react';
import CalendarSkeleton from './CalendarSkeleton';

export default function CalendarPage() {
  return (
    <Suspense fallback={<CalendarSkeleton />}>
      <CalendarContent />
    </Suspense>
  );
}
EOF

echo "✅ Stage 4 fix templates created"
```
