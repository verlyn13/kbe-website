// API Validation Schemas - For SendGrid webhook and other APIs

import { z } from 'zod';

// SendGrid Event Types
export const sendGridEventSchema = z.object({
  email: z.string().email(),
  timestamp: z.number(),
  event: z.enum([
    'processed',
    'dropped',
    'delivered',
    'deferred',
    'bounce',
    'open',
    'click',
    'spamreport',
    'unsubscribe',
    'group_unsubscribe',
    'group_resubscribe',
  ]),
  sg_event_id: z.string(),
  sg_message_id: z.string(),
  category: z.array(z.string()).optional(),
  url: z.string().url().optional(),
  reason: z.string().optional(),
  status: z.string().optional(),
  response: z.string().optional(),
  attempt: z.string().optional(),
  ip: z.string().optional(),
  useragent: z.string().optional(),
  type: z.string().optional(),
});

export const sendGridWebhookSchema = z.array(sendGridEventSchema);

export type SendGridEvent = z.infer<typeof sendGridEventSchema>;
export type SendGridWebhook = z.infer<typeof sendGridWebhookSchema>;

// Generic API Response schemas
export const apiErrorSchema = z.object({
  error: z.string(),
  message: z.string(),
  statusCode: z.number(),
  timestamp: z.string().datetime(),
});

export const apiSuccessSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  data: z.any().optional(),
});

export type ApiError = z.infer<typeof apiErrorSchema>;
export type ApiSuccess = z.infer<typeof apiSuccessSchema>;
