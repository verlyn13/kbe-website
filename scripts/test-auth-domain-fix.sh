#!/bin/bash

echo "🔍 Testing Auth Domain Fix"
echo "========================="
echo ""

echo "1. Checking deployed configuration..."
echo "-------------------------------------"
echo "Fetching the deployed app to check authDomain setting..."
echo ""

# Test the direct App Hosting URL
APP_URL="https://kbe-website--kbe-website.us-central1.hosted.app"
echo "Testing: $APP_URL"
echo ""

# Fetch the page and look for Firebase config
echo "Looking for Firebase configuration in deployed app..."
RESPONSE=$(curl -s "$APP_URL" | grep -A 10 "authDomain" | head -20)

if echo "$RESPONSE" | grep -q "homerenrichment.com"; then
    echo "✅ SUCCESS: authDomain is set to homerenrichment.com"
    echo "The fix has been deployed!"
else
    echo "❌ NOT YET: authDomain might still be kbe-website.firebaseapp.com"
    echo "The deployment may still be in progress."
fi

echo ""
echo "2. Testing authentication endpoint with new domain..."
echo "---------------------------------------------------"
# Test with the new authDomain
curl -s -X POST "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBhTEs3Uxq_KBLBzbzIL2VB4Ao_DBw9faM" \
  -H "Content-Type: application/json" \
  -H "Referer: https://homerenrichment.com" \
  -H "X-Auth-Domain: homerenrichment.com" \
  -d '{"email":"test@example.com","password":"testpass","returnSecureToken":true}' 2>&1 | grep -E "(error|EMAIL_NOT_FOUND)" | head -5

echo ""
echo ""
echo "3. Current OAuth Client Configuration"
echo "-----------------------------------"
echo "Make sure these are ALL configured in your OAuth client:"
echo ""
echo "Authorized JavaScript origins:"
echo "✓ https://homerenrichment.com"
echo "✓ https://www.homerenrichment.com"
echo "✓ https://kbe-website--kbe-website.us-central1.hosted.app"
echo "✓ https://kbe-website.firebaseapp.com"
echo "✓ http://localhost"
echo "✓ http://localhost:9002"
echo ""
echo "Authorized redirect URIs:"
echo "✓ https://homerenrichment.com/__/auth/handler"
echo "✓ https://www.homerenrichment.com/__/auth/handler"
echo "✓ https://kbe-website--kbe-website.us-central1.hosted.app/__/auth/handler"
echo "✓ https://kbe-website.firebaseapp.com/__/auth/handler"
echo ""

echo "4. Next Steps"
echo "------------"
echo "1. If authDomain is still not updated, wait 5-10 more minutes"
echo "2. Clear browser cache and cookies"
echo "3. Try signing in at https://homerenrichment.com"
echo "4. If still failing, check browser console for specific errors"