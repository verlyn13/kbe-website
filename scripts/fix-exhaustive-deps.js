#!/usr/bin/env node

/**
 * Fix useExhaustiveDependencies issues by wrapping functions with useCallback
 */

const fs = require('node:fs');
const path = require('node:path');

const fixes = [
  {
    file: 'src/app/admin/communications/page.tsx',
    functionName: 'loadAnnouncements',
    dependencies: ['user'],
  },
  {
    file: 'src/app/admin/registrations/page.tsx',
    functionName: 'loadRegistrations',
    dependencies: [],
  },
  {
    file: 'src/app/admin/reports/page.tsx',
    functionName: 'loadRegistrationData',
    dependencies: [],
  },
  {
    file: 'src/app/admin/users/page.tsx',
    functionName: 'loadUsers',
    dependencies: [],
  },
  {
    file: 'src/app/admin/waivers/page.tsx',
    functionName: 'loadStudents',
    dependencies: [],
  },
  {
    file: 'src/app/announcements/page.tsx',
    functionName: 'loadAnnouncements',
    dependencies: ['user?.uid'],
  },
  {
    file: 'src/app/auth-diagnostics/page.tsx',
    functionName: 'checkAuth',
    dependencies: [],
  },
  {
    file: 'src/app/debug-announcements/page.tsx',
    functionName: 'loadAnnouncements',
    dependencies: [],
  },
  {
    file: 'src/app/debug-auth/page.tsx',
    functionName: 'checkIndexedDB',
    dependencies: [],
  },
];

fixes.forEach(({ file, functionName, dependencies }) => {
  const fullPath = path.join(process.cwd(), file);

  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');

    // Check if already has useCallback import
    if (!content.includes('useCallback')) {
      // Add useCallback to React import
      content = content.replace(/import \{ ([^}]+) \} from 'react'/, (match, imports) => {
        const importList = imports.split(',').map((i) => i.trim());
        if (!importList.includes('useCallback')) {
          importList.push('useCallback');
        }
        return `import { ${importList.join(', ')} } from 'react'`;
      });
    }

    // Wrap function with useCallback if not already wrapped
    const functionPattern = new RegExp(`const ${functionName} = async \\(\\) => \\{`);
    if (
      content.match(functionPattern) &&
      !content.includes(`const ${functionName} = useCallback`)
    ) {
      const depsString = dependencies.length > 0 ? dependencies.join(', ') : '';
      content = content.replace(
        functionPattern,
        `const ${functionName} = useCallback(async () => {`
      );

      // Find the end of the function and add dependencies
      const functionStartIndex = content.indexOf(
        `const ${functionName} = useCallback(async () => {`
      );
      if (functionStartIndex !== -1) {
        let braceCount = 0;
        let inFunction = false;
        let i = functionStartIndex;

        for (; i < content.length; i++) {
          if (content[i] === '{') {
            braceCount++;
            inFunction = true;
          } else if (content[i] === '}' && inFunction) {
            braceCount--;
            if (braceCount === 0) {
              // Found the closing brace
              content = `${content.slice(0, i + 1)}, [${depsString}])${content.slice(i + 1)}`;
              break;
            }
          }
        }
      }
    }

    fs.writeFileSync(fullPath, content);
    console.log(`✓ Fixed ${file}`);
  } else {
    console.log(`⚠ File not found: ${file}`);
  }
});

console.log('\n✅ useExhaustiveDependencies fixes complete!');
