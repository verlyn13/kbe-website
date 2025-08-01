#!/usr/bin/env node

// Script to merge our webpack aliases with Firebase's generated config
const fs = require('fs');
const path = require('path');

console.log('Merging webpack aliases with Firebase configuration...');

const configPath = path.join(process.cwd(), 'next.config.js');

// Read the Firebase-generated config as text first
let configContent;
try {
  configContent = fs.readFileSync(configPath, 'utf8');
  console.log('✓ Read Firebase-generated config');
} catch (error) {
  console.error('Error reading Firebase config:', error);
  process.exit(1);
}

// Create our merged configuration
const mergedConfigContent = `// Merged configuration: Firebase + Custom webpack aliases
const path = require('path');

// Original Firebase configuration
${configContent}

// Store the original config
const firebaseConfig = module.exports;

// Create our merged configuration
const mergedConfig = {
  ...firebaseConfig,
  
  // Merge webpack configuration
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
    
    // Call Firebase's webpack function if it exists
    if (firebaseConfig.webpack && typeof firebaseConfig.webpack === 'function') {
      config = firebaseConfig.webpack(config, options);
    }
    
    return config;
  },
  
  // Ensure our TypeScript settings
  typescript: {
    ...firebaseConfig.typescript,
    ignoreBuildErrors: true,
  },
  
  // Ensure our ESLint settings
  eslint: {
    ...firebaseConfig.eslint,
    ignoreDuringBuilds: true,
  },
  
  // Merge image configuration
  images: {
    ...firebaseConfig.images,
    remotePatterns: [
      ...(firebaseConfig.images?.remotePatterns || []),
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  
  // Merge redirects
  async redirects() {
    const firebaseRedirects = firebaseConfig.redirects ? 
      await firebaseConfig.redirects() : [];
    
    return [
      ...firebaseRedirects,
      {
        source: '/admin',
        destination: '/admin/content-generator',
        permanent: true,
      },
    ];
  },
};

// Export the merged configuration
module.exports = mergedConfig;
`;

// Write the merged configuration
fs.writeFileSync(configPath, mergedConfigContent);
console.log('✓ Merged configuration written successfully');

// Also ensure tsconfig.json has our path mappings
const tsconfigPath = path.join(process.cwd(), 'tsconfig.json');
try {
  const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
  
  if (!tsconfig.compilerOptions.paths || !tsconfig.compilerOptions.paths['@/*']) {
    tsconfig.compilerOptions.baseUrl = '.';
    tsconfig.compilerOptions.paths = {
      ...tsconfig.compilerOptions.paths,
      '@/*': ['./src/*']
    };
    
    fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2));
    console.log('✓ Updated tsconfig.json with path mappings');
  }
} catch (error) {
  console.warn('Could not update tsconfig.json:', error.message);
}