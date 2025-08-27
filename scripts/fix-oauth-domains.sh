#!/bin/bash

echo "📋 Firebase OAuth Domain Configuration Guide"
echo "==========================================="
echo ""
echo "This error occurs because Vercel domains are not authorized in Firebase/Google Cloud."
echo ""
echo "1️⃣  Google Cloud Console - OAuth Redirect URIs"
echo "   URL: https://console.cloud.google.com/apis/credentials?project=kbe-website"
echo ""
echo "   Add these Authorized redirect URIs:"
echo "   • https://kbe-website.vercel.app/__/auth/handler"
echo "   • https://kbe-website.firebaseapp.com/__/auth/handler" 
echo "   • https://homerenrichment.com/__/auth/handler"
echo "   • https://www.homerenrichment.com/__/auth/handler"
echo ""
echo "2️⃣  Firebase Console - Authorized Domains"
echo "   URL: https://console.firebase.google.com/project/kbe-website/authentication/settings"
echo ""
echo "   Add these domains:"
echo "   • kbe-website.vercel.app"
echo "   • homerenrichment.com"
echo "   • www.homerenrichment.com"
echo ""
echo "3️⃣  Test OAuth Flow"
echo "   After adding domains, test at:"
echo "   • https://kbe-website.vercel.app"
echo ""
echo "Press Enter to open the Google Cloud Console..."
read -r
open "https://console.cloud.google.com/apis/credentials?project=kbe-website" 2>/dev/null || \
  xdg-open "https://console.cloud.google.com/apis/credentials?project=kbe-website" 2>/dev/null || \
  echo "Please manually open: https://console.cloud.google.com/apis/credentials?project=kbe-website"

echo ""
echo "Press Enter to open the Firebase Console..."
read -r
open "https://console.firebase.google.com/project/kbe-website/authentication/settings" 2>/dev/null || \
  xdg-open "https://console.firebase.google.com/project/kbe-website/authentication/settings" 2>/dev/null || \
  echo "Please manually open: https://console.firebase.google.com/project/kbe-website/authentication/settings"

echo ""
echo "✅ Once you've added all domains, OAuth will work on Vercel!"