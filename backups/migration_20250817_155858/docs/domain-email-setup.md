# Custom Domain and Email Setup Guide

## 1. Custom Domain Setup (homerconnect.com)

### DNS Records Required

Add these DNS records at your domain registrar (GoDaddy, Namecheap, etc.):

```
Type    Host    Value                           TTL
----    ----    -----                           ---
A       @       151.101.1.195                   3600
A       @       151.101.65.195                  3600
TXT     @       google-site-verification=...    3600
```

### Firebase Hosting Steps

1. Go to Firebase Console → Hosting
2. Click "Add custom domain"
3. Enter `homerconnect.com`
4. Add the DNS records shown
5. Verify ownership (usually via TXT record)
6. Wait for SSL certificate provisioning (can take up to 24 hours)

### Verify DNS Propagation

```bash
# Check A records
dig homerconnect.com A

# Check if site is accessible
curl -I https://homerconnect.com
```

## 2. Custom Email Domain Setup

### Option A: Firebase + SendGrid (Recommended)

1. **Sign up for SendGrid**
   - Go to https://sendgrid.com
   - Create free account (100 emails/day free)

2. **Verify your domain in SendGrid**
   - Add domain authentication records
   - Add SPF, DKIM, and DMARC records

3. **Configure Firebase to use SendGrid**
   - Install Firebase Extensions: "Trigger Email from Firestore"
   - Configure with SendGrid API key
   - Set up email templates

### Option B: Firebase + Custom SMTP

1. **Use email service provider** (Gmail Workspace, Zoho, etc.)
2. **Configure SMTP settings** in Firebase

### DNS Records for Email

```
Type    Host              Value                                   Priority
----    ----              -----                                   --------
MX      @                 mx1.youremailprovider.com              10
TXT     @                 v=spf1 include:sendgrid.net ~all      -
TXT     default._domainkey k=rsa; p=YOUR_DKIM_KEY               -
TXT     _dmarc            v=DMARC1; p=none;                      -
```

## 3. Email Template Configuration

### Update Authentication Settings

1. Go to Firebase Console → Authentication → Templates
2. Customize the email template
3. Update sender name: "Homer Enrichment Hub"
4. Update sender email: "noreply@homerconnect.com"

### Custom Action URL

Update the action URL in Firebase:
```
https://homerconnect.com/__/auth/action
```

## 4. Testing

1. **Test domain access**:
   ```bash
   curl https://homerconnect.com
   ```

2. **Test email delivery**:
   - Send test magic link
   - Check spam folder
   - Verify sender domain

## 5. Troubleshooting

### Domain not working
- Check DNS propagation (can take 48 hours)
- Verify A records point to Firebase IPs
- Check SSL certificate status in Firebase Console

### Emails going to spam
- Verify SPF, DKIM, DMARC records
- Use authenticated domain
- Improve email content (avoid spam triggers)
- Add sender to contacts

### SSL Certificate Issues
- Wait for automatic provisioning
- Check domain verification status
- Contact Firebase support if stuck

## 6. Environment Updates

Update `.env.local`:
```
NEXT_PUBLIC_APP_URL=https://homerconnect.com
```

Update Firebase authentication settings to use custom domain for redirect URLs.

## 7. Fix API Key Restrictions (IMPORTANT)

When you get the error: `auth/requests-to-this-api-identitytoolkit-method-are-blocked`

### Quick Fix:
1. Go to: https://console.cloud.google.com/apis/credentials?project=kbe-website
2. Find your Browser API key (starts with AIzaSy...)
3. Click to edit
4. Under "Application restrictions", temporarily select **"None"**
5. Click "Save"
6. Wait 2-5 minutes for changes to propagate
7. Try logging in again

### Secure Fix (After Testing):
1. Change "Application restrictions" back to "HTTP referrers"
2. Add these referrers:
   - `https://homerconnect.com/*`
   - `https://www.homerconnect.com/*`
   - `https://*.homerconnect.com/*`
   - `http://localhost:*`
3. Save and test again