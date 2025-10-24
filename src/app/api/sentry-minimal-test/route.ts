import { NextResponse } from "next/server";

/**
 * Minimal Sentry test - the most direct approach possible
 */
export async function GET() {
  // Only run in production
  if (process.env.NODE_ENV !== 'production') {
    return NextResponse.json({
      error: 'Production only',
      env: process.env.NODE_ENV,
    });
  }

  try {
    // Direct import and initialization
    const Sentry = await import("@sentry/nextjs");

    const dsn = "https://4f44009c4ef6950362e6cba83db7c7ab@o4510172424699904.ingest.us.sentry.io/4510242089795584";

    console.log('[MINIMAL-TEST] Starting with hardcoded DSN');

    // Create a new client directly
    const client = new Sentry.NodeClient({
      dsn: dsn,
      debug: true,
      environment: 'production',
      beforeSend(event) {
        console.log('[MINIMAL-TEST] Sending event:', event.event_id, event.exception?.values?.[0]?.value);
        return event;
      },
    });

    // Create a new hub with this client
    const hub = new Sentry.Hub(client);

    // Make it the current hub
    Sentry.makeMain(hub);

    const timestamp = new Date().toISOString();

    // Test 1: Send a message
    const messageId = hub.captureMessage(
      `[MINIMAL-TEST] Direct test message at ${timestamp}`,
      'error'
    );
    console.log('[MINIMAL-TEST] Message sent:', messageId);

    // Test 2: Send an error
    const error = new Error(`[MINIMAL-TEST] Direct test error at ${timestamp}`);
    const errorId = hub.captureException(error);
    console.log('[MINIMAL-TEST] Error sent:', errorId);

    // Flush
    await client.flush(5000);
    console.log('[MINIMAL-TEST] Flush completed');

    // Also throw to test error boundaries
    throw new Error(`[MINIMAL-TEST] Final throw at ${timestamp}`);

  } catch (error) {
    console.error('[MINIMAL-TEST] Error during test:', error);
    throw error;
  }
}