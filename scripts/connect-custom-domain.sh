#!/bin/bash

echo "🌐 Connecting homerenrichment.com to Firebase App Hosting"
echo "===================================================="
echo ""

echo "Your app is currently deployed at:"
echo "https://kbe-website--kbe-website.us-central1.hosted.app"
echo ""

echo "To connect your custom domain to Firebase App Hosting:"
echo ""

echo "Option 1: Via Firebase Console (Recommended)"
echo "==========================================="
echo "1. Go to: https://console.firebase.google.com/project/kbe-website/apphosting"
echo "2. Click on 'kbe-website' backend"
echo "3. Click 'Add custom domain'"
echo "4. Enter: homerenrichment.com"
echo "5. Follow the DNS verification steps"
echo ""

echo "Option 2: Via Command Line"
echo "========================="
echo "Run this command:"
echo ""
echo "firebase apphosting:domains:create homerenrichment.com --backend kbe-website"
echo ""

echo "DNS Records You'll Need:"
echo "======================="
echo "Type    Host    Value"
echo "A       @       35.219.200.11  (or the IP provided by Firebase)"
echo "TXT     @       [verification-token-from-firebase]"
echo ""

echo "Current DNS Status:"
echo "=================="
dig homerenrichment.com A +short

echo ""
echo "Note: Since you already have DNS pointing to Firebase Hosting IPs,"
echo "you'll need to update them to point to App Hosting instead."
echo ""
echo "The process is:"
echo "1. Add domain to App Hosting backend"
echo "2. Update DNS records as instructed"
echo "3. Wait for SSL certificate provisioning (up to 24 hours)"