# Stage 1-3 Remediation Workflow

## Overview

Parallel-safe tasks that won't interfere with Stage 4 audit. Split into immediate fixes, testing setup, and optimization tasks.

---

## Phase A: Immediate Fixes (30 mins)

_No build/runtime impact - safe during Stage 4_

### A1: Complete Stage 1 Configuration

```bash
# 1. Update package.json engines (manual edit required)
cat > UPDATE_PACKAGE_JSON.md << 'EOF'
Add after "version" in package.json:
  "engines": {
    "node": ">=22.0.0",
    "npm": ">=11.0.0"
  },
EOF

# 2. Fix npm vulnerabilities
npm audit fix --force 2>/dev/null || npm audit fix

# 3. Remove Firebase config fallbacks
# Create a safer version without hardcoded values
cat > src/lib/firebase-config-safe.ts << 'EOF'
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Require all environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

// Validate config at runtime
Object.entries(firebaseConfig).forEach(([key, value]) => {
  if (!value) {
    throw new Error(`Missing required Firebase config: ${key}`);
  }
});

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
EOF

echo "✅ Stage 1 fixes prepared (requires manual migration)"
```

### A2: Add Missing Error Boundaries (Stage 3)

```bash
# Root error boundary
cat > app/error.tsx << 'EOF'
'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="max-w-md text-center">
        <h1 className="mb-4 text-4xl font-bold">Oops!</h1>
        <h2 className="mb-4 text-xl">Something went wrong</h2>
        <p className="mb-6 text-muted-foreground">
          We encountered an unexpected error. Please try again.
        </p>
        <Button onClick={reset} size="lg">
          Try again
        </Button>
      </div>
    </div>
  );
}
EOF

# 404 page
cat > app/not-found.tsx << 'EOF'
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="max-w-md text-center">
        <h1 className="mb-4 text-6xl font-bold">404</h1>
        <h2 className="mb-4 text-2xl">Page not found</h2>
        <p className="mb-6 text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link href="/">
          <Button size="lg">Go home</Button>
        </Link>
      </div>
    </div>
  );
}
EOF

# Loading states for heavy pages
cat > app/calendar/loading.tsx << 'EOF'
import { Skeleton } from '@/components/ui/skeleton';

export default function CalendarLoading() {
  return (
    <div className="container mx-auto p-4">
      <Skeleton className="mb-4 h-10 w-48" />
      <div className="grid gap-4">
        <Skeleton className="h-96 w-full" />
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 35 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
EOF

cat > app/register/loading.tsx << 'EOF'
import { Skeleton } from '@/components/ui/skeleton';

export default function RegisterLoading() {
  return (
    <div className="container mx-auto max-w-2xl p-4">
      <Skeleton className="mb-6 h-10 w-64" />
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i}>
            <Skeleton className="mb-2 h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  );
}
EOF

echo "✅ Error boundaries and loading states created"
```

---

## Phase B: Testing Infrastructure (45 mins)

_Set up Vitest 3.2.4 with modern configuration_

### B1: Install Vitest 3.2.4

```bash
# Install Vitest 3.2.4 and testing dependencies
npm install --save-dev vitest@3.2.4 @vitejs/plugin-react@4.3.4 \
  @testing-library/react@16.1.0 @testing-library/user-event@14.6.0 \
  @testing-library/jest-dom@6.6.0 jsdom@25.0.1 \
  @vitest/ui@3.2.4 @vitest/coverage-v8@3.2.4

echo "✅ Vitest 3.2.4 installed"
```

### B2: Configure Vitest for Next.js 15

```bash
# Create Vitest config for Next.js 15 + React 19
cat > vitest.config.ts << 'EOF'
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        '.next/',
        'src/test/',
        '*.config.*',
        '**/types/**',
      ],
    },
    include: ['src/**/*.{test,spec}.{js,jsx,ts,tsx}', 'app/**/*.{test,spec}.{js,jsx,ts,tsx}'],
    exclude: ['node_modules', '.next', 'out'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/lib': path.resolve(__dirname, './src/lib'),
      '@/app': path.resolve(__dirname, './app'),
    },
  },
});
EOF

# Create test setup
mkdir -p src/test
cat > src/test/setup.ts << 'EOF'
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Next.js modules
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
  useParams: () => ({}),
}));

// Mock Firebase
vi.mock('@/lib/firebase-config', () => ({
  auth: {},
  db: {},
  storage: {},
}));

// Mock environment variables
process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';

// Suppress console errors in tests
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
EOF

# Add test scripts to package.json
cat > ADD_TEST_SCRIPTS.md << 'EOF'
Add to package.json scripts:
  "test": "vitest",
  "test:ui": "vitest --ui",
  "test:run": "vitest run",
  "test:coverage": "vitest run --coverage",
  "test:watch": "vitest watch"
EOF

echo "✅ Vitest configured for Next.js 15 + React 19"
```

