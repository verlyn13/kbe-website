#!/usr/bin/env node

/**
 * SendGrid verification script for initial setup
 * This sends a simple test email to verify the API key works
 */

require('dotenv').config({ path: '.env.local' });
const sgMail = require('@sendgrid/mail');

// Set API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Your verified sender email
const FROM_EMAIL = 'noreply@homerenrichment.com'; // Update this if not verified yet

// Test email
const msg = {
  to: 'test@example.com', // Change this to your email
  from: FROM_EMAIL,
  subject: 'Sending with SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
};

// Send email
sgMail
  .send(msg)
  .then(() => {
    console.log('✅ Email sent successfully!');
    console.log('Check the SendGrid dashboard to verify.');
  })
  .catch((error) => {
    console.error('❌ Error sending email:', error);
    if (error.response) {
      console.error(error.response.body);
    }
  });