#!/bin/bash

# List of all secrets that need access
SECRETS=(
  "NEXT_PUBLIC_FIREBASE_API_KEY"
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID"
  "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"
  "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"
  "NEXT_PUBLIC_FIREBASE_APP_ID"
  "GOOGLE_GENAI_API_KEY"
  "NEXTAUTH_SECRET"
  "JWT_SECRET"
  "NEXT_PUBLIC_APP_URL"
)

echo "🔐 Granting Firebase App Hosting backend 'kbe-website' access to all secrets..."
echo ""

for SECRET in "${SECRETS[@]}"; do
  echo "✨ Granting access to $SECRET..."
  firebase apphosting:secrets:grantaccess "$SECRET" --backend=kbe-website
  echo ""
done

echo "✅ Done! All secrets are now accessible to Firebase App Hosting."
echo "🚀 Push a commit to trigger a new build."