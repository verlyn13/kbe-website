import { NextResponse } from "next/server";

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
export async function GET() {
  const isProduction = process.env.NODE_ENV === "production";

  if (!isProduction) {
    return NextResponse.json({
      success: false,
      message: "Sentry test only works in production environment",
      environment: process.env.NODE_ENV,
      note: "Deploy to production first, then visit this endpoint"
    }, { status: 400 });
  }

  // This error will be captured by Sentry in production
  const timestamp = new Date().toISOString();
  throw new Error(`[SENTRY TEST] Production error tracking verification - ${timestamp}`);

  // This line is never reached, but TypeScript needs it
  return NextResponse.json({ message: "unreachable" });
}
