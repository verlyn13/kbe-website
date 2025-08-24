import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as sg from '@sendgrid/mail';
import { sendWelcomeEmail, sendTemplatedEmail } from '@/lib/sendgrid-email-service';

vi.mock('@sendgrid/mail', () => ({
  default: { setApiKey: vi.fn(), send: vi.fn(async () => [{ statusCode: 202 }]) },
}));

const sgMail = (sg as unknown as { default: { send: any; setApiKey: any } }).default;

describe('SendGrid email contract', () => {
  beforeEach(() => {
    process.env.SENDGRID_API_KEY = 'SG.xxx';
    process.env.SENDGRID_TEMPLATE_WELCOME = 'tmpl_welcome_123';
  });

  it('uses correct templateId and dynamic data for welcome email', async () => {
    await sendWelcomeEmail('user@example.com', 'Jane');
    expect(sgMail.send).toHaveBeenCalledTimes(1);
    const arg = sgMail.send.mock.calls[0][0];
    expect(arg.templateId).toBe('tmpl_welcome_123');
    expect(arg.dynamicTemplateData).toMatchObject({ firstName: 'Jane' });
    expect(arg.categories).toContain('welcome');
  });

  it('throws if template id missing', async () => {
    delete process.env.SENDGRID_TEMPLATE_WELCOME;
    await expect(sendWelcomeEmail('user@example.com', 'Jane')).rejects.toThrow(
      /Template ID not found/i
    );
  });
});
