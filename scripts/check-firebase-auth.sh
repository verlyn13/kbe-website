#!/bin/bash

# Check Firebase Auth Configuration
echo "🔍 Checking Firebase Auth Configuration for kbe-website"
echo "=================================================="

# Check current project
echo -e "\n📌 Current Firebase Project:"
firebase use

# Check hosting sites
echo -e "\n🌐 Hosting Sites:"
firebase hosting:sites:list

# Check deployed hosting
echo -e "\n🚀 Recent Deployments:"
firebase hosting:releases:list --site=kbe-website | head -10 || true

# Get project info
echo -e "\n📊 Project Information:"
firebase projects:describe kbe-website

# Provide manual check instructions
echo -e "\n📋 Manual Checks Required in Firebase Console:"
echo "=================================================="
echo ""
echo "1. ✅ Check Email Link Authentication:"
echo "   https://console.firebase.google.com/project/kbe-website/authentication/providers"
echo "   - Ensure 'Email/Password' is enabled"
echo "   - Ensure 'Email link (passwordless sign-in)' is checked"
echo ""
echo "2. 🌍 Check Authorized Domains:"
echo "   https://console.firebase.google.com/project/kbe-website/authentication/settings"
echo "   Required domains:"
echo "   - localhost"
echo "   - kbe-website.firebaseapp.com"
echo "   - kbe-website.web.app"
echo "   - homerconnect.com (if using custom domain)"
echo ""
echo "3. 📧 Check Email Templates:"
echo "   https://console.firebase.google.com/project/kbe-website/authentication/emails"
echo "   - Verify 'Email address verification' template"
echo "   - Check that action URL is correct"
echo ""
echo "4. 🔑 API Keys:"
echo "   https://console.firebase.google.com/project/kbe-website/settings/general"
echo "   - Verify Web API Key matches your .env.local"
echo ""

# Show current environment
echo -e "\n🔧 Current Environment Variables:"
echo "=================================================="
if [[ -f .env.local ]]; then
	echo "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=$(grep NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN .env.local | cut -d '=' -f2 || true)"
	echo "NEXT_PUBLIC_FIREBASE_PROJECT_ID=$(grep NEXT_PUBLIC_FIREBASE_PROJECT_ID .env.local | cut -d '=' -f2 || true)"
	echo "NEXT_PUBLIC_APP_URL=$(grep NEXT_PUBLIC_APP_URL .env.local | cut -d '=' -f2 || true)"
else
	echo "❌ .env.local not found!"
fi

echo -e "\n💡 To debug magic link issues, run:"
echo "   npm run debug:magic-link"
