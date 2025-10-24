import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";

/**
 * Test different DSNs to find which one works
 */
export async function GET() {
  const dsns = {
    vercel_integration: process.env.NEXT_PUBLIC_SENTRY_DSN,
    workable_ram: "https://623aa9db5615d45e548b0c7a5417ef9f@o4510172424699904.ingest.us.sentry.io/4510242089795584",
    dashing_viper: "https://2fb4d2440fccee07320466e0471c044e@o4510172424699904.ingest.us.sentry.io/4510242089795584",
    default: "https://4f44009c4ef6950362e6cba83db7c7ab@o4510172424699904.ingest.us.sentry.io/4510242089795584",
  };

  console.log('[DSN-TEST] Testing DSNs:', {
    vercel_integration: dsns.vercel_integration ? 'Present' : 'Missing',
    matches_default: dsns.vercel_integration === dsns.default,
  });

  if (process.env.NODE_ENV !== 'production') {
    return NextResponse.json({
      error: 'This test only works in production',
      environment: process.env.NODE_ENV,
    });
  }

  const results: Record<string, any> = {};

  for (const [name, dsn] of Object.entries(dsns)) {
    if (!dsn) {
      results[name] = { error: 'DSN not found in environment' };
      continue;
    }

    try {
      console.log(`[DSN-TEST] Testing ${name} DSN...`);

      // Create a new hub for this test
      const hub = new Sentry.Hub();

      // Create a new client with this DSN
      const client = new Sentry.NodeClient({
        dsn: dsn,
        environment: 'production',
        release: process.env.VERCEL_GIT_COMMIT_SHA || 'test',
        debug: true,
        beforeSend(event) {
          console.log(`[DSN-TEST] ${name} - Sending event:`, event.event_id);
          return event;
        },
      });

      hub.bindClient(client);

      // Make this hub active for this test
      Sentry.makeMain(hub);

      // Send a test message
      const timestamp = new Date().toISOString();
      const messageId = hub.captureMessage(
        `[DSN-TEST] Testing ${name} DSN at ${timestamp}`,
        'info'
      );

      // Send a test error
      const error = new Error(`[DSN-TEST] Test error for ${name} at ${timestamp}`);
      const errorId = hub.captureException(error);

      // Flush to ensure events are sent
      await client.flush(3000);

      results[name] = {
        success: true,
        messageId,
        errorId,
        dsn: dsn.substring(0, 50) + '...',
      };

      console.log(`[DSN-TEST] ${name} test completed:`, results[name]);

    } catch (error) {
      console.error(`[DSN-TEST] ${name} failed:`, error);
      results[name] = {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  // Restore the original Sentry setup
  try {
    const originalDsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
    if (originalDsn) {
      Sentry.init({
        dsn: originalDsn,
        environment: process.env.NODE_ENV,
        debug: true,
      });
    }
  } catch (e) {
    console.error('[DSN-TEST] Failed to restore original Sentry:', e);
  }

  return NextResponse.json({
    results,
    instructions: 'Check your Sentry dashboard for test messages and errors from each DSN',
    dashboard: 'https://sentry.io/organizations/happy-patterns-llc/issues/?project=4510242089795584',
    timestamp: new Date().toISOString(),
  });
}