#!/usr/bin/env bash

# setup-gopass-vercel.sh
# Initialize gopass structure for Vercel-native KBE website

set -e

PROJECT="kbe-website"
ENVIRONMENTS=("production" "preview" "development")

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔐 Setting up gopass structure for Vercel-native KBE Website${NC}"
echo ""

# Check if gopass is initialized
if ! gopass ls > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  gopass is not initialized. Run 'gopass init' first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ gopass is initialized${NC}"
echo ""

# Create base structure
echo "📁 Creating gopass structure..."

for ENV in "${ENVIRONMENTS[@]}"; do
    BASE_PATH="vercel/${PROJECT}/${ENV}"
    echo -e "  Creating ${BLUE}${BASE_PATH}${NC}"
    
    # Create the base path
    gopass generate "${BASE_PATH}/placeholder" 1 > /dev/null 2>&1 || true
    gopass rm -f "${BASE_PATH}/placeholder" > /dev/null 2>&1 || true
    
    # Auth Provider Secrets (using Clerk as example)
    echo -e "    ${YELLOW}→${NC} Auth secrets"
    gopass generate "${BASE_PATH}/CLERK_SECRET_KEY" 32 > /dev/null 2>&1 || echo "    - CLERK_SECRET_KEY exists"
    gopass insert "${BASE_PATH}/NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY" < /dev/null 2>&1 || echo "    - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY exists"
    
    # Database Secrets
    echo -e "    ${YELLOW}→${NC} Database secrets"
    gopass insert "${BASE_PATH}/POSTGRES_URL" < /dev/null 2>&1 || echo "    - POSTGRES_URL exists"
    gopass insert "${BASE_PATH}/POSTGRES_URL_NON_POOLING" < /dev/null 2>&1 || echo "    - POSTGRES_URL_NON_POOLING exists"
    gopass insert "${BASE_PATH}/KV_REST_API_URL" < /dev/null 2>&1 || echo "    - KV_REST_API_URL exists"
    gopass generate "${BASE_PATH}/KV_REST_API_TOKEN" 32 > /dev/null 2>&1 || echo "    - KV_REST_API_TOKEN exists"
    
    # AI/LLM Secrets
    echo -e "    ${YELLOW}→${NC} AI secrets"
    gopass insert "${BASE_PATH}/OPENAI_API_KEY" < /dev/null 2>&1 || echo "    - OPENAI_API_KEY exists"
    gopass insert "${BASE_PATH}/ANTHROPIC_API_KEY" < /dev/null 2>&1 || echo "    - ANTHROPIC_API_KEY exists"
    
    # Vercel Platform
    echo -e "    ${YELLOW}→${NC} Vercel platform secrets"
    gopass insert "${BASE_PATH}/VERCEL_TOKEN" < /dev/null 2>&1 || echo "    - VERCEL_TOKEN exists"
    
    # Application
    echo -e "    ${YELLOW}→${NC} Application config"
    if [ "$ENV" == "production" ]; then
        gopass insert "${BASE_PATH}/NEXT_PUBLIC_APP_URL" <<< "https://homerenrichment.com" > /dev/null 2>&1 || echo "    - NEXT_PUBLIC_APP_URL exists"
    elif [ "$ENV" == "preview" ]; then
        gopass insert "${BASE_PATH}/NEXT_PUBLIC_APP_URL" <<< "https://preview.homerenrichment.com" > /dev/null 2>&1 || echo "    - NEXT_PUBLIC_APP_URL exists"
    else
        gopass insert "${BASE_PATH}/NEXT_PUBLIC_APP_URL" <<< "http://localhost:3000" > /dev/null 2>&1 || echo "    - NEXT_PUBLIC_APP_URL exists"
    fi
done

echo ""
echo -e "${GREEN}✅ gopass structure created successfully!${NC}"
echo ""
echo "📝 Next steps:"
echo "  1. Update secret values: gopass edit vercel/${PROJECT}/[env]/[SECRET_NAME]"
echo "  2. Sync to Vercel: ./scripts/gopass-vercel-sync.sh ${PROJECT} [environment]"
echo "  3. Pull for local dev: vercel env pull .env.local"
echo ""
echo -e "${BLUE}Current structure:${NC}"
gopass ls vercel/${PROJECT}/