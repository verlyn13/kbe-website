// Original Next.js configuration with TypeScript path aliases
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
  webpack: (config, options) => {
    // Add our path aliases
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
    };
    
    // Add module resolution paths
    config.resolve.modules = [
      ...config.resolve.modules,
      path.resolve(__dirname, 'src'),
    ];
    
    return config;
  },
};

module.exports = nextConfig;