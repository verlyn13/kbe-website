'use server';

import { logApiError } from '@/lib/api-error-handler';
import { sendWelcomeEmail } from '@/lib/sendgrid-email-service';

export async function sendWelcomeEmailAction(email: string, name: string) {
  try {
    await sendWelcomeEmail(email, name);

    console.log(`[SEND_WELCOME_EMAIL] Sent welcome email to ${email} (${name})`);

    return { success: true };
  } catch (error) {
    logApiError(error, {
      context: 'SEND_WELCOME_EMAIL',
      additionalData: {
        email,
        name,
      },
    });

    return { success: false, error: 'Failed to send welcome email' };
  }
}
