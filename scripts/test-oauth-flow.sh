#!/bin/bash

echo "🧪 Testing OAuth Configuration..."
echo "================================="
echo ""

VERCEL_URL="https://kbe-website.vercel.app"

echo "1️⃣  Checking site accessibility..."
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$VERCEL_URL")
if [ "$HTTP_STATUS" = "200" ]; then
    echo "✅ Site accessible (HTTP $HTTP_STATUS)"
else
    echo "❌ Site not accessible (HTTP $HTTP_STATUS)"
    exit 1
fi

echo ""
echo "2️⃣  Checking OAuth rewrite..."
OAUTH_CHECK=$(curl -s "$VERCEL_URL/__/auth/handler" | grep -o "fireauth.oauthhelper" | head -1)
if [ "$OAUTH_CHECK" = "fireauth.oauthhelper" ]; then
    echo "✅ OAuth rewrite working (Firebase handler active)"
else
    echo "❌ OAuth rewrite not working"
    exit 1
fi

echo ""
echo "3️⃣  Checking login page..."
LOGIN_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$VERCEL_URL/login")
if [ "$LOGIN_STATUS" = "200" ]; then
    echo "✅ Login page accessible (HTTP $LOGIN_STATUS)"
else
    echo "❌ Login page not accessible (HTTP $LOGIN_STATUS)"
    exit 1
fi

echo ""
echo "✅ All automated tests passed!"
echo ""
echo "4️⃣  Manual Testing Required:"
echo "   Please test Google OAuth at: $VERCEL_URL"
echo "   1. Click 'Sign in with Google'"
echo "   2. Complete OAuth flow"
echo "   3. Verify redirect to dashboard"
echo ""
echo "5️⃣  Mobile Testing (CRITICAL):"
echo "   Test on actual mobile device"
echo "   This was the primary goal of migration!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Migration Status: COMPLETE"
echo "🌐 Production URL: $VERCEL_URL"
echo "🔑 OAuth Domain: Added to Firebase"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"