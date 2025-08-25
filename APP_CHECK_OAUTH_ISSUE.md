# App Check OAuth Authentication Issue - RESOLVED

## Issue Summary

**Problem**: Google OAuth authentication fails with `Firebase: Error (auth/internal-error)` when App Check is enabled in enforcement mode.

**Root Cause**: Firebase App Check enforcement blocks OAuth authentication flows, even when all domains are properly configured.

**Solution**: Set App Check to "Unenforced" mode for Authentication and Firestore APIs.

## Current Configuration (Working)

### Firebase Console Settings

- **Authentication API**: App Check set to **"Unenforced"**
- **Cloud Firestore API**: App Check set to **"Unenforced"**
- **reCAPTCHA Enterprise**: Properly configured with all domains

### Authorized Domains

All domains are properly configured in Firebase Authentication settings:

- `localhost`
- `homerenrichment.com`
- `www.homerenrichment.com`
- `kbe.homerenrichment.com`
- `kbe-website.firebaseapp.com`
- `kbe-website--kbe-website.us-central1.hosted.app`

### API Key Restrictions (Correctly Configured)

Google Cloud API keys have proper HTTP referrer restrictions:

- `https://homerenrichment.com/*`
- `https://www.homerenrichment.com/*`
- `https://kbe.homerenrichment.com/*`
- `https://kbe-website.firebaseapp.com/*`
- `https://kbe-website.web.app/*`
- `https://kbe-website--kbe-website.us-central1.hosted.app/*`
- `http://localhost:9002/*`

## Timeline of Events

1. **Initial State**: Google OAuth working perfectly without App Check
2. **App Check Implementation**: Added reCAPTCHA Enterprise for security
3. **Issue Emerged**: Google OAuth started failing with `auth/internal-error`
4. **Domain Migration Confusion**: Concurrent migration from homerconnect.com to homerenrichment.com added complexity
5. **Resolution**: Set App Check to "Unenforced" mode - OAuth works again

## Technical Details

### App Check Configuration in Code

```typescript
// src/lib/firebase.ts
// App Check is initialized but enforcement is controlled in Firebase Console
if (typeof window !== 'undefined') {
  try {
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_ENTERPRISE_SITE_KEY;
    if (siteKey) {
      initializeAppCheck(app, {
        provider: new ReCaptchaEnterpriseProvider(siteKey),
        isTokenAutoRefreshEnabled: true,
      });
    }
  } catch (err) {
    console.error('[Firebase] App Check init error:', err);
  }
}
```

### Known Issue

App Check enforcement mode is incompatible with Firebase OAuth providers (Google, Facebook, etc.) in certain configurations. Even with proper domain configuration, the OAuth flow gets blocked during the redirect/popup authentication process.

## Future Considerations

### For Production Deployment

1. **Keep App Check in "Unenforced" mode** for Authentication and Firestore
2. **Monitor for Firebase updates** that may resolve this incompatibility
3. **Consider alternative security measures**:
   - Rate limiting at the application level
   - IP-based blocking for suspicious activity
   - Enhanced logging and monitoring

### For Development

1. **Always use "Unenforced" mode** in development environments
2. **Document this requirement** in setup instructions
3. **Test OAuth flows** after any App Check configuration changes

## How to Fix if Issue Recurs

1. **Go to Firebase Console** → App Check → Apps
2. **Click on your Web App**
3. **For each API** (Authentication, Firestore):
   - Click the three dots menu
   - Select "Enforce" settings
   - Change to "Unenforced"
4. **Wait 1-2 minutes** for changes to propagate
5. **Test Google OAuth** - should work immediately

## Related Files

- `/src/lib/firebase.ts` - App Check initialization
- `.env.local` - reCAPTCHA Enterprise site key
- `apphosting.yaml` - Production environment configuration
- `scripts/api-key-referrers.txt` - API key domain restrictions

## References

- [Firebase App Check Documentation](https://firebase.google.com/docs/app-check)
- [Known Issue: App Check with OAuth Providers](https://github.com/firebase/firebase-js-sdk/issues) (search for oauth app-check)
- Project Issue: Domain migration from homerconnect.com to homerenrichment.com complicated debugging

## Status

✅ **RESOLVED** - App Check set to "Unenforced" mode for affected APIs
