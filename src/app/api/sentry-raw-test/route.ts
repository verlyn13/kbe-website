import { NextResponse } from "next/server";

/**
 * Raw Sentry test - bypassing all wrappers and going directly to the core
 */
export async function GET() {
  if (process.env.NODE_ENV !== 'production') {
    return NextResponse.json({ error: 'Production only' });
  }

  const results: any = {
    timestamp: new Date().toISOString(),
    tests: {},
  };

  try {
    // Test 1: Direct HTTP POST to Sentry
    const projectId = "4510242089795584";
    const publicKey = "4f44009c4ef6950362e6cba83db7c7ab";
    const sentryUrl = `https://o4510172424699904.ingest.us.sentry.io/api/${projectId}/store/`;

    const timestamp = Math.floor(Date.now() / 1000);
    const message = `[RAW-TEST] Direct HTTP test at ${new Date().toISOString()}`;

    const sentryPayload = {
      event_id: crypto.randomUUID().replace(/-/g, ''),
      timestamp: timestamp,
      platform: 'node',
      level: 'error',
      logger: 'javascript',
      environment: 'production',
      release: process.env.VERCEL_GIT_COMMIT_SHA || 'unknown',
      message: {
        formatted: message,
      },
      extra: {
        test: true,
        endpoint: '/api/sentry-raw-test',
      },
      tags: {
        test: 'raw-http',
      },
    };

    console.log('[RAW-TEST] Sending direct HTTP request to Sentry');

    const response = await fetch(sentryUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Sentry-Auth': [
          `Sentry sentry_version=7`,
          `sentry_client=raw-test/1.0`,
          `sentry_timestamp=${timestamp}`,
          `sentry_key=${publicKey}`,
        ].join(', '),
      },
      body: JSON.stringify(sentryPayload),
    });

    results.tests.directHttp = {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      eventId: sentryPayload.event_id,
      message: message,
    };

    console.log('[RAW-TEST] Direct HTTP response:', results.tests.directHttp);

    // If successful, also send an error
    if (response.ok) {
      const errorPayload = {
        event_id: crypto.randomUUID().replace(/-/g, ''),
        timestamp: Math.floor(Date.now() / 1000),
        platform: 'node',
        level: 'error',
        logger: 'javascript',
        environment: 'production',
        exception: {
          values: [
            {
              type: 'Error',
              value: `[RAW-TEST] Direct HTTP error at ${new Date().toISOString()}`,
              stacktrace: {
                frames: [
                  {
                    filename: '/api/sentry-raw-test',
                    function: 'GET',
                    lineno: 1,
                    colno: 1,
                  },
                ],
              },
            },
          ],
        },
      };

      const errorResponse = await fetch(sentryUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Sentry-Auth': [
            `Sentry sentry_version=7`,
            `sentry_client=raw-test/1.0`,
            `sentry_timestamp=${Math.floor(Date.now() / 1000)}`,
            `sentry_key=${publicKey}`,
          ].join(', '),
        },
        body: JSON.stringify(errorPayload),
      });

      results.tests.directError = {
        status: errorResponse.status,
        ok: errorResponse.ok,
        eventId: errorPayload.event_id,
      };
    }

  } catch (error) {
    console.error('[RAW-TEST] Test failed:', error);
    results.tests.directHttp = {
      error: error instanceof Error ? error.message : String(error),
    };
  }

  results.success = results.tests.directHttp?.ok || false;
  results.instructions = results.success
    ? 'Direct HTTP to Sentry works! Check dashboard for events. The SDK initialization might be the issue.'
    : 'Direct HTTP to Sentry failed. Check network/firewall settings.';

  return NextResponse.json(results);
}