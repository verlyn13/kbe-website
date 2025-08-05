#!/bin/bash

echo "🔍 Deep Authentication Diagnostic"
echo "================================"
echo ""

echo "1. Checking OAuth Clients in Google Cloud"
echo "----------------------------------------"
echo "Go to: https://console.cloud.google.com/apis/credentials?project=kbe-website"
echo ""
echo "Look for OAuth 2.0 Client IDs section. You should see:"
echo "- A Web application client"
echo "- Check the Authorized JavaScript origins includes:"
echo "  • https://kbe-website.firebaseapp.com"
echo "  • https://homerconnect.com"
echo "  • https://kbe-website--kbe-website.us-central1.hosted.app"
echo ""

echo "2. Testing Different Auth Methods"
echo "---------------------------------"
echo "Testing anonymous auth (should work if auth is enabled):"
curl -s -X POST "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBhTEs3Uxq_KBLBzbzIL2VB4Ao_DBw9faM" \
  -H "Content-Type: application/json" \
  -H "Referer: https://homerconnect.com" \
  -d '{"returnSecureToken":true}' 2>&1 | grep -E "(idToken|error)" | head -5

echo ""
echo ""

echo "3. Check Service Account Permissions"
echo "-----------------------------------"
echo "The service accounts might be missing permissions."
echo "Go to: https://console.cloud.google.com/iam-admin/iam?project=kbe-website"
echo ""
echo "Check that firebase-adminsdk-fbsvc@kbe-website.iam.gserviceaccount.com has:"
echo "- Firebase Authentication Admin"
echo "- Service Account Token Creator"
echo ""

echo "4. Possible Root Causes"
echo "----------------------"
echo "Since Google provider is enabled but still blocked, check:"
echo ""
echo "a) OAuth Client Configuration:"
echo "   - Missing or misconfigured OAuth 2.0 Web Client"
echo "   - Authorized origins don't match your domains"
echo ""
echo "b) Project-level Issues:"
echo "   - Billing account suspended"
echo "   - Project quota exceeded"
echo "   - Security policy blocking auth"
echo ""

echo "5. Nuclear Option - Recreate OAuth Client"
echo "----------------------------------------"
echo "1. Go to Google Cloud Console > APIs & Services > Credentials"
echo "2. Delete existing OAuth 2.0 Web clients"
echo "3. In Firebase Console, disable then re-enable Google provider"
echo "4. This forces creation of new OAuth client with correct settings"
echo ""

echo "6. Check for Organization Policies"
echo "---------------------------------"
echo "If this is under a Google Workspace/Cloud organization:"
echo "- There might be org policies blocking external auth"
echo "- Check: https://console.cloud.google.com/iam-admin/orgpolicies?project=kbe-website"