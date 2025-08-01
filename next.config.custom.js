// Original Next.js configuration with TypeScript path aliases
const path = require('path');
const util = require('util'); // Import the 'util' module

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
    // Add the alias
    config.resolve.alias['@'] = path.resolve(__dirname, 'src');

    // --- START DIAGNOSTIC LOG ---
    // We only need to see the config once, so let's log it only for the server build.
    if (isServer) {
      console.log("--- FULL WEBPACK CONFIG ---");
      // Use util.inspect to print the deep object without truncation
      console.log(util.inspect(config, { showHidden: false, depth: null, colors: false }));
      console.log("--- END WEBPACK CONFIG ---");
      
      // Also log specific resolve configuration for easier debugging
      console.log("--- RESOLVE CONFIGURATION ---");
      console.log("resolve.alias:", util.inspect(config.resolve.alias, { depth: null }));
      console.log("__dirname:", __dirname);
      console.log("Expected @ alias path:", path.resolve(__dirname, 'src'));
      console.log("--- END RESOLVE CONFIGURATION ---");
    }
    // --- END DIAGNOSTIC LOG ---

    return config;
  },
};

module.exports = nextConfig;