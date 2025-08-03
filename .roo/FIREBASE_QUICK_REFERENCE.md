# 🚨 Firebase Quick Reference - MUST READ

## Before ANY Code Changes

### ✅ Dependency Check
```bash
# WRONG ❌
"devDependencies": {
  "tailwindcss": "^4.0.0"  # Will FAIL on Firebase!
}

# CORRECT ✅
"dependencies": {
  "tailwindcss": "^4.0.0"  # Works on Firebase
}
```

### ✅ Tailwind CSS 4 Syntax
```css
/* WRONG ❌ */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* CORRECT ✅ */
@config "../../tailwind.config.ts";
@import 'tailwindcss';
```

### ✅ API Key Setup
```env
# WRONG ❌
GOOGLE_API_KEY=AIza...  # One key for everything

# CORRECT ✅
FIREBASE_API_KEY=AIza...     # Identity Toolkit API only
GOOGLE_AI_API_KEY=AIza...    # Generative Language API only
```

### ✅ Next.js Config
```typescript
// REQUIRED for Firebase
const nextConfig = {
  output: 'standalone',  // MUST have this!
  typescript: {
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true
  }
}
```

## Agent-Specific Reminders

### 🎨 kbe-ui Agent
- ALWAYS use new Tailwind CSS 4 syntax
- CHECK globals.css has @config directive
- VERIFY CSS variables are scoped correctly

### 🔌 kbe-api Agent  
- NEVER share API keys between services
- CHECK Firebase API key has Identity Toolkit enabled
- VERIFY auth configuration before testing

### ⚡ kbe-performance Agent
- MOVE all build deps to dependencies
- CHECK standalone output is generated
- VERIFY bundle includes all requirements

### 🐛 kbe-debug Agent
- IF CSS not rendering → Check Tailwind syntax
- IF auth failing → Check API key permissions  
- IF build failing → Check dependencies location

## Pre-Deployment Checklist

```bash
# 1. Check dependencies
grep -E "(tailwindcss|typescript)" package.json | grep dependencies

# 2. Verify Tailwind config
grep "@config" src/app/globals.css

# 3. Test build locally
npm run build && ls -la .next/standalone

# 4. Check env vars
echo "Firebase Key: ${FIREBASE_API_KEY:0:10}..."
echo "GenKit Key: ${GOOGLE_AI_API_KEY:0:10}..."
```

## Emergency Commands

```bash
# Fix dependencies quickly
npm uninstall -D tailwindcss @tailwindcss/postcss typescript
npm install tailwindcss @tailwindcss/postcss typescript

# Test Firebase compatibility
firebase emulators:start

# Debug auth issues
node scripts/debug-magic-link.js
```

## Golden Rule

**When in doubt, remember:**
> Firebase App Hosting ≠ Vercel/Netlify

What works locally might NOT work on Firebase. Always validate!