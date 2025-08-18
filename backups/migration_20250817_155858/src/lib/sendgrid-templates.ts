/**
 * SendGrid Transactional Email Templates for Homer Enrichment Hub
 * These templates can be synced to SendGrid via API
 */

export interface EmailTemplate {
  name: string;
  subject: string;
  html_content: string;
  plain_content: string;
  generation?: 'dynamic' | 'legacy';
}

export interface TemplateVersion {
  template_id?: string;
  name: string;
  subject: string;
  html_content: string;
  plain_content: string;
  active: 1 | 0;
}

// Base styles shared across all templates
const baseStyles = `
  <style>
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333333;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: linear-gradient(135deg, #008080 0%, #006666 100%);
      color: white;
      padding: 30px 20px;
      text-align: center;
      border-radius: 8px 8px 0 0;
    }
    .logo {
      font-size: 28px;
      font-weight: bold;
      margin-bottom: 10px;
    }
    .tagline {
      font-size: 14px;
      opacity: 0.9;
    }
    .content {
      background: white;
      padding: 40px 30px;
      border: 1px solid #e0e0e0;
      border-top: none;
    }
    .button {
      display: inline-block;
      padding: 14px 32px;
      background-color: #008080;
      color: #ffffff !important;
      text-decoration: none !important;
      border-radius: 6px;
      font-weight: 600;
      margin: 20px 0;
    }
    .button:hover {
      background-color: #006666;
      color: #ffffff !important;
      text-decoration: none !important;
    }
    a.button {
      color: #ffffff !important;
      text-decoration: none !important;
    }
    .footer {
      background-color: #E0EEEE;
      padding: 30px;
      text-align: center;
      font-size: 13px;
      color: #666666;
      border-radius: 0 0 8px 8px;
      border: 1px solid #e0e0e0;
      border-top: none;
    }
    .divider {
      border-top: 1px solid #e0e0e0;
      margin: 30px 0;
    }
    .info-box {
      background-color: #f8f9fa;
      border-left: 4px solid #B8860B;
      padding: 15px;
      margin: 20px 0;
    }
    ul {
      padding-left: 20px;
    }
    li {
      margin-bottom: 8px;
    }
  </style>
`;

// Shared header HTML
const headerHtml = `
  <div class="header">
    <div class="logo">🏔️ Homer Enrichment Hub</div>
    <div class="tagline">Empowering Young Minds in Homer, Alaska</div>
  </div>
`;

// Shared footer HTML
const footerHtml = `
  <div class="footer">
    <p style="margin: 0 0 10px 0;">
      <strong>Homer Enrichment Hub</strong><br>
      Formerly Kachemak Bay Explorers<br>
      Homer, Alaska
    </p>
    <p style="margin: 10px 0;">
      <a href="https://homerconnect.com" style="color: #006666; text-decoration: underline;">Visit our website</a> |
      <a href="https://homerconnect.com/contact" style="color: #006666; text-decoration: underline;">Contact us</a>
    </p>
    <p style="margin: 10px 0 0 0; font-size: 12px; color: #999;">
      © {{currentYear}} Homer Enrichment Hub. All rights reserved.<br>
      You're receiving this email because you have an account with Homer Enrichment Hub.
    </p>
  </div>
`;

