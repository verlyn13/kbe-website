// Next.js configuration with hardcoded webpack alias
const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
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
        destination: '/admin/content-generator',
        permanent: true,
      },
    ]
  },
  // Force webpack to resolve TypeScript paths
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Important: return the modified config
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.join(__dirname, 'src'),
    };
    
    // Also add fallback for module resolution
    config.resolve.fallback = {
      ...config.resolve.fallback,
      '@': path.join(__dirname, 'src'),
    };
    
    return config;
  },
};

module.exports = nextConfig;