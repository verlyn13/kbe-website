/**
 * Custom email templates for Homer Enrichment Hub
 * These templates provide professional, branded emails for all authentication flows
 */

const colors = {
  primary: '#008080', // Deep teal - bay waters
  secondary: '#B8860B', // Muted gold - Kachemak Gold
  background: '#E0EEEE', // Light grayish-teal
  text: '#333333',
  lightText: '#666666',
};

const baseStyles = `
  <style>
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: ${colors.text};
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: linear-gradient(135deg, ${colors.primary} 0%, #006666 100%);
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
      background-color: ${colors.primary};
      color: white !important;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      margin: 20px 0;
    }
    .button:hover {
      background-color: #006666;
    }
    .footer {
      background-color: ${colors.background};
      padding: 30px;
      text-align: center;
      font-size: 13px;
      color: ${colors.lightText};
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
      border-left: 4px solid ${colors.secondary};
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

const headerHtml = `
  <div class="header">
    <div class="logo">🏔️ Homer Enrichment Hub</div>
    <div class="tagline">Empowering Young Minds in Homer, Alaska</div>
  </div>
`;

const footerHtml = `
  <div class="footer">
    <p style="margin: 0 0 10px 0;">
      <strong>Homer Enrichment Hub</strong><br>
      Formerly Kachemak Bay Explorers<br>
      Homer, Alaska
    </p>
    <p style="margin: 10px 0;">
      <a href="https://homerconnect.com" style="color: ${colors.primary};">Visit our website</a> |
      <a href="https://homerconnect.com/contact" style="color: ${colors.primary};">Contact us</a>
    </p>
    <p style="margin: 10px 0 0 0; font-size: 12px; color: #999;">
      © ${new Date().getFullYear()} Homer Enrichment Hub. All rights reserved.<br>
      You're receiving this email because you have an account with Homer Enrichment Hub.
    </p>
  </div>
`;

export const homerEmailTemplates = {
  magicLink: {
    subject: 'Sign in to Homer Enrichment Hub',
    html: (url: string, recipientName?: string) => `
      <!DOCTYPE html>
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
            <h2 style="color: ${colors.primary}; margin-top: 0;">Welcome back${recipientName ? `, ${recipientName}` : ''}!</h2>
            
            <p>We received a request to sign in to your Homer Enrichment Hub account. Click the button below to securely access your dashboard:</p>
            
            <div style="text-align: center;">
              <a href="${url}" class="button">Sign In to Your Account</a>
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
            
            <p style="color: ${colors.lightText}; font-size: 14px;">
              Having trouble? Copy and paste this link into your browser:<br>
              <code style="background: #f5f5f5; padding: 5px; word-break: break-all;">${url}</code>
            </p>
          </div>
          ${footerHtml}
        </div>
      </body>
      </html>
    `,
    text: (url: string, recipientName?: string) => `
Welcome back${recipientName ? `, ${recipientName}` : ''}!

We received a request to sign in to your Homer Enrichment Hub account.

Sign in here: ${url}

This link will expire in 1 hour and can only be used once. If you didn't request this email, you can safely ignore it.

After signing in, you'll be able to:
- View and manage student registrations
- Access program schedules and announcements
- Update your family profile
- Download resources and materials

Homer Enrichment Hub
Formerly Kachemak Bay Explorers
Homer, Alaska

© ${new Date().getFullYear()} Homer Enrichment Hub. All rights reserved.
    `,
  },

  welcome: {
    subject: 'Welcome to Homer Enrichment Hub!',
    html: (recipientName?: string) => `
      <!DOCTYPE html>
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
            <h2 style="color: ${colors.primary}; margin-top: 0;">Welcome to Our Community${recipientName ? `, ${recipientName}` : ''}! 🎉</h2>
            
            <p>We're thrilled to have you join the Homer Enrichment Hub family! Our programs are designed to inspire curiosity, foster learning, and build lasting connections in our community.</p>
            
            <div style="text-align: center;">
              <a href="https://homerconnect.com/dashboard" class="button">Visit Your Dashboard</a>
            </div>
            
            <h3 style="color: ${colors.primary};">Getting Started</h3>
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
            
            <h3 style="color: ${colors.primary};">Need Help?</h3>
            <p>We're here to support you! If you have any questions about:</p>
            <ul>
              <li>Program registration or schedules</li>
              <li>Technical issues with your account</li>
              <li>General inquiries about our offerings</li>
            </ul>
            <p>Feel free to reach out at <a href="mailto:info@homerconnect.com" style="color: ${colors.primary};">info@homerconnect.com</a></p>
            
            <div class="divider"></div>
            
            <p style="text-align: center; color: ${colors.lightText};">
              <em>"Empowering young minds to explore, discover, and grow in the beautiful setting of Homer, Alaska."</em>
            </p>
          </div>
          ${footerHtml}
        </div>
      </body>
      </html>
    `,
    text: (recipientName?: string) => `
