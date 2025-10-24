import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,

  // Only send errors in production
  enabled: process.env.NODE_ENV === "production",

  // Release tracking - use VERCEL_GIT_COMMIT_SHA or fallback to dev
  release: process.env.VERCEL_GIT_COMMIT_SHA || process.env.SENTRY_RELEASE || "dev",

  // SAFE FREE TIER: Minimal sampling for edge runtime
  tracesSampleRate: 0.02, // 2% of edge transactions

  // Reduce breadcrumbs for edge runtime
  maxBreadcrumbs: 20,

  // Always attach stack traces
  attachStacktrace: true,

  // Ignore common edge runtime noise
  ignoreErrors: [
    "NetworkError",
    "Request aborted",
    "AbortError",
    "ECONNRESET",
  ],

  // Filter before sending
  beforeSend(event) {
    // Filter health checks
    const url = event.request?.url || "";
    if (url.includes("/health") || url.includes("/status")) {
      return null;
    }

    return event;
  },
});
