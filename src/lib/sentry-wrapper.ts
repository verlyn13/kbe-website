import * as Sentry from '@sentry/nextjs';

// Track if Sentry has been initialized
let sentryInitialized = false;
let initializationAttempted = false;

/**
 * Initialize Sentry for server-side error tracking
 * This is a workaround for Next.js 15 instrumentation hook not being called on Vercel
 */
export function initializeSentryIfNeeded() {
  if (sentryInitialized) {
    console.log('[SENTRY-WRAPPER] Sentry already initialized, skipping');
    return true;
  }

  if (initializationAttempted) {
    console.log('[SENTRY-WRAPPER] Initialization already attempted but failed');
    return false;
  }

  initializationAttempted = true;

  // Only initialize in production
  if (process.env.NODE_ENV !== 'production') {
    console.log('[SENTRY-WRAPPER] Skipping Sentry initialization in non-production environment');
    return false;
  }

  // Check DSN explicitly
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) {
    console.error('[SENTRY-WRAPPER] CRITICAL: NEXT_PUBLIC_SENTRY_DSN environment variable is not set!');
    return false;
  }

  try {
    console.log('[SENTRY-WRAPPER] Initializing Sentry (API route workaround)', {
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN ? 'Present' : 'Missing',
      env: process.env.NODE_ENV,
      vercelEnv: process.env.VERCEL_ENV,
    });

    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      environment: process.env.NODE_ENV,
      enabled: true,

      // Release tracking - use VERCEL_GIT_COMMIT_SHA or fallback
      release: process.env.VERCEL_GIT_COMMIT_SHA || process.env.SENTRY_RELEASE || 'dev',

      // SAFE FREE TIER: Very low sample rate for server performance
      tracesSampleRate: 0.05, // 5% of server transactions

      // Reduce breadcrumb noise
      maxBreadcrumbs: 30,

      // Always attach stack traces for better debugging
      attachStacktrace: true,

      // Ignore common server noise
      ignoreErrors: [
        // Network errors
        'ECONNRESET',
        'ECONNREFUSED',
        'ETIMEDOUT',
        'TimeoutError',
        'NetworkError',
        'Request aborted',

        // Common client disconnects
        'Client closed request',
        'Socket hang up',

        // Database connection errors (transient)
        'Connection terminated unexpectedly',
        'Connection lost',

        // Next.js dev noise
        'NEXT_NOT_FOUND',
        'NEXT_REDIRECT',
      ],

      // Filter before sending
      beforeSend(event, hint) {
        // Filter health check endpoints
        const url = event.request?.url || '';
        if (
          url.includes('/health') ||
          url.includes('/status') ||
          url.includes('/api/health') ||
          url.includes('/api/ping')
        ) {
          return null;
        }

        // Filter monitoring endpoints
        if (url.includes('/metrics') || url.includes('/prometheus')) {
          return null;
        }

        // Filter bot requests
        const userAgent = event.request?.headers?.['user-agent'] || '';
        const botPattern = /bot|crawler|spider|crawling|monitoring/i;
        if (botPattern.test(userAgent)) {
          return null;
        }

        // Log what we're sending
        console.log('[SENTRY-WRAPPER] Sending event to Sentry:', {
          message: event.exception?.values?.[0]?.value,
          level: event.level,
          tags: event.tags,
        });

        return event;
      },
    });

    sentryInitialized = true;
    console.log('[SENTRY-WRAPPER] Sentry initialized successfully');

    // Test that it's actually working
    const hub = Sentry.getCurrentHub();
    const client = hub.getClient();
    console.log('[SENTRY-WRAPPER] Verification:', {
      hasClient: !!client,
      dsn: client?.getDsn()?.toString()?.substring(0, 50) + '...',
    });

    return true;
  } catch (error) {
    console.error('[SENTRY-WRAPPER] Failed to initialize Sentry:', error);
    return false;
  }
}

/**
 * Wrapper for API route handlers that ensures Sentry is initialized
 */
export function withSentry<T extends (...args: any[]) => any>(handler: T): T {
  return (async (...args: Parameters<T>) => {
    // Initialize Sentry if needed
    initializeSentryIfNeeded();

    try {
      // Call the original handler
      return await handler(...args);
    } catch (error) {
      // Capture any errors
      console.error('[SENTRY-WRAPPER] API route error:', error);

      if (sentryInitialized) {
        const eventId = Sentry.captureException(error, {
          tags: {
            location: 'api-route',
          },
        });
        console.log('[SENTRY-WRAPPER] Error sent to Sentry with ID:', eventId);

        // Ensure the error is sent before the response
        await Sentry.flush(2000);
      }

      // Re-throw to maintain original behavior
      throw error;
    }
  }) as T;
}