# Cloudflare Migration: ~~homerconnect.com~~ → homerenrichment.com ✅

## Status: MIGRATION COMPLETE

The project has successfully migrated from homerconnect.com to homerenrichment.com domain.

## Current Configuration

- **Production Domain**: homerenrichment.com
- **Subdomain**: kbe.homerenrichment.com (main site)
- **Old Domain**: homerconnect.com (deprecated)
- **Zone ID**: 7a95b1a3db5d14d1292fd04b9007ba32
- **Account ID**: 13eb584192d9cefb730fde0cfd271328

## Cloudflare Management System Available

### CLI Tools

```bash
# Context-aware Cloudflare CLI
cf dns list                    # List DNS records
cf dns add A kbe 35.219.200.11 # Add subdomain
cf dns delete kbe              # Remove record

# Direct cf-go CLI
cf-go dns list
cf-go diag token              # Test token access
```

### Token Management (via gopass)

```bash
# Available tokens for this project:
gopass show -o cloudflare/tokens/projects/homerenrichment/dns       # DNS management
gopass show -o cloudflare/tokens/projects/homerenrichment/terraform # Terraform
gopass show -o cloudflare/tokens/human/readonly                    # Safe read-only
gopass show -o cloudflare/tokens/human/full                        # Full access
```

### Project Navigation

```bash
# Use ds CLI for quick navigation
cd $(ds cd kbe-website)        # Jump to this project
cd $(ds cd cloudflare-management) # Jump to Cloudflare IaC repo
```

## Migration Steps

### Phase 1: DNS Setup (Cloudflare API)

```bash
# 1. Add required DNS records for homerenrichment.com
export CLOUDFLARE_API_TOKEN=$(gopass show -o cloudflare/tokens/projects/homerenrichment/dns)
export CLOUDFLARE_ZONE_ID="7a95b1a3db5d14d1292fd04b9007ba32"

# Main site (if needed - Firebase App Hosting may handle this)
cf-go dns add A kbe 35.219.200.11

# API subdomain (if using)
cf-go dns add CNAME api.kbe kbe.homerenrichment.com

# Email authentication (SendGrid)
cf-go dns add CNAME em5187 u54920324.wl075.sendgrid.net
cf-go dns add CNAME s1._domainkey s1.domainkey.u54920324.wl075.sendgrid.net
cf-go dns add CNAME s2._domainkey s2.domainkey.u54920324.wl075.sendgrid.net
cf-go dns add TXT _dmarc "v=DMARC1; p=none;"
cf-go dns add TXT @ "v=spf1 include:sendgrid.net ~all"
```

### Phase 2: Code Updates

#### Files to Update (56 total)

Major categories:

1. **SendGrid Email Configuration** (4 files)
   - `src/lib/sendgrid-email-service.ts`
   - `src/lib/sendgrid-templates.ts`
   - `src/lib/email-templates.ts`
   - `src/lib/utils.ts`

2. **Scripts** (20+ files in `/scripts/`)
   - Domain setup scripts
   - Auth verification scripts
   - SSL check scripts

3. **Documentation** (15+ files in `/docs/` and root)
   - Setup guides
   - API key configuration
   - Domain migration docs

#### Automated Update Script

```bash
# Create a migration script
cat > migrate-domain.sh << 'EOF'
#!/bin/bash
# Migrate from homerconnect.com to homerenrichment.com

OLD_DOMAIN="homerconnect.com"
NEW_DOMAIN="homerenrichment.com"

# Find and replace in all files
find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" -o -name "*.md" -o -name "*.sh" \) \
  -not -path "./node_modules/*" \
  -not -path "./.git/*" \
  -exec sed -i "s/${OLD_DOMAIN}/${NEW_DOMAIN}/g" {} +

echo "Domain migration complete. Files updated:"
grep -r "$NEW_DOMAIN" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.md" | wc -l
EOF

chmod +x migrate-domain.sh
./migrate-domain.sh
```

### Phase 3: Firebase Configuration

1. **Update Firebase Auth Authorized Domains**:

   ```bash
   # Navigate to Firebase Console
   echo "https://console.firebase.google.com/project/kbe-website/authentication/settings"

   # Add to Authorized domains:
   # - homerenrichment.com
   # - kbe.homerenrichment.com
   ```

2. **Update API Key Restrictions**:

   ```bash
   # Update referrer restrictions in Google Cloud Console
   echo "https://console.cloud.google.com/apis/credentials?project=kbe-website"

   # Add HTTP referrers:
   # - https://homerenrichment.com/*
   # - https://kbe.homerenrichment.com/*
   ```

3. **Update OAuth 2.0 Redirect URIs**:
   ```bash
   # In Google Cloud Console OAuth 2.0 Client
   # Add authorized redirect URIs:
   # - https://kbe.homerenrichment.com/__/auth/handler
   # - https://homerenrichment.com/__/auth/handler
   ```

### Phase 4: SendGrid Configuration

1. **Domain Authentication**:

   ```bash
   # Use SendGrid API or UI to authenticate homerenrichment.com
   # DNS records will be provided by SendGrid
   # Add them using cf-go CLI as shown in Phase 1
   ```

2. **Update Email Templates**:
   - Update FROM addresses to use @homerenrichment.com
   - Update reply-to addresses
   - Update footer links

### Phase 5: Environment Variables

Update `.env.local` and production secrets:

```bash
# Local development
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=kbe.homerenrichment.com
NEXT_PUBLIC_APP_URL=https://kbe.homerenrichment.com

# Production (Google Secret Manager via apphosting.yaml)
firebase apphosting:secrets:set NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
firebase apphosting:secrets:set NEXT_PUBLIC_APP_URL
```

### Phase 6: Verification

```bash
# 1. Check DNS propagation
cf-go dns list | grep kbe

# 2. Verify SSL certificate
curl -I https://kbe.homerenrichment.com

# 3. Test authentication flow
npm run dev
# Navigate to http://localhost:9002 and test login

# 4. Check email delivery
node scripts/test-basic-email.js
```

## Rollback Plan

If issues arise:

```bash
# 1. Keep homerconnect.com DNS records active
# 2. Use dual-domain support temporarily
# 3. Revert code changes:
git checkout -- .
# 4. Re-run with homerconnect.com
```

## Post-Migration Cleanup

Once confirmed working:

```bash
# 1. Remove homerconnect.com from Firebase authorized domains
# 2. Update all documentation
# 3. Remove old DNS records from homerconnect.com zone
# 4. Update any hardcoded references in Firebase App Hosting
```

## Support Resources

- **Cloudflare Management**: `/home/verlyn13/Projects/Jefahnierocks-Infra/cloudflare-management`
- **Token Guide**: `/tmp/cf-token-creation-guide.md`
- **CF CLI Help**: `cf --help` or `cf-go --help`
- **DS Navigation**: `ds status` to see all repos

## Notes

- All Cloudflare operations can be done via API (no manual DNS entry needed)
- SendGrid will require re-authentication for the new domain
- Firebase App Hosting may need domain verification through Google Search Console
- Keep both domains active during transition period (dual-domain support)
