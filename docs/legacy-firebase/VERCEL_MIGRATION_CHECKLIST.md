# Vercel Migration Preparation Document
## Firebase App Hosting → Vercel Migration Checklist

Fill out this document completely before starting migration. All information should be current as of the date of migration.

---

## 1. Current Firebase App Hosting Configuration

### Firebase Project Details
- **Project ID**: `kbe-website`
- **Project Number**: `886214990861`
- **Default Region**: `us-central1`
- **Current Hosting URL**: `kbe-website--kbe-website.us-central1.hosted.app`

### apphosting.yaml Contents
```yaml
# Settings to manage and configure a Firebase App Hosting backend.
# https://firebase.google.com/docs/app-hosting/configure

runConfig:
  # Increase this value if you'd like to automatically spin up
  # more instances in response to increased traffic.
  maxInstances: 1

env:
  # Existing config
  - variable: NODEJS_VERSION
    value: '22'

  # Firebase Core Secrets
  - variable: NEXT_PUBLIC_FIREBASE_API_KEY
    secret: NEXT_PUBLIC_FIREBASE_API_KEY
  - variable: NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
    secret: NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
  - variable: NEXT_PUBLIC_FIREBASE_PROJECT_ID
    secret: NEXT_PUBLIC_FIREBASE_PROJECT_ID
  - variable: NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
    secret: NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
  - variable: NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
    secret: NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
  - variable: NEXT_PUBLIC_FIREBASE_APP_ID
    secret: NEXT_PUBLIC_FIREBASE_APP_ID

  # Security Secrets
  - variable: NEXTAUTH_SECRET
    secret: NEXTAUTH_SECRET
  - variable: JWT_SECRET
    secret: JWT_SECRET

  # App Configuration
  - variable: NODE_ENV
    value: 'production'
  - variable: NEXT_PUBLIC_APP_URL
    secret: NEXT_PUBLIC_APP_URL
    availability:
      - BUILD
      - RUNTIME

  # App Check (reCAPTCHA Enterprise)
  - variable: NEXT_PUBLIC_RECAPTCHA_ENTERPRISE_SITE_KEY
    secret: NEXT_PUBLIC_RECAPTCHA_ENTERPRISE_SITE_KEY
    availability:
      - BUILD
      - RUNTIME

  # SendGrid Configuration
  - variable: SENDGRID_API_KEY
    secret: SENDGRID_API_KEY
    availability:
      - RUNTIME

  # SendGrid Template IDs
  - variable: SENDGRID_TEMPLATE_MAGIC_LINK
    secret: SENDGRID_TEMPLATE_MAGIC_LINK
    availability:
      - RUNTIME
  - variable: SENDGRID_TEMPLATE_WELCOME
    secret: SENDGRID_TEMPLATE_WELCOME
    availability:
      - RUNTIME
  - variable: SENDGRID_TEMPLATE_PASSWORD_RESET
    secret: SENDGRID_TEMPLATE_PASSWORD_RESET
    availability:
      - RUNTIME
  - variable: SENDGRID_TEMPLATE_ANNOUNCEMENT
    secret: SENDGRID_TEMPLATE_ANNOUNCEMENT
    availability:
      - RUNTIME
  - variable: SENDGRID_TEMPLATE_REGISTRATION_CONFIRMATION
    secret: SENDGRID_TEMPLATE_REGISTRATION_CONFIRMATION
    availability:
      - RUNTIME

# Build settings for App Hosting
buildConfig:
  buildCommand: 'npm run build'
```

### firebase.json Contents
```json
{
  "firestore": {
    "rules": "firestore.rules"
  }
}
```

### Build Commands
- **Current build command**: `npm run build`
- **Output directory**: `.next`
- **Node version**: `22`
- **Package manager**: [x] npm [ ] yarn [ ] pnpm

---

## 2. Environment Variables

List ALL environment variables currently in use:

### Public Variables (NEXT_PUBLIC_*)
```env
NEXT_PUBLIC_FIREBASE_API_KEY=(stored in Google Secret Manager)
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=kbe-website.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=kbe-website
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=(stored in Google Secret Manager)
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=(stored in Google Secret Manager)
NEXT_PUBLIC_FIREBASE_APP_ID=(stored in Google Secret Manager)
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=(not currently used)
NEXT_PUBLIC_RECAPTCHA_ENTERPRISE_SITE_KEY=(stored in Google Secret Manager)
NEXT_PUBLIC_APP_URL=(stored in Google Secret Manager)
```

