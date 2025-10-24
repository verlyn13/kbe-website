/**
 * Server-side Sentry initialization and error handling
 * This file ensures Sentry is properly initialized for server-side error tracking
 */

import * as Sentry from '@sentry/nextjs';

// Module-level initialization flag
let isInitialized = false;

/**
 * Force initialize Sentry for server-side operations
 * This bypasses all the normal initialization paths that aren't working
 */
export function forceInitSentry(): boolean {
  // Return early if already initialized
  if (isInitialized) {
    return true;
  }

  // Skip in non-production
  if (process.env.NODE_ENV !== 'production') {
    console.log('[SERVER-SENTRY] Non-production environment, skipping init');
    return false;
  }

  // Use the explicit DSN that's confirmed to be in Vercel
  const envDsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
  const fallbackDsn = "https://4f44009c4ef6950362e6cba83db7c7ab@o4510172424699904.ingest.us.sentry.io/4510242089795584";

  const dsn = envDsn || fallbackDsn;

  console.log('[SERVER-SENTRY] DSN configuration:', {
    fromEnv: !!envDsn,
    envValue: envDsn ? 'Present' : 'Missing',
    usingFallback: !envDsn,
    dsnStart: dsn.substring(0, 50) + '...',
  });

  if (!dsn) {
    console.error('[SERVER-SENTRY] No DSN available!');
    return false;
  }

  try {
    console.log('[SERVER-SENTRY] Force initializing Sentry for server-side tracking');

    // Close any existing client first
    const currentHub = Sentry.getCurrentHub();
    const existingClient = currentHub.getClient();
    if (existingClient) {
      console.log('[SERVER-SENTRY] Found existing client, closing it first');
      existingClient.close();
    }

    // Initialize with explicit configuration
    Sentry.init({
      dsn: dsn,
      environment: process.env.VERCEL_ENV || process.env.NODE_ENV || 'production',

      // Force enable
      enabled: true,
      debug: true, // Enable debug mode to see what's happening

      // Release tracking
      release: process.env.VERCEL_GIT_COMMIT_SHA || process.env.SENTRY_RELEASE || `kbe-${Date.now()}`,

      // Sampling
      tracesSampleRate: 1.0, // 100% sampling for testing

      // Integration options
      integrations: [
        new Sentry.Integrations.Http({ tracing: true }),
      ],

      // Error filtering
      beforeSend(event, hint) {
        console.log('[SERVER-SENTRY] beforeSend called:', {
          eventId: event.event_id,
          message: event.message,
          exception: event.exception?.values?.[0]?.value,
          level: event.level,
          timestamp: new Date().toISOString(),
        });

        // Always send in production for now (we can filter later)
        return event;
      },

      beforeSendTransaction(event) {
        console.log('[SERVER-SENTRY] beforeSendTransaction called:', event.event_id);
        return event;
      },

      // Transport options
      transportOptions: {
        // Increase timeout for Vercel
        timeout: 5000,
      },
    });

    // Verify initialization
    const hub = Sentry.getCurrentHub();
    const client = hub.getClient();

    if (client) {
      isInitialized = true;
      console.log('[SERVER-SENTRY] Successfully initialized:', {
        dsn: client.getDsn()?.toString()?.substring(0, 50) + '...',
        environment: client.getOptions().environment,
        release: client.getOptions().release,
      });

      // Send a test message to verify it's working
      Sentry.captureMessage('[SERVER-SENTRY] Initialization successful', 'info');

      return true;
    } else {
      console.error('[SERVER-SENTRY] Failed to initialize - no client created');
      return false;
    }
  } catch (error) {
    console.error('[SERVER-SENTRY] Failed to initialize:', error);
    return false;
  }
}

/**
 * Capture an exception with forced initialization
 */
export async function captureServerError(
  error: Error | unknown,
  context?: Record<string, any>
): Promise<string | null> {
  // Ensure Sentry is initialized
  forceInitSentry();

  if (!isInitialized) {
    console.error('[SERVER-SENTRY] Cannot capture error - Sentry not initialized');
    return null;
  }

  try {
    console.log('[SERVER-SENTRY] Capturing error:', error);

    const eventId = Sentry.captureException(error, {
      tags: {
        source: 'server',
        ...context?.tags,
      },
      extra: context,
    });

    console.log('[SERVER-SENTRY] Error captured with ID:', eventId);

    // Force flush to ensure it's sent
    await Sentry.flush(3000);
    console.log('[SERVER-SENTRY] Flush completed');

    return eventId;
  } catch (captureError) {
    console.error('[SERVER-SENTRY] Failed to capture error:', captureError);
    return null;
  }
}

/**
 * Test function to verify Sentry is working
 */
export async function testSentry(): Promise<{
  initialized: boolean;
  testMessageId: string | null;
  testErrorId: string | null;
}> {
  const initialized = forceInitSentry();

  if (!initialized) {
    return {
      initialized: false,
      testMessageId: null,
      testErrorId: null,
    };
  }

  // Send test message
  const testMessageId = Sentry.captureMessage(
    `[SERVER-SENTRY TEST] Message test at ${new Date().toISOString()}`,
    'info'
  );

  // Send test error
  const testError = new Error(`[SERVER-SENTRY TEST] Error test at ${new Date().toISOString()}`);
  const testErrorId = await captureServerError(testError, {
    tags: { test: 'true' },
    isTest: true,
  });

  return {
    initialized,
    testMessageId,
    testErrorId,
  };
}