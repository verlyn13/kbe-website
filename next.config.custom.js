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
    // This is all you need for the alias to work
    config.resolve.alias['@'] = path.resolve(__dirname, 'src');
    
    return config;
  },
};

module.exports = nextConfig;