/**
 * SendGrid Email Service for Homer Enrichment Hub
 * Uses dynamic templates created via sync-sendgrid-templates script
 */

import sgMail from '@sendgrid/mail';
import { sendGridTemplates, templateTestData } from './sendgrid-templates';

// Initialize SendGrid with API key - will be set when needed
function ensureApiKey() {
  if (!sgMail.apiKey && process.env.SENDGRID_API_KEY) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  }
}

// Template IDs from environment variables - loaded dynamically
function getTemplateId(key: string): string | undefined {
  const templateIds = {
    magicLink: process.env.SENDGRID_TEMPLATE_MAGIC_LINK,
    welcome: process.env.SENDGRID_TEMPLATE_WELCOME,
    passwordReset: process.env.SENDGRID_TEMPLATE_PASSWORD_RESET,
    announcement: process.env.SENDGRID_TEMPLATE_ANNOUNCEMENT,
    registrationConfirmation: process.env.SENDGRID_TEMPLATE_REGISTRATION_CONFIRMATION,
  };
  return templateIds[key as keyof typeof templateIds];
}

// Default from address
const DEFAULT_FROM = {
  email: 'noreply@homerenrichment.com',
  name: 'Homer Enrichment Hub',
};

interface SendEmailOptions {
  to: string | string[];
  templateKey: 'magicLink' | 'welcome' | 'passwordReset' | 'announcement' | 'registrationConfirmation';
  dynamicData: Record<string, any>;
  from?: { email: string; name?: string };
  replyTo?: { email: string; name?: string };
  categories?: string[];
  customArgs?: Record<string, string>;
}

/**
 * Send an email using a SendGrid dynamic template
 */
export async function sendTemplatedEmail({
  to,
  templateKey,
  dynamicData,
  from = DEFAULT_FROM,
  replyTo,
  categories = [],
  customArgs = {},
}: SendEmailOptions) {
  ensureApiKey();
  
  const templateId = getTemplateId(templateKey);
  
  if (!templateId) {
    throw new Error(`Template ID not found for key: ${templateKey}. Run 'npm run sync-templates' and add the IDs to .env.local`);
  }

  // Add common dynamic data
  const enrichedData = {
    currentYear: new Date().getFullYear(),
    ...dynamicData,
  };

  const msg = {
    to,
    from,
    replyTo,
    templateId,
    dynamicTemplateData: enrichedData,
    categories: ['heh', templateKey, ...categories],
    customArgs,
  };

  try {
    await sgMail.send(msg);
    console.log(`✅ Email sent successfully using template: ${templateKey}`);
  } catch (error) {
    console.error(`❌ Error sending email with template ${templateKey}:`, error);
    throw error;
  }
}

/**
 * Send magic link sign-in email
 */
export async function sendMagicLinkEmail(
  email: string, 
  magicLinkUrl: string,
  firstName?: string
) {
  return sendTemplatedEmail({
    to: email,
    templateKey: 'magicLink',
    dynamicData: {
      firstName,
      magicLinkUrl,
    },
    categories: ['auth', 'magic-link'],
  });
}

/**
 * Send welcome email to new users
 */
export async function sendWelcomeEmail(
  email: string,
  firstName?: string
) {
  return sendTemplatedEmail({
    to: email,
    templateKey: 'welcome',
    dynamicData: {
      firstName,
      dashboardUrl: 'https://homerenrichment.com/dashboard',
    },
    categories: ['onboarding', 'welcome'],
  });
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(
  email: string,
  resetUrl: string,
  firstName?: string
) {
  return sendTemplatedEmail({
    to: email,
    templateKey: 'passwordReset',
    dynamicData: {
      firstName,
      resetUrl,
    },
    categories: ['auth', 'password-reset'],
  });
}

/**
 * Send announcement email
 */
export async function sendAnnouncementEmail(
  recipients: string | string[],
  title: string,
  content: string,
  firstName?: string
) {
  return sendTemplatedEmail({
    to: recipients,
    templateKey: 'announcement',
    dynamicData: {
      firstName,
      announcementTitle: title,
      announcementContent: content,
      announcementUrl: 'https://homerenrichment.com/announcements',
    },
    categories: ['announcement'],
    customArgs: {
      announcementTitle: title,
    },
  });
}

/**
 * Send registration confirmation email
 */
export async function sendRegistrationConfirmationEmail(
  email: string,
  data: {
    guardianName?: string;
    studentName: string;
    studentGrade: string;
    studentSchool: string;
    programName: string;
    startDate?: string;
    schedule?: string;
  }
) {
  return sendTemplatedEmail({
    to: email,
    templateKey: 'registrationConfirmation',
    dynamicData: {
      ...data,
      dashboardUrl: 'https://homerenrichment.com/dashboard',
    },
    categories: ['registration', 'confirmation'],
    customArgs: {
      programName: data.programName,
      studentName: data.studentName,
    },
  });
}

/**
 * Test email templates (for development)
 */
export async function testEmailTemplate(
  templateKey: 'magicLink' | 'welcome' | 'passwordReset' | 'announcement' | 'registrationConfirmation',
  testEmail: string
) {
  const testData = templateTestData[templateKey];
  
  if (!testData) {
    throw new Error(`No test data found for template: ${templateKey}`);
  }

  console.log(`📧 Sending test email for template: ${templateKey} to ${testEmail}`);
  
  return sendTemplatedEmail({
    to: testEmail,
    templateKey,
    dynamicData: testData,
    categories: ['test'],
  });
}

/**
 * Preview template content locally (without sending)
 */
export function previewTemplate(templateKey: keyof typeof sendGridTemplates) {
  const template = sendGridTemplates[templateKey];
  const testData = templateTestData[templateKey] || {};
  
  if (!template) {
    throw new Error(`Template not found: ${templateKey}`);
  }

  console.log('\n📋 Template Preview');
  console.log('==================');
  console.log(`Name: ${template.name}`);
  console.log(`Subject: ${template.subject}`);
  console.log('\nTest Data:');
  console.log(JSON.stringify(testData, null, 2));
  console.log('\nHTML Preview:');
  console.log('(Open in browser for best results)');
  console.log('\nPlain Text Preview:');
  console.log(template.plain_content);
  
  return {
    html: template.html_content,
    text: template.plain_content,
    testData,
  };
}