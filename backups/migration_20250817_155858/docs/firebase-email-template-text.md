# Firebase Email Template Custom Text

Copy and paste these into Firebase Console → Authentication → Templates

## 1. Email Address Verification

**Subject Line:**
```
Verify your email for Homer Enrichment Hub
```

**Email Body:**
```
Hello,

Welcome to Homer Enrichment Hub! Please verify your email address to complete your registration and access all features of your account.

%LINK%

By verifying your email, you'll be able to:
• Receive important program updates and announcements
• Access exclusive resources for registered families
• Manage your student registrations online
• Reset your password if needed

If you didn't create an account with Homer Enrichment Hub, you can safely ignore this email.

Thank you for joining our community of learners!

Best regards,
The Homer Enrichment Hub Team

---
Homer Enrichment Hub
Empowering Young Minds in Homer, Alaska
https://homerconnect.com
```

## 2. Password Reset

**Subject Line:**
```
Reset your Homer Enrichment Hub password
```

**Email Body:**
```
Hello,

We received a request to reset your Homer Enrichment Hub account password. Click the link below to create a new password:

%LINK%

This password reset link will expire in 1 hour for security reasons.

If you didn't request a password reset, please ignore this email. Your password will remain unchanged.

For additional support, please contact us at info@homerconnect.com

Best regards,
The Homer Enrichment Hub Team

---
Homer Enrichment Hub
Empowering Young Minds in Homer, Alaska
https://homerconnect.com
```

## 3. Email Address Change

**Subject Line:**
```
Your Homer Enrichment Hub email was changed
```

**Email Body:**
```
Hello,

This is a confirmation that the email address for your Homer Enrichment Hub account has been successfully changed.

If you made this change, no further action is needed.

If you didn't authorize this change, please contact us immediately at info@homerconnect.com or reset your password using the link below:

%LINK%

For your security, we recommend:
• Using a unique, strong password
• Enabling two-factor authentication if available
• Keeping your contact information up to date

Best regards,
The Homer Enrichment Hub Team

---
Homer Enrichment Hub
Empowering Young Minds in Homer, Alaska
https://homerconnect.com
```

## 4. SMS Multi-Factor Authentication

**SMS Message:**
```
Your Homer Enrichment Hub verification code is %CODE%. Do not share this code with anyone.
```

## Settings to Update in Firebase Console

For each template:

1. **Sender Name:** Homer Enrichment Hub
2. **Reply-to Address:** info@homerconnect.com (if possible)
3. **Action URL:** https://homerconnect.com/__/auth/action
4. **Language:** English (United States)

## Additional Notes

- Keep messages concise but friendly
- Include the organization name prominently
- Provide clear next steps
- Always include a security note for sensitive actions
- Add contact information for support
- Use the tagline "Empowering Young Minds in Homer, Alaska" for brand consistency