# Update Firebase Email Templates

## Quick Win: Update Email Templates Now

While we set up custom domain email, let's improve the current emails immediately.

### Steps:

1. **Go to Firebase Console**
   - https://console.firebase.google.com/project/kbe-website/authentication/emails

2. **Update Each Template**
   
   Click on each template and update:
   
   **Email address verification**
   - Subject: `Verify your email for Homer Enrichment Hub`
   - Sender name: `Homer Enrichment Hub`
   
   **Password reset**
   - Subject: `Reset your Homer Enrichment Hub password`
   - Sender name: `Homer Enrichment Hub`
   
   **Email address change**
   - Subject: `Your Homer Enrichment Hub email was changed`
   - Sender name: `Homer Enrichment Hub`

3. **Update Action URL** (if needed)
   - Change from: `https://kbe-website.firebaseapp.com/__/auth/action`
   - To: `https://homerenrichment.com/__/auth/action`

4. **Customize Message Content**
   
   For Password Reset:
   ```
   Hello,

   We received a request to reset your Homer Enrichment Hub password.

   Click the link below to create a new password:
   %LINK%

   If you didn't request this, you can safely ignore this email.

   Best regards,
   The Homer Enrichment Hub Team
   ```

   For Email Verification:
   ```
   Welcome to Homer Enrichment Hub!

   Please verify your email address by clicking the link below:
   %LINK%

   This helps us ensure we can send you important program updates.

   Thank you,
   The Homer Enrichment Hub Team
   ```

## Benefits:
- Immediate improvement in email professionalism
- Better user recognition of emails
- Reduced chance of marking as spam
- No code changes required

## Note:
- Emails will still come from `noreply@kbe-website.firebaseapp.com`
- But with "Homer Enrichment Hub" as the sender name
- Full custom domain setup will change the actual email address