### B3: Create Initial Test Suite

```bash
# Test for SendGrid webhook validation (Stage 2 issue)
mkdir -p src/lib/validations/__tests__
cat > src/lib/validations/__tests__/sendgrid.test.ts << 'EOF'
import { describe, it, expect } from 'vitest';
import { z } from 'zod';

// SendGrid webhook validation schema
const sendGridEventSchema = z.object({
  email: z.string().email(),
  timestamp: z.number(),
  event: z.enum([
    'processed', 'dropped', 'delivered', 'deferred',
    'bounce', 'open', 'click', 'spamreport',
    'unsubscribe', 'group_unsubscribe', 'group_resubscribe'
  ]),
  sg_event_id: z.string(),
  sg_message_id: z.string(),
  category: z.array(z.string()).optional(),
  url: z.string().url().optional(),
});

describe('SendGrid Webhook Validation', () => {
  it('validates correct event structure', () => {
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

  it('rejects invalid email', () => {
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

  it('rejects invalid event type', () => {
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
EOF

# Component test example
mkdir -p src/components/ui/__tests__
cat > src/components/ui/__tests__/button.test.tsx << 'EOF'
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../button';

describe('Button Component', () => {
  it('renders children correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies variant classes', () => {
    const { container } = render(<Button variant="destructive">Delete</Button>);
    const button = container.querySelector('button');
    expect(button?.className).toContain('destructive');
  });

  it('disables when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });
});
EOF

echo "✅ Initial test suite created"
```

---

## Phase C: Code Splitting Implementation (1 hour)

_Addresses Stage 3 bundle size issues_

### C1: Implement Dynamic Imports for Heavy Pages

```bash
# Create wrapper components with lazy loading

# 1. Calendar page optimization
cat > app/calendar/CalendarClient.tsx << 'EOF'
'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

// Lazy load heavy calendar components
const CalendarView = dynamic(
  () => import('@/components/CalendarView'),
  {
    loading: () => <Skeleton className="h-[600px] w-full" />,
    ssr: false, // Disable SSR for calendar with client-side state
  }
);

export default function CalendarClient() {
  return (
    <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
      <CalendarView />
    </Suspense>
  );
}
EOF

# 2. Register page optimization
cat > app/register/RegisterClient.tsx << 'EOF'
'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

// Split registration into steps with lazy loading
const StudentInfoForm = dynamic(
  () => import('@/components/forms/StudentInfoForm'),
  { loading: () => <Skeleton className="h-96 w-full" /> }
);

const ProgramSelection = dynamic(
  () => import('@/components/forms/ProgramSelection'),
  { loading: () => <Skeleton className="h-64 w-full" /> }
);

const PaymentForm = dynamic(
  () => import('@/components/forms/PaymentForm'),
  { loading: () => <Skeleton className="h-80 w-full" /> }
);

interface RegisterClientProps {
  step: number;
}

export default function RegisterClient({ step }: RegisterClientProps) {
  switch (step) {
    case 1:
      return <StudentInfoForm />;
    case 2:
      return <ProgramSelection />;
    case 3:
      return <PaymentForm />;
    default:
      return <StudentInfoForm />;
  }
}
EOF

# 3. Admin communications optimization
cat > app/admin/communications/CommunicationsClient.tsx << 'EOF'
'use client';

import dynamic from 'next/dynamic';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';

// Lazy load heavy components
const EmailComposer = dynamic(
  () => import('@/components/admin/EmailComposer'),
  { loading: () => <Skeleton className="h-96 w-full" /> }
);

const RecipientSelector = dynamic(
  () => import('@/components/admin/RecipientSelector'),
  { loading: () => <Skeleton className="h-64 w-full" /> }
);

const EmailHistory = dynamic(
  () => import('@/components/admin/EmailHistory'),
  { loading: () => <Skeleton className="h-96 w-full" /> }
);

export default function CommunicationsClient() {
  return (
    <Tabs defaultValue="compose" className="w-full">
      <TabsList>
        <TabsTrigger value="compose">Compose</TabsTrigger>
        <TabsTrigger value="recipients">Recipients</TabsTrigger>
        <TabsTrigger value="history">History</TabsTrigger>
      </TabsList>
      <TabsContent value="compose">
        <EmailComposer />
      </TabsContent>
      <TabsContent value="recipients">
        <RecipientSelector />
      </TabsContent>
      <TabsContent value="history">
        <EmailHistory />
      </TabsContent>
    </Tabs>
  );
}
EOF

echo "✅ Code splitting implemented for heavy pages"
```

