# SendGrid Domain Authentication Decisions

## Recommended Settings for Homer Enrichment Hub

### 1. **Domain**: `homerenrichment.com` ✅

- Use your primary domain for best recognition
- Ensures emails appear to come directly from your organization

### 2. **Brand the link for this domain**: **YES** ✅

- **Why**: Links will show as `links.homerenrichment.com` instead of `sendgrid.net`
- **Benefits**:
  - Increased trust (users see your domain)
  - Better click-through rates
  - Consistent branding
  - Reduced spam filtering

### 3. **Advanced Settings**

#### **Use automated security**: **YES** ✅

- **Why**: Automatically rotates DKIM keys for maximum security
- **Benefits**: No manual maintenance required

#### **Use custom return path**: **NO** ❌

- **Why**: SendGrid's default works well
- **Unless**: You have specific compliance requirements

#### **Use a custom link subdomain**: **NO** ❌ (use default)

- **Default**: `links.homerenrichment.com`
- **Why**: Standard and recognizable
- **Alternative**: Could use `click.homerenrichment.com` if preferred

#### **Use a custom DKIM selector**: **NO** ❌ (unless conflict)

- **Default**: Uses "s1" and "s2"
- **Only change if**: You already use SendGrid with another service

## DNS Records You'll Add to Cloudflare

After configuring, SendGrid will provide records like:

```
# Domain Authentication
CNAME   em1234.homerenrichment.com     → u1234567.wl123.sendgrid.net
CNAME   s1._domainkey               → s1.domainkey.u1234567.wl123.sendgrid.net
CNAME   s2._domainkey               → s2.domainkey.u1234567.wl123.sendgrid.net

# Link Branding
CNAME   links.homerenrichment.com      → sendgrid.net
CNAME   1234567.homerenrichment.com    → sendgrid.net

# Optional SPF (if not already set)
TXT     @                           → v=spf1 include:sendgrid.net ~all
```

## Summary of Decisions

| Setting               | Choice              | Reason                                         |
| --------------------- | ------------------- | ---------------------------------------------- |
| Domain                | homerenrichment.com | Primary domain for recognition                 |
| Link Branding         | Yes                 | Professional appearance, better deliverability |
| Automated Security    | Yes                 | Automatic DKIM rotation                        |
| Custom Return Path    | No                  | Default works well                             |
| Custom Link Subdomain | No                  | Use standard "links"                           |
| Custom DKIM Selector  | No                  | No conflicts expected                          |

## Next Steps

1. Complete domain authentication in SendGrid
2. Add DNS records to Cloudflare
3. Verify authentication (usually within 30 minutes)
4. Set up email templates with Homer Enrichment Hub branding