### Server-Side Variables
```env
# Security
NEXTAUTH_SECRET=(stored in Google Secret Manager)
JWT_SECRET=(stored in Google Secret Manager)
NODE_ENV=production

# SendGrid
SENDGRID_API_KEY=(stored in Google Secret Manager)
SENDGRID_TEMPLATE_MAGIC_LINK=(stored in Google Secret Manager)
SENDGRID_TEMPLATE_WELCOME=(stored in Google Secret Manager)
SENDGRID_TEMPLATE_PASSWORD_RESET=(stored in Google Secret Manager)
SENDGRID_TEMPLATE_ANNOUNCEMENT=(stored in Google Secret Manager)
SENDGRID_TEMPLATE_REGISTRATION_CONFIRMATION=(stored in Google Secret Manager)

# Firebase Admin (mentioned in .env.example but not in apphosting.yaml)
FIREBASE_ADMIN_PROJECT_ID=(potentially needed)
FIREBASE_ADMIN_CLIENT_EMAIL=(potentially needed)
FIREBASE_ADMIN_PRIVATE_KEY=(potentially needed)
```

### Secret Manager References
- [x] Secrets exist in Google Secret Manager (all above marked as "stored in Google Secret Manager")

---

## 3. Domain Configuration

### Current Domains
| Domain | Type | DNS Provider | Current Points To |
|--------|------|--------------|-------------------|
| homerenrichment.com | Primary | Cloudflare | Firebase App Hosting (via Google IPs) |
| www.homerenrichment.com | Redirect | Cloudflare | Firebase App Hosting |
| kbe.homerenrichment.com | Subdomain | Cloudflare | Firebase App Hosting |

### DNS Records to Update
- **A Records**: Currently pointing to Google anycast IPs (216.239.32.21, 216.239.34.21, 216.239.36.21, 216.239.38.21)
- **CNAME Records**: Will need to point to Vercel's cname.vercel-dns.com
- **TXT Records**: Vercel verification record will be needed

### SSL Certificate
- [x] Let's Encrypt (auto-provisioned by Firebase)
- [ ] Custom certificate

---

## 4. Firebase Services Used

Check all Firebase services your app uses:
- [x] Authentication
  - [x] Email/Password
  - [x] Google OAuth
  - [x] Magic Links
  - [ ] Other
- [x] Firestore
- [x] App Check (reCAPTCHA Enterprise)
- [ ] Storage
- [ ] Functions
- [ ] Realtime Database
- [ ] Analytics (config exists but not actively used)
- [ ] Performance Monitoring
- [ ] Remote Config
- [ ] Other

---

## 5. Code Audit

### Firebase App Hosting Specific Code
Search for and document any App Hosting specific imports or code:
```javascript
// No Firebase App Hosting specific imports found
// All Firebase imports are standard SDK imports (firebase/auth, firebase/firestore, firebase/app-check)
```

### Files to Modify
- [x] Files that need modification:
  - `apphosting.yaml` - To be removed
  - `src/components/login-form.tsx` - Remove debug code (lines 113-116, 139-145, 149-151, 244-251)
  - `firebase-debug.js` - To be removed (test file)
  - `test-firebase-redirect.html` - To be removed (test file)

### Current authDomain Value
```javascript
authDomain: "kbe-website.firebaseapp.com" // Current value in Secret Manager
```

### Debugging Code to Remove
- [x] Location: `src/components/login-form.tsx`
- [x] Line numbers: 113-116, 139-145, 149-151, 244-251 (OAuth debugging logs)

---

## 6. Build Configuration

### package.json Scripts
```json
"scripts": {
  "dev": "next dev --turbopack -p 9002",
  "build": "next build",
  "start": "next start",
  "lint": "biome check .",
  "typecheck": "tsc --noEmit"
}
```

### next.config.js Special Configuration
- [x] Special configuration exists:
```javascript
// TypeScript and ESLint errors ignored during build
typescript: {
  ignoreBuildErrors: true,
},
eslint: {
  ignoreDuringBuilds: true,
},
// Image optimization for placehold.co
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'placehold.co',
      port: '',
      pathname: '/**',
    },
  ],
},
// Admin redirect
async redirects() {
  return [
    {
      source: '/admin',
      destination: '/admin/dashboard',
      permanent: false,
    },
  ];
},
```

### API Routes
- [x] API routes exist:
  - `/api/webhooks/sendgrid/route.ts` - SendGrid webhook handler

