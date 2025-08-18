export const emailTemplates = {
  magicLink: {
    subject: 'Sign in to Homer Enrichment Hub',
    html: (url: string, recipientName?: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sign in to Homer Enrichment Hub</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: #f5f5f5;
      color: #333;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, #008080 0%, #006666 100%);
      color: white;
      padding: 40px 30px;
      text-align: center;
    }
    .logo {
      font-size: 28px;
      font-weight: bold;
      margin-bottom: 10px;
    }
    .tagline {
      font-size: 16px;
      opacity: 0.9;
    }
    .content {
      padding: 40px 30px;
    }
    .greeting {
      font-size: 20px;
      margin-bottom: 20px;
      color: #008080;
    }
    .message {
      font-size: 16px;
      line-height: 1.6;
      margin-bottom: 30px;
    }
    .button-container {
      text-align: center;
      margin: 40px 0;
    }
    .button {
      display: inline-block;
      padding: 16px 32px;
      background-color: #008080;
      color: white;
      text-decoration: none;
      border-radius: 8px;
      font-size: 18px;
      font-weight: 600;
      box-shadow: 0 4px 6px rgba(0, 128, 128, 0.2);
      transition: all 0.3s ease;
    }
    .button:hover {
      background-color: #006666;
      box-shadow: 0 6px 8px rgba(0, 128, 128, 0.3);
    }
    .security-note {
      background-color: #f0f8f8;
      border-left: 4px solid #008080;
      padding: 15px 20px;
      margin: 30px 0;
      font-size: 14px;
      color: #555;
    }
    .link-text {
      margin-top: 20px;
      padding: 20px;
      background-color: #f5f5f5;
      border-radius: 4px;
      word-break: break-all;
      font-family: monospace;
      font-size: 12px;
      color: #666;
    }
    .footer {
      background-color: #f5f5f5;
      padding: 30px;
      text-align: center;
      font-size: 14px;
      color: #666;
    }
    .footer a {
      color: #008080;
      text-decoration: none;
    }
    .footer a:hover {
      text-decoration: underline;
    }
    .divider {
      height: 1px;
      background-color: #e0e0e0;
      margin: 20px 0;
    }
    @media only screen and (max-width: 600px) {
      .container {
        width: 100%;
      }
      .header {
        padding: 30px 20px;
      }
      .content {
        padding: 30px 20px;
      }
      .button {
        padding: 14px 28px;
        font-size: 16px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">🏔️ Homer Enrichment Hub</div>
      <div class="tagline">Your Gateway to MathCounts & Enrichment Programs</div>
    </div>
    
    <div class="content">
      <div class="greeting">
        Hello${recipientName ? ` ${recipientName}` : ''}! 👋
      </div>
      
      <div class="message">
        We received a request to sign in to your Homer Enrichment Hub account. 
        Click the button below to complete your sign-in. This link will expire in 1 hour for your security.
      </div>
      
      <div class="button-container">
        <a href="${url}" class="button">Sign In to Your Account</a>
      </div>
      
      <div class="security-note">
        <strong>🔒 Security Note:</strong> This is a secure, one-time sign-in link. 
        If you didn't request this email, you can safely ignore it. 
        No one else can access your account without clicking this link.
      </div>
      
      <div class="divider"></div>
      
      <p style="font-size: 14px; color: #666;">
        Having trouble with the button? Copy and paste this link into your browser:
      </p>
      
      <div class="link-text">${url}</div>
    </div>
    
    <div class="footer">
      <p>
        © ${new Date().getFullYear()} Homer Enrichment Hub<br>
        Enriching young minds in Homer, Alaska
      </p>
      <p style="margin-top: 15px;">
        <a href="https://homerenrichment.com">Visit our website</a> • 
        <a href="mailto:support@homerenrichment.com">Contact Support</a>
      </p>
      <p style="margin-top: 15px; font-size: 12px; color: #999;">
        This email was sent by Homer Enrichment Hub. 
        Please do not reply to this email as this mailbox is not monitored.
      </p>
    </div>
  </div>
</body>
</html>
    `,
    text: (url: string, recipientName?: string) => `
Hello${recipientName ? ` ${recipientName}` : ''}!

We received a request to sign in to your Homer Enrichment Hub account.

Click this link to sign in:
${url}

This link will expire in 1 hour for your security.

Security Note: This is a secure, one-time sign-in link. If you didn't request this email, you can safely ignore it. No one else can access your account without clicking this link.

---
© ${new Date().getFullYear()} Homer Enrichment Hub
Enriching young minds in Homer, Alaska

Visit our website: https://homerenrichment.com
Contact Support: support@homerenrichment.com

This email was sent by Homer Enrichment Hub. Please do not reply to this email as this mailbox is not monitored.
    `
  },
  
  welcome: {
    subject: 'Welcome to Homer Enrichment Hub!',
    html: (recipientName: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Homer Enrichment Hub</title>
  <style>
    /* Same styles as magicLink template */
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: #f5f5f5;
      color: #333;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, #008080 0%, #006666 100%);
      color: white;
      padding: 40px 30px;
      text-align: center;
    }
    .logo {
      font-size: 28px;
      font-weight: bold;
      margin-bottom: 10px;
    }
    .content {
      padding: 40px 30px;
    }
    .welcome-box {
      background-color: #f0f8f8;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
      text-align: center;
    }
    .feature {
      margin: 20px 0;
      padding: 15px;
      border-left: 3px solid #008080;
    }
    .feature-title {
      font-weight: bold;
      color: #008080;
      margin-bottom: 5px;
    }
    .footer {
      background-color: #f5f5f5;
      padding: 30px;
      text-align: center;
      font-size: 14px;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">🏔️ Homer Enrichment Hub</div>
    </div>
    
    <div class="content">
      <div class="welcome-box">
        <h1 style="color: #008080; margin: 0;">Welcome, ${recipientName}! 🎉</h1>
        <p>Your account has been successfully created.</p>
      </div>
      
      <p>We're excited to have you join the Homer Enrichment Hub community! Here's what you can do with your new account:</p>
      
      <div class="feature">
        <div class="feature-title">📚 Register for Programs</div>
        <div>Enroll your students in MathCounts and other enrichment programs</div>
      </div>
      
      <div class="feature">
        <div class="feature-title">📅 View Schedules</div>
        <div>Stay up-to-date with program schedules and important dates</div>
      </div>
      
      <div class="feature">
        <div class="feature-title">📢 Receive Updates</div>
        <div>Get important announcements and program information</div>
      </div>
      
      <div class="feature">
        <div class="feature-title">👥 Manage Your Profile</div>
        <div>Keep your contact information current and manage your preferences</div>
      </div>
      
      <div style="text-align: center; margin-top: 40px;">
        <a href="https://homerenrichment.com/dashboard" style="display: inline-block; padding: 16px 32px; background-color: #008080; color: white; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: 600;">
          Go to Your Dashboard
        </a>
      </div>
    </div>
    
    <div class="footer">
      <p>
        © ${new Date().getFullYear()} Homer Enrichment Hub<br>
        Enriching young minds in Homer, Alaska
      </p>
    </div>
  </div>
</body>
</html>
    `,
    text: (recipientName: string) => `
Welcome to Homer Enrichment Hub, ${recipientName}! 🎉

Your account has been successfully created.

We're excited to have you join the Homer Enrichment Hub community! Here's what you can do with your new account:

📚 Register for Programs
   Enroll your students in MathCounts and other enrichment programs

📅 View Schedules
   Stay up-to-date with program schedules and important dates

📢 Receive Updates
   Get important announcements and program information

👥 Manage Your Profile
   Keep your contact information current and manage your preferences

Visit your dashboard: https://homerenrichment.com/dashboard

---
© ${new Date().getFullYear()} Homer Enrichment Hub
Enriching young minds in Homer, Alaska
    `
  }
};

// Helper function to send custom emails
export async function sendCustomEmail(
  to: string,
  template: 'magicLink' | 'welcome',
  data?: { url?: string; recipientName?: string }
) {
  const emailTemplate = emailTemplates[template];
  
  // This would integrate with your email service (SendGrid, etc.)
  // For now, this is a placeholder showing the structure
  const emailData = {
    to,
    subject: emailTemplate.subject,
    html: template === 'magicLink' 
      ? emailTemplate.html(data?.url || '', data?.recipientName)
      : emailTemplate.html(data?.recipientName || ''),
    text: template === 'magicLink'
      ? emailTemplate.text(data?.url || '', data?.recipientName)
      : emailTemplate.text(data?.recipientName || ''),
  };
  
  return emailData;
}