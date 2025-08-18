# Fix OAuth Consent Screen "No Reachable Owners" Issue

## The Core Problem

Even though you're listed as Owner, Google says "Your project has no reachable owners/editors"

## Immediate Actions

### 1. Update OAuth Consent Screen Contact Info

Go to: https://console.cloud.google.com/apis/credentials/consent?project=kbe-website

Click **"EDIT APP"** and ensure:

- **User support email**: Select `jeffreyverlynjohnson@gmail.com` from dropdown
- **Developer contact information**: Enter `jeffreyverlynjohnson@gmail.com`
- Click **"SAVE AND CONTINUE"** through all steps

### 2. Add Missing Authorized Domain

Go to: https://console.firebase.google.com/project/kbe-website/authentication/settings

Add this missing domain:

- `kbe-website--kbe-website.us-central1.hosted.app`

### 3. Quick Test with Email/Password

Let's bypass Google OAuth temporarily to test if auth works at all:

1. Go to: https://console.firebase.google.com/project/kbe-website/authentication/providers
2. Enable **"Email/Password"** provider
3. Create a test user manually in the console
4. Try logging in with email/password at your app

If email/password works but Google doesn't, it confirms the OAuth issue.

### 4. Nuclear Option - Reset OAuth

If nothing works:

1. Go to: https://console.cloud.google.com/apis/credentials?project=kbe-website
2. Find the OAuth 2.0 Client IDs section
3. Delete any existing Web clients
4. Go back to Firebase Console → Authentication → Sign-in method
5. Re-enable Google provider (it will create new OAuth client)

### 5. Alternative - Switch to Testing Mode

As a temporary workaround:

1. In OAuth consent screen, switch to **"Testing"** mode
2. Add these test users:
   - jeffreyverlynjohnson@gmail.com
   - Any other emails you need
3. This limits to 100 users but unblocks auth immediately

## Why This Happens

Google's "no reachable owners" can occur when:

- The owner email isn't verified in the OAuth consent screen
- Contact information is missing
- There's a mismatch between IAM owners and OAuth config
- The project was transferred or inherited

## Quick Verification

Run this command to check if Firebase Auth is working:

```bash
curl -X POST "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBhTEs3Uxq_KBLBzbzIL2VB4Ao_DBw9faM" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testpass123","returnSecureToken":true}'
```

If you get "EMAIL_EXISTS" or "WEAK_PASSWORD", auth is working!
