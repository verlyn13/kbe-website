# SendGrid Next Steps for Homer Enrichment Hub

## 1. Templates ✅ RECOMMENDED
**Purpose**: Create reusable, professional email templates in SendGrid

### Why You Should Set This Up:
- Consistent branding across all emails
- Easy to update without code changes
- A/B testing capabilities
- Dynamic content personalization

### Implementation Plan:
1. **Create these templates first**:
   - Magic Link Sign-in
   - Welcome Email
   - Password Reset
   - General Announcement
   - Registration Confirmation

2. **Template Structure**:
```handlebars
<!DOCTYPE html>
<html>
<head>
  <style>
    /* Your brand styles here */
  </style>
</head>
<body>
  <div class="header">
    <h1>🏔️ Homer Enrichment Hub</h1>
  </div>
  <div class="content">
    {{content}}
  </div>
  <div class="footer">
    <p>© {{year}} Homer Enrichment Hub</p>
  </div>
</body>
</html>
```

3. **Use Handlebars variables**:
   - `{{firstName}}` - Personalized greetings
   - `{{actionUrl}}` - Dynamic links
   - `{{announcementText}}` - Content blocks

### Integration with Your App:
```typescript
// Update email service to use SendGrid templates
async function sendTemplatedEmail(to: string, templateId: string, dynamicData: any) {
  const msg = {
    to,
    from: 'noreply@homerconnect.com',
    templateId,
    dynamicTemplateData: dynamicData,
  };
  await sgMail.send(msg);
}
```

## 2. Unsubscribe Groups ⚠️ CONSIDER LATER
**Purpose**: Let users control which types of emails they receive

### Current Recommendation: WAIT
Since you're just starting, keep it simple. Implement this after you have regular email flows.

### When to Implement (Phase 2):
- When sending multiple email types regularly
- If users complain about too many emails
- When you have 100+ active users

### Future Groups to Create:
1. **Essential** (cannot unsubscribe):
   - Password resets
   - Security alerts
   - Legal notices

2. **Announcements** (can unsubscribe):
   - General updates
   - Event reminders
   - Newsletter

3. **Program Notifications** (can unsubscribe):
   - Registration confirmations
   - Schedule changes
   - Deadline reminders

### Implementation Note:
```typescript
// Future implementation
const msg = {
  to: userEmail,
  from: 'noreply@homerconnect.com',
  templateId: 'announcement-template',
  asm: {
    groupId: 12345, // Announcements group
    groupsToDisplay: [12345, 67890] // Show available groups
  }
};
```

## 3. Event Notifications 📊 IMPLEMENT SOON
**Purpose**: Track email engagement (opens, clicks, bounces)

### Why This Is Important:
- Know if emails are reaching inboxes
- Track engagement rates
- Identify delivery issues early
- Improve email effectiveness

### Quick Setup:
1. **Go to**: Settings → Mail Settings → Event Webhook
2. **Set webhook URL**: `https://homerconnect.com/api/webhooks/sendgrid`
3. **Select events to track**:
   - ✅ Delivered
   - ✅ Opened
   - ✅ Clicked
   - ✅ Bounced
   - ✅ Spam Report
   - ✅ Unsubscribe

### Create Webhook Handler:
```typescript
// app/api/webhooks/sendgrid/route.ts
export async function POST(request: Request) {
  const events = await request.json();
  
  for (const event of events) {
    switch (event.event) {
      case 'bounce':
        // Mark email as invalid
        await markEmailBounced(event.email);
        break;
      case 'spam_report':
        // Remove from all lists
        await handleSpamReport(event.email);
        break;
      case 'click':
        // Track engagement
        await trackClick(event.email, event.url);
        break;
    }
  }
  
  return Response.json({ received: true });
}
```

### Security:
Add webhook verification:
```typescript
const crypto = require('crypto');

function verifyWebhook(publicKey: string, payload: string, signature: string) {
  const elliptic = require('elliptic');
  const ec = new elliptic.ec('secp256k1');
  // Verify signature
}
```

## Recommended Implementation Order

### Phase 1 (Now):
1. ✅ Domain Authentication (done)
2. ✅ Create Templates in SendGrid
3. ✅ Set up Event Notifications webhook

### Phase 2 (After Launch):
1. ⏳ Monitor email metrics
2. ⏳ Implement Unsubscribe Groups
3. ⏳ Add email preference center

### Phase 3 (Growth):
1. ⏳ A/B testing templates
2. ⏳ Advanced personalization
3. ⏳ Automated campaigns

## Quick Win Actions

1. **Create your first template** (30 min):
   - Go to SendGrid → Email API → Dynamic Templates
   - Create "Magic Link Sign-in" template
   - Use the HTML from `email-templates-custom.ts`

2. **Set up basic webhook** (1 hour):
   - Create `/api/webhooks/sendgrid` endpoint
   - Log events initially
   - Add bounce handling

3. **Test everything** (30 min):
   - Send test emails
   - Verify webhook receives events
   - Check template rendering

This approach starts simple and grows with your needs!