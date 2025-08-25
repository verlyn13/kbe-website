import { describe, expect, it } from 'vitest';
import { POST } from '../route';

const validEvent = {
  email: 'test@example.com',
  timestamp: 1234567890,
  event: 'delivered',
  sg_event_id: 'event123',
  sg_message_id: 'msg123',
};

describe('SendGrid webhook route', () => {
  it('returns 200 for valid payload', async () => {
    const req = new Request('http://localhost/api/webhooks/sendgrid', {
      method: 'POST',
      body: JSON.stringify([validEvent]),
      headers: { 'content-type': 'application/json' },
    });

    const res = await POST(req as any);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual({ received: true });
  });

  it('returns 400 for invalid payload', async () => {
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const req = new Request('http://localhost/api/webhooks/sendgrid', {
      method: 'POST',
      body: JSON.stringify([{ ...validEvent, email: 'not-an-email' }]),
      headers: { 'content-type': 'application/json' },
    });

    const res = await POST(req as any);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json).toHaveProperty('error');
    errSpy.mockRestore();
  });
});
