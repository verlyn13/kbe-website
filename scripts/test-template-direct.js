#!/usr/bin/env node

/**
 * Direct test of SendGrid template
 */

require('dotenv').config({ path: '.env.local' });
const sgMail = require('@sendgrid/mail');

const API_KEY = process.env.SENDGRID_API_KEY;
const TEMPLATE_ID = process.env.SENDGRID_TEMPLATE_WELCOME;

console.log('🔑 API Key:', API_KEY ? `${API_KEY.substring(0, 10)}...` : 'NOT FOUND');
console.log('📄 Template ID:', TEMPLATE_ID || 'NOT FOUND');

if (!API_KEY || !TEMPLATE_ID) {
  console.error('❌ Missing API key or template ID');
  process.exit(1);
}

// Set API key
sgMail.setApiKey(API_KEY);

// Send email with template
const msg = {
  to: 'jeffreyverlynjohnson@gmail.com',
  from: {
    email: 'noreply@homerenrichment.com',
    name: 'Homer Enrichment Hub',
  },
  templateId: TEMPLATE_ID,
  dynamicTemplateData: {
    firstName: 'Jeffrey',
    dashboardUrl: 'https://homerenrichment.com/dashboard',
    currentYear: new Date().getFullYear(),
  },
};

console.log('\n📧 Sending templated email...');

sgMail
  .send(msg)
  .then(() => {
    console.log('✅ Email sent successfully!');
    console.log('\nThe welcome email should arrive at jeffreyverlynjohnson@gmail.com shortly.');
    console.log('It will have the Homer Enrichment Hub branding and welcome message.');
  })
  .catch((error) => {
    console.error('❌ Error:', error.toString());
    if (error.response) {
      console.error('\nError details:', JSON.stringify(error.response.body, null, 2));
    }
  });
