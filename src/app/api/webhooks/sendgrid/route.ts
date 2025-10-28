import { type NextRequest, NextResponse } from 'next/server';
import { createErrorResponse, logApiError } from '@/lib/api-error-handler';
import { type SendGridEvent, sendGridWebhookSchema } from '@/lib/validations/api';

export const runtime = 'nodejs';

/**
 * Handle SendGrid webhook events
 * Tracks email delivery, engagement, and issues
 */
export async function POST(request: NextRequest) {
  let eventCount: number | undefined;
  let validationFailed = false;

  try {
    // Parse and validate the webhook payload
    const body = await request.json();
    const validationResult = sendGridWebhookSchema.safeParse(body);

    if (!validationResult.success) {
      validationFailed = true;

      logApiError(
        validationResult.error,
        {
          context: 'SENDGRID_WEBHOOK_VALIDATION',
          requestPath: request.url,
          requestMethod: 'POST',
          additionalData: {
            validationErrors: validationResult.error.flatten(),
          },
        },
        'warning'
      );

      return NextResponse.json(
        {
          error: 'Invalid webhook payload',
          code: 'VALIDATION_ERROR',
          details: validationResult.error.flatten(),
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    const events = validationResult.data;
    eventCount = events.length;

    console.log(`[SENDGRID_WEBHOOK] Processing ${events.length} events`);

    // Process each event
    for (const event of events) {
      await processEvent(event);
    }

    console.log(`[SENDGRID_WEBHOOK] Successfully processed ${events.length} events`);

    // Return success response
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    logApiError(error, {
      context: 'SENDGRID_WEBHOOK',
      requestPath: request.url,
      requestMethod: 'POST',
      additionalData: {
        eventCount,
        validationFailed,
      },
    });

    return createErrorResponse(error, { context: 'SENDGRID_WEBHOOK' });
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
