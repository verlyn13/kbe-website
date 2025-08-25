#!/usr/bin/env node

/**
 * Test SendGrid email templates
 * Usage: npm run test-email -- [template] [email]
 * Example: npm run test-email -- magicLink test@example.com
 */

import * as dotenv from 'dotenv';
import { previewTemplate, testEmailTemplate } from '../src/lib/sendgrid-email-service';
import { sendGridTemplates } from '../src/lib/sendgrid-templates';

// Load environment variables
dotenv.config({ path: '.env.local' });

const args = process.argv.slice(2);
const templateKey = args[0];
const testEmail = args[1];

const availableTemplates = Object.keys(sendGridTemplates);
const allowedTemplates = [
  'magicLink',
  'welcome',
  'passwordReset',
  'announcement',
  'registrationConfirmation',
] as const;
type TemplateKey = (typeof allowedTemplates)[number];

async function main() {
  if (!templateKey) {
    console.log('📧 SendGrid Email Template Tester\n');
    console.log('Usage: npm run test-email -- [template] [email]\n');
    console.log('Available templates:');
    availableTemplates.forEach((key) => {
      console.log(`  - ${key} (${sendGridTemplates[key as keyof typeof sendGridTemplates].name})`);
    });
    console.log('\nExample: npm run test-email -- magicLink test@example.com');
    console.log('\nTo preview without sending: npm run test-email -- magicLink preview');
    process.exit(0);
  }

  if (!availableTemplates.includes(templateKey)) {
    console.error(`❌ Invalid template key: ${templateKey}`);
    console.log('\nAvailable templates:', availableTemplates.join(', '));
    process.exit(1);
  }

  if (testEmail === 'preview' || !testEmail) {
    console.log('👁️  Preview mode - template will not be sent\n');
    const preview = previewTemplate(templateKey as keyof typeof sendGridTemplates);

    // Create HTML preview file
    const fs = await import('node:fs');
    const path = await import('node:path');
    const previewPath = path.join(process.cwd(), `preview-${templateKey}.html`);

    await fs.promises.writeFile(previewPath, preview.html);
    console.log(`\n✅ HTML preview saved to: ${previewPath}`);
    console.log('Open this file in your browser to see the rendered template.\n');

    return;
  }

  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(testEmail)) {
    console.error(`❌ Invalid email address: ${testEmail}`);
    process.exit(1);
  }

  try {
    console.log(`📨 Sending test email...`);
    console.log(`Template: ${templateKey}`);
    console.log(`To: ${testEmail}\n`);

    await testEmailTemplate(templateKey as TemplateKey, testEmail);

    console.log('\n✅ Test email sent successfully!');
    console.log('Check your inbox (and spam folder) for the email.');
  } catch (error) {
    console.error('\n❌ Error sending test email:', error);
    process.exit(1);
  }
}

main();
