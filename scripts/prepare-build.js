// scripts/prepare-build.js
const fs = require('fs');
const path = require('path');

const customConfigPath = path.resolve(__dirname, '..', 'next.config.custom.js');
const targetConfigPath = path.resolve(__dirname, '..', 'next.config.js');

console.log('Preparing build in directory:', process.cwd());
console.log('Custom config path:', customConfigPath);
console.log('Target config path:', targetConfigPath);

// Check if custom config exists
if (!fs.existsSync(customConfigPath)) {
  console.error('ERROR: Custom config not found at:', customConfigPath);
  process.exit(1);
}

console.log('Copying custom Next.js config for build...');
fs.copyFileSync(customConfigPath, targetConfigPath);
console.log('✓ Custom config copied to next.config.js');

// Verify the copy worked
if (fs.existsSync(targetConfigPath)) {
  const stats = fs.statSync(targetConfigPath);
  console.log('✓ Verified: next.config.js exists with size:', stats.size, 'bytes');
} else {
  console.error('ERROR: Failed to create next.config.js');
  process.exit(1);
}