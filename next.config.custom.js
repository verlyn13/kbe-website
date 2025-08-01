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
  webpack: (config, { isServer }) => {
    // Just ensure our alias exists without overwriting anything
    if (!config.resolve) {
      config.resolve = {};
    }
    if (!config.resolve.alias) {
      config.resolve.alias = {};
    }
    
    // Only add if not already present
    if (!config.resolve.alias['@']) {
      config.resolve.alias['@'] = path.resolve(__dirname, 'src');
      console.log('Added @ alias to webpack config');
    } else {
      console.log('@ alias already exists in webpack config');
    }
    
    return config;
  },
};

module.exports = nextConfig;