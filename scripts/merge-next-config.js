#!/usr/bin/env node

// Script to merge our webpack aliases with Firebase's generated config
const fs = require('fs');
const path = require('path');
const vm = require('vm');

console.log('Merging webpack aliases with Firebase configuration...');

const configPath = path.join(process.cwd(), 'next.config.js');
const workspaceDir = process.cwd();

// Read and evaluate the Firebase-generated config
let firebaseConfig;
try {
  const configContent = fs.readFileSync(configPath, 'utf8');
  console.log('Firebase config content:', configContent.substring(0, 200) + '...');
  
  // Create a sandbox to safely evaluate the config
  const sandbox = {
    module: { exports: {} },
    exports: {},
    require: require,
    __dirname: workspaceDir,
    __filename: configPath,
    process: process,
    console: console,
    path: require('path')
  };
  
  // Execute the config file in the sandbox
  vm.createContext(sandbox);
  vm.runInContext(configContent, sandbox);
  
  firebaseConfig = sandbox.module.exports || sandbox.exports || {};
  console.log('✓ Loaded Firebase config:', JSON.stringify(firebaseConfig, null, 2));
} catch (error) {
  console.error('Error loading Firebase config:', error);
  // If we can't load it, use an empty config
  firebaseConfig = {};
}

// Create our merged configuration with proper webpack handling
const mergedConfigCode = `// Merged configuration: Firebase + Custom webpack aliases
const path = require('path');

const originalWebpack = ${firebaseConfig.webpack ? firebaseConfig.webpack.toString() : 'null'};

module.exports = {
  ${firebaseConfig.output ? `output: '${firebaseConfig.output}',` : ''}
  ${firebaseConfig.distDir ? `distDir: '${firebaseConfig.distDir}',` : ''}
  ${firebaseConfig.experimental ? `experimental: ${JSON.stringify(firebaseConfig.experimental)},` : ''}
  
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
      ${firebaseConfig.images?.remotePatterns ? JSON.stringify(firebaseConfig.images.remotePatterns) + ',' : ''}
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
    const firebaseRedirects = ${firebaseConfig.redirects ? firebaseConfig.redirects.toString() : '() => []'};
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
`;

// Write the merged configuration
fs.writeFileSync(configPath, mergedConfigCode);
console.log('✓ Merged configuration written successfully');
console.log('Written config preview:', mergedConfigCode.substring(0, 500) + '...');

// Also ensure tsconfig.json has our path mappings
const tsconfigPath = path.join(workspaceDir, 'tsconfig.json');
try {
  const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
  
  if (!tsconfig.compilerOptions) {
    tsconfig.compilerOptions = {};
  }
  
  tsconfig.compilerOptions.baseUrl = '.';
  tsconfig.compilerOptions.paths = {
    ...tsconfig.compilerOptions.paths,
    '@/*': ['./src/*']
  };
  
  fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2));
  console.log('✓ Updated tsconfig.json with path mappings');
} catch (error) {
  console.warn('Could not update tsconfig.json:', error.message);
}