Welcome to Our Community${recipientName ? `, ${recipientName}` : ''}!

We're thrilled to have you join the Homer Enrichment Hub family! Our programs are designed to inspire curiosity, foster learning, and build lasting connections in our community.

Visit Your Dashboard: https://homerconnect.com/dashboard

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

© ${new Date().getFullYear()} Homer Enrichment Hub. All rights reserved.
    `,
  },

  passwordReset: {
    subject: 'Reset your Homer Enrichment Hub password',
    html: (url: string, recipientName?: string) => `
      <!DOCTYPE html>
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
            <h2 style="color: ${colors.primary}; margin-top: 0;">Password Reset Request</h2>
            
            <p>Hi${recipientName ? ` ${recipientName}` : ''},</p>
            
            <p>We received a request to reset the password for your Homer Enrichment Hub account. If you made this request, click the button below to create a new password:</p>
            
            <div style="text-align: center;">
              <a href="${url}" class="button">Reset Your Password</a>
            </div>
            
            <div class="info-box">
              <strong>⏰ Important:</strong><br>
              This link will expire in 1 hour for security reasons. If you need a new link, you can request another password reset.
            </div>
            
            <p><strong>Didn't request this?</strong><br>
            If you didn't ask to reset your password, you can safely ignore this email. Your password won't be changed unless you click the link above and create a new one.</p>
            
            <p style="color: ${colors.lightText}; font-size: 14px;">
              Having trouble with the button? Copy and paste this link into your browser:<br>
              <code style="background: #f5f5f5; padding: 5px; word-break: break-all;">${url}</code>
            </p>
          </div>
          ${footerHtml}
        </div>
      </body>
      </html>
    `,
    text: (url: string, recipientName?: string) => `
Password Reset Request

Hi${recipientName ? ` ${recipientName}` : ''},

We received a request to reset the password for your Homer Enrichment Hub account. If you made this request, click the link below to create a new password:

${url}

This link will expire in 1 hour for security reasons. If you need a new link, you can request another password reset.

Didn't request this?
If you didn't ask to reset your password, you can safely ignore this email. Your password won't be changed unless you click the link above and create a new one.

Homer Enrichment Hub
Formerly Kachemak Bay Explorers
Homer, Alaska

© ${new Date().getFullYear()} Homer Enrichment Hub. All rights reserved.
    `,
  },

  announcement: {
    subject: (title: string) => `Homer Enrichment Hub: ${title}`,
    html: (title: string, content: string, recipientName?: string) => `
      <!DOCTYPE html>
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
            <h2 style="color: ${colors.primary}; margin-top: 0;">${title}</h2>
            
            ${recipientName ? `<p>Dear ${recipientName},</p>` : ''}
            
            <div style="margin: 20px 0;">
              ${content}
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://homerconnect.com/announcements" class="button">View All Announcements</a>
            </div>
            
            <div class="divider"></div>
            
            <p style="font-size: 14px; color: ${colors.lightText};">
              Stay connected with all the latest updates from Homer Enrichment Hub by visiting your dashboard regularly.
            </p>
          </div>
          ${footerHtml}
        </div>
      </body>
      </html>
    `,
    text: (title: string, content: string, recipientName?: string) => `
${title}

${recipientName ? `Dear ${recipientName},\n\n` : ''}${content}

View all announcements at: https://homerconnect.com/announcements

Stay connected with all the latest updates from Homer Enrichment Hub by visiting your dashboard regularly.

Homer Enrichment Hub
Formerly Kachemak Bay Explorers
Homer, Alaska

© ${new Date().getFullYear()} Homer Enrichment Hub. All rights reserved.
    `,
  },
};