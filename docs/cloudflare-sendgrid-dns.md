# Adding SendGrid DNS Records to Cloudflare

## Step-by-Step Instructions

### 1. Log into Cloudflare
- Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
- Select your domain: `homerenrichment.com`
- Click on "DNS" in the left sidebar

### 2. Add Each CNAME Record

For each CNAME record below, click "Add record" and enter:

#### Record 1 - Link Tracking
- **Type**: CNAME
- **Name**: `url3778` (Cloudflare will append .homerenrichment.com)
- **Target**: `sendgrid.net`
- **Proxy status**: DNS only (gray cloud)
- **TTL**: Auto

#### Record 2 - Click Tracking
- **Type**: CNAME
- **Name**: `54920324`
- **Target**: `sendgrid.net`
- **Proxy status**: DNS only (gray cloud)
- **TTL**: Auto

#### Record 3 - Email Subdomain
- **Type**: CNAME
- **Name**: `em5187`
- **Target**: `u54920324.wl075.sendgrid.net`
- **Proxy status**: DNS only (gray cloud)
- **TTL**: Auto

#### Record 4 - DKIM Key 1
- **Type**: CNAME
- **Name**: `s1._domainkey`
- **Target**: `s1.domainkey.u54920324.wl075.sendgrid.net`
- **Proxy status**: DNS only (gray cloud)
- **TTL**: Auto

#### Record 5 - DKIM Key 2
- **Type**: CNAME
- **Name**: `s2._domainkey`
- **Target**: `s2.domainkey.u54920324.wl075.sendgrid.net`
- **Proxy status**: DNS only (gray cloud)
- **TTL**: Auto

### 3. Add the TXT Record

#### Record 6 - DMARC Policy
- **Type**: TXT
- **Name**: `_dmarc`
- **Content**: `v=DMARC1; p=none;`
- **TTL**: Auto

### 4. Add SPF Record (if not already present)

Check if you already have a TXT record for `@` (root domain) with SPF. If not, add:

- **Type**: TXT
- **Name**: `@`
- **Content**: `v=spf1 include:sendgrid.net ~all`
- **TTL**: Auto

If you already have an SPF record, modify it to include SendGrid:
```
v=spf1 include:sendgrid.net include:_spf.google.com ~all
```

## Important Notes

### Proxy Status (Orange vs Gray Cloud)
- **ALWAYS use DNS only (gray cloud)** for email-related records
- If you use Cloudflare proxy (orange cloud), email authentication will fail

### What Each Record Does
- **url3778 & 54920324**: Link branding - makes links show as your domain
- **em5187**: Email sending subdomain
- **s1 & s2._domainkey**: DKIM authentication for email security
- **_dmarc**: DMARC policy for email authentication

### Verification Timeline
- Records typically propagate within 5-30 minutes
- SendGrid will automatically verify once records are detected
- You'll see green checkmarks in SendGrid when verified

## After Adding Records

1. Go back to SendGrid
2. Click "Verify" on the domain authentication page
3. All records should show as verified (green checkmarks)
4. If any fail, double-check the exact values and proxy status

## Troubleshooting

### If verification fails:
1. Ensure all records have gray cloud (DNS only)
2. Check for typos in record names/values
3. Wait 30 minutes and try again
4. Use DNS checker: https://dnschecker.org

### Common Issues:
- **Proxy enabled**: Must be DNS only for email records
- **Typos**: Copy/paste exactly from SendGrid
- **Existing records**: Check for conflicts with existing DKIM records

## DMARC Upgrade (Optional)

The basic DMARC policy (`p=none`) just monitors. To enforce:
- `p=quarantine` - Suspicious emails go to spam
- `p=reject` - Block unauthorized emails

Start with `p=none` and monitor before enforcing.