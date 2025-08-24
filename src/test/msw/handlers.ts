import { http, HttpResponse } from 'msw';

export const handlers = [
  // Example handler: stub any external API calls if present
  http.get('https://example.com/health', () => HttpResponse.json({ ok: true })),
];
