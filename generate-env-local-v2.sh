#!/bin/bash

# Enhanced .env.local generator that prefers gopass (local) over Google Cloud (remote)
# This provides faster access and works offline once synced

set -e

echo "🔐 Generating .env.local file..."
echo ""

# Configuration
GOPASS_PREFIX="projects/kbe-website"
GCLOUD_PROJECT="kbe-website"
USE_GOPASS=true
USE_GCLOUD=true

# Color output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check available secret managers
if ! command -v gopass &> /dev/null; then
    echo -e "${YELLOW}⚠️  gopass not available, will use Google Cloud only${NC}"
    USE_GOPASS=false
fi

if ! command -v gcloud &> /dev/null; then
    echo -e "${YELLOW}⚠️  gcloud not available, will use gopass only${NC}"
    USE_GCLOUD=false
fi

if [ "$USE_GOPASS" = false ] && [ "$USE_GCLOUD" = false ]; then
    echo -e "${RED}❌ Neither gopass nor gcloud is available!${NC}"
    echo "Install one of them first:"
    echo "  brew install gopass"
    echo "  brew install google-cloud-sdk"
    exit 1
fi

# Secret mappings
declare -A SECRETS=(
    # Firebase Public Configuration
    ["NEXT_PUBLIC_FIREBASE_API_KEY"]="firebase/api-key"
    ["NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"]="firebase/auth-domain"
    ["NEXT_PUBLIC_FIREBASE_PROJECT_ID"]="firebase/project-id"
    ["NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"]="firebase/storage-bucket"
    ["NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"]="firebase/messaging-sender-id"
    ["NEXT_PUBLIC_FIREBASE_APP_ID"]="firebase/app-id"
    
    # Firebase Admin
    ["FIREBASE_ADMIN_PROJECT_ID"]="firebase-admin/project-id"
    ["FIREBASE_ADMIN_CLIENT_EMAIL"]="firebase-admin/client-email"
    ["FIREBASE_ADMIN_PRIVATE_KEY"]="firebase-admin/private-key"
    
    # SendGrid
    ["SENDGRID_API_KEY"]="sendgrid/api-key"
    ["SENDGRID_TEMPLATE_ANNOUNCEMENT"]="sendgrid/templates/announcement"
    ["SENDGRID_TEMPLATE_MAGIC_LINK"]="sendgrid/templates/magic-link"
    ["SENDGRID_TEMPLATE_PASSWORD_RESET"]="sendgrid/templates/password-reset"
    ["SENDGRID_TEMPLATE_REGISTRATION_CONFIRMATION"]="sendgrid/templates/registration-confirmation"
    ["SENDGRID_TEMPLATE_WELCOME"]="sendgrid/templates/welcome"
    
    # App Config
    ["NEXT_PUBLIC_APP_URL"]="app/url"
    ["NODE_ENV"]="app/node-env"
    # App Check
    ["NEXT_PUBLIC_RECAPTCHA_ENTERPRISE_SITE_KEY"]="appcheck/site-key"
    
    # Auth
    ["NEXTAUTH_SECRET"]="auth/nextauth-secret"
    ["JWT_SECRET"]="auth/jwt-secret"
)

# Function to get secret from gopass
get_from_gopass() {
    local path="$1"
    gopass show -o "${GOPASS_PREFIX}/${path}" 2>/dev/null
}

# Function to get secret from Google Cloud
get_from_gcloud() {
    local name="$1"
    gcloud secrets versions access latest --secret="$name" --project="$GCLOUD_PROJECT" 2>/dev/null
}

# Create .env.local header
cat > .env.local << EOF
# Generated from secrets management - DO NOT COMMIT
# Generated on $(date)
# Source: $([ "$USE_GOPASS" = true ] && echo "gopass (primary)" || echo "Google Cloud")

EOF

# Process each secret
SUCCESS_COUNT=0
MISSING_COUNT=0
echo "📝 Processing secrets..."
echo ""

for env_var in "${!SECRETS[@]}"; do
    gopass_path="${SECRETS[$env_var]}"
    VALUE=""
    SOURCE=""
    
    # Try gopass first (faster, works offline)
    if [ "$USE_GOPASS" = true ]; then
        VALUE=$(get_from_gopass "$gopass_path")
        if [ ! -z "$VALUE" ]; then
            SOURCE="gopass"
        fi
    fi
    
    # Fall back to Google Cloud if needed
    if [ -z "$VALUE" ] && [ "$USE_GCLOUD" = true ]; then
        VALUE=$(get_from_gcloud "$env_var")
        if [ ! -z "$VALUE" ]; then
            SOURCE="gcloud"
        fi
    fi
    
    # Write to .env.local if found
    if [ ! -z "$VALUE" ]; then
        # Handle multiline values (like private keys)
        if [[ "$VALUE" == *$'\n'* ]]; then
            echo "${env_var}=\"${VALUE}\"" >> .env.local
        else
            echo "${env_var}=${VALUE}" >> .env.local
        fi
        echo -e "  ${GREEN}✓${NC} ${env_var} (${SOURCE})"
        ((SUCCESS_COUNT++))
    else
        echo -e "  ${RED}✗${NC} ${env_var} - not found"
        ((MISSING_COUNT++))
    fi
done

echo ""
echo "═══════════════════════════════════════"
echo "Generation Complete!"
echo "  ${GREEN}✓ Added: ${SUCCESS_COUNT} secrets${NC}"
if [ $MISSING_COUNT -gt 0 ]; then
    echo "  ${RED}✗ Missing: ${MISSING_COUNT} secrets${NC}"
    echo ""
    echo "  To sync from Google Cloud to gopass, run:"
    echo "  ${YELLOW}./sync-gopass-secrets.sh${NC}"
fi
echo ""
echo "📁 Created: .env.local"
echo ""

# Verify .gitignore
if ! grep -q "^\.env\.local$" .gitignore 2>/dev/null; then
    echo -e "${YELLOW}⚠️  Warning: .env.local is not in .gitignore!${NC}"
    echo "Adding it now..."
    echo ".env.local" >> .gitignore
fi

# Check if critical variables are present
CRITICAL_VARS=(
    "NEXT_PUBLIC_FIREBASE_API_KEY"
    "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"
    "NEXT_PUBLIC_FIREBASE_PROJECT_ID"
)

echo "🔍 Verifying critical variables..."
ALL_CRITICAL_PRESENT=true
for var in "${CRITICAL_VARS[@]}"; do
    if ! grep -q "^${var}=" .env.local; then
        echo -e "  ${RED}✗ Missing critical: ${var}${NC}"
        ALL_CRITICAL_PRESENT=false
    fi
done

if [ "$ALL_CRITICAL_PRESENT" = true ]; then
    echo -e "  ${GREEN}✓ All critical variables present${NC}"
    echo ""
    echo -e "${GREEN}✅ Ready to start development!${NC}"
    echo "  Run: npm run dev"
else
    echo ""
    echo -e "${RED}⚠️  Missing critical variables!${NC}"
    echo "The app will not start without these Firebase configuration variables."
    echo "Please sync secrets first: ./sync-gopass-secrets.sh"
    exit 1
fi
