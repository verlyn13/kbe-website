# CRITICAL: Add Missing Authorized Domains in Firebase

## The Root Cause
Magic links work on localhost but fail on production because the redirect URL (`https://homerconnect.com/`) is not in Firebase's authorized domains list.

## Immediate Fix Required

### 1. Go to Firebase Console
https://console.firebase.google.com/project/kbe-website/authentication/settings

### 2. In the "Authorized domains" section, ADD:
- `homerconnect.com` (if not already there)
- `www.homerconnect.com`
- `kbe-website--kbe-website.us-central1.hosted.app`

### 3. Save the changes

## Why This Is Different from OAuth Domains
- **OAuth Consent Screen domains**: Control Google Sign-in
- **Firebase Authorized domains**: Control ALL Firebase Auth methods including magic links

## The Code Issue
The login form uses:
```typescript
url: `${window.location.origin}/`
```

This dynamically uses whatever domain the user is on. If that domain isn't authorized in Firebase, it fails.

## Test After Adding Domains
1. Clear browser cache
2. Try magic link from https://homerconnect.com
3. Try Google sign-in

## Alternative Quick Fix (Code Change)
If adding domains doesn't work, we can hardcode the auth domain:

```typescript
// Change from:
url: `${window.location.origin}/`,

// To:
url: 'https://kbe-website.firebaseapp.com/',
```

This forces all auth to go through the Firebase domain, which is always authorized.