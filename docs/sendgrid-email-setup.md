# SendGrid Email Setup for Homer Enrichment Hub

## Overview

Set up professional email sending from `noreply@homerenrichment.com` using SendGrid with Firebase Extensions.

## Step 1: Create SendGrid Account

1. Go to [SendGrid](https://sendgrid.com)
2. Sign up for free account (100 emails/day free tier)
3. Complete account verification

## Step 2: Domain Authentication in SendGrid

1. In SendGrid Dashboard, go to **Settings → Sender Authentication**
2. Click **Authenticate Your Domain**
3. Select your DNS provider (Cloudflare)
4. Enter domain: `homerenrichment.com`
5. SendGrid will provide DNS records to add

### DNS Records to Add (via Cloudflare):

```
Type    Name                    Value
----    ----                    -----
CNAME   em1234.homerenrichment.com sendgrid.net
CNAME   s1._domainkey           s1.domainkey.u1234.wl.sendgrid.net
CNAME   s2._domainkey           s2.domainkey.u1234.wl.sendgrid.net
```

_Note: The exact values will be provided by SendGrid_

## Step 3: Create SendGrid API Key

1. Go to **Settings → API Keys**
2. Click **Create API Key**
3. Name: `Firebase Email Extension`
4. Permissions: **Full Access** (or Restricted with Mail Send)
5. Copy the API key (you'll need it for Firebase)

## Step 4: Install Firebase Extension

```bash
firebase ext:install firebase/firestore-send-email --project=kbe-website
```

During installation, configure:

- **SMTP connection URI**: Leave empty (we'll use API key)
- **SendGrid API Key**: Paste your SendGrid API key
- **Default FROM address**: `noreply@homerenrichment.com`
- **Default FROM name**: `Homer Enrichment Hub`
- **Email documents collection**: `mail`
- **Default reply-to address**: `info@homerenrichment.com` (or your preferred)

## Step 5: Update Email Templates

Create enhanced email sending function:

```typescript
// src/lib/email-service.ts
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

export async function sendEmail(to: string, subject: string, html: string, text?: string) {
  try {
    await addDoc(collection(db, 'mail'), {
      to: [to],
      message: {
        subject,
        html,
        text: text || html.replace(/<[^>]*>/g, ''), // Strip HTML for text version
      },
      createdAt: new Date(),
    });
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}

export async function sendMagicLinkEmail(email: string, link: string, userName?: string) {
  const subject = 'Sign in to Homer Enrichment Hub';
  const html = emailTemplates.magicLink.html(link, userName);
  const text = emailTemplates.magicLink.text(link, userName);

  return sendEmail(email, subject, html, text);
}
```

## Step 6: Configure Firebase Authentication Templates

1. Go to Firebase Console → Authentication → Templates
2. For each template:
   - Update **Sender name**: `Homer Enrichment Hub`
   - Update **From**: `noreply@homerenrichment.com`
   - Keep the action URL as is

## Step 7: Test Email Delivery

1. Send a test magic link
2. Check email headers for:
   - SPF: `pass`
   - DKIM: `pass`
   - From domain: `homerenrichment.com`

## Step 8: Monitor Email Performance

1. In SendGrid Dashboard, go to **Activity**
2. Monitor:
   - Delivery rates
   - Open rates
   - Bounce rates
   - Spam reports

## Troubleshooting

### Emails Going to Spam

1. Ensure domain authentication is complete
2. Add SPF record: `v=spf1 include:sendgrid.net ~all`
3. Check email content for spam triggers
4. Warm up sending reputation gradually

### Authentication Failing

1. Verify all DNS records are added correctly
2. Wait 24-48 hours for propagation
3. Re-verify domain in SendGrid

### Rate Limits

- Free tier: 100 emails/day
- Monitor usage in SendGrid dashboard
- Upgrade if needed

## Security Notes

1. Store SendGrid API key in Firebase secrets:

   ```bash
   firebase functions:secrets:set SENDGRID_API_KEY
   ```

2. Never commit API keys to git
3. Use environment-specific API keys for dev/prod
