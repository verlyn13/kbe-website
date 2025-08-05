# Fix API Key Configuration NOW

## The Problem
Your API key has "API restrictions" set to "Selected APIs" but it's missing critical authentication APIs.

## Quick Fix (Immediate)

1. Go to: https://console.cloud.google.com/apis/credentials?project=kbe-website
2. Edit your Browser API key (AIzaSyBhTEs3Uxq_KBLBzbzIL2VB4Ao_DBw9faM)
3. Under **"API restrictions"**, select:
   ### ✅ "Don't restrict key"
4. Click **"Save"**
5. Wait 2-5 minutes for changes to propagate
6. Test authentication immediately

## Why This Works
- "Don't restrict key" allows all Firebase APIs including authentication
- Your current "Selected APIs" list is missing critical auth APIs
- This is safe for a browser API key when combined with HTTP referrer restrictions

## After It Works (Optional Security)
If you want to use "Selected APIs" later, you MUST include these:
- ✅ Identity Toolkit API (CRITICAL - this is Firebase Auth!)
- ✅ Token Service API 
- ✅ Cloud Firestore API
- ✅ Firebase Installations API
- All your other currently selected APIs

## Test Authentication
1. https://kbe-website--kbe-website.us-central1.hosted.app
2. https://homerconnect.com (once DNS propagates)

## Important Notes
- "Application restrictions: None" is fine temporarily
- Later you can add HTTP referrer restrictions for security
- But API restrictions MUST include Identity Toolkit API for auth to work!