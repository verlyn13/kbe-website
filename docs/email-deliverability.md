# Improving Email Deliverability for Magic Links

Magic link emails going to spam is a common issue. Here's how to fix it:

## Why Emails Go to Spam

1. **Sender Domain**: Using `noreply@kbe-website.firebaseapp.com`
2. **No SPF/DKIM Records**: Firebase's default sending doesn't include custom domain authentication
3. **Content Triggers**: "Sign in" links can trigger spam filters
4. **New Domain**: No sender reputation established

## Solutions

### 1. Immediate Fix (User Action)

Tell users to:

- Check spam/junk folder
- Mark email as "Not Spam"
- Add `noreply@kbe-website.firebaseapp.com` to contacts

### 2. Custom Domain Email (Recommended)

Use your domain for sending emails:

1. **Set up Firebase Email with Custom Domain**:
   - Go to Firebase Console → Authentication → Templates
   - Configure "Reply-to email" to use your domain
2. **Configure SPF Records** in Cloudflare:

   ```text
   Type: TXT
   Name: @
   Value: v=spf1 include:_spf.google.com ~all
   ```

3. **Configure DKIM**:
   - Firebase doesn't support custom DKIM directly
   - Consider using a transactional email service

### 3. Use a Transactional Email Service

For best deliverability, integrate with:

1. **SendGrid** (recommended):

   ```javascript
   // Using Firebase Functions
   const sgMail = require('@sendgrid/mail');
   sgMail.setApiKey(process.env.SENDGRID_API_KEY);

   // Generate magic link with Admin SDK
   const link = await admin.auth().generateSignInWithEmailLink(email, actionCodeSettings);

   // Send with SendGrid
   const msg = {
     to: email,
     from: 'no-reply@homerconnect.com',
     subject: 'Sign in to KBE Website',
     html: `<p>Click <a href="${link}">here</a> to sign in.</p>`,
   };
   await sgMail.send(msg);
   ```

2. **Other Options**:
   - Mailgun
   - Amazon SES
   - Postmark

### 4. Email Template Best Practices

Improve the default Firebase email:

1. **Subject Line**:
   - Avoid: "Sign in to..."
   - Better: "Your secure access link for KBE Website"

2. **Content**:
   - Include company branding
   - Explain why they're receiving this
   - Add physical address (CAN-SPAM compliance)

3. **Technical**:
   - Use both HTML and plain text versions
   - Keep HTML simple
   - Avoid spam trigger words

### 5. Warmup Strategy

For new domains:

1. Start with small volume
2. Gradually increase sends
3. Monitor bounce rates
4. Encourage engagement (opens/clicks)

## Testing Deliverability

Use these tools:

- [Mail Tester](https://www.mail-tester.com/)
- [GlockApps](https://glockapps.com/)
- [Litmus](https://litmus.com/)

## Quick Wins

1. **Update Email Template** in Firebase Console:

   ```text
   Subject: Your KBE Website access link

   Body:
   Hi,

   You requested a sign-in link for KBE Website.
   Click the link below to sign in:

   [Sign In Button]

   This link will expire in 1 hour.

   If you didn't request this, please ignore this email.

   Thanks,
   The KBE Team

   ---
   KBE Website | Homer, Alaska
   This email was sent to {{ email }}
   ```

2. **Add to Documentation**:
   Tell users to check spam and add to contacts

3. **Consider Magic Link Alternatives**:
   - OAuth (Google Sign-in) has better deliverability
   - Traditional password with 2FA
   - Passkeys (WebAuthn)

## For Production with homerconnect.com

When you set up the custom domain:

1. Use `no-reply@homerconnect.com` as sender
2. Set up proper SPF/DKIM/DMARC records
3. Consider professional email service
4. Monitor sender reputation
