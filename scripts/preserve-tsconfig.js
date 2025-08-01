// Script to preserve TypeScript path resolution during Firebase builds
const fs = require('fs');
const path = require('path');

// Read our tsconfig.json
const tsconfigPath = path.join(process.cwd(), 'tsconfig.json');
const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));

// Ensure baseUrl and paths are preserved
if (!tsconfig.compilerOptions) {
  tsconfig.compilerOptions = {};
}

// Force our TypeScript configuration
tsconfig.compilerOptions.baseUrl = '.';
tsconfig.compilerOptions.paths = {
  '@/*': ['./src/*']
};

// Write it back
fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2));

console.log('TypeScript configuration preserved with path aliases');

// Also create a jsconfig.json as a fallback
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

console.log('Created jsconfig.json fallback');