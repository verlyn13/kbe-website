#!/usr/bin/env bash

echo "🔍 Checking Firebase Authorized Domains Configuration"
echo "====================================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PROJECT_ID="kbe-website"

echo "📋 Required Domains for OAuth to work:"
echo "  - homerenrichment.com"
echo "  - www.homerenrichment.com"
echo "  - kbe-website.vercel.app"
echo "  - kbe-website.firebaseapp.com (default)"
echo "  - localhost (for development)"
echo ""

echo "🔧 To add missing domains:"
echo "  1. Go to: https://console.firebase.google.com/project/$PROJECT_ID/authentication/settings"
echo "  2. Scroll to 'Authorized domains'"
echo "  3. Click 'Add domain'"
echo "  4. Add any missing domains from the list above"
echo ""

echo "⚠️  IMPORTANT: After adding domains:"
echo "  - It can take up to 10 minutes for changes to propagate"
echo "  - Clear your browser cache"
echo "  - Test in an incognito/private window"
echo ""

echo "🔑 Checking API Key Restrictions..."
# Check Browser key
KEY_ID="66a156ba-2925-4378-b52b-17b961f205ea"
RESTRICTIONS=$(gcloud services api-keys describe $KEY_ID --project=$PROJECT_ID --format=json 2>/dev/null | jq -r '.restrictions.browserKeyRestrictions.allowedReferrers[]' 2>/dev/null)

if [ -n "$RESTRICTIONS" ]; then
    echo -e "${GREEN}✅ API Key Restrictions found:${NC}"
    echo "$RESTRICTIONS" | while read -r domain; do
        echo "   - $domain"
    done
else
    echo -e "${RED}❌ Could not fetch API key restrictions${NC}"
fi

echo ""
echo "🧪 Testing OAuth endpoints..."

# Test each domain
for DOMAIN in "homerenrichment.com" "www.homerenrichment.com" "kbe-website.vercel.app"; do
    echo -n "  Testing $DOMAIN... "
    
    # Test if the auth iframe loads
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" "https://$DOMAIN/__/auth/iframe")
    
    if [ "$STATUS" = "200" ]; then
        echo -e "${GREEN}✅ OAuth endpoint accessible${NC}"
    else
        echo -e "${RED}❌ OAuth endpoint returned $STATUS${NC}"
    fi
done

echo ""
echo "📝 If you're still seeing 'Illegal url for new iframe' error:"
echo "  1. The domain is not in Firebase's Authorized domains list"
echo "  2. OR the changes haven't propagated yet (wait 10 minutes)"
echo "  3. OR there's a browser cache issue (clear cache/use incognito)"
echo ""
echo "🔗 Direct link to add domains:"
echo "   https://console.firebase.google.com/project/$PROJECT_ID/authentication/settings"