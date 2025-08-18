# OAuth Console vs Firebase Console Explained

## Why Two Places?

### Firebase Console

- Manages Firebase-specific authentication settings
- Controls which domains can use Firebase Auth SDK
- Located at: Firebase Console → Authentication → Settings → Authorized domains

### Google Cloud OAuth Console

- Manages Google Sign-in specifically
- Controls OAuth consent screen for ALL Google services
- Required because Google Sign-in uses Google's OAuth infrastructure
- Located at: Google Cloud Console → APIs & Services → OAuth consent screen

## The Missing Domains Issue

You found it! In the OAuth Branding page, you only have:

- `kbe-website.firebaseapp.com`

But you NEED to add:

- `homerenrichment.com`
- `kbe-website--kbe-website.us-central1.hosted.app`

## How to Add Authorized Domains

1. On the Branding page you're on
2. In the "Authorized domains" section
3. Click "ADD DOMAIN"
4. Add these domains:
   - `homerenrichment.com`
   - `kbe-website--kbe-website.us-central1.hosted.app`

## Why This Matters

When someone tries to sign in with Google from `homerenrichment.com`, Google checks:

1. Is this domain authorized in OAuth settings? (Currently NO)
2. Is the developer contact email set? (Currently NO)

Both must be YES for Google Sign-in to work.

## The Complete Fix

1. Add the missing domains to "Authorized domains"
2. Add your email to "Developer contact information"
3. Save changes
4. Wait 5 minutes
5. Google Sign-in should work!

## Why Firebase Doesn't Handle This

Firebase handles its own auth methods (email/password, phone, etc.) but Google Sign-in specifically requires Google's OAuth consent configuration. It's a Google security requirement, not a Firebase one.

That's why:

- Magic links work (Firebase-only feature)
- Email/password works (Firebase-only feature)
- Google Sign-in doesn't work (requires Google OAuth setup)
