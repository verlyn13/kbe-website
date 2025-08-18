# URGENT: Fix Authentication Block

## The Issue
Even with unrestricted API keys, you're getting `auth/requests-to-this-api-identitytoolkit` errors. This usually means one of these:

## Most Likely Causes

### 1. **OAuth Consent Screen Issue** (MOST LIKELY)
Go to: https://console.cloud.google.com/apis/credentials/consent?project=kbe-website

Check:
- **Publishing Status**: Must be "In production" NOT "Testing"
- If it's in "Testing" mode, only test users can sign in
- Click "PUBLISH APP" if needed

### 2. **Authorized Domains Missing**
Go to: https://console.firebase.google.com/project/kbe-website/authentication/settings

Under "Authorized domains", you MUST have:
- `localhost`
- `kbe-website.firebaseapp.com`
- `kbe-website--kbe-website.us-central1.hosted.app`
- `homerconnect.com`

Click "Add domain" if any are missing.

### 3. **Google Provider Not Configured**
Go to: https://console.firebase.google.com/project/kbe-website/authentication/providers

Click on Google provider and ensure:
- Status is "Enabled"
- There's a Web Client ID configured

### 4. **Project Quota or Billing**
Go to: https://console.cloud.google.com/apis/api/identitytoolkit.googleapis.com/quotas?project=kbe-website

Check if you've hit any quotas or if the API is disabled.

## Test Your Fix

Visit: https://kbe-website--kbe-website.us-central1.hosted.app/auth-diagnostics

This page will help diagnose the exact issue.

## Nuclear Option
If nothing works:
1. Create a new Firebase project
2. Enable Authentication
3. Add Google provider
4. Update your app's Firebase config

## The Error Breakdown
`auth/requests-to-this-api-identitytoolkit-megoogle.cloud.identitytoolkit.v1.projectconfigservice.getprojectconfig are-blocked`

This specifically means Firebase can't retrieve your project's auth configuration, which happens when:
- OAuth consent screen is misconfigured
- Domain isn't authorized
- Project has auth disabled
- Billing/quota issues