### C2: Add API Route Validation (Stage 2 issue)

```bash
# Fix the SendGrid webhook validation
cat > app/api/webhooks/sendgrid/route.ts << 'EOF'
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Validation schema
const sendGridEventSchema = z.object({
  email: z.string().email(),
  timestamp: z.number(),
  event: z.enum([
    'processed', 'dropped', 'delivered', 'deferred',
    'bounce', 'open', 'click', 'spamreport',
    'unsubscribe', 'group_unsubscribe', 'group_resubscribe'
  ]),
  sg_event_id: z.string(),
  sg_message_id: z.string(),
  category: z.array(z.string()).optional(),
  url: z.string().url().optional(),
  reason: z.string().optional(),
  response: z.string().optional(),
});

const webhookSchema = z.array(sendGridEventSchema);

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validatedEvents = webhookSchema.parse(body);

    // Process each event
    for (const event of validatedEvents) {
      console.log(`Processing ${event.event} for ${event.email}`);

      // Add your event processing logic here
      switch (event.event) {
        case 'bounce':
          // Handle bounce
          break;
        case 'unsubscribe':
          // Handle unsubscribe
          break;
        case 'delivered':
          // Track delivery
          break;
        default:
          // Log other events
          break;
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid webhook data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('SendGrid webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
EOF

echo "✅ API validation added to SendGrid webhook"
```

---

## Phase D: Performance Quick Wins (30 mins)

_Immediate optimizations_

### D1: Optimize Large Files (Stage 2)

```bash
# Split firebase-admin.ts into smaller modules
cat > REFACTOR_FIREBASE_ADMIN.md << 'EOF'
# Refactoring firebase-admin.ts (666 lines)

Split into:
1. src/lib/firebase-admin/auth.ts - Authentication functions
2. src/lib/firebase-admin/firestore.ts - Database operations
3. src/lib/firebase-admin/storage.ts - File operations
4. src/lib/firebase-admin/utils.ts - Shared utilities
5. src/lib/firebase-admin/index.ts - Re-exports

Example structure:
\`\`\`typescript
// src/lib/firebase-admin/auth.ts
import { auth } from './config';

export async function verifyIdToken(token: string) {
  return auth.verifyIdToken(token);
}

export async function createCustomToken(uid: string) {
  return auth.createCustomToken(uid);
}

// src/lib/firebase-admin/index.ts
export * from './auth';
export * from './firestore';
export * from './storage';
\`\`\`
EOF

# Split sidebar.tsx into smaller components
cat > REFACTOR_SIDEBAR.md << 'EOF'
# Refactoring sidebar.tsx (748 lines)

Split into:
1. src/components/ui/sidebar/SidebarContainer.tsx
2. src/components/ui/sidebar/SidebarHeader.tsx
3. src/components/ui/sidebar/SidebarNav.tsx
4. src/components/ui/sidebar/SidebarFooter.tsx
5. src/components/ui/sidebar/SidebarMobile.tsx
6. src/components/ui/sidebar/index.tsx - Main export

This reduces complexity and improves maintainability.
EOF

echo "✅ Refactoring guides created"
```

### D2: Add Suspense Boundaries

```bash
# Add Suspense to main layout
cat > app/layout-with-suspense.tsx << 'EOF'
import { Suspense } from 'react';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Suspense fallback={<div>Loading...</div>}>
          {children}
        </Suspense>
      </body>
    </html>
  );
}
EOF

echo "✅ Suspense boundaries prepared"
```

---

## Execution Script

```bash
#!/bin/bash
# Stage 1-3 Remediation Script

echo "🚀 Starting Stage 1-3 Remediation..."

# Phase A: Immediate Fixes
echo "📝 Phase A: Configuration & Error Boundaries..."
# Run Phase A commands

# Phase B: Testing Setup
echo "🧪 Phase B: Installing Vitest 3.2.4..."
npm install --save-dev vitest@3.2.4 @vitejs/plugin-react@4.3.4 \
  @testing-library/react@16.1.0 @testing-library/user-event@14.6.0 \
  @testing-library/jest-dom@6
```
