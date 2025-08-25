# Agent Directive: Essential Smart Tests (Vitest + JSDOM)

## 0) Objectives (why these tests exist)

- Catch **high-value breakage** fast: routes render, forms validate, APIs respond, emails generate.
- Enforce **accessibility, env safety, and coverage gates** without human babysitting.
- Keep **mocks stable** and **fixtures reusable** to minimize flake and rewrite cost.

---

## 1) Baseline plumbing (once)

**Create/ensure files:**

- `src/test/setup.ts` (already present):
  - keep `@testing-library/jest-dom`
  - silence React/Next noisy logs in tests
  - add MSW server lifecycle hooks

- `src/test/test-utils.tsx`: custom `render` with providers (theme, RHF, etc.).
- `src/test/msw/handlers.ts` + `src/test/msw/server.ts`: request stubs for Firebase/SendGrid/app APIs.
- `src/test/factories/index.ts`: plain TS factories for common entities (User, Enrollment, EmailPayload). No extra libs required.

**Add packages (dev) if missing:**

```
npm i -D msw @types/testing-library__jest-dom axe-core @axe-core/react
```

> If keeping deps lean, you can skip `@axe-core/react` and run `axe-core` directly.

**Update `vitest.config.ts`:**

- Ensure `setupFiles: ['src/test/setup.ts']`
- Coverage thresholds (raise later):
  `coverage: { provider: 'v8', reporter: ['text','json','html'], lines: 70, functions: 70, branches: 60 }`
- `test.include`: `['src/**/*.{test,spec}.{ts,tsx}']`
- `environment: 'jsdom'`, `globals: true`.

**Add scripts:**

```json
"test:ci": "vitest run --coverage --reporter=default --reporter=junit",
"test:a11y": "vitest run src/**/__a11y__/*.test.tsx"
```

---

## 2) Smart Smoke for Critical Routes (fast guardrails)

**Goal:** Every critical page renders, no fatal errors, key landmarks exist.

**Create:** `src/app/__tests__/smoke.routes.test.tsx`

- For each route (`/`, `/admin/dashboard`, main enrollment flow page):
  - `render(<Page />)` via `test-utils`
  - assert `getByRole('main')` and a couple of unique headings/buttons
  - **Fail test if `console.error` or `console.warn` is called** (spy in `setup.ts`)

- Mock Next’s `useRouter`/`next/navigation` as needed (you already have stubs).

---

## 3) Form+Schema Contract (RHForm + Zod)

**Goal:** Prevent validation regressions & submission shape drift.

**Create:** `src/components/forms/__tests__/enroll.form.test.tsx`

- Unit test the **zod** schemas (valid, boundary, invalid).
- Integration test: render form, type minimal valid data, submit → verify `onSubmit` called with **exact zod-parsed payload**.
- Test error message mapping (a couple of representative fields).

Also add **pure unit tests** for every schema in `src/lib/validations/**/__tests__/*.test.ts` (you already have one suite; expand coverage).

---

## 4) API Route Handler Tests (app router)

**Goal:** Route handlers remain pure & deterministic.

**Create:** `src/app/api/**/__tests__/*.test.ts`
Pattern per handler (e.g., `src/app/api/enroll/route.ts`):

- Import `{ POST }` (or GET) and call with a **mock Request**.
- Use **MSW** to intercept any outbound fetches (Firebase REST, internal APIs).
- Assert `status`, `json()` shape, and **error branches** (400/401/500).
- Keep handler logic isolated behind a small module (`src/server/services/*`) so you can unit-test the core without HTTP ceremony.

---

## 5) Email Generation Contract (SendGrid)

**Goal:** Template IDs exist and dynamic substitutions never break.

**Create:** `src/lib/email/__tests__/sendgrid.contract.test.ts`

- Mock `@sendgrid/mail` completely.
- Test `build*Email()` functions: assert exact **templateId**, **required dynamic data keys**, and that HTML text alternatives exist if you generate them.
- Snapshot **rendered subject** and **minimal HTML** (small, trimmed snapshot; avoid flake).
- Add a negative test: missing field → throws with clear message.

