// Post-install script to ensure TypeScript paths work in Firebase
const fs = require('fs');
const path = require('path');

console.log('Running post-install configuration for Firebase compatibility...');

// 1. Ensure jsconfig.json exists for module resolution fallback
const jsconfig = {
  compilerOptions: {
    baseUrl: '.',
    paths: {
      '@/*': ['./src/*']
    }
  }
};

fs.writeFileSync(
  path.join(process.cwd(), 'jsconfig.json'),
  JSON.stringify(jsconfig, null, 2)
);

console.log('✓ Created jsconfig.json for module resolution');

// 2. Create a .env file with NODE_OPTIONS if it doesn't exist
const envPath = path.join(process.cwd(), '.env');
if (!fs.existsSync(envPath)) {
  fs.writeFileSync(envPath, 'NODE_OPTIONS="--enable-source-maps"\n');
  console.log('✓ Created .env file');
}

console.log('Post-install configuration complete');