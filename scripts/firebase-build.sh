#!/bin/bash

# Firebase Build Script - Preserves TypeScript path resolution
# This script runs the Next.js build while preserving our configuration

echo "Starting Firebase-compatible build with preserved configuration..."

# Save our original next.config.mjs
cp next.config.mjs next.config.mjs.backup

# Run the standard build
npm run build

# Check if Firebase overwrote our config during build
if [ -f "next.config.mjs.backup" ]; then
  # Restore our original config
  cp next.config.mjs.backup next.config.mjs
  rm next.config.mjs.backup
fi

echo "Build completed with preserved configuration"