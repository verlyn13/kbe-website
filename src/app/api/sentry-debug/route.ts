import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";

/**
 * Sentry Debug Endpoint
 *
 * Returns diagnostic information about Sentry configuration
 * and captures a test event
 */
export async function GET() {
  const diagnostics = {
    environment: process.env.NODE_ENV,
    sentryDsnConfigured: !!process.env.NEXT_PUBLIC_SENTRY_DSN,
    sentryOrgConfigured: !!process.env.SENTRY_ORG,
    sentryProjectConfigured: !!process.env.SENTRY_PROJECT,
    sentryAuthTokenConfigured: !!process.env.SENTRY_AUTH_TOKEN,
    sentryReleaseConfigured: !!process.env.SENTRY_RELEASE,
    sentryHub: !!Sentry.getClient(),
    timestamp: new Date().toISOString(),
  };

  // Try to capture a test message
  if (process.env.NODE_ENV === "production") {
    const eventId = Sentry.captureMessage(
      `[SENTRY DEBUG] Configuration test - ${diagnostics.timestamp}`,
      "info"
    );

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
