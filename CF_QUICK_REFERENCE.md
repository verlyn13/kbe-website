# Cloudflare Quick Reference for kbe-website

## Essential Commands

### DNS Management

```bash
# List current DNS records
cf dns list

# Add kbe subdomain (for Firebase App Hosting)
cf dns add A kbe 35.219.200.11

# Add SendGrid email records
cf dns add CNAME em5187 u54920324.wl075.sendgrid.net
cf dns add CNAME s1._domainkey s1.domainkey.u54920324.wl075.sendgrid.net
cf dns add CNAME s2._domainkey s2.domainkey.u54920324.wl075.sendgrid.net
cf dns add TXT @ "v=spf1 include:sendgrid.net ~all"
cf dns add TXT _dmarc "v=DMARC1; p=none;"

# Update existing record
cf dns update kbe 35.219.200.12

# Delete record
cf dns delete kbe
```

### Token Management

```bash
# View available tokens
gopass list | grep cloudflare/tokens

# Use specific token
export CLOUDFLARE_API_TOKEN=$(gopass show -o cloudflare/tokens/projects/homerenrichment/dns)

# Test token access
cf-go diag token
```

### Context Information

```bash
# Check current context
cf context
# Output: Context: human, Project: kbe-website

# Jump between projects
cd $(ds cd kbe-website)              # This project
cd $(ds cd cloudflare-management)    # Cloudflare IaC
```

## Zone Details

- **Domain**: homerenrichment.com
- **Zone ID**: 7a95b1a3db5d14d1292fd04b9007ba32
- **Account ID**: 13eb584192d9cefb730fde0cfd271328
- **Current IP**: 65.74.107.134

## Migration Checklist

- [ ] DNS records created in homerenrichment.com zone
- [ ] Code updated (56 files) - use `./migrate-domain.sh`
- [ ] Firebase authorized domains updated
- [ ] API key restrictions updated
- [ ] OAuth redirect URIs updated
- [ ] SendGrid domain authenticated
- [ ] Email templates updated
- [ ] Environment variables updated
- [ ] SSL certificate verified
- [ ] Authentication flow tested
- [ ] Email delivery tested

## Troubleshooting

```bash
# Check DNS propagation
dig kbe.homerenrichment.com

# Verify SSL
curl -I https://kbe.homerenrichment.com

# Check Firebase auth domains
firebase projects:get kbe-website

# Test email
node scripts/test-basic-email.js

# View logs
firebase functions:log
```

## Important Files

- `CLOUDFLARE_MIGRATION.md` - Full migration guide
- `CLAUDE.md` - Project context and guidelines
- `.cloudflare` - Project Cloudflare config
- `migrate-domain.sh` - Automated migration script

## Support

- **Cloudflare Tokens**: Stored in gopass
- **DNS Changes**: Use `cf` or `cf-go` CLI
- **Firebase Console**: https://console.firebase.google.com/project/kbe-website
- **Google Cloud Console**: https://console.cloud.google.com/home/dashboard?project=kbe-website
