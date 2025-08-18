import { describe, expect, it } from 'vitest';
import { sendGridEventSchema, sendGridWebhookSchema } from '../api';

describe('SendGrid Validation Schemas', () => {
  describe('sendGridEventSchema', () => {
    it('should validate a valid SendGrid event', () => {
      const validEvent = {
        email: 'test@example.com',
        timestamp: 1234567890,
        event: 'delivered',
        sg_event_id: 'event123',
        sg_message_id: 'msg123',
      };

      const result = sendGridEventSchema.safeParse(validEvent);
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      const invalidEvent = {
        email: 'not-an-email',
        timestamp: 1234567890,
        event: 'delivered',
        sg_event_id: 'event123',
        sg_message_id: 'msg123',
      };

      const result = sendGridEventSchema.safeParse(invalidEvent);
      expect(result.success).toBe(false);
    });

    it('should reject invalid event type', () => {
      const invalidEvent = {
        email: 'test@example.com',
        timestamp: 1234567890,
        event: 'invalid_event',
        sg_event_id: 'event123',
        sg_message_id: 'msg123',
      };

      const result = sendGridEventSchema.safeParse(invalidEvent);
      expect(result.success).toBe(false);
    });
  });

  describe('sendGridWebhookSchema', () => {
    it('should validate an array of events', () => {
      const validWebhook = [
        {
          email: 'test1@example.com',
          timestamp: 1234567890,
          event: 'delivered',
          sg_event_id: 'event1',
          sg_message_id: 'msg1',
        },
        {
          email: 'test2@example.com',
          timestamp: 1234567891,
          event: 'open',
          sg_event_id: 'event2',
          sg_message_id: 'msg2',
        },
      ];

      const result = sendGridWebhookSchema.safeParse(validWebhook);
      expect(result.success).toBe(true);
    });
  });
});
