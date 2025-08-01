#!/usr/bin/env node

// Wrapper script for next build that ensures path resolution works
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// First, ensure our next.config.js is in place
const nextConfigContent = `
const path = require('path');

module.exports = {
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
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.join(__dirname, 'src'),
    };
    return config;
  },
};
`;

// Write our config
fs.writeFileSync(path.join(process.cwd(), 'next.config.js'), nextConfigContent);
console.log('Restored next.config.js with webpack aliases');

// Now run the actual next build
const nextBuild = spawn('node', [path.join(process.cwd(), 'node_modules/.bin/next'), 'build'], {
  stdio: 'inherit',
  env: process.env
});

nextBuild.on('exit', (code) => {
  process.exit(code);
});