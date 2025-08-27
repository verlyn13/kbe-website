# Current Firebase Dependencies

## Package Dependencies

### Main Project (`package.json`)
- **firebase**: ^12.0.0
  - Used for: Authentication, Firestore, App Check
  - Files using it: 
    - `/src/lib/firebase.ts`
    - `/src/lib/firebase-config.ts`
    - `/src/hooks/use-auth.tsx`
    - `/src/providers/auth-provider.tsx`
    - Multiple component files

### Firebase Import Tool (`firebase-import/package.json`)
- **firebase-admin**: ^13.4.0
  - Used for: Data migration scripts
  - Can be removed after migration

## NPM Scripts Using Firebase
- `fb:rules:test` - Tests Firebase security rules
- `fb:deploy:dry` - Dry run Firebase deployment

## Environment Variables
```env
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
NEXT_PUBLIC_RECAPTCHA_ENTERPRISE_SITE_KEY
```

## Firebase Services in Use
1. **Authentication**
   - Email/Password
   - Google OAuth
   - Magic Links
   - Session management

2. **Firestore**
   - User profiles
   - Student records
   - Program registrations
   - Announcements
   - Waivers

3. **App Check**
   - reCAPTCHA Enterprise integration
   - Currently in "Unenforced" mode

## Files to Update During Migration
- All files in `/src/hooks/` related to auth
- `/src/providers/auth-provider.tsx`
- `/src/lib/firebase.ts`
- `/src/lib/firebase-config.ts`
- Components using Firebase Auth directly
- API routes that validate Firebase tokens

## Data Export Requirements
Collections to export from Firestore:
- users
- students
- programs
- registrations
- announcements
- waivers
- Any other collections discovered during export