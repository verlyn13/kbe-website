import { emailTemplates } from './email-templates';

/**
 * Email service for sending custom emails
 * Currently uses Firebase's built-in email service
 * TODO: Integrate with SendGrid for custom domain sending
 */

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
}

/**
 * Send email using Firebase Authentication
 * Note: This currently uses Firebase's email service
 * Future: Will be updated to use SendGrid or custom SMTP
 */
export async function sendEmail(options: EmailOptions): Promise<{ success: boolean; error?: any }> {
  try {
    // For now, Firebase handles email sending through its authentication service
    // This is a placeholder for when we implement custom email sending
    console.log('Email would be sent:', {
      to: options.to,
      subject: options.subject,
      from: options.from || 'Homer Enrichment Hub <noreply@homerconnect.com>',
    });

    // TODO: Implement actual email sending via:
    // 1. SendGrid API
    // 2. Firebase Extension (Trigger Email from Firestore)
    // 3. Custom Cloud Function with Nodemailer

    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}

/**
 * Send a magic link email with custom template
 * Note: Currently, Firebase handles magic link emails automatically
 * This function prepares for future custom implementation
 */
export async function sendMagicLinkEmail(
  email: string,
  link: string,
  userName?: string
): Promise<{ success: boolean; error?: any }> {
  const subject = 'Sign in to Homer Enrichment Hub';
  const html = emailTemplates.magicLink.html(link, userName);
  const text = emailTemplates.magicLink.text(link, userName);

  return sendEmail({
    to: email,
    subject,
    html,
    text,
    from: 'Homer Enrichment Hub <noreply@homerconnect.com>',
    replyTo: 'info@homerconnect.com',
  });
}

/**
 * Send a welcome email to new users
 */
export async function sendWelcomeEmail(
  email: string,
  userName?: string
): Promise<{ success: boolean; error?: any }> {
  const subject = 'Welcome to Homer Enrichment Hub!';
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #008080;">Welcome to Homer Enrichment Hub!</h1>
      <p>Hi ${userName || 'there'},</p>
      <p>Thank you for joining our enrichment programs. We're excited to have you as part of our community!</p>
      <p>Here's what you can do next:</p>
      <ul>
        <li>Complete your profile</li>
        <li>Register your students</li>
        <li>View upcoming programs and events</li>
        <li>Access resources and announcements</li>
      </ul>
      <p>If you have any questions, feel free to reach out to us.</p>
      <p>Best regards,<br>The Homer Enrichment Hub Team</p>
    </div>
  `;

  const text = `
    Welcome to Homer Enrichment Hub!
    
    Hi ${userName || 'there'},
    
    Thank you for joining our enrichment programs. We're excited to have you as part of our community!
    
    Here's what you can do next:
    - Complete your profile
    - Register your students
    - View upcoming programs and events
    - Access resources and announcements
    
    If you have any questions, feel free to reach out to us.
    
    Best regards,
    The Homer Enrichment Hub Team
  `;

  return sendEmail({
    to: email,
    subject,
    html,
    text,
    from: 'Homer Enrichment Hub <noreply@homerconnect.com>',
    replyTo: 'info@homerconnect.com',
  });
}