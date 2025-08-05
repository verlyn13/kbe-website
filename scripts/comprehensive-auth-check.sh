#!/bin/bash

echo "🔍 Comprehensive Authentication Diagnostic"
echo "========================================"
echo ""

PROJECT_ID="kbe-website"
API_KEY="AIzaSyBhTEs3Uxq_KBLBzbzIL2VB4Ao_DBw9faM"

echo "1. Project Configuration"
echo "-----------------------"
echo "Project ID: $PROJECT_ID"
echo "Current gcloud account: $(gcloud config get-value account)"
echo "Current gcloud project: $(gcloud config get-value project)"
echo ""

echo "2. Identity Toolkit API Status"
echo "-----------------------------"
gcloud services list --enabled --filter="identitytoolkit.googleapis.com" --format="table(name,state)" --project=$PROJECT_ID
echo ""

echo "3. Project Quotas Check"
echo "----------------------"
echo "Checking Identity Toolkit quotas..."
gcloud compute project-info describe --project=$PROJECT_ID 2>&1 | grep -E "(quota|limit)" | head -10
echo ""

echo "4. Testing Auth Endpoints Directly"
echo "---------------------------------"
echo "Testing sign up endpoint..."
SIGNUP_RESPONSE=$(curl -s -X POST "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=$API_KEY" \
  -H "Content-Type: application/json" \
  -H "Referer: https://homerconnect.com" \
  -d '{"returnSecureToken":true}' 2>&1)
echo "Response: $(echo $SIGNUP_RESPONSE | jq -r '.error.message // "Success"' 2>/dev/null || echo $SIGNUP_RESPONSE | head -100)"
echo ""

echo "5. Billing Status"
echo "----------------"
gcloud billing projects describe $PROJECT_ID --format="table(billingAccountName,billingEnabled)" 2>&1
echo ""

echo "6. Organization Policy Check"
echo "---------------------------"
echo "Checking for restrictive policies..."
gcloud resource-manager org-policies list --project=$PROJECT_ID --format="table(constraint)" 2>&1 | grep -v "Listed 0 items"
echo ""

echo "7. Firebase Auth Providers Status"
echo "--------------------------------"
echo "Current Firebase configuration:"
firebase apps:sdkconfig WEB 1:886214990861:web:69d21293a494f323e94944 2>&1 | grep -E "(apiKey|authDomain)"
echo ""

echo "8. OAuth Client Check"
echo "--------------------"
echo "To manually verify OAuth client configuration:"
echo "1. Go to: https://console.cloud.google.com/apis/credentials?project=$PROJECT_ID"
echo "2. Click on the OAuth 2.0 Web client"
echo "3. Verify ALL these domains are in Authorized JavaScript origins:"
echo "   - https://homerconnect.com"
echo "   - https://kbe-website--kbe-website.us-central1.hosted.app"
echo "   - https://kbe-website.firebaseapp.com"
echo "4. Verify ALL these are in Authorized redirect URIs:"
echo "   - https://homerconnect.com/__/auth/handler"
echo "   - https://kbe-website--kbe-website.us-central1.hosted.app/__/auth/handler"
echo "   - https://kbe-website.firebaseapp.com/__/auth/handler"
echo ""

echo "9. Alternative Test - Magic Link"
echo "-------------------------------"
echo "Testing email/password auth (which should work)..."
EMAIL_TEST=$(curl -s -X POST "https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=$API_KEY" \
  -H "Content-Type: application/json" \
  -H "Referer: https://homerconnect.com" \
  -d '{"requestType":"PASSWORD_RESET","email":"test@example.com"}' 2>&1)
echo "Response: $(echo $EMAIL_TEST | jq -r '.error.message // "Would send email if account exists"' 2>/dev/null || echo $EMAIL_TEST | head -100)"
echo ""

echo "10. Potential Issues Summary"
echo "---------------------------"
echo "If Google Sign-in is still blocked after all checks:"
echo "• OAuth redirect URIs might be incomplete"
echo "• There might be a domain verification issue"
echo "• The project might have hit a rate limit"
echo "• Consider using Email/Password + Magic Links as alternative"