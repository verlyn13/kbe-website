// Merged configuration: Firebase + Custom webpack aliases
const path = require('path');

const originalWebpack = null;

module.exports = {
  output: 'standalone',
  distDir: '.next',
  experimental: {"appDocumentPreloading":true},
  
  // Merged webpack configuration
  webpack: (config, options) => {
    // Ensure resolve exists
    if (!config.resolve) {
      config.resolve = {};
    }
    if (!config.resolve.alias) {
      config.resolve.alias = {};
    }
    if (!config.resolve.modules) {
      config.resolve.modules = [];
    }
    
    // Add our path aliases
    config.resolve.alias['@'] = path.resolve(__dirname, 'src');
    
    // Add module resolution paths
    if (!config.resolve.modules.includes(path.resolve(__dirname, 'src'))) {
      config.resolve.modules.push(path.resolve(__dirname, 'src'));
    }
    
    // Call Firebase's webpack function if it exists
    if (originalWebpack && typeof originalWebpack === 'function') {
      config = originalWebpack(config, options);
    }
    
    console.log('Webpack aliases configured:', config.resolve.alias);
    return config;
  },
  
  // Our TypeScript settings
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Our ESLint settings
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Image configuration
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
  
  // Redirects
  async redirects() {
    const firebaseRedirects = () => [];
    const baseRedirects = typeof firebaseRedirects === 'function' ? await firebaseRedirects() : [];
    
    return [
      ...baseRedirects,
      {
        source: '/admin',
        destination: '/admin/content-generator',
        permanent: true,
      },
    ];
  },
};
