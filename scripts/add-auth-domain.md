# Add homerenrichment.com to Firebase Auth Authorized Domains

Since homerenrichment.com is connected in Firebase Hosting, you just need to authorize it for Authentication.

## Steps to Fix Magic Link Error:

1. **Go to Firebase Console Authentication Settings**:
   https://console.firebase.google.com/project/kbe-website/authentication/settings

2. **In the "Authorized domains" tab, you should see**:
   - localhost
   - kbe-website.firebaseapp.com
   - kbe-website.web.app

3. **Click "Add domain" and add**:
   - `homerenrichment.com`

4. **That's it!** Magic links should now work immediately.

## Why This Is Needed:

Firebase Auth requires explicit authorization for each domain that can:

- Send magic link emails
- Receive OAuth redirects
- Use Firebase Auth features

Even though the domain is connected for hosting, Auth is a separate service that needs its own authorization.

## Test Magic Link:

After adding the domain, test at: https://homerenrichment.com

The magic link should now:

1. Send successfully
2. Redirect back to homerenrichment.com
3. Sign you in properly

## Note:

The auth domain in your Firebase config (NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN) should remain as `homerenrichment.com` as you have it set in .env.local.
