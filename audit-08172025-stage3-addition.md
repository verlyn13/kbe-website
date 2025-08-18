# Stage 3: Build & Runtime Verification

## Context from Previous Stages
- **TypeScript**: Clean compilation in 8.74s
- **Framework**: Next.js with App Router
- **Deployment**: Firebase App Hosting
- **Known Issues**: 91 'any' types, no tests, 2 large files
- **API Routes**: 1 webhook route without validation

---

## 3.1 Production Build Analysis

### Clean Build Test
```bash
# Remove previous build artifacts
rm -rf .next
rm -rf out

# Set production environment and build with detailed output
NODE_ENV=production npm run build 2>&1 | tee build-output.log

# Capture build summary
echo "=== BUILD SUMMARY ===" >> build-output.log
grep -E "Route \(app\)|├|└|○|●|λ" build-output.log

# Check build output structure
ls -la .next/
ls -la .next/static/chunks/ | head -10
ls -la .next/server/app/ 2>/dev/null | head -10
```

**Capture:**
- Build time
- Route types (○ Static, λ Dynamic, ● ISR)
- Bundle sizes
- Any warnings or errors

### Bundle Size Analysis
```bash
# Get page bundle sizes
grep -A 50 "Route (app)" build-output.log | grep -E "kB|MB"

# Find largest JavaScript chunks
find .next/static/chunks -name "*.js" -type f -exec ls -lh {} \; | sort -k5 -hr | head -10

# Calculate total bundle size
du -sh .next/static/chunks/

# Check for large pages
grep -E "First Load JS" build-output.log | grep -E "[0-9]+ kB" | sort -t' ' -k4 -n -r | head -5
```

**Pass Criteria:**
- First Load JS < 200KB for main pages
- No individual chunk > 500KB
- Build completes without errors

### Check for Build Warnings
```bash
# Extract all warnings
grep -i "warn" build-output.log | grep -v "node_modules"

# Check for unused exports
grep -i "unused" build-output.log

# Check for missing dependencies
grep -i "not found\|missing" build-output.log
```

---

## 3.2 Static vs Dynamic Route Analysis

### Identify Route Types
```bash
# List all app routes
find app -name "page.tsx" -o -name "route.ts" | sort

# Check for dynamic routes
find app -name "*\[*\]*" | sort

# Look for generateStaticParams
grep -r "generateStaticParams" app/ --include="*.tsx"

# Check for dynamic functions
grep -r "cookies\|headers\|searchParams" app/ --include="*.tsx" | grep -v "// " | head -10

# Identify routes using 'use client'
grep -r "^'use client'" app/ --include="*.tsx" | cut -d: -f1 | sort -u
```

**Document:**
- Static routes (can be cached at edge)
- Dynamic routes (require server execution)
- Client components vs Server components ratio

---

## 3.3 Development vs Production Parity Check

### Start Production Server
```bash
# Build and start production server
npm run build
PORT=3000 npm start > prod-server.log 2>&1 &
PROD_PID=$!
sleep 5

# Verify server started
curl -I http://localhost:3000 | head -5

# Capture production HTML for key pages
curl -s http://localhost:3000 > prod-home.html
curl -s http://localhost:3000/pricing > prod-pricing.html 2>/dev/null || echo "No pricing page"
curl -s http://localhost:3000/login > prod-login.html 2>/dev/null || echo "No login page"

# Kill production server
kill $PROD_PID
```

### Start Development Server
```bash
# Start dev server (with Turbo if available)
PORT=3000 npm run dev > dev-server.log 2>&1 &
DEV_PID=$!
sleep 10

# Capture development HTML
curl -s http://localhost:3000 > dev-home.html
curl -s http://localhost:3000/pricing > dev-pricing.html 2>/dev/null || echo "No pricing page"
curl -s http://localhost:3000/login > dev-login.html 2>/dev/null || echo "No login page"

# Kill dev server
kill $DEV_PID
```

### Compare Outputs
```bash
# Compare HTML structure (ignore React dev IDs)
diff -u prod-home.html dev-home.html | grep -v "data-react\|<!--\|__next" | head -30

# Check for hydration markers
grep -c "data-reactroot\|__next" prod-home.html
grep -c "data-reactroot\|__next" dev-home.html

# Look for console errors in dev log
grep -i "error\|warning" dev-server.log | head -10
```

**Pass Criteria:**
- No significant HTML structure differences
- No hydration warnings in development
- Both environments render the same content

---

## 3.4 API Routes & Server Functions

### Test API Routes
```bash
# Find all API routes
find app -path "*/api/*" -name "route.ts" | while read route; do
  echo "Found API route: $route"
  # Extract HTTP methods
  grep -E "export async function (GET|POST|PUT|DELETE|PATCH)" "$route"
done

# Test SendGrid webhook (from Stage 2 finding)
curl -X POST http://localhost:3000/api/webhooks/sendgrid \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}' \
  -w "\nStatus: %{http_code}\n" 2>/dev/null || echo "Server not running"
```

### Check Server Actions
```bash
# Find server actions (use server directive)
grep -r "^'use server'" app/ lib/ --include="*.ts" --include="*.tsx"

# Find server components calling async functions
grep -r "async function.*Page\|export default async function" app/ --include="*.tsx" | head -10
```

---

