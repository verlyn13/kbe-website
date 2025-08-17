#!/bin/bash

# Domain Migration Script: homerconnect.com → homerenrichment.com
# This script automates the code changes for migrating from the old domain to the new one

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Domain Migration Script ===${NC}"
echo "Migrating from homerconnect.com to homerenrichment.com"
echo ""

# Backup function
create_backup() {
    echo -e "${YELLOW}Creating backup...${NC}"
    timestamp=$(date +"%Y%m%d_%H%M%S")
    backup_dir="backups/migration_${timestamp}"
    mkdir -p "$backup_dir"
    
    # Copy all files that will be modified
    find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" -o -name "*.json" -o -name "*.md" -o -name "*.yaml" -o -name "*.yml" \) \
        -not -path "./node_modules/*" \
        -not -path "./.git/*" \
        -not -path "./backups/*" \
        -exec cp --parents {} "$backup_dir/" \; 2>/dev/null || true
    
    echo -e "${GREEN}✓ Backup created in $backup_dir${NC}"
}

# Count occurrences
count_occurrences() {
    echo -e "${YELLOW}Counting occurrences...${NC}"
    count=$(grep -r "homerconnect\.com" . \
        --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" \
        --include="*.json" --include="*.md" --include="*.yaml" --include="*.yml" \
        --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=backups \
        2>/dev/null | wc -l)
    echo -e "Found ${GREEN}$count${NC} occurrences of homerconnect.com"
}

# Replace in files
replace_domain() {
    echo -e "${YELLOW}Replacing domain references...${NC}"
    
    # Files to process
    file_types=("*.ts" "*.tsx" "*.js" "*.jsx" "*.json" "*.md" "*.yaml" "*.yml" "*.sh" "*.env*")
    
    for pattern in "${file_types[@]}"; do
        find . -type f -name "$pattern" \
            -not -path "./node_modules/*" \
            -not -path "./.git/*" \
            -not -path "./backups/*" \
            -not -path "./CLOUDFLARE_MIGRATION.md" \
            -not -path "./migrate-domain.sh" \
            -exec sed -i 's/homerconnect\.com/homerenrichment.com/g' {} \; 2>/dev/null || true
    done
    
    echo -e "${GREEN}✓ Domain references updated${NC}"
}

# Verify changes
verify_changes() {
    echo -e "${YELLOW}Verifying changes...${NC}"
    
    # Check for any remaining old domain references
    remaining=$(grep -r "homerconnect\.com" . \
        --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" \
        --include="*.json" --include="*.md" --include="*.yaml" --include="*.yml" \
        --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=backups \
        --exclude="CLOUDFLARE_MIGRATION.md" \
        --exclude="migrate-domain.sh" \
        2>/dev/null | wc -l)
    
    if [ "$remaining" -eq 0 ]; then
        echo -e "${GREEN}✓ All domain references successfully updated${NC}"
        return 0
    else
        echo -e "${RED}⚠ Warning: Found $remaining remaining references to homerconnect.com${NC}"
        echo "Remaining references:"
        grep -r "homerconnect\.com" . \
            --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" \
            --include="*.json" --include="*.md" --include="*.yaml" --include="*.yml" \
            --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=backups \
            --exclude="CLOUDFLARE_MIGRATION.md" \
            --exclude="migrate-domain.sh" \
            2>/dev/null || true
        return 1
    fi
}

# Update specific configuration files
update_configs() {
    echo -e "${YELLOW}Updating configuration files...${NC}"
    
    # Update Firebase config if present
    if [ -f ".firebaserc" ]; then
        echo "  Checking .firebaserc..."
    fi
    
    # Update environment files
    for env_file in .env .env.local .env.production; do
        if [ -f "$env_file" ]; then
            echo "  Updating $env_file..."
            sed -i 's/homerconnect\.com/homerenrichment.com/g' "$env_file"
        fi
    done
    
    echo -e "${GREEN}✓ Configuration files updated${NC}"
}

# Main execution
main() {
    echo -e "${YELLOW}Starting migration process...${NC}"
    echo ""
    
    # Show initial count
    count_occurrences
    echo ""
    
    # Create backup
    create_backup
    echo ""
    
    # Perform replacement
    replace_domain
    echo ""
    
    # Update configs
    update_configs
    echo ""
    
    # Verify
    verify_changes
    result=$?
    echo ""
    
    if [ $result -eq 0 ]; then
        echo -e "${GREEN}=== Migration Complete ===${NC}"
        echo ""
        echo "Next steps:"
        echo "1. Review the changes: git diff"
        echo "2. Test locally: npm run dev"
        echo "3. Update DNS records: cf dns add A kbe 35.219.200.11"
        echo "4. Update Firebase authorized domains in console"
        echo "5. Commit changes: git add -A && git commit -m 'Migrate domain from homerconnect.com to homerenrichment.com'"
        echo "6. Deploy: firebase apphosting:rollouts:create"
    else
        echo -e "${YELLOW}=== Migration Complete with Warnings ===${NC}"
        echo "Please review the remaining references manually."
    fi
    
    echo ""
    echo -e "${YELLOW}Backup location:${NC} $backup_dir"
}

# Run if not sourced
if [ "${BASH_SOURCE[0]}" == "${0}" ]; then
    main "$@"
fi