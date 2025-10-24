#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PROJECT_ID="kbe-website"

echo -e "${GREEN}🔐 Setting up secrets for $PROJECT_ID${NC}"
echo

# Check if secrets.txt exists
if [ ! -f "secrets.txt" ]; then
    echo -e "${RED}❌ secrets.txt not found!${NC}"
    echo "Please create secrets.txt with your configuration values"
    exit 1
fi

# Function to create or update a secret
set_secret() {
    local SECRET_NAME=$1
    local SECRET_VALUE=$2
    
    if [ -z "$SECRET_VALUE" ] || [ "$SECRET_VALUE" == "your-"* ] || [ "$SECRET_VALUE" == "GENERATE" ]; then
        echo -e "${YELLOW}⚠️  Skipping $SECRET_NAME (no value set)${NC}"
        return
    fi
    
    echo -n "Setting $SECRET_NAME... "
    
    # Check if secret exists
    if gcloud secrets describe $SECRET_NAME --project=$PROJECT_ID &>/dev/null; then
        # Secret exists, add a new version
        echo -n "$SECRET_VALUE" | gcloud secrets versions add $SECRET_NAME \
            --data-file=- \
            --project=$PROJECT_ID &>/dev/null
        
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✓${NC}"
        else
            echo -e "${RED}✗${NC}"
        fi
    else
        # Create new secret
        echo -n "$SECRET_VALUE" | gcloud secrets create $SECRET_NAME \
            --data-file=- \
            --replication-policy="automatic" \
            --project=$PROJECT_ID &>/dev/null
        
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✓ (created)${NC}"
        else
            echo -e "${RED}✗${NC}"
        fi
    fi
}

# Read secrets.txt and process each line
echo -e "${YELLOW}Processing secrets...${NC}"
while IFS='=' read -r key value; do
    # Skip comments and empty lines
    if [[ $key == \#* ]] || [ -z "$key" ]; then
        continue
    fi
    
    # Remove any leading/trailing whitespace
    key=$(echo "$key" | xargs)
    value=$(echo "$value" | xargs)
    
    set_secret "$key" "$value"
done < secrets.txt

echo
echo -e "${GREEN}✅ Secrets setup complete!${NC}"
echo

# Grant App Hosting service account access
echo -e "${YELLOW}Granting App Hosting access to secrets...${NC}"
SERVICE_ACCOUNT="firebase-app-hosting-compute@$PROJECT_ID.iam.gserviceaccount.com"

# Get all secrets we just created
SECRETS=$(gcloud secrets list --project=$PROJECT_ID --format="value(name)" --filter="createTime>$(date -u -d '5 minutes ago' +%Y-%m-%dT%H:%M:%S)Z")

if [ -z "$SECRETS" ]; then
    # If no recent secrets, grant access to all NEXT_PUBLIC and other common secrets
    SECRETS="NEXT_PUBLIC_FIREBASE_API_KEY NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN NEXT_PUBLIC_FIREBASE_PROJECT_ID NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID NEXT_PUBLIC_FIREBASE_APP_ID GOOGLE_GENAI_API_KEY NEXTAUTH_SECRET JWT_SECRET"
fi

for SECRET in $SECRETS; do
    echo -n "Granting access to $SECRET... "
    gcloud secrets add-iam-policy-binding $SECRET \
        --member="serviceAccount:${SERVICE_ACCOUNT}" \
        --role="roles/secretmanager.secretAccessor" \
        --project=$PROJECT_ID &>/dev/null
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓${NC}"
    else
        echo -e "${YELLOW}⚠️  (may already have access)${NC}"
    fi
done

echo
echo -e "${GREEN}✅ All done!${NC}"
echo
echo "Next steps:"
echo "1. Create/update apphosting.yaml with your secrets"
echo "2. Create .env.local for local development"
echo "3. Update your code to use firebase-config.ts"
echo "4. DELETE secrets.txt - ${RED}IMPORTANT!${NC}"
