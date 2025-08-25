#!/usr/bin/env node

/**
 * Script to automatically fix useUniqueElementIds errors by adding useId hooks
 * This helps Biome auto-fix similar issues in the future
 */

const fs = require('node:fs');
const path = require('node:path');

// Files with useUniqueElementIds errors
const filesToFix = [
  'src/app/students/add/page.tsx',
  'src/app/signup/page.tsx',
  'src/app/profile/page.tsx',
  'src/components/guardian-info-form.tsx',
];

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Check if useId is already imported
  if (!content.includes('import { useId }') && !content.includes('useId,')) {
    // Add useId to React imports
    if (content.includes("'react'")) {
      content = content.replace(/import\s+{([^}]+)}\s+from\s+['"]react['"]/, (match, imports) => {
        const importList = imports.split(',').map((i) => i.trim());
        if (!importList.includes('useId')) {
          importList.push('useId');
        }
        return `import { ${importList.join(', ')} } from 'react'`;
      });
    }
  }

  // Find all id="staticString" patterns and collect them
  const idPattern = /id="([^"]+)"/g;
  const staticIds = new Set();
  let matchResult = idPattern.exec(content);
  while (matchResult !== null) {
    const match = matchResult;
    // Skip dynamic IDs (those with ${} or that are variables)
    if (!match[1].includes('$') && !match[1].includes('{')) {
      staticIds.add(match[1]);
    }
    matchResult = idPattern.exec(content);
  }

  if (staticIds.size > 0) {
    // Find the component function
    const componentMatch = content.match(/export\s+(?:default\s+)?function\s+\w+\([^)]*\)\s*{/);
    if (componentMatch) {
      const insertPosition = componentMatch.index + componentMatch[0].length;

      // Generate useId declarations for each static ID
      const idDeclarations = Array.from(staticIds)
        .map((id) => {
          const varName = `${id.replace(/-([a-z])/g, (g) => g[1].toUpperCase())}Id`;
          return `  const ${varName} = useId();`;
        })
        .join('\n');

      // Insert the declarations
      content = `${content.slice(0, insertPosition)}\n${idDeclarations}${content.slice(insertPosition)}`;

      // Replace static IDs with dynamic ones
      staticIds.forEach((id) => {
        const varName = `${id.replace(/-([a-z])/g, (g) => g[1].toUpperCase())}Id`;
        // Replace id="staticId" with id={dynamicId}
        content = content.replace(new RegExp(`id="${id}"`, 'g'), `id={${varName}}`);
        // Also update htmlFor attributes
        content = content.replace(new RegExp(`htmlFor="${id}"`, 'g'), `htmlFor={${varName}}`);
      });
    }
  }

  fs.writeFileSync(filePath, content);
  console.log(`✓ Fixed ${filePath}`);
}

// Process all files
filesToFix.forEach((file) => {
  const fullPath = path.join(process.cwd(), file);
  if (fs.existsSync(fullPath)) {
    fixFile(fullPath);
  } else {
    console.log(`⚠ File not found: ${file}`);
  }
});

console.log('\n✅ Done! Run "npx biome check src" to verify fixes.');
