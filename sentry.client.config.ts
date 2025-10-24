import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,

  // Only send errors in production
  enabled: process.env.NODE_ENV === "production",

  // Release tracking - use VERCEL_GIT_COMMIT_SHA or fallback to dev
  release: process.env.VERCEL_GIT_COMMIT_SHA || process.env.SENTRY_RELEASE || "dev",

  // SAFE FREE TIER: Low sample rate for performance monitoring
  tracesSampleRate: 0.03, // 3% of transactions

  // Reduce breadcrumb noise
  maxBreadcrumbs: 30,

  // Always attach stack traces
  attachStacktrace: true,

  // Ignore common browser noise
  ignoreErrors: [
    // Browser extensions
    "top.GLOBALS",
    "originalCreateNotification",
    "canvas.contentDocument",
    "MyApp_RemoveAllHighlights",
    "atomicFindClose",

    // Network errors
    "NetworkError",
    "Network request failed",
    "Failed to fetch",
    "Load failed",
    "AbortError",

    // React/Next.js dev noise
    "ResizeObserver loop limit exceeded",
    "ResizeObserver loop completed with undelivered notifications",
    "ChunkLoadError",

    // User cancelled actions
    "User cancelled",
    "Request aborted",

    // Common false positives
    "Non-Error promise rejection captured",
  ],

  // Ignore errors from browser extensions
  denyUrls: [
    /extensions\//i,
    /^chrome:\/\//i,
    /^moz-extension:\/\//i,
  ],

  // Filter out noise before sending
  beforeSend(event, hint) {
    // Filter out bot traffic
    if (typeof navigator !== "undefined" && navigator.userAgent) {
      const botPattern = /bot|crawler|spider|crawling/i;
      if (botPattern.test(navigator.userAgent)) {
        return null;
      }
    }

    // Filter out localhost errors
    if (event.request?.url?.includes("localhost")) {
      return null;
    }

    // Filter health check endpoints
    const url = event.request?.url || "";
    if (url.includes("/health") || url.includes("/status") || url.includes("/api/health")) {
      return null;
    }

    return event;
  },

  // Integrations configuration
  integrations: [
    Sentry.replayIntegration({
      // Only capture replays for errors (not all sessions)
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],

  // Session Replay - only on errors to save quota
  replaysSessionSampleRate: 0, // Don't record normal sessions
  replaysOnErrorSampleRate: 0.1, // 10% of error sessions
});
