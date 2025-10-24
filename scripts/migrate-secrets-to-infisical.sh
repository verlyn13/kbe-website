#!/usr/bin/env bash
set -euo pipefail

# Migrate secrets from .env.local to Infisical
# Usage: ./scripts/migrate-secrets-to-infisical.sh [project-id]

DOMAIN="https://secrets.jefahnierocks.com"
ENV="prod"
PROJECT_ID="${1:-}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Infisical Secrets Migration ===${NC}"
echo ""

# Check if INFISICAL_TOKEN is set
if [ -z "${INFISICAL_TOKEN:-}" ]; then
    echo -e "${YELLOW}INFISICAL_TOKEN not set. Attempting to get from gopass...${NC}"
    if command -v gopass &> /dev/null; then
        export INFISICAL_TOKEN=$(gopass show -o infisical/tokens/homer-enrichment 2>/dev/null || echo "")
    fi

    if [ -z "${INFISICAL_TOKEN:-}" ]; then
        echo -e "${RED}Error: INFISICAL_TOKEN not found${NC}"
        echo "Please set it with:"
        echo "  export INFISICAL_TOKEN=\"your-token\""
        echo "Or store in gopass:"
        echo "  gopass insert infisical/tokens/homer-enrichment"
        exit 1
    fi
fi

# Check if project ID provided
if [ -z "$PROJECT_ID" ]; then
    echo -e "${YELLOW}No project ID provided.${NC}"
    echo "Please find your project ID from Infisical web UI:"
    echo "  https://secrets.jefahnierocks.com"
    echo ""
    echo "Usage: $0 <project-id>"
    echo "Example: $0 6789abcd-1234-5678-90ab-cdef12345678"
    exit 1
fi

echo "Domain: $DOMAIN"
echo "Environment: $ENV"
echo "Project ID: $PROJECT_ID"
echo ""

# Function to set a secret
set_secret() {
    local key=$1
    local value=$2
    local description=${3:-""}

    echo -n "Setting $key..."

    if infisical secrets set \
        --env="$ENV" \
        --projectId="$PROJECT_ID" \
        --domain="$DOMAIN" \
        "$key=$value" &>/dev/null; then
        echo -e " ${GREEN}✓${NC}"
        return 0
    else
        echo -e " ${RED}✗${NC}"
        return 1
    fi
}

# Secrets from current .env.local
echo -e "${GREEN}Migrating existing secrets:${NC}"
set_secret "NEXTAUTH_SECRET" "<set-in-infisical>"
set_secret "JWT_SECRET" "<set-in-infisical>"
set_secret "NEXT_PUBLIC_APP_URL" "https://homerenrichment.com"
set_secret "SENDGRID_API_KEY" "<set-in-infisical>"
set_secret "SENDGRID_TEMPLATE_MAGIC_LINK" "<template-id>"
set_secret "SENDGRID_TEMPLATE_WELCOME" "<template-id>"
set_secret "SENDGRID_TEMPLATE_PASSWORD_RESET" "<template-id>"
set_secret "SENDGRID_TEMPLATE_ANNOUNCEMENT" "<template-id>"
set_secret "SENDGRID_TEMPLATE_REGISTRATION_CONFIRMATION" "<template-id>"

echo ""
echo -e "${GREEN}Adding Sentry secrets:${NC}"
set_secret "NEXT_PUBLIC_SENTRY_DSN" "<set-in-infisical>"
set_secret "SENTRY_ORG" "<org>"
set_secret "SENTRY_PROJECT" "<project>"
set_secret "SENTRY_AUTH_TOKEN" "<set-in-infisical>"

echo ""
echo -e "${YELLOW}Note: Supabase secrets need to be added manually:${NC}"
echo "  NEXT_PUBLIC_SUPABASE_URL"
echo "  NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo "  DATABASE_URL"
echo "  DIRECT_URL"
echo ""
echo "Get these from: https://app.supabase.com/project/_/settings/api"
echo ""
echo -e "${GREEN}Migration complete!${NC}"
echo ""
echo "To verify, run:"
echo "  infisical secrets list --env=$ENV --projectId=$PROJECT_ID --domain=$DOMAIN"
echo ""
echo "To use in development:"
echo "  infisical run --env=$ENV --projectId=$PROJECT_ID --domain=$DOMAIN -- bun run dev"
