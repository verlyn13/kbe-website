#!/usr/bin/env node

// Comprehensive Firebase build script that handles all path resolution issues
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting Firebase-compatible build process...');

// 1. Set up environment
const workspaceDir = process.cwd();
console.log('Workspace directory:', workspaceDir);

// 2. Create tsconfig.json with path mappings
const tsconfigContent = {
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
};

fs.writeFileSync(
  path.join(workspaceDir, 'tsconfig.json'),
  JSON.stringify(tsconfigContent, null, 2)
);
console.log('✓ Created tsconfig.json with path mappings');

// 3. Create jsconfig.json as fallback
const jsconfigContent = {
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
};

fs.writeFileSync(
  path.join(workspaceDir, 'jsconfig.json'),
  JSON.stringify(jsconfigContent, null, 2)
);
console.log('✓ Created jsconfig.json fallback');

// 4. Create next.config.js with webpack configuration
const nextConfigContent = `
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
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Force webpack to resolve @ alias
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
`;

fs.writeFileSync(
  path.join(workspaceDir, 'next.config.js'),
  nextConfigContent
);
console.log('✓ Created next.config.js with webpack aliases');

// 5. Set up module-alias
try {
  const moduleAlias = require('module-alias');
  moduleAlias.addAlias('@', path.join(workspaceDir, 'src'));
  console.log('✓ Configured module-alias');
} catch (e) {
  console.log('⚠ Module-alias not available, skipping');
}

// 6. Run the actual Next.js build
console.log('\nRunning Next.js build...\n');

try {
  execSync('npx next build', {
    stdio: 'inherit',
    env: {
      ...process.env,
      // Ensure TypeScript uses our config
      TS_NODE_PROJECT: path.join(workspaceDir, 'tsconfig.json'),
    }
  });
  console.log('\n✓ Build completed successfully');
  process.exit(0);
} catch (error) {
  console.error('\n✗ Build failed');
  process.exit(1);
}