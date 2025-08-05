#!/bin/bash

echo "🔍 Deep Identity Toolkit Investigation"
echo "====================================="
echo ""

PROJECT_ID="kbe-website"

echo "1. Checking if Identity Toolkit API has specific permissions issues"
echo "-----------------------------------------------------------------"
echo "Testing direct API call with service account..."
gcloud auth application-default print-access-token 2>/dev/null | head -5

echo ""
echo "2. Checking for custom organizational constraints"
echo "-----------------------------------------------"
gcloud org-policies list --project=$PROJECT_ID 2>&1 | grep -E "(constraint|identity)" || echo "No specific constraints found"

echo ""
echo "3. Testing Identity Toolkit API directly"
echo "--------------------------------------"
echo "Attempting to get project config..."
curl -s -X GET "https://identitytoolkit.googleapis.com/v1/projects/$PROJECT_ID/config" \
  -H "Authorization: Bearer $(gcloud auth application-default print-access-token 2>/dev/null)" \
  -H "Content-Type: application/json" 2>&1 | head -50

echo ""
echo "4. Checking project metadata for restrictions"
echo "-------------------------------------------"
gcloud compute project-info describe --project=$PROJECT_ID --format="json" 2>&1 | jq '.commonInstanceMetadata.items[] | select(.key | contains("block") or contains("restrict"))' 2>/dev/null || echo "No metadata restrictions found"

echo ""
echo "5. Alternative: Force re-enable Identity Toolkit API"
echo "--------------------------------------------------"
echo "Sometimes the API needs to be re-enabled to fix permission issues:"
echo "Run: gcloud services disable identitytoolkit.googleapis.com --project=$PROJECT_ID"
echo "Wait 30 seconds"
echo "Run: gcloud services enable identitytoolkit.googleapis.com --project=$PROJECT_ID"

echo ""
echo "6. Nuclear Option: Create New OAuth Client"
echo "----------------------------------------"
echo "If organizational policies are blocking the current setup:"
echo "1. Delete all OAuth 2.0 clients in Google Cloud Console"
echo "2. In Firebase Console, disable then re-enable Google provider"
echo "3. This creates fresh OAuth configuration"

echo ""
echo "7. Workaround: Use Different Auth Domain"
echo "--------------------------------------"
echo "Update firebase.ts to use a different authDomain:"
echo "authDomain: 'kbe-website.firebaseapp.com' (instead of custom domain)"
echo "This might bypass domain-specific restrictions"