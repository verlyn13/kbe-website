// scripts/prepare-build.js
const fs = require('fs');
const path = require('path');

const customConfigPath = path.resolve(__dirname, '..', 'next.config.custom.js');
const targetConfigPath = path.resolve(__dirname, '..', 'next.config.js');

console.log('Copying custom Next.js config for build...');
fs.copyFileSync(customConfigPath, targetConfigPath);
console.log('✓ Custom config copied to next.config.js');