import { type NextRequest, NextResponse } from 'next/server';
import { type SendGridEvent, sendGridWebhookSchema } from '@/lib/validations/api';

/**
 * Handle SendGrid webhook events
 * Tracks email delivery, engagement, and issues
 */
export async function POST(request: NextRequest) {
  try {
    // Parse and validate the webhook payload
    const body = await request.json();
    const validationResult = sendGridWebhookSchema.safeParse(body);

    if (!validationResult.success) {
      console.error('Invalid SendGrid webhook payload:', validationResult.error);
      return NextResponse.json(
        { error: 'Invalid webhook payload', details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const events = validationResult.data;

    // Process each event
    for (const event of events) {
      await processEvent(event);
    }

    // Return success response
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('SendGrid webhook error:', error);
    return NextResponse.json({ error: 'Failed to process webhook' }, { status: 500 });
  }
}

async function processEvent(event: SendGridEvent) {
  const { email, event: eventType } = event;
  // Persisting webhook events now handled by backend DB (Prisma)
  // For now, we emit structured logs; a DB-backed implementation can be wired later
  console.log('[SendGrid] Event received:', JSON.stringify(event));

  // Update user email status based on event type
  switch (eventType) {
    case 'bounce':
      await handleBounce(email, event.reason, event.type);
      break;

    case 'spamreport':
      await handleSpamReport(email);
      break;

    case 'unsubscribe':
      await handleUnsubscribe(email);
      break;

    case 'delivered':
      await updateEmailStatus(email, 'delivered');
      break;

    case 'open':
      await trackEngagement(email, 'opened');
      break;

    case 'click':
      await trackEngagement(email, 'clicked', event.url);
      break;
  }
}

async function handleBounce(email: string, reason?: string, type?: string) {
  console.log(`Email bounced: ${email}, Type: ${type}, Reason: ${reason}`);

  // Update user's email status
  // TODO: Update user email status in DB via Prisma when schema is ready

  await logActivity('email_bounce', {
    email,
    bounceType: type,
    reason,
  });
}

async function handleSpamReport(email: string) {
  console.log(`Spam report received for: ${email}`);

  // Mark user as having reported spam
  // In production: Update user preferences to stop all non-essential emails

  await logActivity('spam_report', { email });
}

async function handleUnsubscribe(email: string) {
  console.log(`User unsubscribed: ${email}`);

  // Update user's email preferences
  // In production: Mark user as unsubscribed from marketing emails

  await logActivity('unsubscribe', { email });
}

async function updateEmailStatus(email: string, status: string) {
  // TODO: Update the user's email delivery status via Prisma
  await logActivity('email_status', { email, status });
}

async function trackEngagement(email: string, action: string, url?: string) {
  // Track user engagement with emails (log only for now)
  const data: Record<string, string> = { email, action };
  if (url) data.url = url;

  await logActivity('email_engagement', data);
}

async function logActivity(type: string, data: Record<string, unknown>) {
  // Log activity for admin dashboard (no-op DB write until Prisma schema is defined)
  console.log('[Activity]', { type: `email_${type}`, data, source: 'sendgrid_webhook' });
}

// Verify webhook signature (optional but recommended)
// SendGrid uses signed webhooks for security
async function verifyWebhookSignature(
  _publicKey: string,
  _payload: string,
  _signature: string,
  _timestamp: string
): Promise<boolean> {
  // Implementation depends on SendGrid's webhook verification setup
  // See: https://docs.sendgrid.com/for-developers/tracking-events/getting-started-event-webhook-security-features

  // For now, return true to accept all webhooks
  // In production, implement proper signature verification
  return true;
}