### Static Files
- **Public folder size**: 420 KB
- **Large static assets**: Android/Apple icons (largest: android-chrome-512x512.png at ~57KB)

---

## 7. Current Issues & Workarounds

### Known Issues
1. OAuth redirect `/n/` path issue - breaks mobile authentication (Firebase App Hosting specific)
2. App Check enforcement must be set to "Unenforced" for OAuth to work
3. Domain configuration requires manual Firebase Console updates

### Current Workarounds
1. authDomain must remain as `kbe-website.firebaseapp.com` for OAuth to work
2. App Check set to unenforced mode in Firebase Console
3. Manual addition of domains to Firebase authorized domains list

### Performance Metrics
- **Current build time**: ~2-3 minutes
- **Current deployment time**: 3-5 minutes
- **Cold start time**: Not measured (estimated 2-3 seconds)

---

## 8. Testing Requirements

### Critical User Flows to Test Post-Migration
- [ ] Email/password sign up
- [ ] Email/password sign in
- [ ] Google OAuth (desktop)
- [ ] Google OAuth (mobile) - CRITICAL: Currently broken
- [ ] Magic link sign in
- [ ] Password reset
- [ ] Firestore read/write
- [ ] App Check token generation
- [ ] Protected routes (/dashboard, /admin)
- [ ] SendGrid webhook integration

### Browser Testing Matrix
- [ ] Chrome (desktop)
- [ ] Safari (desktop)
- [ ] Firefox (desktop)
- [ ] Chrome (mobile)
- [ ] Safari (mobile)

---

## 9. Rollback Plan

### If Migration Fails
1. **DNS reversion time**: 1-24 hours (depends on TTL)
2. **Firebase App Hosting backup**: [x] Available (current deployment)
3. **Database backup**: [ ] Taken (Firestore export recommended)
4. **Last working commit hash**: `0ad5e035056d52d147c987a7f2cfd7ddf814e624`

---

## 10. Migration Checklist

### Pre-Migration (Day Before)
- [ ] All sections above completed
- [ ] Recent backup of Firestore data
- [ ] Team notified of maintenance window
- [ ] Vercel account created and verified
- [ ] All environment variable values retrieved from Google Secret Manager

### Migration Day
- [ ] Remove apphosting.yaml
- [ ] Remove .firebase folder (if exists)
- [ ] Create vercel.json (if needed)
- [ ] Ensure authDomain remains as `kbe-website.firebaseapp.com`
- [ ] Remove debug code from login-form.tsx
- [ ] Remove test files (firebase-debug.js, test-firebase-redirect.html)
- [ ] Commit changes
- [ ] Run `vercel` locally for initial setup
- [ ] Add all env variables to Vercel dashboard
- [ ] Test preview deployment thoroughly
- [ ] Update DNS records to point to Vercel
- [ ] Monitor error logs

### Post-Migration
- [ ] All critical flows tested
- [ ] OAuth working on mobile (should be fixed by migration)
- [ ] No console errors
- [ ] Performance metrics captured
- [ ] Team notified of completion
- [ ] Remove Firebase App Hosting backend if successful

---

## Sign-off

**Prepared by**: Claude Code Assistant  
**Date**: August 26, 2025  
**Reviewed by**: _______________ 
**Migration scheduled for**: _______________

---

## Notes Section
```
Additional notes, concerns, or special considerations:

1. CRITICAL: The OAuth `/n/` path issue is likely Firebase App Hosting specific and should be resolved by migrating to Vercel.

2. Environment Variables: All secrets need to be manually copied from Google Secret Manager to Vercel's environment variables section.

3. Build Configuration: The project ignores TypeScript and ESLint errors during build. Consider addressing these post-migration.

4. Domain Migration: Currently migrating from homerenrichment.com to homerenrichment.com (see CLOUDFLARE_MIGRATION.md). Ensure correct domain is used in Vercel.

5. App Check: After migration, test if App Check can be re-enabled in "Enforce" mode since the OAuth issue should be resolved.

6. Development Port: Local development uses port 9002, not the default 3000.

7. Testing Priority: Mobile OAuth should be the first thing tested post-migration as it's currently broken.

8. Firebase Services: Only Authentication, Firestore, and App Check are actively used. No Functions, Storage, or other advanced services to migrate.

9. API Routes: Only one API route exists (SendGrid webhook), minimal server-side functionality.

10. Recommended Vercel Settings:
    - Framework Preset: Next.js
    - Build Command: npm run build
    - Output Directory: .next
    - Install Command: npm install
    - Development Command: npm run dev
```