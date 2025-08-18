# API Key Architecture

This project uses a **two-key architecture** for better security and separation of concerns.

## Current Setup

### 1. Firebase API Key

- **Purpose**: Firebase Authentication (magic links, Google sign-in, etc.)
- **Key Name in GCP**: "Firebase API Key"
- **Environment Variable**: `NEXT_PUBLIC_FIREBASE_API_KEY`
- **APIs Enabled**:
  - ✓ Identity Toolkit API
  - ✓ Token Service API
  - ✓ Firebase Installations API
  - ✓ Cloud Resource Manager API
  - ✓ Firebase Management API

### 2. GenKit/AI API Key

- **Purpose**: AI content generation with GenKit
- **Key Name in GCP**: "Generative Language API Key"
- **Environment Variable**: `GOOGLE_GENAI_API_KEY`
- **APIs Enabled**:
  - ✓ Generative Language API

## Why Two Keys

1. **Security**: If one key is compromised, the other service remains secure
2. **Quota Management**: Each service has its own usage limits
3. **Access Control**: Different keys can have different restrictions
4. **Monitoring**: Easier to track usage per service
5. **Principle of Least Privilege**: Each key only has access to what it needs

## Local Development Setup

Your `.env.local` should have:

````bash
# Firebase Authentication
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key

# GenKit AI
GOOGLE_GENAI_API_KEY=your-genkit-api-key

# Other Firebase config (unchanged)
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=kbe-website.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=kbe-website
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=kbe-website.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=886214990861
NEXT_PUBLIC_FIREBASE_APP_ID=1:886214990861:web:69d21293a494f323e94944
```bash
## Production Setup

Update secrets in Google Cloud:

```bash
# Update Firebase API key
firebase apphosting:secrets:set NEXT_PUBLIC_FIREBASE_API_KEY

# GenKit key remains unchanged
# firebase apphosting:secrets:set GOOGLE_GENAI_API_KEY
```bash
## Adding Application Restrictions (Production)

Once everything works, add HTTP referrer restrictions:

### Firebase API Key

```text
http://localhost:9002/*
https://localhost:9002/*
https://kbe-website.firebaseapp.com/*
https://kbe-website.web.app/*
https://homerconnect.com/*
https://www.homerconnect.com/*
```bash
### GenKit API Key

- Can remain unrestricted since it's server-side only
- Or restrict to your Cloud Run service URL

## Troubleshooting

### Magic Links Not Working

- Check Firebase API Key has Identity Toolkit API enabled
- Verify using correct key in `NEXT_PUBLIC_FIREBASE_API_KEY`
- Run `npm run debug:magic-link` to test

### AI Generation Not Working

- Check GenKit API Key has Generative Language API enabled
- Verify using correct key in `GOOGLE_GENAI_API_KEY`
- Check GenKit logs with `npm run genkit:dev`

## Key Rotation

Best practice is to rotate keys periodically:

1. Create new keys in Google Cloud Console
2. Update `.env.local` locally
3. Test thoroughly
4. Update production secrets
5. Delete old keys after confirming everything works

## Monitoring

Monitor key usage in Google Cloud Console:

- APIs & Services → Credentials → Click on key → View metrics
- Set up alerts for unusual usage patterns
````