## 3.5 Environment Variables & Configuration

### Check Environment Setup
```bash
# List all environment variables used
grep -r "process.env\." src/ app/ lib/ --include="*.ts" --include="*.tsx" | \
  sed 's/.*process\.env\.\([A-Z_]*\).*/\1/' | sort -u > used-env-vars.txt

echo "=== Environment Variables Used ==="
cat used-env-vars.txt

# Check which are NEXT_PUBLIC
grep "^NEXT_PUBLIC_" used-env-vars.txt

# Verify .env.example completeness
for var in $(cat used-env-vars.txt); do
  grep -q "$var" .env.example 2>/dev/null || echo "⚠️ Missing in .env.example: $var"
done
```

### Firebase Configuration Check
```bash
# Check Firebase client config
grep -A 10 "const firebaseConfig" src/lib/firebase-config.ts

# Check for Firebase Admin setup
grep -l "firebase-admin" src/lib/*.ts

# Verify service account handling
grep -r "serviceAccountKey\|GOOGLE_APPLICATION_CREDENTIALS" . --include="*.ts" --exclude-dir=node_modules
```

---

## 3.6 Image Optimization

### Check Image Usage
```bash
# Find all image imports
grep -r "next/image" app/ src/ --include="*.tsx" -l | wc -l
echo "Files using next/image: $(grep -r "next/image" app/ src/ --include="*.tsx" -l | wc -l)"

# Find native img tags (should be 0)
grep -r "<img " app/ src/ --include="*.tsx" | grep -v "next/image\|{/\*\|//"
echo "Native <img> tags found: $(grep -r "<img " app/ src/ --include="*.tsx" | grep -v "next/image\|{/\*\|//" | wc -l)"

# Check image configuration
cat next.config.mjs | grep -A 20 "images:"

# Find image files in public
find public -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" -o -name "*.webp" -o -name "*.svg" \) | head -20
```

**Pass Criteria:**
- All images use next/image component
- Image domains configured in next.config.mjs
- No unoptimized image tags

---

## 3.7 Middleware & Redirects

### Check Middleware
```bash
# Look for middleware file
ls -la middleware.ts 2>/dev/null || ls -la src/middleware.ts 2>/dev/null || echo "No middleware found"

# Check for redirects in next.config
cat next.config.mjs | grep -A 20 "redirects\|rewrites"

# Find programmatic redirects
grep -r "redirect\|permanentRedirect" app/ --include="*.tsx" --include="*.ts" | head -10
```

---

## 3.8 Performance Optimizations

### Check Lazy Loading
```bash
# Find dynamic imports (code splitting)
grep -r "dynamic\|lazy" app/ src/ --include="*.tsx" | grep -E "import|require" | head -10

# Check for Suspense boundaries
grep -r "<Suspense" app/ src/ --include="*.tsx" -c | sort -n -r | head -5

# Look for loading states
find app -name "loading.tsx" | head -10
```

### Font Optimization
```bash
# Check font configuration
grep -r "next/font" app/ src/ --include="*.tsx" --include="*.ts"

# Look for custom fonts
ls -la public/fonts/ 2>/dev/null || echo "No custom fonts directory"
```

---

## 3.9 Error Handling

### Check Error Boundaries
```bash
# Find error.tsx files
find app -name "error.tsx"

# Find not-found.tsx files  
find app -name "not-found.tsx"

# Check for try-catch in server components
grep -r "try {" app/ --include="*.tsx" | grep -v "use client" | head -10
```

---

## Report Template for Stage 3

```markdown
# Stage 3 Audit Report: Build & Runtime Verification
**Date**: [DATE]
**Build Time**: [TIME]
**Bundle Size**: [SIZE]

## 3.1 Build Health
- **Build Status**: ✅/❌
- **Build Time**: [X]s
- **Warnings**: [COUNT]
- **Total Bundle Size**: [SIZE]

### Route Analysis
- **Static Routes**: [COUNT]
- **Dynamic Routes**: [COUNT]
- **API Routes**: [COUNT]

### Largest Pages
1. [PAGE]: [SIZE]
2. [PAGE]: [SIZE]

## 3.2 Runtime Parity
- **Dev/Prod Differences**: [COUNT]
- **Hydration Issues**: [YES/NO]
- **Console Errors**: [COUNT]

## 3.3 Optimization Status
- **Images Optimized**: [X/Y]
- **Code Splitting**: [YES/NO]
- **Fonts Optimized**: [YES/NO]
- **Suspense Boundaries**: [COUNT]

## Critical Issues
[List any build failures or runtime errors]

## Recommendations
[Specific optimization suggestions]

## Fix Commands
[Automated fixes if applicable]
```

---

## Decision Gate for Stage 4

**Proceed to Stage 4 if:**
- ✅ Build completes successfully
- ✅ No runtime errors
- ✅ Bundle size reasonable (< 500KB main)

**Stop and fix if:**
- ❌ Build fails
- ❌ Dev/Prod parity issues
- ❌ Bundle size > 1MB for main pages

---

## Execution Notes

1. **Run with servers stopped** initially
2. **Start/stop servers** as needed for tests
3. **Capture all outputs** including errors
4. **Note Firebase-specific** configurations
5. **Document bundle sizes** precisely
6. **Check Firebase deployment** readiness
