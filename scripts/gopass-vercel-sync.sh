#!/usr/bin/env bash

# gopass-vercel-sync.sh
# Securely sync secrets from gopass to Vercel environment variables

set -e
set -o pipefail

# Configuration
GOPASS_ROOT="vercel"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

function show_usage() {
    echo "Usage: $0 <project-name> <environment>"
    echo "  <project-name>: The project name (e.g., kbe-website)"
    echo "  <environment>: Target environment (production, preview, or development)"
    echo ""
    echo "Example:"
    echo "  $0 kbe-website production"
    exit 1
}

# Argument validation
if [ "$#" -ne 2 ]; then
    show_usage
fi

PROJECT_NAME=$1
VERCEL_ENV=$2

# Validate environment
if [[ ! "$VERCEL_ENV" =~ ^(production|preview|development)$ ]]; then
    echo -e "${RED}❌ Invalid environment. Must be: production, preview, or development${NC}"
    show_usage
fi

GOPASS_PROJECT_PATH="${GOPASS_ROOT}/${PROJECT_NAME}/${VERCEL_ENV}"

echo -e "${BLUE}🔐 Syncing secrets from gopass to Vercel${NC}"
echo -e "   Project: ${YELLOW}${PROJECT_NAME}${NC}"
echo -e "   Environment: ${YELLOW}${VERCEL_ENV}${NC}"
echo -e "   gopass path: ${YELLOW}${GOPASS_PROJECT_PATH}${NC}"
echo ""

# Check if gopass path exists
if ! gopass ls "${GOPASS_PROJECT_PATH}" > /dev/null 2>&1; then
    echo -e "${RED}❌ gopass path '${GOPASS_PROJECT_PATH}' not found${NC}"
    echo ""
    echo "Available paths:"
    gopass ls "${GOPASS_ROOT}/${PROJECT_NAME}/" 2>/dev/null || echo "No project found at ${GOPASS_ROOT}/${PROJECT_NAME}/"
    exit 1
fi

# Check if vercel CLI is logged in
if ! vercel whoami > /dev/null 2>&1; then
    echo -e "${RED}❌ Not logged in to Vercel CLI${NC}"
    echo "Run: vercel login"
    exit 1
fi

echo -e "${GREEN}✅ Prerequisites checked${NC}"
echo ""

# Count secrets to sync
SECRET_COUNT=$(gopass ls -f "${GOPASS_PROJECT_PATH}" | wc -l)
echo -e "Found ${YELLOW}${SECRET_COUNT}${NC} secrets to sync"
echo ""

# Sync each secret
SYNCED=0
FAILED=0

gopass ls -f "${GOPASS_PROJECT_PATH}" | while read -r secret_full_path; do
    # Extract secret name (last part of path)
    secret_name=$(basename "${secret_full_path}")
    
    # Skip placeholder entries
    if [[ "$secret_name" == "placeholder" ]]; then
        continue
    fi
    
    echo -n "  Syncing ${secret_name}... "
    
    # Get the secret value and pipe to vercel env add
    # The --force flag will overwrite if it exists
    if gopass show -o "${secret_full_path}" 2>/dev/null | vercel env add "${secret_name}" "${VERCEL_ENV}" --yes --force > /dev/null 2>&1; then
        echo -e "${GREEN}✓${NC}"
        ((SYNCED++)) || true
    else
        echo -e "${RED}✗${NC}"
        echo -e "    ${RED}Failed to sync ${secret_name}${NC}"
        ((FAILED++)) || true
    fi
done

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ Sync complete!${NC}"
echo -e "   Synced: ${GREEN}${SYNCED}${NC} secrets"
if [ "$FAILED" -gt 0 ]; then
    echo -e "   Failed: ${RED}${FAILED}${NC} secrets"
fi
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Provide next steps
echo "📝 Next steps:"
echo "  1. Pull to local: vercel env pull .env.local"
echo "  2. Restart dev server: vercel dev"
echo "  3. Deploy: vercel --prod"
echo ""

# Optional: Show what was synced
read -p "Show synced variables? (y/N) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "Synced variables:"
    vercel env ls "${VERCEL_ENV}" | grep -E "ago|Name"
fi