const { withSentryConfig } = require("@sentry/nextjs");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable source maps in production for Sentry error tracking
  productionBrowserSourceMaps: true,

  // Enable instrumentation for Sentry (not experimental in Next.js 15+)
  // Note: instrumentationHook is enabled by default in Next.js 15

  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/admin/dashboard',
        permanent: false,
      },
    ];
  },
};

// Sentry configuration options
const sentryWebpackPluginOptions = {
  // Suppress all Sentry CLI logs
  silent: true,

  // Organization and project from environment variables
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,

  // Auth token from environment
  authToken: process.env.SENTRY_AUTH_TOKEN,

  // Only upload source maps in production builds
  disableServerWebpackPlugin: process.env.NODE_ENV !== "production",
  disableClientWebpackPlugin: process.env.NODE_ENV !== "production",

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  widenClientFileUpload: true,

  // Route browser requests through a proxy to avoid ad-blockers
  tunnelRoute: "/monitoring",

  // Hides source maps from generated client bundles
  hideSourceMaps: true,

  // Automatically annotate React components with origin for better error tracking
  reactComponentAnnotation: {
    enabled: true,
  },
};

// Export config wrapped with Sentry
module.exports = withSentryConfig(nextConfig, sentryWebpackPluginOptions);
