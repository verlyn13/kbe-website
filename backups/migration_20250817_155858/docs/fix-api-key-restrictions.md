# Fix Firebase API Key Restrictions for Magic Link

## Error Explanation

The error `auth/requests-to-this-api-identitytoolkit-method-google.cloud.identitytoolkit.v1.accountmanagementservice.getoobcode-are-blocked` means your Firebase API key has restrictions that are blocking the magic link (OOB - Out Of Band) authentication method.

## Solution Steps

### 1. Access Google Cloud Console

Go to: <https://console.cloud.google.com/apis/credentials?project=kbe-website>

### 2. Find Your Web API Key

Look for the API key that matches: `AIzaSyCQfj7TpHnoB2TdaBmM06wG8L2-hwHmikc`
(This is your NEXT_PUBLIC_FIREBASE_API_KEY)

### 3. Check Current Restrictions

Click on the API key to see its configuration. You'll likely see:

#### Application Restrictions

- **HTTP referrers (websites)**: May be restricting to specific domains

#### API Restrictions

- **Restrict key**: May be limited to specific APIs

### 4. Fix the Restrictions

#### Option A: Remove All Restrictions (Quick Fix for Testing)

1. Set **Application restrictions** to: "None"
2. Set **API restrictions** to: "Don't restrict key"
3. Click **Save**
4. Wait 5-10 minutes for changes to propagate

#### Option B: Configure Proper Restrictions (Recommended for Production)

**Application Restrictions:**

- Select: **HTTP referrers (websites)**
- Add these referrers:
  ```text
  http://localhost:9002/*
  https://localhost:9002/*
  https://kbe-website.firebaseapp.com/*
  https://kbe-website.web.app/*
  https://homerconnect.com/*
  https://www.homerconnect.com/*
  ```text

**API Restrictions:**

- Select: **Restrict key**
- Enable these APIs:
  ```text
  ✓ Identity Toolkit API
  ✓ Firebase Auth API
  ✓ Firebase Management API
  ✓ Firebase Hosting API
  ✓ Google AI Generative Language API (for GenKit)
  ```text

### 5. Alternative: Create a New Unrestricted Key

If modifying the existing key is problematic:

1. Click **+ CREATE CREDENTIALS** → **API key**
2. Name it: "KBE Website - Development"
3. Leave unrestricted initially
4. Update your `.env.local`:
   ```text
   NEXT_PUBLIC_FIREBASE_API_KEY=your-new-api-key
   ```text

## Verification

After making changes:

1. Wait 5-10 minutes for propagation
2. Run the debug script:

   ```bash
   npm run debug:magic-link
   ```text

3. You should see:
   ```text
   ✅ Success! Magic link sent.
   ```text

## Security Best Practices

Once magic links are working:

1. **Re-enable restrictions** with proper domains
2. **Monitor usage** in Google Cloud Console
3. **Rotate keys** periodically
4. **Use different keys** for dev/staging/production

## Common Issues

### Changes Not Taking Effect

- API key changes can take up to 10 minutes
- Try clearing browser cache
- Restart your dev server

### Still Blocked After Removing Restrictions

- Check if there's a quota limit exceeded
- Verify billing is enabled on the Google Cloud project
- Check for any organization policies blocking the API

## Quick Commands

```bash
# Check current API key from .env
grep NEXT_PUBLIC_FIREBASE_API_KEY .env.local

# Test magic link after changes
npm run debug:magic-link

# Check if using correct Firebase project
firebase use
```bash
## Related Documentation

- [Google Cloud API Key Best Practices](https://cloud.google.com/docs/authentication/api-keys)
- [Firebase Auth Error Codes](https://firebase.google.com/docs/auth/admin/errors)
- [Identity Toolkit API](https://cloud.google.com/identity-platform/docs/reference/rest)
