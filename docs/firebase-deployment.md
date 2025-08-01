# Firebase App Hosting Deployment Guide

This document captures all lessons learned from deploying the KBE Website to Firebase App Hosting with Next.js 15.4.5, React 19, and Tailwind CSS 4.

## Prerequisites

1. Firebase CLI installed and authenticated
2. Google Cloud CLI installed and authenticated
3. Access to the Firebase project and Google Cloud project
4. All environment variables configured in Google Cloud Secret Manager

## Key Deployment Constraints

### 1. Dependency Management
Firebase App Hosting runs `npm ci --omit=dev` in production, which means:
- **ALL** production dependencies must be in `dependencies`, NOT `devDependencies`
- This includes TypeScript, Tailwind CSS, PostCSS, and any build tools
- Only true development-only tools (like ESLint configs) should be in `devDependencies`

### 2. Version Compatibility
- **Zod**: Must use v3 (not v4) for GenKit compatibility
  - GenKit 1.15.5 requires `zod@^3.24.1`
  - Using Zod v4 will cause `npm prune --production` to fail
- **Node.js**: Use version 22 (specified in apphosting.yaml)
- **Next.js**: 15.4.5 works with Firebase App Hosting

### 3. Build Configuration
- Firebase overwrites `next.config.js` during deployment
- This is intentional - Firebase needs to configure Next.js for serverless
- Do NOT try to preserve custom webpack configs
- TypeScript path aliases (`@/*`) work automatically via Next.js

### 4. File Visibility
- Check BOTH `.gitignore` AND `~/.gitignore_global`
- Files ignored globally won't be in the repo and cause build failures
- Common issue: `lib/` or `src/lib/` in global gitignore

## Deployment Checklist

1. **Verify all files are committed**:
   ```bash
   git status
   git ls-files | grep "src/lib"  # Ensure lib files are tracked
   ```

2. **Check dependency placement**:
   ```bash
   npm ls typescript  # Should be in dependencies, not devDependencies
   npm ls @tailwindcss/postcss  # Should be in dependencies
   ```

3. **Verify Zod version**:
   ```bash
   npm ls zod  # Should show ^3.x.x, not 4.x.x
   ```

4. **Grant secret access**:
   ```bash
   firebase apphosting:secrets:grantaccess
   ```

5. **Deploy**:
   ```bash
   git push origin main  # Triggers automatic deployment
   ```

## Troubleshooting

### "Module not found" errors
1. Check if file exists locally: `ls -la src/lib/`
2. Check if file is in Git: `git ls-files | grep filename`
3. Check global gitignore: `cat ~/.gitignore_global`
4. Force add if needed: `git add -f src/lib/filename.ts`

### Peer dependency conflicts
1. Check GenKit's peer dependencies: `npm info @genkit-ai/next peerDependencies`
2. Downgrade conflicting packages to match
3. Clean install: `rm -rf node_modules package-lock.json && npm install`

### PostCSS/Tailwind errors
1. Move to dependencies: `npm uninstall --save-dev @tailwindcss/postcss && npm install @tailwindcss/postcss`
2. Same for any other build-time CSS tools

### Firebase config overwrites
This is normal! Firebase needs to:
- Configure Next.js for serverless deployment
- Set up proper routing for App Hosting
- Optimize for Google Cloud Run

Don't fight it - work with it.

## Environment Variables

All secrets must be in Google Cloud Secret Manager and referenced in `apphosting.yaml`:

```yaml
env:
  - variable: NEXT_PUBLIC_FIREBASE_API_KEY
    secret: NEXT_PUBLIC_FIREBASE_API_KEY
  - variable: GENKIT_API_KEY
    secret: GENKIT_API_KEY
  # ... etc
```

## Working Build Configuration

### package.json
```json
{
  "scripts": {
    "build": "next build"
  },
  "dependencies": {
    // All production deps here, including:
    "typescript": "^5.7.3",
    "@tailwindcss/postcss": "^4.0.0",
    "zod": "^3.23.8"  // NOT v4!
  }
}
```

### apphosting.yaml
```yaml
runConfig:
  maxInstances: 1

env:
  - variable: NODEJS_VERSION
    value: "22"
  # ... all your secrets

buildConfig:
  buildCommand: "npm run build"
```

### tsconfig.json
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## What NOT to Do

1. Don't create custom webpack configs for path aliases
2. Don't try to preserve next.config.js during build
3. Don't use .npmrc with `legacy-peer-deps` unless absolutely necessary
4. Don't put production dependencies in devDependencies
5. Don't upgrade to Zod v4 while using GenKit
6. Don't forget to check global gitignore files

## Success Metrics

A successful deployment will show:
1. "Next.js build completed successfully"
2. "Creating container image"
3. "Deploying to Cloud Run"
4. "Deployment successful"

The app should be accessible at your Firebase Hosting URL.