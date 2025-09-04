import '@testing-library/jest-dom';
import { afterAll, afterEach, beforeAll, beforeEach, vi } from 'vitest';
import { server } from './msw/server';

// MSW: start/stop server and reset handlers between tests
beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Mock Next.js navigation and Supabase modules used in tests

// Mock Supabase factories (avoid real initialization in tests)
vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: {
      getSession: async () => ({ data: { session: null } }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signInWithPassword: async () => ({ error: null }),
      signInWithOAuth: async () => ({ error: null }),
      signInWithOtp: async () => ({ error: null }),
      signUp: async () => ({ error: null }),
      signOut: async () => ({}),
      resetPasswordForEmail: async () => ({ error: null }),
      exchangeCodeForSession: async () => ({ error: null }),
      getUser: async () => ({ data: { user: null } }),
    },
  }),
}));
vi.mock('@/lib/supabase/server', () => ({
  createClient: async () => ({
    auth: {
      getUser: async () => ({ data: { user: null } }),
      exchangeCodeForSession: async () => ({ error: null }),
    },
  }),
}));

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    prefetch: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}));

// Remove legacy Firebase mocks; Supabase is the current stack

// Fail tests on console.error/console.warn to catch regressions
let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
let consoleWarnSpy: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation((..._args) => {
    // Allow known benign warnings here if needed
    // For now, record and continue; assertion runs after each test
    // eslint-disable-next-line no-console
    // console.log('console.error intercepted:', args);
  });
  consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation((..._args) => {
    // Suppress noisy warnings in tests but record usage
  });
});

afterEach(() => {
  const errorCalls = consoleErrorSpy.mock.calls;
  const warnCalls = consoleWarnSpy.mock.calls;
  consoleErrorSpy.mockRestore();
  consoleWarnSpy.mockRestore();

  if (errorCalls.length > 0) {
    throw new Error(
      `console.error called ${errorCalls.length} time(s):\n${JSON.stringify(errorCalls[0])}`
    );
  }
  if (warnCalls.length > 0) {
    throw new Error(
      `console.warn called ${warnCalls.length} time(s):\n${JSON.stringify(warnCalls[0])}`
    );
  }
});

// Guard against unhandled rejections
process.on('unhandledRejection', (reason) => {
  throw reason instanceof Error ? reason : new Error(String(reason));
});

// Polyfill matchMedia for next-themes and components relying on it
if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = () => ({
    matches: false,
    media: '',
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}