---

## 6) Access Control & Guarded Navigation

**Goal:** Role/guard logic won’t silently regress.

**Create:** `src/app/(admin)/**/__tests__/guards.test.tsx`

- Stub `next/navigation` and your auth selector.
- For `AdminRoute`/guarded components: unauthenticated/unauthorized cases → **redirect was called** with the right target (spy on `redirect`), and **no content** renders.
- Happy path renders the first protected landmark.

---

## 7) Component Contracts (Radix + UI)

**Goal:** Interactive primitives stay wired (a11y + behavior).

**Create:** `src/components/**/__tests__/*.test.tsx`
Focus on:

- Dialog, DropdownMenu, Tabs, Select, Tooltip, Toast.
- Assert **aria roles/labels**, keyboard interactions (open/close with `userEvent.keyboard`), and critical props (e.g., `onOpenChange`).
- One or two tests each, not exhaustive—**contract style**.

---

## 8) Lightweight Accessibility Checks

**Goal:** Prevent obvious a11y regressions with tiny cost.

**Create:** `src/app/__a11y__/home.a11y.test.tsx`

- Render key pages/components.
- Run `axe` and assert **no violations** except an allow-listed set (comment why if needed).
- Scope to 2–3 critical surfaces to keep tests snappy.

---

## 9) Environment & Safety Tests

**Goal:** Missing or malformed env doesn’t reach prod.

**Create:** `src/lib/env/__tests__/env.safety.test.ts`

- Unit test your env loader/validator (zod over `process.env`).
- For required vars (e.g., `SENDGRID_API_KEY`, Firebase config), assert **throws** if missing and **parses** when present.
- Add a test verifying **no real network** calls can occur when `NODE_ENV === 'test'` (e.g., a guard in your fetch wrapper; assert it’s mocked).

---

## 10) Telemetry/Analytics (if present)

**Goal:** No telemetry in test or dev by accident.

**Create:** `src/lib/telemetry/__tests__/telemetry.guard.test.ts`

- Ensure analytics exporters are **no-ops** in `test` and **respect an opt-out flag**.
- If you wrap `console`, assert only info logs in dev and silent in test (except errors which fail).

---

## 11) Coverage Gates & CI

- Set initial thresholds (above) and plan to ratchet +5% per milestone.
- **Fail CI** on:
  - coverage below thresholds,
  - any `console.error` in tests,
  - unhandled promise rejections (set `vi.unhandledRejection` hook in `setup.ts`).

- Emit `junit` reporter for CI visibility.

**Add a GitHub Action (example):**
`.github/workflows/test.yml`

```yaml
name: test
on: [push, pull_request]
jobs:
  vitest:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '22' }
      - run: npm ci
      - run: npm run typecheck
      - run: npm run test:ci
```

---

## 12) Implementation Checklist (exact paths)

- `src/test/setup.ts` → add console spies, MSW lifecycle, axe helper (optional).
- `src/test/test-utils.tsx` → `render` with providers (Theme, RHF, etc.).
- `src/test/msw/handlers.ts` & `src/test/msw/server.ts`
- `src/test/factories/index.ts`
- `src/app/__tests__/smoke.routes.test.tsx`
- `src/components/forms/__tests__/enroll.form.test.tsx`
- `src/lib/validations/**/__tests__/*.test.ts`
- `src/app/api/**/__tests__/*.test.ts`
- `src/lib/email/__tests__/sendgrid.contract.test.ts`
- `src/app/(admin)/**/__tests__/guards.test.tsx`
- `src/components/**/__tests__/*.test.tsx`
- `src/app/__a11y__/*.a11y.test.tsx`
- `src/lib/env/__tests__/env.safety.test.ts`
- `src/lib/telemetry/__tests__/telemetry.guard.test.ts` (if applicable)

---

## 13) Code stubs to drop in

