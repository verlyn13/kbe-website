#!/bin/bash

echo "🔧 Fixing homerconnect.com Issues"
echo "================================="
echo ""

echo "📋 Current Status:"
echo ""

# Check hosting sites
echo "1. Firebase Hosting Sites:"
firebase hosting:sites:list
echo ""

# Check if domain is connected
echo "2. Checking homerconnect site status:"
firebase hosting:sites:get homerconnect
echo ""

echo "🔍 Troubleshooting Steps:"
echo ""

echo "SSL/HTTPS Issues:"
echo "1. In Cloudflare Dashboard:"
echo "   • Ensure DNS records for homerconnect.com are set to 'DNS only' (gray cloud)"
echo "   • Go to SSL/TLS → Overview → Set to 'Full (strict)'"
echo "   • Current IPs should be: 151.101.1.195 and 151.101.65.195"
echo ""

echo "Magic Link Authorization Issues:"
echo "1. Add domain to Firebase Auth:"
echo "   • Go to: https://console.firebase.google.com/project/kbe-website/authentication/settings"
echo "   • Click 'Authorized domains' tab"
echo "   • Add: homerconnect.com"
echo "   • Also add: www.homerconnect.com (if using www)"
echo ""

echo "2. Add custom domain in Firebase Hosting (if not already done):"
echo "   • Go to: https://console.firebase.google.com/project/kbe-website/hosting/sites"
echo "   • Click on 'homerconnect' site"
echo "   • Click 'Add custom domain'"
echo "   • Enter: homerconnect.com"
echo "   • Follow the verification steps"
echo ""

echo "3. Update Firebase Auth configuration:"
echo "   • The auth domain should remain: kbe-website.firebaseapp.com"
echo "   • Only the redirect URL needs to be homerconnect.com"
echo ""

echo "📊 Quick Checks:"
echo ""

# Check DNS
echo "Checking DNS for homerconnect.com:"
dig +short homerconnect.com
echo ""

# Check if the domain responds
echo "Checking HTTPS response:"
curl -I https://homerconnect.com 2>&1 | head -5
echo ""

echo "🚀 After Manual Steps:"
echo "1. DNS propagation: 5 minutes to 48 hours"
echo "2. SSL certificate: Up to 24 hours"
echo "3. Magic links: Work immediately after domain is authorized"
echo ""
echo "⚠️  IMPORTANT: Keep Cloudflare proxy OFF (gray cloud) until SSL is working!"