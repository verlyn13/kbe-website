// Module alias setup for Firebase builds
// This ensures @/* imports work even if Firebase overrides config

const Module = require('module');
const path = require('path');

const originalResolveFilename = Module._resolveFilename;

Module._resolveFilename = function (request, parent, isMain) {
  // Handle @/* imports
  if (request.startsWith('@/')) {
    const actualPath = request.replace('@/', path.join(process.cwd(), 'src/'));
    return originalResolveFilename.call(this, actualPath, parent, isMain);
  }
  
  return originalResolveFilename.call(this, request, parent, isMain);
};

console.log('Module alias resolution configured for @/* imports');