**`src/test/setup.ts` (essentials):**

```ts
import '@testing-library/jest-dom';
import { server } from './msw/server';
import { afterAll, afterEach, beforeAll, vi } from 'vitest';

// Fail test on console.error/warn (helps catch React/Next issues)
const error = console.error;
const warn = console.warn;
beforeAll(() => {
  console.error = (...args: any[]) => {
    error(...args);
    throw new Error(`console.error: ${args[0]}`);
  };
  console.warn = (...args: any[]) => {
    warn(...args);
    throw new Error(`console.warn: ${args[0]}`);
  };
  server.listen({ onUnhandledRequest: 'error' });
});
afterEach(() => {
  server.resetHandlers();
  vi.clearAllMocks();
});
afterAll(() => {
  server.close();
  console.error = error;
  console.warn = warn;
});

// JSDOM sanity: guard unhandled rejections
process.on('unhandledRejection', (reason) => {
  throw reason instanceof Error ? reason : new Error(String(reason));
});

// Next/navigation minimal mocks (extend if you already have these elsewhere)
vi.mock('next/navigation', () => {
  return {
    useRouter: () => ({ push: vi.fn(), replace: vi.fn(), refresh: vi.fn() }),
    usePathname: () => '/',
    redirect: vi.fn(),
  };
});
```

**`src/test/msw/server.ts`:**

```ts
import { setupServer } from 'msw/node';
import { handlers } from './handlers';
export const server = setupServer(...handlers);
```

**`src/test/msw/handlers.ts`:**

```ts
import { http, HttpResponse } from 'msw';

export const handlers = [
  // Firebase example
  http.post('https://identitytoolkit.googleapis.com/*', () => {
    return HttpResponse.json({ idToken: 'test', refreshToken: 'test' });
  }),
  // App API example
  http.post('/api/enroll', async ({ request }) => {
    const body = await request.json();
    if (!body?.email)
      return new HttpResponse(JSON.stringify({ error: 'email required' }), { status: 400 });
    return HttpResponse.json({ ok: true });
  }),
];
```

**`src/test/test-utils.tsx`:**

```tsx
import { render as rtlRender } from '@testing-library/react';
import { ReactNode } from 'react';

function Providers({ children }: { children: ReactNode }) {
  // add ThemeProvider, QueryClientProvider, etc. if you use them
  return <>{children}</>;
}

export function render(ui: React.ReactElement, options?: Parameters<typeof rtlRender>[1]) {
  return rtlRender(ui, { wrapper: Providers, ...options });
}
export * from '@testing-library/react';
```

**`src/lib/email/__tests__/sendgrid.contract.test.ts`:**

```ts
import { describe, it, expect, vi } from 'vitest';
vi.mock('@sendgrid/mail', () => ({ default: { setApiKey: vi.fn(), send: vi.fn() } }));

import { buildWelcomeEmail } from '../buildWelcomeEmail'; // your function

describe('SendGrid contract', () => {
  it('uses correct template id and vars', () => {
    const payload = buildWelcomeEmail({ to: 'a@b.com', name: 'Alice' });
    expect(payload.templateId).toBeDefined();
    expect(payload.personalizations?.[0]?.dynamicTemplateData).toEqual(
      expect.objectContaining({ name: 'Alice' })
    );
  });
});
```

---

## 14) Optional but Recommended

- **Playwright** for a couple of true E2E journeys (enroll + admin view). Keep to 2–3 tests, run in nightly CI.
- **Mutation testing** (stryker) later, once coverage stabilizes.
- **Coverage ratchet**: +5% lines/branches per release.

---

### Definition of Done

- All files above created.
- CI green with coverage artifacts uploaded.
- Smoke routes, form+schema, API, email, guards, and a11y suites in place.
- No real network in tests; MSW handles all HTTP.
- Console errors/warnings fail tests.

If you want, I can generate the exact file contents for each test path based on your current modules (names/exports) so the agent can drop them in verbatim.
