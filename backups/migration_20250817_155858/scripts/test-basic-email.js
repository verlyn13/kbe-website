#!/usr/bin/env node

/**
 * Basic SendGrid test to verify API key works
 */

require('dotenv').config({ path: '.env.local' });
const sgMail = require('@sendgrid/mail');

// Set API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

console.log('🔑 API Key loaded:', process.env.SENDGRID_API_KEY ? 'Yes' : 'No');
console.log('📧 Sending test email to: jeffreyverlynjohnson@gmail.com');

// Test email
const msg = {
  to: 'jeffreyverlynjohnson@gmail.com',
  from: 'noreply@homerconnect.com', // This needs to be verified
  subject: 'Homer Enrichment Hub - SendGrid Test',
  text: 'This is a test email from Homer Enrichment Hub to verify SendGrid integration.',
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #008080;">Homer Enrichment Hub</h2>
      <p>This is a test email to verify SendGrid integration.</p>
      <p style="color: #666;">If you received this, the integration is working!</p>
    </div>
  `,
};

// Send email
sgMail
  .send(msg)
  .then(() => {
    console.log('✅ Email sent successfully!');
    console.log('\nNext steps:');
    console.log('1. Check your inbox at jeffreyverlynjohnson@gmail.com');
    console.log('2. Go back to SendGrid setup and click "Verify"');
    console.log('3. Once verified, we can set up templates');
  })
  .catch((error) => {
    console.error('❌ Error sending email:', error.toString());
    if (error.response) {
      console.error('\nError details:', JSON.stringify(error.response.body, null, 2));
      
      if (error.response.body.errors) {
        error.response.body.errors.forEach(err => {
          if (err.message.includes('from')) {
            console.log('\n⚠️  Sender verification needed:');
            console.log('   1. Go to SendGrid → Settings → Sender Authentication');
            console.log('   2. Add "noreply@homerconnect.com" as a verified sender');
            console.log('   3. Or complete domain authentication for homerconnect.com');
          }
        });
      }
    }
  });