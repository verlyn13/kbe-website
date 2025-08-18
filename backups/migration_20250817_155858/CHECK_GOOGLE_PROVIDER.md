# Check Google Provider Configuration

The error `auth/requests-to-this-api-identitytoolkit-method-are-blocked` even after OAuth fixes suggests the Google provider might not be properly configured in Firebase.

## Critical Check: Google Provider in Firebase

Go to: https://console.firebase.google.com/project/kbe-website/authentication/providers

For the Google provider, check:

1. **Is it Enabled?** (toggle should be ON)
2. **Web SDK configuration** - Does it show:
   - Web client ID (should be auto-populated)
   - Web client secret (optional, usually empty)

## If Google Provider is Disabled:

1. Click on Google provider
2. Toggle "Enable"
3. It should auto-configure with your OAuth client
4. Click "Save"

## If It's Already Enabled:

Try this:

1. Click on Google provider
2. Toggle it OFF
3. Save
4. Toggle it back ON
5. Save again

This forces Firebase to reconfigure the OAuth connection.

## Also Check: API Enablement

Go to: https://console.cloud.google.com/apis/library?project=kbe-website

Make sure these are ENABLED (not just added):

- **Identity Toolkit API** (search and enable if needed)
- **Firebase Authentication API** (if available)

## Quick Test

After enabling, test immediately at:

- https://kbe-website--kbe-website.us-central1.hosted.app
- https://homerconnect.com

The error specifically mentioning `projectconfigservice.getprojectconfig` suggests Firebase can't retrieve the project's auth configuration, which often happens when:

1. Google provider is disabled in Firebase
2. Identity Toolkit API is not enabled
3. There's a mismatch between OAuth config and Firebase
