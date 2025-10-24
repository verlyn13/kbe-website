import { NextResponse } from "next/server";
import { forceInitSentry, captureServerError, testSentry } from "@/lib/server-sentry";

/**
 * Force Test Sentry Endpoint
 * This endpoint uses the most direct approach to test Sentry
 */
export async function GET() {
  console.log('[FORCE-TEST] Starting Sentry force test');

  // Environment check
  const envInfo = {
    NODE_ENV: process.env.NODE_ENV,
    VERCEL_ENV: process.env.VERCEL_ENV,
    NEXT_PUBLIC_SENTRY_DSN: !!process.env.NEXT_PUBLIC_SENTRY_DSN,
    SENTRY_DSN: !!process.env.SENTRY_DSN,
  };

  console.log('[FORCE-TEST] Environment:', envInfo);

  if (process.env.NODE_ENV !== 'production') {
    return NextResponse.json({
      success: false,
      message: 'This test only works in production',
      environment: envInfo,
    });
  }

  // Run comprehensive test
  const testResults = await testSentry();

  console.log('[FORCE-TEST] Test results:', testResults);

  // Create and capture a specific error
  const timestamp = new Date().toISOString();
  const testError = new Error(`[FORCE-TEST] Server error at ${timestamp}`);

  const errorId = await captureServerError(testError, {
    endpoint: '/api/sentry-force-test',
    timestamp,
    method: 'forced',
  });

  const response = {
    success: testResults.initialized,
    timestamp,
    testResults,
    errorId,
    environment: envInfo,
    instructions: testResults.initialized
      ? 'Check your Sentry dashboard for the test errors'
      : 'Sentry failed to initialize - check environment variables',
  };

  console.log('[FORCE-TEST] Sending response:', response);

  // Throw error to test error boundary
  if (testResults.initialized) {
    throw new Error(`[FORCE-TEST] Intentional error after successful capture - ${timestamp}`);
  }

  return NextResponse.json(response);
}