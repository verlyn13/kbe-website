# Email Setup Options for Homer Enrichment Hub

## Current State
- Emails are sent from: `noreply@kbe-website.firebaseapp.com`
- This looks unprofessional and may trigger spam filters
- Goal: Send from `noreply@homerconnect.com`

## Option 1: Firebase SMTP Configuration (Simplest)
**Best for**: Quick setup without third-party services

### Steps:
1. Go to Firebase Console → Authentication → Templates
2. Click on each template (Password reset, Email verification, etc.)
3. Click "Customize action URL and email"
4. Update:
   - **From**: `Homer Enrichment Hub <noreply@homerconnect.com>`
   - **Reply-to**: `info@homerconnect.com`

### Limitations:
- Firebase still sends the email, just changes the "From" header
- May still be flagged as spam without proper domain authentication
- Limited customization of email design

## Option 2: SendGrid Integration (Recommended)
**Best for**: Professional email delivery with analytics

### Pros:
- Professional email delivery
- Email analytics and tracking
- Better spam score
- Custom templates
- 100 free emails/day

### Implementation:
See `sendgrid-email-setup.md` for detailed steps

## Option 3: Firebase Email Extension with SMTP
**Best for**: Using existing email service (Gmail, Office 365)

### Requirements:
- Email account with SMTP access
- App-specific password (for Gmail)
- SMTP settings

### Steps:
1. Install extension: `firebase ext:install firebase/firestore-send-email`
2. Configure with your SMTP settings
3. Update code to write to Firestore collection

## Option 4: Custom Email Function
**Best for**: Complete control over email sending

### Implementation:
```typescript
// functions/src/email.ts
import * as functions from 'firebase-functions';
import * as nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 587,
  auth: {
    user: 'apikey',
    pass: process.env.SENDGRID_API_KEY
  }
});

export const sendEmail = functions.https.onCall(async (data, context) => {
  const { to, subject, html } = data;
  
  await transporter.sendMail({
    from: 'Homer Enrichment Hub <noreply@homerconnect.com>',
    to,
    subject,
    html
  });
});
```

## Recommendation

For Homer Enrichment Hub, I recommend **Option 2 (SendGrid)** because:
1. Free tier covers your needs (100 emails/day)
2. Professional delivery ensures emails reach inboxes
3. Analytics help track engagement
4. Easy Firebase integration via extension
5. Scales as your program grows

## Next Steps

1. Decide on approach
2. Set up SendGrid account if choosing Option 2
3. Configure DNS records for domain authentication
4. Update email sending code
5. Test thoroughly