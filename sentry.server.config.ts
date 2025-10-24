import * as Sentry from "@sentry/nextjs";

console.log("[SENTRY SERVER] Initializing Sentry server config", {
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN?.substring(0, 50) + "...",
  env: process.env.NODE_ENV,
  enabled: process.env.NODE_ENV === "production",
});

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,

  // Only send errors in production
  enabled: process.env.NODE_ENV === "production",

  // Release tracking
  release: process.env.SENTRY_RELEASE,

  // SAFE FREE TIER: Very low sample rate for server performance
  tracesSampleRate: 0.05, // 5% of server transactions

  // Reduce breadcrumb noise
  maxBreadcrumbs: 30,

  // Always attach stack traces for better debugging
  attachStacktrace: true,

  // Ignore common server noise
  ignoreErrors: [
    // Network errors
    "ECONNRESET",
    "ECONNREFUSED",
    "ETIMEDOUT",
    "TimeoutError",
    "NetworkError",
    "Request aborted",

    // Common client disconnects
    "Client closed request",
    "Socket hang up",

    // Database connection errors (transient)
    "Connection terminated unexpectedly",
    "Connection lost",

    // Next.js dev noise
    "NEXT_NOT_FOUND",
    "NEXT_REDIRECT",
  ],

  // Filter before sending
  beforeSend(event, hint) {
    // Filter health check endpoints
    const url = event.request?.url || "";
    if (
      url.includes("/health") ||
      url.includes("/status") ||
      url.includes("/api/health") ||
      url.includes("/api/ping")
    ) {
      return null;
    }

    // Filter monitoring endpoints
    if (url.includes("/metrics") || url.includes("/prometheus")) {
      return null;
    }

    // Filter bot requests
    const userAgent = event.request?.headers?.["user-agent"] || "";
    const botPattern = /bot|crawler|spider|crawling|monitoring/i;
    if (botPattern.test(userAgent)) {
      return null;
    }

    return event;
  },

  // Integrations
  integrations: [
    // Add profiling for performance insights (very low sample rate)
    // Only available on paid plans - keeping here for when you upgrade
    // Sentry.profilingIntegration(),
  ],
});
