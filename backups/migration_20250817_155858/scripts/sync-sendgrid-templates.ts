#!/usr/bin/env node

/**
 * Sync email templates to SendGrid
 * Usage: npm run sync-templates
 */

import * as dotenv from 'dotenv';
import { sendGridTemplates, templateTestData } from '../src/lib/sendgrid-templates';

// Load environment variables
dotenv.config({ path: '.env.local' });

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const SENDGRID_API_URL = 'https://api.sendgrid.com/v3';

if (!SENDGRID_API_KEY) {
  console.error('❌ SENDGRID_API_KEY not found in environment variables');
  process.exit(1);
}

interface SendGridTemplate {
  id: string;
  name: string;
  generation: string;
  updated_at: string;
  versions: any[];
}

interface TemplateMapping {
  [key: string]: string; // local key -> SendGrid template ID
}

// Store template ID mappings
const templateMappings: TemplateMapping = {};

async function makeRequest(
  endpoint: string,
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE' = 'GET',
  body?: any
) {
  const response = await fetch(`${SENDGRID_API_URL}${endpoint}`, {
    method,
    headers: {
      Authorization: `Bearer ${SENDGRID_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`SendGrid API error: ${response.status} - ${error}`);
  }

  return response.json();
}

async function listTemplates(): Promise<SendGridTemplate[]> {
  console.log('📋 Fetching existing templates...');
  const data = await makeRequest('/templates?generations=dynamic');
  return data.templates || [];
}

async function createTemplate(name: string): Promise<string> {
  console.log(`📝 Creating template: ${name}`);
  const data = await makeRequest('/templates', 'POST', {
    name,
    generation: 'dynamic',
  });
  return data.id;
}

async function createTemplateVersion(
  templateId: string,
  template: any,
  testData: any
): Promise<void> {
  console.log(`📄 Creating version for template: ${template.name}`);

  await makeRequest(`/templates/${templateId}/versions`, 'POST', {
    template_id: templateId,
    name: template.name,
    subject: template.subject,
    html_content: template.html_content,
    plain_content: template.plain_content,
    test_data: JSON.stringify(testData),
    active: 1,
  });
}

async function updateTemplateVersion(
  templateId: string,
  versionId: string,
  template: any,
  testData: any
): Promise<void> {
  console.log(`🔄 Updating version for template: ${template.name}`);

  await makeRequest(`/templates/${templateId}/versions/${versionId}`, 'PATCH', {
    name: template.name,
    subject: template.subject,
    html_content: template.html_content,
    plain_content: template.plain_content,
    test_data: JSON.stringify(testData),
    active: 1,
  });
}

async function getTemplateVersions(templateId: string): Promise<any[]> {
  const data = await makeRequest(`/templates/${templateId}`);
  return data.versions || [];
}

async function syncTemplates() {
  try {
    console.log('🚀 Starting SendGrid template sync...\n');

    // Get existing templates
    const existingTemplates = await listTemplates();
    console.log(`Found ${existingTemplates.length} existing templates\n`);

    // Create a map of existing templates by name
    const existingMap = new Map(existingTemplates.map((t) => [t.name, t]));

    // Sync each template
    for (const [key, template] of Object.entries(sendGridTemplates)) {
      console.log(`\n--- Processing: ${template.name} ---`);

      const existing = existingMap.get(template.name);
      const testData = templateTestData[key] || {};

      if (existing) {
        // Template exists, update it
        console.log(`✅ Template exists (ID: ${existing.id})`);
        templateMappings[key] = existing.id;

        // Get existing versions
        const versions = await getTemplateVersions(existing.id);

        if (versions.length > 0) {
          // Update the active version
          const activeVersion = versions.find((v) => v.active === 1) || versions[0];
          await updateTemplateVersion(existing.id, activeVersion.id, template, testData);
        } else {
          // Create first version
          await createTemplateVersion(existing.id, template, testData);
        }
      } else {
        // Create new template
        const templateId = await createTemplate(template.name);
        templateMappings[key] = templateId;
        console.log(`✅ Created template (ID: ${templateId})`);

        // Create first version
        await createTemplateVersion(templateId, template, testData);
      }
    }

    // Save template mappings
    console.log('\n\n📌 Template ID Mappings:');
    console.log('Add these to your .env.local file:\n');

    for (const [key, id] of Object.entries(templateMappings)) {
      const envKey = `SENDGRID_TEMPLATE_${key
        .toUpperCase()
        .replace(/([A-Z])/g, '_$1')
        .replace(/^_/, '')}`;
      console.log(`${envKey}=${id}`);
    }

    console.log('\n✨ Template sync completed successfully!');
  } catch (error) {
    console.error('❌ Error syncing templates:', error);
    process.exit(1);
  }
}

// Run the sync
syncTemplates();
