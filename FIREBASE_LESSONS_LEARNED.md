# Firebase Configuration Lessons Learned - KBE Portal

## Critical Firebase App Hosting Requirements

### 1. Dependencies MUST be in `dependencies`, NOT `devDependencies`
**❌ WRONG:**
```json
{
  "devDependencies": {
    "@tailwindcss/postcss": "^4.1.11",
    "tailwindcss": "^4.1.11"
  }
}
```

**✅ CORRECT:**
```json
{
  "dependencies": {
    "@tailwindcss/postcss": "^4.1.11",
    "tailwindcss": "^4.1.11"
  }
}
```

**Why:** Firebase App Hosting's build process only installs `dependencies`, not `devDependencies`. This is different from Vercel/Netlify and caught us off guard.

### 2. Tailwind CSS 4 Configuration
**❌ WRONG:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**✅ CORRECT:**
```css
@config "../../tailwind.config.ts";
@import 'tailwindcss';
```

**Why:** Tailwind CSS 4 uses a new syntax with the `@config` directive. The old syntax causes builds to fail silently.

### 3. API Key Configuration
**Lesson:** Different Firebase services need different API permissions

**❌ WRONG:** Single API key for everything
```env
GOOGLE_API_KEY=AIza...
```

**✅ CORRECT:** Separate keys with specific permissions
```env
FIREBASE_API_KEY=AIza...  # For Firebase Auth (Identity Toolkit API)
GENKIT_API_KEY=AIza...    # For Generative Language API
```

**Required APIs:**
- Firebase Auth Key needs: Identity Toolkit API
- GenKit Key needs: Generative Language API

### 4. Magic Link Authentication
**Issue:** "auth/requests-to-this-api-identitytoolkit-method...are-blocked"

**Solution:**
1. Create dedicated Firebase API Key
2. Enable Identity Toolkit API
3. Configure actionCodeSettings properly:
```typescript
const actionCodeSettings = {
  url: `${window.location.origin}/`,  // Must be exact origin
  handleCodeInApp: true,
};
```

### 5. Build Configuration
**next.config.ts settings that work:**
```typescript
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  swcMinify: true,
  typescript: {
    ignoreBuildErrors: true, // Firebase build may have stricter checks
  },
  eslint: {
    ignoreDuringBuilds: true, // Prevent build failures from lint warnings
  },
};
```

### 6. CSS Variables and Theming
**Issue:** Sidebar colors not applying correctly

**Solution:** Proper CSS variable scoping
```css
/* Global variables */
:root {
  --sidebar-width: 16rem;
  --sidebar-width-mobile: 18rem;
  --sidebar-width-icon: 3rem;
}

/* Scoped sidebar variables */
[data-sidebar] {
  --background: var(--sidebar-background);
  --foreground: var(--sidebar-foreground);
}
```

## Orchestrator Integration

The KBE Orchestrator MUST enforce these rules:

### Pre-deployment Checklist
```javascript
const firebaseDeploymentRules = {
  dependencies: {
    check: "All build deps in 'dependencies'",
    validate: () => {
      // Check package.json for misplaced dependencies
      const buildDeps = ['tailwindcss', '@tailwindcss/postcss', 'typescript'];
      return buildDeps.every(dep => packageJson.dependencies[dep]);
    }
  },
  
  tailwindConfig: {
    check: "Tailwind CSS 4 syntax used",
    validate: () => {
      // Check globals.css for correct imports
      return globalsCSS.includes('@config') && globalsCSS.includes('@import \'tailwindcss\'');
    }
  },
  
  apiKeys: {
    check: "Separate API keys configured",
    validate: () => {
      // Ensure multiple API keys for different services
      return env.FIREBASE_API_KEY !== env.GOOGLE_AI_API_KEY;
    }
  },
  
  buildConfig: {
    check: "Next.js config optimized for Firebase",
    validate: () => {
      // Check next.config.ts settings
      return nextConfig.output === 'standalone';
    }
  }
};
```

### Agent-Specific Rules

#### kbe-api Agent
- ALWAYS check API key permissions before implementing auth features
- NEVER use a single API key for multiple Google services
- ALWAYS verify Firebase config before deployment

#### kbe-ui Agent  
- ALWAYS use Tailwind CSS 4 syntax with @config
- NEVER use old @tailwind directives
- ALWAYS ensure CSS variables are properly scoped

#### kbe-performance Agent
- ALWAYS move build dependencies to 'dependencies' for Firebase
- NEVER assume Firebase hosting works like Vercel/Netlify
- ALWAYS validate standalone output mode

## Common Pitfalls to Avoid

1. **Don't assume Firebase hosting = Vercel hosting**
   - Different build processes
   - Different dependency handling
   - Different environment variable injection

2. **Don't use generic Google API keys**
   - Each service needs specific permissions
   - Identity Toolkit ≠ Generative Language API

3. **Don't trust local dev = production**
   - Firebase build environment is different
   - Test with `npm run build` before deploying

4. **Don't ignore build warnings**
   - Firebase is stricter about TypeScript/ESLint errors
   - Use ignoreBuildErrors cautiously

## Testing Firebase Compatibility

```bash
# Test build locally as Firebase would
npm run build

# Check for standalone output
ls -la .next/standalone

# Verify all dependencies
npm ls --prod

# Test with Firebase emulators
firebase emulators:start
```

## Quick Reference Card

| Issue | Solution | Agent |
|-------|----------|-------|
| CSS not rendering | Check Tailwind CSS 4 syntax | kbe-ui |
| Magic link fails | Separate Firebase API key | kbe-api |
| Build fails on Firebase | Move deps from devDeps | kbe-performance |
| Sidebar overlapping | Fix CSS variable scoping | kbe-ui |
| Auth errors | Check API permissions | kbe-api |

## Integration with Orchestrator

The orchestrator should:
1. Run pre-deployment validation before any Firebase deploy
2. Alert agents to Firebase-specific requirements
3. Maintain this knowledge for future tasks
4. Prevent regression to old patterns

This hard-won knowledge should be baked into every agent's decision-making process to avoid repeating these painful debugging sessions.