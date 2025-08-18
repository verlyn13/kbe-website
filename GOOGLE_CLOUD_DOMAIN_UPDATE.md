# Google Cloud Console Domain Updates Required

## ⚠️ CRITICAL: Manual Updates Needed in Google Cloud Console

These settings MUST be updated manually in the Google Cloud Console for authentication to work with homerenrichment.com.

**Project**: kbe-website (in jeffreyverlynjohnson@gmail.com account)
**Note**: The project name remains `kbe-website` - only the domain is changing to homerenrichment.com

## 1. API Key Restrictions
**URL**: https://console.cloud.google.com/apis/credentials?project=kbe-website

### Browser API Key (AIzaSyBhTEs3Uxq_KBLBzbzIL2VB4Ao_DBw9faM)
1. Click on the Browser API key
2. Under **Application restrictions**:
   - Add HTTP referrer: `https://homerenrichment.com/*`
   - Add HTTP referrer: `https://*.homerenrichment.com/*`
   - Keep existing referrers for backward compatibility
3. Under **API restrictions**:
   - Option A (Recommended): Select "Don't restrict key"
   - Option B: If using "Selected APIs", MUST include:
     - ✅ Identity Toolkit API (CRITICAL for Firebase Auth)
     - ✅ Token Service API
     - ✅ Cloud Firestore API
     - ✅ Firebase Installations API
4. Click **Save**

## 2. OAuth 2.0 Client Configuration
**URL**: https://console.cloud.google.com/apis/credentials/oauthclient?project=kbe-website

### Web Client (OAuth 2.0)
1. Find and edit the Web client OAuth configuration
2. Under **Authorized JavaScript origins**, ADD:
   - `https://homerenrichment.com`
   - `https://www.homerenrichment.com`
3. Under **Authorized redirect URIs**, ADD:
   - `https://homerenrichment.com/__/auth/handler`
   - `https://www.homerenrichment.com/__/auth/handler`
4. Keep existing entries for backward compatibility
5. Click **Save**

## 3. Firebase Console Updates
**URL**: https://console.firebase.google.com/project/kbe-website/authentication/settings

### Authorized Domains
Should already include (verify):
- ✅ homerenrichment.com
- ✅ localhost
- ✅ kbe-website.firebaseapp.com
- ✅ kbe-website--kbe-website.us-central1.hosted.app

## 4. Verification Steps
After making changes (wait 2-5 minutes for propagation):

1. **Test API Key**:
   ```bash
   curl -X POST "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBhTEs3Uxq_KBLBzbzIL2VB4Ao_DBw9faM" \
     -H "Content-Type: application/json" \
     -d '{"returnSecureToken":true}'
   ```
   Should return an error about missing email/password, NOT about API key

2. **Test OAuth Flow**:
   - Visit https://homerenrichment.com
   - Click "Sign in with Google"
   - Should redirect to Google auth
   - Should successfully redirect back after authentication

## 5. Domain Propagation Status
Check DNS propagation:
```bash
# Check A record
dig homerenrichment.com

# Check SSL certificate
curl -I https://homerenrichment.com
```

## Timeline
- [ ] Update API key restrictions
- [ ] Update OAuth redirect URIs
- [ ] Verify Firebase authorized domains
- [ ] Wait 5 minutes for propagation
- [ ] Test authentication flow
- [ ] Deploy application

## Important Notes
- These changes cannot be made via CLI - must use Google Cloud Console
- Changes typically take 2-5 minutes to propagate
- Clear browser cache/cookies if authentication fails after updates
- The old domain (homerconnect.com) settings can remain for backward compatibility