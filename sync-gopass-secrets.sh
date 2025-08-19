#!/bin/bash

# Script to sync Google Cloud secrets to gopass for local development
# This creates a mirror of production secrets in gopass for easier access

set -e

echo "🔐 Syncing kbe-website secrets from Google Cloud to gopass..."
echo ""

PROJECT="kbe-website"
GOPASS_PREFIX="projects/kbe-website"

# Color output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if gopass is available
if ! command -v gopass &> /dev/null; then
    echo -e "${RED}❌ gopass is not installed${NC}"
    exit 1
fi

# Check if gcloud is available and authenticated
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}❌ gcloud is not installed${NC}"
    exit 1
fi

if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    echo -e "${RED}❌ Not authenticated with gcloud. Run: gcloud auth login${NC}"
    exit 1
fi

# List of secrets to sync
declare -A SECRETS=(
    # Firebase Public Configuration
    ["firebase/api-key"]="NEXT_PUBLIC_FIREBASE_API_KEY"
    ["firebase/auth-domain"]="NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"
    ["firebase/project-id"]="NEXT_PUBLIC_FIREBASE_PROJECT_ID"
    ["firebase/storage-bucket"]="NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"
    ["firebase/messaging-sender-id"]="NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"
    ["firebase/app-id"]="NEXT_PUBLIC_FIREBASE_APP_ID"
    
    # Firebase Admin
    ["firebase-admin/project-id"]="FIREBASE_ADMIN_PROJECT_ID"
    ["firebase-admin/client-email"]="FIREBASE_ADMIN_CLIENT_EMAIL"
    ["firebase-admin/private-key"]="FIREBASE_ADMIN_PRIVATE_KEY"
    
    # SendGrid
    ["sendgrid/api-key"]="SENDGRID_API_KEY"
    ["sendgrid/templates/announcement"]="SENDGRID_TEMPLATE_ANNOUNCEMENT"
    ["sendgrid/templates/magic-link"]="SENDGRID_TEMPLATE_MAGIC_LINK"
    ["sendgrid/templates/password-reset"]="SENDGRID_TEMPLATE_PASSWORD_RESET"
    ["sendgrid/templates/registration-confirmation"]="SENDGRID_TEMPLATE_REGISTRATION_CONFIRMATION"
    ["sendgrid/templates/welcome"]="SENDGRID_TEMPLATE_WELCOME"
    
    # App Config
    ["app/url"]="NEXT_PUBLIC_APP_URL"
    ["app/node-env"]="NODE_ENV"
    
    # App Check
    ["appcheck/site-key"]="NEXT_PUBLIC_RECAPTCHA_ENTERPRISE_SITE_KEY"
    
    # Auth
    ["auth/nextauth-secret"]="NEXTAUTH_SECRET"
    ["auth/jwt-secret"]="JWT_SECRET"
)

echo "📋 Syncing ${#SECRETS[@]} secrets..."
echo ""

SUCCESS_COUNT=0
SKIP_COUNT=0
ERROR_COUNT=0

for gopass_path in "${!SECRETS[@]}"; do
    gcloud_secret="${SECRETS[$gopass_path]}"
    full_gopass_path="${GOPASS_PREFIX}/${gopass_path}"
    
    echo -n "Syncing ${gcloud_secret} → gopass:${full_gopass_path}... "
    
    # Fetch from Google Cloud
    VALUE=$(gcloud secrets versions access latest --secret="$gcloud_secret" --project="$PROJECT" 2>/dev/null)
    
    if [ $? -eq 0 ] && [ ! -z "$VALUE" ]; then
        # Store in gopass
        echo "$VALUE" | gopass insert -f "$full_gopass_path" &>/dev/null
        
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✓${NC}"
            ((SUCCESS_COUNT++))
        else
            echo -e "${RED}✗ Failed to store in gopass${NC}"
            ((ERROR_COUNT++))
        fi
    else
        echo -e "${YELLOW}⊘ Not found in Google Cloud${NC}"
        ((SKIP_COUNT++))
    fi
done

echo ""
echo "═══════════════════════════════════════"
echo "Sync Complete!"
echo "  ${GREEN}✓ Synced: ${SUCCESS_COUNT}${NC}"
echo "  ${YELLOW}⊘ Skipped: ${SKIP_COUNT}${NC}"
if [ $ERROR_COUNT -gt 0 ]; then
    echo "  ${RED}✗ Errors: ${ERROR_COUNT}${NC}"
fi
echo ""
echo "📝 View secrets with: gopass ls ${GOPASS_PREFIX}"
echo "🔑 Get a secret with: gopass show ${GOPASS_PREFIX}/firebase/api-key"
echo ""