// Template definitions
export const sendGridTemplates: Record<string, EmailTemplate> = {
  magicLink: {
    name: 'HEH Magic Link Sign-in',
    subject: 'Sign in to Homer Enrichment Hub',
    generation: 'dynamic',
    html_content: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${baseStyles}
</head>
<body>
  <div class="container">
    ${headerHtml}
    <div class="content">
      <h2 style="color: #008080; margin-top: 0;">Welcome back{{#if firstName}}, {{firstName}}{{/if}}!</h2>
      
      <p>We received a request to sign in to your Homer Enrichment Hub account. Click the button below to securely access your dashboard:</p>
      
      <div style="text-align: center;">
        <a href="{{magicLinkUrl}}" class="button">Sign In to Your Account</a>
      </div>
      
      <div class="info-box">
        <strong>🔒 Security Note:</strong><br>
        This link will expire in 1 hour and can only be used once. If you didn't request this email, you can safely ignore it.
      </div>
      
      <p>After signing in, you'll be able to:</p>
      <ul>
        <li>View and manage student registrations</li>
        <li>Access program schedules and announcements</li>
        <li>Update your family profile</li>
        <li>Download resources and materials</li>
      </ul>
      
      <p style="color: #666666; font-size: 14px;">
        Having trouble? Copy and paste this link into your browser:<br>
        <code style="background: #f5f5f5; padding: 5px; word-break: break-all;">{{magicLinkUrl}}</code>
      </p>
    </div>
    ${footerHtml}
  </div>
</body>
</html>`,
    plain_content: `Welcome back{{#if firstName}}, {{firstName}}{{/if}}!

We received a request to sign in to your Homer Enrichment Hub account.

Sign in here: {{magicLinkUrl}}

This link will expire in 1 hour and can only be used once. If you didn't request this email, you can safely ignore it.

After signing in, you'll be able to:
- View and manage student registrations
- Access program schedules and announcements
- Update your family profile
- Download resources and materials

Homer Enrichment Hub
Formerly Kachemak Bay Explorers
Homer, Alaska

© {{currentYear}} Homer Enrichment Hub. All rights reserved.`,
  },

  welcome: {
    name: 'HEH Welcome Email',
    subject: 'Welcome to Homer Enrichment Hub!',
    generation: 'dynamic',
    html_content: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${baseStyles}
</head>
<body>
  <div class="container">
    ${headerHtml}
    <div class="content">
      <h2 style="color: #008080; margin-top: 0;">Welcome to Our Community{{#if firstName}}, {{firstName}}{{/if}}! 🎉</h2>
      
      <p>We're thrilled to have you join the Homer Enrichment Hub family! Our programs are designed to inspire curiosity, foster learning, and build lasting connections in our community.</p>
      
      <div style="text-align: center;">
        <a href="{{dashboardUrl}}" class="button">Visit Your Dashboard</a>
      </div>
      
      <h3 style="color: #008080;">Getting Started</h3>
      <p>Here are your next steps to make the most of our programs:</p>
      
      <ul>
        <li><strong>Complete Your Profile:</strong> Add guardian and student information</li>
        <li><strong>Browse Programs:</strong> Explore our MathCounts, enrichment, and special events</li>
        <li><strong>Register Students:</strong> Secure spots in programs that interest your family</li>
        <li><strong>Stay Connected:</strong> Watch for announcements and updates</li>
      </ul>
      
      <div class="info-box">
        <strong>📚 Current Programs Include:</strong><br>
        • MathCounts Competition Team<br>
        • Creative Writing Workshops<br>
        • Science Exploration Labs<br>
        • Art & Music Enrichment<br>
        • And much more!
      </div>
      
      <h3 style="color: #008080;">Need Help?</h3>
      <p>We're here to support you! If you have any questions about:</p>
      <ul>
        <li>Program registration or schedules</li>
        <li>Technical issues with your account</li>
        <li>General inquiries about our offerings</li>
      </ul>
      <p>Feel free to reach out at <a href="mailto:info@homerconnect.com" style="color: #008080;">info@homerconnect.com</a></p>
      
      <div class="divider"></div>
      
      <p style="text-align: center; color: #666666;">
        <em>"Empowering young minds to explore, discover, and grow in the beautiful setting of Homer, Alaska."</em>
      </p>
    </div>
    ${footerHtml}
  </div>
</body>
</html>`,
    plain_content: `Welcome to Our Community{{#if firstName}}, {{firstName}}{{/if}}!

We're thrilled to have you join the Homer Enrichment Hub family! Our programs are designed to inspire curiosity, foster learning, and build lasting connections in our community.

Visit Your Dashboard: {{dashboardUrl}}

GETTING STARTED
Here are your next steps to make the most of our programs:

• Complete Your Profile: Add guardian and student information
• Browse Programs: Explore our MathCounts, enrichment, and special events
• Register Students: Secure spots in programs that interest your family
• Stay Connected: Watch for announcements and updates

CURRENT PROGRAMS INCLUDE:
• MathCounts Competition Team
• Creative Writing Workshops
• Science Exploration Labs
• Art & Music Enrichment
• And much more!

NEED HELP?
We're here to support you! If you have any questions, feel free to reach out at info@homerconnect.com

"Empowering young minds to explore, discover, and grow in the beautiful setting of Homer, Alaska."

Homer Enrichment Hub
Formerly Kachemak Bay Explorers
Homer, Alaska

© {{currentYear}} Homer Enrichment Hub. All rights reserved.`,
  },

  passwordReset: {
    name: 'HEH Password Reset',
    subject: 'Reset your Homer Enrichment Hub password',
    generation: 'dynamic',
    html_content: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${baseStyles}
</head>
<body>
  <div class="container">
    ${headerHtml}
    <div class="content">
      <h2 style="color: #008080; margin-top: 0;">Password Reset Request</h2>
      
      <p>Hi{{#if firstName}} {{firstName}}{{/if}},</p>
      
      <p>We received a request to reset the password for your Homer Enrichment Hub account. If you made this request, click the button below to create a new password:</p>
      
      <div style="text-align: center;">
        <a href="{{resetUrl}}" class="button">Reset Your Password</a>
      </div>
      
      <div class="info-box">
        <strong>⏰ Important:</strong><br>
        This link will expire in 1 hour for security reasons. If you need a new link, you can request another password reset.
      </div>
      
      <p><strong>Didn't request this?</strong><br>
      If you didn't ask to reset your password, you can safely ignore this email. Your password won't be changed unless you click the link above and create a new one.</p>
      
      <p style="color: #666666; font-size: 14px;">
        Having trouble with the button? Copy and paste this link into your browser:<br>
        <code style="background: #f5f5f5; padding: 5px; word-break: break-all;">{{resetUrl}}</code>
      </p>
    </div>
    ${footerHtml}
  </div>
</body>
</html>`,
    plain_content: `Password Reset Request

Hi{{#if firstName}} {{firstName}}{{/if}},

We received a request to reset the password for your Homer Enrichment Hub account. If you made this request, click the link below to create a new password:

{{resetUrl}}

This link will expire in 1 hour for security reasons. If you need a new link, you can request another password reset.

Didn't request this?
If you didn't ask to reset your password, you can safely ignore this email. Your password won't be changed unless you click the link above and create a new one.

Homer Enrichment Hub
Formerly Kachemak Bay Explorers
Homer, Alaska

© {{currentYear}} Homer Enrichment Hub. All rights reserved.`,
  },

  announcement: {
    name: 'HEH Announcement',
    subject: 'Homer Enrichment Hub: {{announcementTitle}}',
    generation: 'dynamic',
    html_content: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${baseStyles}
</head>
<body>
  <div class="container">
    ${headerHtml}
    <div class="content">
      <h2 style="color: #008080; margin-top: 0;">{{announcementTitle}}</h2>
      
      {{#if firstName}}<p>Dear {{firstName}},</p>{{/if}}
      
      <div style="margin: 20px 0;">
        {{{announcementContent}}}
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="{{announcementUrl}}" class="button">View All Announcements</a>
      </div>
      
      <div class="divider"></div>
      
      <p style="font-size: 14px; color: #666666;">
        Stay connected with all the latest updates from Homer Enrichment Hub by visiting your dashboard regularly.
      </p>
    </div>
    ${footerHtml}
  </div>
</body>
</html>`,
    plain_content: `{{announcementTitle}}

{{#if firstName}}Dear {{firstName}},

{{/if}}{{announcementContent}}

View all announcements at: {{announcementUrl}}

Stay connected with all the latest updates from Homer Enrichment Hub by visiting your dashboard regularly.

Homer Enrichment Hub
Formerly Kachemak Bay Explorers
Homer, Alaska

© {{currentYear}} Homer Enrichment Hub. All rights reserved.`,
  },

  registrationConfirmation: {
    name: 'HEH Registration Confirmation',
    subject: 'Registration Confirmed: {{programName}}',
    generation: 'dynamic',
    html_content: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${baseStyles}
</head>
<body>
  <div class="container">
    ${headerHtml}
    <div class="content">
      <h2 style="color: #008080; margin-top: 0;">Registration Confirmed! 🎉</h2>
      
      <p>Hi{{#if guardianName}} {{guardianName}}{{/if}},</p>
      
      <p>Great news! {{studentName}} has been successfully registered for:</p>
      
      <div class="info-box">
        <h3 style="margin-top: 0; color: #008080;">{{programName}}</h3>
        <p style="margin: 5px 0;"><strong>Student:</strong> {{studentName}}</p>
        <p style="margin: 5px 0;"><strong>Grade:</strong> {{studentGrade}}</p>
        <p style="margin: 5px 0;"><strong>School:</strong> {{studentSchool}}</p>
        {{#if startDate}}<p style="margin: 5px 0;"><strong>Start Date:</strong> {{startDate}}</p>{{/if}}
        {{#if schedule}}<p style="margin: 5px 0;"><strong>Schedule:</strong> {{schedule}}</p>{{/if}}
      </div>
      
      <h3 style="color: #008080;">What's Next?</h3>
      <ul>
        <li>Watch your email for program updates and announcements</li>
        <li>Add important dates to your calendar</li>
        <li>Review any materials or supplies needed</li>
        <li>Contact us with any questions</li>
      </ul>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="{{dashboardUrl}}" class="button">View Registration Details</a>
      </div>
      
      <p>We're looking forward to having {{studentName}} join us!</p>
      
      <p>If you have any questions about the program, please don't hesitate to reach out to us at <a href="mailto:info@homerconnect.com" style="color: #008080;">info@homerconnect.com</a>.</p>
    </div>
    ${footerHtml}
  </div>
</body>
</html>`,
    plain_content: `Registration Confirmed!

Hi{{#if guardianName}} {{guardianName}}{{/if}},

Great news! {{studentName}} has been successfully registered for:

PROGRAM: {{programName}}
Student: {{studentName}}
Grade: {{studentGrade}}
School: {{studentSchool}}
{{#if startDate}}Start Date: {{startDate}}{{/if}}
{{#if schedule}}Schedule: {{schedule}}{{/if}}

WHAT'S NEXT?
• Watch your email for program updates and announcements
• Add important dates to your calendar
• Review any materials or supplies needed
• Contact us with any questions

View registration details: {{dashboardUrl}}

We're looking forward to having {{studentName}} join us!

If you have any questions about the program, please don't hesitate to reach out to us at info@homerconnect.com.

Homer Enrichment Hub
Formerly Kachemak Bay Explorers
Homer, Alaska

© {{currentYear}} Homer Enrichment Hub. All rights reserved.`,
  },
};

// Test data for each template (for development/preview)
export const templateTestData: Record<string, any> = {
  magicLink: {
    firstName: 'Sarah',
    magicLinkUrl: 'https://homerconnect.com/__/auth/action?mode=signIn&oobCode=abc123',
    currentYear: new Date().getFullYear(),
  },
  welcome: {
    firstName: 'Sarah',
    dashboardUrl: 'https://homerconnect.com/dashboard',
    currentYear: new Date().getFullYear(),
  },
  passwordReset: {
    firstName: 'Sarah',
    resetUrl: 'https://homerconnect.com/__/auth/action?mode=resetPassword&oobCode=abc123',
    currentYear: new Date().getFullYear(),
  },
  announcement: {
    firstName: 'Sarah',
    announcementTitle: 'Spring Registration Now Open',
    announcementContent:
      "<p>We're excited to announce that registration for our Spring 2025 programs is now open!</p><p>Visit your dashboard to see all available programs and register your students.</p>",
    announcementUrl: 'https://homerconnect.com/announcements',
    currentYear: new Date().getFullYear(),
  },
  registrationConfirmation: {
    guardianName: 'Sarah Johnson',
    studentName: 'Emma Johnson',
    studentGrade: '7th Grade',
    studentSchool: 'Homer Middle School',
    programName: 'MathCounts Competition Team',
    startDate: 'January 15, 2025',
    schedule: 'Tuesdays and Thursdays, 4:00-5:30 PM',
    dashboardUrl: 'https://homerconnect.com/dashboard',
    currentYear: new Date().getFullYear(),
  },
};
