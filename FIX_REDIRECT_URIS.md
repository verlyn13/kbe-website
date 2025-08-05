# CRITICAL: Add Missing Redirect URIs

You found the issue! The OAuth client only has a redirect URI for `kbe-website.firebaseapp.com` but not for your other domains.

## Add These Redirect URIs Immediately

In the same OAuth 2.0 Web Client configuration, under **Authorized redirect URIs**, add:

1. `https://homerconnect.com/__/auth/handler`
2. `https://kbe-website--kbe-website.us-central1.hosted.app/__/auth/handler`

## Why This Is Critical

When you sign in with Google from `homerconnect.com`, the flow is:
1. User clicks "Sign in with Google"
2. Goes to Google's auth page
3. Google needs to redirect back to `https://homerconnect.com/__/auth/handler`
4. But this URL isn't authorized, so Google blocks the entire flow

## Complete OAuth Client Configuration Should Be:

**Authorized JavaScript origins:**
- `http://localhost`
- `http://localhost:5000`
- `http://localhost:9002`
- `https://kbe-website.firebaseapp.com`
- `https://homerconnect.com`
- `https://kbe-website--kbe-website.us-central1.hosted.app`

**Authorized redirect URIs:**
- `https://kbe-website.firebaseapp.com/__/auth/handler`
- `https://homerconnect.com/__/auth/handler`
- `https://kbe-website--kbe-website.us-central1.hosted.app/__/auth/handler`

## After Adding:
1. Click "Save"
2. Wait 2-5 minutes
3. Clear browser cache/cookies
4. Try signing in again

This should finally fix the authentication!