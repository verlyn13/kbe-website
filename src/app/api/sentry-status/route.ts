import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { initializeSentryIfNeeded } from "@/lib/sentry-wrapper";

/**
 * Sentry Status Diagnostic Endpoint
 *
 * This endpoint provides detailed information about Sentry's initialization status
 * and configuration. Use this to troubleshoot why errors might not be appearing.
 */
export async function GET() {
  // Try to initialize Sentry
  const initResult = initializeSentryIfNeeded();

  // Get current Sentry status
  const hub = Sentry.getCurrentHub();
  const client = hub.getClient();
  const options = client?.getOptions();

  // Check various aspects of Sentry configuration
  const status = {
    initialized: !!client,
    initResult,
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      VERCEL_ENV: process.env.VERCEL_ENV,
      VERCEL: process.env.VERCEL,
      CI: process.env.CI,
    },
    dsn: {
      present: !!process.env.NEXT_PUBLIC_SENTRY_DSN,
      value: process.env.NEXT_PUBLIC_SENTRY_DSN ?
        process.env.NEXT_PUBLIC_SENTRY_DSN.substring(0, 50) + '...' :
        'NOT SET',
      fromClient: client?.getDsn()?.toString()?.substring(0, 50) + '...',
    },
    client: {
      exists: !!client,
      enabled: options?.enabled,
      environment: options?.environment,
      release: options?.release || process.env.VERCEL_GIT_COMMIT_SHA || 'unknown',
      tracesSampleRate: options?.tracesSampleRate,
    },
    transport: {
      hasTransport: !!options?.transport,
      transportName: options?.transport?.name,
    },
    test: {
      captureTestMessage: false,
      captureTestError: false,
      eventId: null as string | null,
    },
  };

  // Try to capture a test message
  try {
    const messageId = Sentry.captureMessage(
      `[DIAGNOSTIC] Sentry status check at ${new Date().toISOString()}`,
      'info'
    );
    status.test.captureTestMessage = !!messageId;
    status.test.eventId = messageId;

    // Try to capture a test error
    const error = new Error('[DIAGNOSTIC] Test error for status check');
    const errorId = Sentry.captureException(error, {
      level: 'warning',
      tags: { diagnostic: 'true' },
    });
    status.test.captureTestError = !!errorId;

    // Flush to ensure events are sent
    await Sentry.flush(2000);
  } catch (testError) {
    console.error('[SENTRY-STATUS] Failed to capture test events:', testError);
  }

  // Log the status for Vercel function logs
  console.log('[SENTRY-STATUS] Full diagnostic status:', JSON.stringify(status, null, 2));

  return NextResponse.json({
    message: 'Sentry diagnostic information',
    status,
    instructions: {
      checkDashboard: 'Look for a message: "[DIAGNOSTIC] Sentry status check..." in your Sentry dashboard',
      dashboardUrl: 'https://sentry.io/organizations/happy-patterns-llc/issues/?project=4510242089795584',
      vercelLogs: 'Check Vercel function logs for [SENTRY-STATUS] entries',
      nextSteps: status.initialized
        ? 'Sentry appears to be initialized. Check dashboard for test events.'
        : 'Sentry is NOT initialized. Check DSN environment variable in Vercel.',
    },
  }, {
    status: 200,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  });
}