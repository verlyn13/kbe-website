import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";

/**
 * Sentry Debug Endpoint
 *
 * Returns diagnostic information about Sentry configuration
 * and captures a test event
 */
export async function GET() {
  const client = Sentry.getClient();
  const options = client?.getOptions();

  const diagnostics = {
    environment: process.env.NODE_ENV,
    nextRuntime: process.env.NEXT_RUNTIME,
    sentryDsnConfigured: !!process.env.NEXT_PUBLIC_SENTRY_DSN,
    sentryDsnValue: process.env.NEXT_PUBLIC_SENTRY_DSN?.substring(0, 50) + "...",
    sentryOrgConfigured: !!process.env.SENTRY_ORG,
    sentryProjectConfigured: !!process.env.SENTRY_PROJECT,
    sentryAuthTokenConfigured: !!process.env.SENTRY_AUTH_TOKEN,
    sentryReleaseConfigured: !!process.env.SENTRY_RELEASE,
    sentryReleaseValue: process.env.SENTRY_RELEASE,
    sentryClientExists: !!client,
    sentryEnabled: options?.enabled,
    sentryDsnInClient: options?.dsn,
    timestamp: new Date().toISOString(),
  };

  // Try to capture a test message
  if (process.env.NODE_ENV === "production") {
    const eventId = Sentry.captureMessage(
      `[SENTRY DEBUG] Server diagnostic - ${diagnostics.timestamp}`,
      "info"
    );

    // Flush to ensure event is sent
    await Sentry.flush(2000);

    return NextResponse.json({
      ...diagnostics,
      testEventId: eventId,
      message: "Test event sent to Sentry. Check your dashboard in a few seconds.",
    });
  }

  return NextResponse.json({
    ...diagnostics,
    message: "Sentry only sends events in production",
  });
}
