# Setting Up homerconnect.com with Firebase

This guide walks through configuring your custom domain for Firebase Hosting and Authentication.

## Benefits of Using Custom Domain

1. **Professional magic links**: `https://homerconnect.com/__/auth/action` instead of `kbe-website.firebaseapp.com`
2. **Better branding**: Users see your domain in emails and browser
3. **Trust**: Users more likely to click links from recognized domain
4. **SEO**: Better for search engine optimization

## Setup Steps

### 1. Add Custom Domain to Firebase Hosting

Using Firebase CLI:

````bash
firebase hosting:site:create homerconnect
firebase hosting:channel:deploy --site homerconnect
```text
Or via Console:

1. Go to [Firebase Console → Hosting](https://console.firebase.google.com/project/kbe-website/hosting/sites)
2. Click "Add custom domain"
3. Enter `homerconnect.com`
4. Follow verification steps

### 2. DNS Configuration with Cloudflare

Since you're using Cloudflare, here's the specific setup:

**For root domain (homerconnect.com):**

```text
Type: A
Name: @ (or homerconnect.com)
Value: [Firebase will provide IP, typically 151.101.1.195 and 151.101.65.195]
Proxy status: DNS only (gray cloud) - IMPORTANT!
```text
**For www subdomain (optional):**

```text
Type: CNAME
Name: www
Value: homerconnect.com
Proxy status: DNS only (gray cloud)
```text
**⚠️ IMPORTANT Cloudflare Settings:**

1. **Proxy Status**: Set to "DNS only" (gray cloud) NOT "Proxied" (orange cloud)
   - Firebase needs direct connection for SSL provisioning
   - You can enable proxy after SSL is working (optional)

2. **SSL/TLS Setting**:
   - Go to SSL/TLS → Overview
   - Set to "Full" or "Full (strict)"
   - Do NOT use "Flexible" - it will cause redirect loops

3. **Page Rules** (if needed):
   - Disable "Always Use HTTPS" for `homerconnect.com/__/auth/*`
   - Firebase handles HTTPS redirects

### 3. SSL Certificate

- Firebase automatically provisions SSL certificates via Let's Encrypt
- This process can take up to 24 hours
- You'll see "Needs setup" → "Provisioning" → "Connected" status

### 4. Update Application Configuration

Once domain is connected, update your configuration:

#### A. Update .env.local
```bash
NEXT_PUBLIC_APP_URL=https://homerconnect.com
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=homerconnect.com
```bash
#### B. Update ActionCodeSettings in login-form.tsx
```javascript
const actionCodeSettings = {
  url: 'https://homerconnect.com/',
  handleCodeInApp: true,
  // Optional: specify if you want to use custom domain for links
  dynamicLinkDomain: 'homerconnect.com',
};
```bash
#### C. Add to Authorized Domains
1. Go to [Firebase Console → Authentication → Settings](https://console.firebase.google.com/project/kbe-website/authentication/settings)
2. Add `homerconnect.com` to Authorized domains
3. Add `www.homerconnect.com` if using www subdomain

### 5. Update firebase.json (Optional)

If you want to specify the custom domain in config:

```json
{
  "hosting": {
    "site": "homerconnect",
    "public": "public",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"]
  }
}
```bash
## Testing the Setup

### 1. Verify Domain Connection
```bash
firebase hosting:sites:list
# Should show homerconnect.com as connected
```bash
### 2. Test Magic Links
```bash
npm run debug:magic-link
# Update the script to use homerconnect.com
```bash
### 3. Check DNS Propagation
```bash
# Check A records
dig homerconnect.com

# Check CNAME
dig www.homerconnect.com

# Test HTTPS
curl -I https://homerconnect.com
```bash
## Timeline

- **DNS Changes**: 5 minutes to 48 hours to propagate
- **SSL Certificate**: Up to 24 hours for provisioning
- **Magic Links**: Work immediately after domain is authorized

## Troubleshooting

### Cloudflare-Specific Issues
**"Needs setup" status persists:**

- Ensure proxy is OFF (gray cloud) in Cloudflare DNS
- Firebase can't verify domain through Cloudflare proxy
- Check: `dig homerconnect.com` should show Firebase IPs, not Cloudflare IPs

**SSL Certificate errors:**

- Cloudflare SSL mode must be "Full" or "Full (strict)"
- "Flexible" mode causes infinite redirects with Firebase
- Turn off "Always Use HTTPS" in Cloudflare during setup

**Error 525 (SSL Handshake Failed):**

- Occurs when Cloudflare proxy is ON before Firebase SSL is ready
- Solution: Keep proxy OFF until Firebase shows "Connected"

**Too Many Redirects:**

- Cloudflare SSL is set to "Flexible"
- Change to "Full" mode in SSL/TLS settings

### General Troubleshooting
**Magic links still failing:**

1. Ensure domain is in authorized domains
2. Check that auth domain in Firebase config matches
3. Verify email provider is enabled
4. Test with `https://` not `http://`

**DNS not propagating:**

```bash
# Check if pointing to Firebase (not Cloudflare)
dig homerconnect.com
# Should show 151.101.x.x IPs, not 104.x.x.x (Cloudflare)

# Force DNS refresh
sudo dscacheutil -flushcache  # macOS
```bash
## Current Setup vs. Custom Domain

| Feature          | Current (firebaseapp.com)                    | With homerconnect.com             |
| ---------------- | -------------------------------------------- | --------------------------------- |
| Magic link URL   | `kbe-website.firebaseapp.com/__/auth/action` | `homerconnect.com/__/auth/action` |
| User trust       | Lower (generic domain)                       | Higher (your domain)              |
| Branding         | Firebase branded                             | Your brand                        |
| Setup complexity | None (works out of box)                      | Requires DNS setup                |
| SSL              | Automatic                                    | Automatic (after setup)           |

## Next Steps

1. **Decision**: Use homerconnect.com for production, keep firebaseapp.com for development
2. **Staging**: Test thoroughly on firebaseapp.com first
3. **Migration**: Update all configurations when ready
4. **Monitor**: Check Firebase Console for domain status

## Quick Commands

```bash
# Check current hosting setup
firebase hosting:sites:list

# View domain status
firebase hosting:site:open homerconnect

# Deploy to custom domain
firebase deploy --only hosting:homerconnect
```text
````
