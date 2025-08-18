'use server';

import { sendWelcomeEmail } from '@/lib/sendgrid-email-service';

export async function sendWelcomeEmailAction(email: string, name: string) {
  try {
    await sendWelcomeEmail(email, name);
    return { success: true };
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    return { success: false, error: 'Failed to send welcome email' };
  }
}
