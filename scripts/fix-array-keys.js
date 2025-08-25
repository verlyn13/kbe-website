#!/usr/bin/env node

/**
 * Fix array index keys by using stable identifiers
 */

const fs = require('fs');
const path = require('path');

const fixes = [
  {
    file: 'src/app/profile/page.tsx',
    pattern: /\{formData\.children\.map\(\(child, index\) => \(/,
    replacement: '{formData.children.map((child) => (',
    keyPattern: /key=\{index\}/,
    keyReplacement: 'key={`child-${child.id || child.firstName}-${child.lastName}`}'
  },
  {
    file: 'src/app/auth-status/page.tsx',
    pattern: /\{checks\.map\(\(check, index\) => \(/,
    replacement: '{checks.map((check) => (',
    keyPattern: /key=\{index\}/,
    keyReplacement: 'key={check.name}'
  },
  {
    file: 'src/app/system-status/page.tsx',
    pattern: /\{checks\.map\(\(check, index\) => \(/,
    replacement: '{checks.map((check) => (',
    keyPattern: /key=\{index\}/,
    keyReplacement: 'key={check.name}'
  },
  {
    file: 'src/app/schedule/page.tsx',
    pattern: /schedule\.specialEvents\.map\(\(event, index\) => \(/,
    replacement: 'schedule.specialEvents.map((event) => (',
    keyPattern: /key=\{index\}/,
    keyReplacement: 'key={`event-${event.date}-${event.title}`}'
  },
  {
    file: 'src/components/registration/add-students.tsx',
    pattern: /fields\.map\(\(field, index\) => \(/,
    replacement: 'fields.map((field) => (',
    keyPattern: /key=\{field\.id\}/,
    keyReplacement: 'key={field.id}' // Already using field.id, good!
  }
];

fixes.forEach(({ file, pattern, replacement, keyPattern, keyReplacement }) => {
  const fullPath = path.join(process.cwd(), file);
  
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    
    if (pattern && replacement) {
      content = content.replace(pattern, replacement);
    }
    
    if (keyPattern && keyReplacement) {
      content = content.replace(keyPattern, keyReplacement);
    }
    
    fs.writeFileSync(fullPath, content);
    console.log(`✓ Fixed ${file}`);
  } else {
    console.log(`⚠ File not found: ${file}`);
  }
});

console.log('\n✅ Array key fixes complete!');