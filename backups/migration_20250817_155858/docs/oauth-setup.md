# OAuth Setup for Local Development

## Issue

When using Google Sign-in on localhost:9002, the authentication succeeds but redirects to localhost (without port), causing ERR_CONNECTION_REFUSED.

## Solution

Add localhost:9002 as an authorized redirect URI in the Google Cloud Console:

1. Go to https://console.cloud.google.com/apis/credentials
2. Select your project (kbe-website)
3. Find the OAuth 2.0 Client ID (likely named "Web client (auto created by Google Service)")
4. Click on it to edit
5. Under "Authorized redirect URIs", add:
   - http://localhost:9002/\_\_/auth/handler
   - http://localhost:9002
6. Save the changes

## Alternative: Use Firebase Emulator

For local development, you can also use Firebase Auth Emulator:

```bash
firebase emulators:start --only auth
```

## Current Authorized Domains in Firebase

- localhost (default)
- kbe-website.firebaseapp.com (default)
- kbe-website.web.app (default)
- homerconnect.com (custom)
- www.homerconnect.com (custom)

Note: Firebase automatically handles OAuth redirects for these domains, but specific ports need to be configured in Google Cloud Console.
