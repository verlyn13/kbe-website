// Script to fix TypeScript paths for Firebase builds
const fs = require('fs');
const path = require('path');

// Get the workspace directory (could be /workspace in Firebase or local path)
const workspaceDir = process.cwd();
console.log('Workspace directory:', workspaceDir);

// Update module-alias configuration
const moduleAlias = require('module-alias');
moduleAlias.addAlias('@', path.join(workspaceDir, 'src'));

// Update jsconfig.json with absolute path
const jsconfig = {
  compilerOptions: {
    baseUrl: '.',
    paths: {
      '@/*': ['./src/*']
    }
  }
};

fs.writeFileSync(
  path.join(workspaceDir, 'jsconfig.json'),
  JSON.stringify(jsconfig, null, 2)
);

// Create a Next.js config if Firebase deleted ours
const nextConfigPath = path.join(workspaceDir, 'next.config.js');
if (!fs.existsSync(nextConfigPath)) {
  console.log('Recreating next.config.js...');
  const nextConfig = `
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
  fs.writeFileSync(nextConfigPath, nextConfig);
}

console.log('Path configuration fixed for Firebase build');