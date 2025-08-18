# SendGrid Template Management

This document explains how to manage SendGrid email templates for Homer Enrichment Hub.

## Overview

Email templates are defined in code (`src/lib/sendgrid-templates.ts`) and synced to SendGrid via API. This approach allows:

- Version control for email templates
- Easy updates without using SendGrid's web interface
- Consistent styling across all emails
- Local preview and testing

## Template Files

### 1. Template Definitions
**File:** `src/lib/sendgrid-templates.ts`

Contains all email templates with:
- HTML and plain text versions
- Handlebars variables for dynamic content
- Test data for previewing

### 2. Email Service
**File:** `src/lib/sendgrid-email-service.ts`

Provides functions to send emails using the templates:
- `sendMagicLinkEmail()` - Sign-in links
- `sendWelcomeEmail()` - New user welcome
- `sendPasswordResetEmail()` - Password reset links
- `sendAnnouncementEmail()` - Broadcast announcements
- `sendRegistrationConfirmationEmail()` - Program registration confirmations

## Syncing Templates

### First Time Setup

1. Add SendGrid API key to `.env.local`:
```bash
SENDGRID_API_KEY=your_api_key_here
```

2. Sync templates to SendGrid:
```bash
npm run sync-templates
```

3. Copy the template IDs from the output and add to `.env.local`:
```bash
SENDGRID_TEMPLATE_MAGIC_LINK=d-abc123...
SENDGRID_TEMPLATE_WELCOME=d-def456...
SENDGRID_TEMPLATE_PASSWORD_RESET=d-ghi789...
SENDGRID_TEMPLATE_ANNOUNCEMENT=d-jkl012...
SENDGRID_TEMPLATE_REGISTRATION_CONFIRMATION=d-mno345...
```

### Updating Templates

1. Edit templates in `src/lib/sendgrid-templates.ts`
2. Run sync command:
```bash
npm run sync-templates
```
3. Templates are automatically updated in SendGrid

## Testing Templates

### Preview Without Sending
```bash
npm run test-email -- magicLink preview
```
This creates an HTML file you can open in your browser.

### Send Test Email
```bash
npm run test-email -- magicLink your-email@example.com
```

### Available Templates
- `magicLink` - Sign-in link email
- `welcome` - Welcome email for new users
- `passwordReset` - Password reset link
- `announcement` - General announcements
- `registrationConfirmation` - Program registration confirmation

## Template Variables

Each template supports different Handlebars variables:

### Magic Link Template
- `{{firstName}}` - User's first name (optional)
- `{{magicLinkUrl}}` - The sign-in URL
- `{{currentYear}}` - Current year for copyright

### Welcome Template
- `{{firstName}}` - User's first name (optional)
- `{{dashboardUrl}}` - Link to dashboard
- `{{currentYear}}` - Current year

### Announcement Template
- `{{firstName}}` - Recipient's name (optional)
- `{{announcementTitle}}` - Title of announcement
- `{{announcementContent}}` - HTML content (triple braces: `{{{announcementContent}}}`)
- `{{announcementUrl}}` - Link to view all announcements

## Modifying Templates

### To Change Styles
Edit the `baseStyles` constant in `sendgrid-templates.ts`:
```typescript
const baseStyles = `
  <style>
    .button {
      background-color: #008080; /* Change button color */
    }
  </style>
`;
```

### To Add a New Template

1. Add template definition in `sendgrid-templates.ts`:
```typescript
export const sendGridTemplates = {
  // ... existing templates
  myNewTemplate: {
    name: 'HEH My New Template',
    subject: 'Subject with {{variable}}',
    html_content: `<html>...</html>`,
    plain_content: `Plain text version...`
  }
};
```

2. Add test data:
```typescript
export const templateTestData = {
  // ... existing test data
  myNewTemplate: {
    variable: 'test value'
  }
};
```

3. Sync to SendGrid:
```bash
npm run sync-templates
```

4. Add the new template ID to `.env.local`

5. Create a helper function in `sendgrid-email-service.ts`:
```typescript
export async function sendMyNewEmail(email: string, data: any) {
  return sendTemplatedEmail({
    to: email,
    templateKey: 'myNewTemplate',
    dynamicData: data,
  });
}
```

## Integration with Firebase

To use SendGrid instead of Firebase for authentication emails:

1. Implement custom email action handler
2. Use SendGrid templates for magic links
3. Handle email verification through SendGrid

Example integration:
```typescript
// When sending magic link
import { sendMagicLinkEmail } from '@/lib/sendgrid-email-service';

// In your auth flow
const actionCodeSettings = {
  url: 'https://homerconnect.com/auth/verify',
  handleCodeInApp: true,
};

const link = await auth.generateSignInWithEmailLink(email, actionCodeSettings);
await sendMagicLinkEmail(email, link, user?.displayName);
```

## Best Practices

1. **Always test templates** before deploying to production
2. **Use preview mode** to check styling without sending emails
3. **Keep plain text versions** updated for better deliverability
4. **Use categories** for tracking in SendGrid analytics
5. **Monitor webhook events** for bounces and spam reports

## Troubleshooting

### Templates not updating
- Ensure you have the latest API key
- Check SendGrid API quotas
- Verify template IDs in `.env.local`

### Emails not sending
- Check API key permissions
- Verify sender authentication
- Check SendGrid account status

### Styling issues
- Test in multiple email clients
- Use inline styles for better compatibility
- Avoid modern CSS features

## Security Notes

1. Never commit `.env.local` with API keys
2. Use environment variables in production
3. Implement webhook signature verification
4. Monitor for unusual sending patterns