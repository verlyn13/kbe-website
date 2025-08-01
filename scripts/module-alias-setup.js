// Module alias setup for Firebase builds
// This ensures @/* imports work even if Firebase overrides config

const moduleAlias = require('module-alias');
const path = require('path');

// Register the @ alias
moduleAlias.addAlias('@', path.join(process.cwd(), 'src'));

console.log('Module alias configured: @ -> ' + path.join(process.cwd(), 'src'));