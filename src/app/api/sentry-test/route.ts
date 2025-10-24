import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { withSentry, initializeSentryIfNeeded } from "@/lib/sentry-wrapper";
import { forceInitSentry, captureServerError } from "@/lib/server-sentry";

/**
 * Sentry Test Endpoint
 *
 * This endpoint is used to verify Sentry error tracking in production.
 * It will only send errors to Sentry when NODE_ENV=production.
 *
 * Usage:
 * 1. Deploy to production
 * 2. Visit: https://yourdomain.com/api/sentry-test
 * 3. Check Sentry dashboard for the test error
 * 4. Verify stack trace is readable (not minified)
 *
 * Security: This endpoint is safe because:
 * - It only works in production (not in development)
 * - It creates a clearly labeled test error
 * - Can be removed after testing
 */
export const GET = withSentry(async function GET() {
  // Try multiple initialization methods
  const wrapperInit = initializeSentryIfNeeded();
  const forceInit = forceInitSentry();

  const initialized = wrapperInit || forceInit;
  const isProduction = process.env.NODE_ENV === "production";

  // Debug info for troubleshooting
  const debugInfo = {
    environment: process.env.NODE_ENV,
    sentryDsnPresent: !!process.env.NEXT_PUBLIC_SENTRY_DSN,
    sentryInitialized: initialized,
    sentryRelease: process.env.VERCEL_GIT_COMMIT_SHA || process.env.SENTRY_RELEASE || 'dev',
    vercelEnv: process.env.VERCEL_ENV,
    timestamp: new Date().toISOString(),
  };

  console.log('[SENTRY-TEST] Endpoint called with debug info:', debugInfo);

  if (!isProduction) {
    return NextResponse.json({
      success: false,
      message: "Sentry test only works in production environment",
      ...debugInfo,
      note: "Deploy to production first, then visit this endpoint"
    }, { status: 400 });
  }

  // Check if Sentry is actually initialized
  const currentHub = Sentry.getCurrentHub();
  const client = currentHub.getClient();
  const isInitialized = !!client;

  console.log('[SENTRY-TEST] Sentry initialization status:', {
    isInitialized,
    hasClient: !!client,
    dsn: client?.getDsn()?.toString()?.substring(0, 50) + '...',
  });

  // Manually capture the error to ensure it's sent
  const timestamp = new Date().toISOString();
  const error = new Error(`[SENTRY TEST] Server-side error tracking - ${timestamp}`);

  // Add breadcrumb for additional context
  Sentry.addBreadcrumb({
    message: 'Test error triggered via API endpoint',
    level: 'info',
    category: 'test',
    data: debugInfo,
  });

  // Try both capture methods
  const eventId = Sentry.captureException(error, {
    level: "error",
    tags: {
      test: "server-error",
      endpoint: "/api/sentry-test",
      initialized: isInitialized ? 'yes' : 'no',
    },
    contexts: {
      debug: debugInfo,
    },
  });

  console.log('[SENTRY-TEST] Standard capture with event ID:', eventId);

  // Also try our force capture method
  const forceEventId = await captureServerError(error, {
    tags: {
      test: "server-error-forced",
      endpoint: "/api/sentry-test",
    },
    debugInfo,
  });

  console.log('[SENTRY-TEST] Force capture with event ID:', forceEventId);

  // Flush Sentry to ensure the event is sent before the function terminates
  await Sentry.flush(3000); // Wait up to 3 seconds for events to be sent

  console.log('[SENTRY-TEST] Sentry flush completed, about to throw error');

  // Also throw to test automatic error handling
  throw error;

  // This line is never reached, but TypeScript needs it
  return NextResponse.json({ message: "unreachable" });
});
