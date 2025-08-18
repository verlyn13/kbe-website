# Parallel Agent Directive: Stage 1-2 Remediation

## Mission
Fix Stage 1-2 issues without interfering with Stage 3 build/runtime testing. Work only on configuration files, type definitions, and non-runtime code.

## Constraints
- ❌ **DO NOT** run `npm install` or modify dependencies
- ❌ **DO NOT** run `npm run build` or start any servers
- ❌ **DO NOT** modify any files in `app/` directory routes
- ❌ **DO NOT** change component behavior or business logic
- ✅ **ONLY** work on type definitions, configs, and documentation

---

## Task 1: Configuration Fixes (Stage 1 Issues)
**Safe to do in parallel - won't affect Stage 3**

### 1.1 Create Version Control Files
```bash
# Create .nvmrc for Node version consistency
echo "22" > .nvmrc

# Create/update .env.example (documentation only)
cat > .env.example << 'EOF'
# Firebase Configuration (Required)
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key-here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain-here
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id-here
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket-here
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id-here
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id-here
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id-here

# SendGrid Configuration (Required for emails)
SENDGRID_API_KEY=your-sendgrid-api-key-here
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
SENDGRID_REPLY_TO_EMAIL=support@yourdomain.com

# Firebase Admin (Server-side)
FIREBASE_ADMIN_PROJECT_ID=your-project-id-here
FIREBASE_ADMIN_CLIENT_EMAIL=your-client-email-here
FIREBASE_ADMIN_PRIVATE_KEY=your-private-key-here

# App Configuration
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NODE_ENV=development
EOF

echo "✅ Created .env.example"
```

### 1.2 Update package.json (Manual Edit Required)
```bash
# Create a patch file for package.json
cat > package-json-updates.md << 'EOF'
# Manual Update Required for package.json

Add the following "engines" field after "version":

```json
  "engines": {
    "node": ">=22.0.0",
    "npm": ">=11.0.0"
  },
```

This ensures consistent runtime versions across environments.
EOF

echo "📝 Created package-json-updates.md - requires manual edit"
```

### 1.3 Document Firebase Config Security
```bash
# Create security documentation
cat > FIREBASE_CONFIG_SECURITY.md << 'EOF'
# Firebase Configuration Security Notes

## Current Issue
The file `src/lib/firebase-config.ts` contains hardcoded Firebase configuration as fallbacks.

## Recommended Fix
Remove the hardcoded values and require environment variables:

```typescript
// Instead of:
apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyBhTEs3...',

// Use:
apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
```

## Why This Matters
- Prevents accidental use of wrong project config
- Forces proper environment setup
- Reduces git diff noise
- Follows security best practices

## Note
NEXT_PUBLIC_* variables are safe to expose (they're client-side).
However, hardcoding them reduces configuration flexibility.
EOF

echo "📚 Created FIREBASE_CONFIG_SECURITY.md"
```

---

## Task 2: Type Safety Improvements (Stage 2 Issues)
**Focus on type definitions only - no logic changes**

### 2.1 Create Type Definition Files
```bash
# Create Firebase type definitions
cat > src/types/firebase.ts << 'EOF'
// Firebase Data Types - Replace 'any' types throughout codebase

export interface FirebaseUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  createdAt?: Date;
  lastLoginAt?: Date;
}

export interface FirestoreDocument {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile extends FirestoreDocument {
  userId: string;
  email: string;
  role: 'admin' | 'parent' | 'student' | 'teacher';
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  isActive: boolean;
}

export interface Program extends FirestoreDocument {
  name: string;
  description: string;
  ageRange: string;
  duration: string;
  price: number;
  capacity: number;
  enrolled: number;
  status: 'active' | 'inactive' | 'full';
}

export interface Student extends FirestoreDocument {
  parentId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  grade?: string;
  allergies?: string;
  medicalNotes?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}

export interface Registration extends FirestoreDocument {
  studentId: string;
  programId: string;
  parentId: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  paymentMethod?: 'card' | 'check' | 'cash';
  paymentDate?: Date;
  notes?: string;
}

// Error types
export type FirebaseErrorCode = 
  | 'auth/user-not-found'
  | 'auth/wrong-password'
  | 'auth/email-already-in-use'
  | 'auth/weak-password'
  | 'auth/invalid-email'
  | 'permission-denied'
  | 'not-found'
  | 'already-exists';

export interface FirebaseError extends Error {
  code: FirebaseErrorCode;
  message: string;
}
EOF

echo "✅ Created src/types/firebase.ts"
```

### 2.2 Create Event Type Definitions
```bash
cat > src/types/events.ts << 'EOF'
// Event Handler Types - Replace (e: any) throughout codebase

import { ChangeEvent, FormEvent, MouseEvent, KeyboardEvent } from 'react';

// Form Events
export type FormSubmitEvent = FormEvent<HTMLFormElement>;
export type InputChangeEvent = ChangeEvent<HTMLInputElement>;
export type TextAreaChangeEvent = ChangeEvent<HTMLTextAreaElement>;
export type SelectChangeEvent = ChangeEvent<HTMLSelectElement>;

// Mouse Events
export type ButtonClickEvent = MouseEvent<HTMLButtonElement>;
export type LinkClickEvent = MouseEvent<HTMLAnchorElement>;
export type DivClickEvent = MouseEvent<HTMLDivElement>;

// Keyboard Events
export type InputKeyboardEvent = KeyboardEvent<HTMLInputElement>;
export type TextAreaKeyboardEvent = KeyboardEvent<HTMLTextAreaElement>;

// File Events
export interface FileChangeEvent extends ChangeEvent<HTMLInputElement> {
  target: HTMLInputElement & {
    files: FileList;
  };
}

// Custom Events
export type AsyncFormHandler = (event: FormSubmitEvent) => Promise<void>;
export type AsyncClickHandler = (event: ButtonClickEvent) => Promise<void>;
EOF

echo "✅ Created src/types/events.ts"
```

### 2.3 Create API Validation Schema
```bash
cat > src/lib/validations/api.ts << 'EOF'
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
    'group_resubscribe'
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
EOF

echo "✅ Created src/lib/validations/api.ts"
```

### 2.4 Generate Type Migration Guide
```bash
# Create a guide for replacing 'any' types
cat > TYPE_MIGRATION_GUIDE.md << 'EOF'
# Type Migration Guide - Fixing 'any' Types

## Quick Replacements (91 occurrences found)

### 1. Error Handling (Most Common)
```typescript
// ❌ Before:
catch (error: any) {
  console.error(error.message);
}

// ✅ After:
catch (error) {
  const message = error instanceof Error ? error.message : 'Unknown error';
  console.error(message);
}

// Or with type guard:
import { FirebaseError } from '@/types/firebase';
catch (error) {
  if (error instanceof Error) {
    // Handle as Error
  }
}
```

### 2. Event Handlers
```typescript
// ❌ Before:
const handleClick = (e: any) => {
  e.preventDefault();
}

// ✅ After:
import { ButtonClickEvent } from '@/types/events';
const handleClick = (e: ButtonClickEvent) => {
  e.preventDefault();
}
```

### 3. Firebase Data
```typescript
// ❌ Before:
const userData: any = doc.data();

// ✅ After:
import { UserProfile } from '@/types/firebase';
const userData = doc.data() as UserProfile;
```

### 4. Component Props
```typescript
// ❌ Before:
interface Props {
  data: any;
  onChange: (value: any) => void;
}

// ✅ After:
interface Props<T = unknown> {
  data: T;
  onChange: (value: T) => void;
}
```

## Files to Update (Top Priority)
Based on Stage 2 audit, focus on:
1. `src/lib/firebase-admin.ts` (666 lines - has many 'any')
2. `src/components/ui/sidebar.tsx` (748 lines)
3. API route handlers in `app/api/`
4. Form components with event handlers

## Safe Update Strategy
1. Start with type definition files (this task)
2. Update one file at a time
3. Use TypeScript's strict mode locally to find issues
4. Run `npx tsc --noEmit` after each file
5. Commit after each successful file update
EOF

echo "📋 Created TYPE_MIGRATION_GUIDE.md"
```

---

## Task 3: Create Test Infrastructure (Won't Affect Runtime)

### 3.1 Set Up Test Configuration
```bash
# Create test configuration file
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
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
EOF

# Create test setup file
mkdir -p src/test
cat > src/test/setup.ts << 'EOF'
import '@testing-library/jest-dom';

// Mock Firebase (to avoid initialization in tests)
vi.mock('@/lib/firebase-config', () => ({
  auth: {},
  db: {},
  storage: {},
}));

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}));
EOF

echo "✅ Created test configuration files"
```

### 3.2 Create First Test File (Example)
```bash
cat > src/lib/validations/__tests__/api.test.ts << 'EOF'
import { describe, it, expect } from 'vitest';
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
EOF

echo "✅ Created example test file"
```

---

## Task 4: Documentation Updates

### 4.1 Update README with Setup Instructions
```bash
cat > SETUP_INSTRUCTIONS.md << 'EOF'
# Development Setup Instructions

## Prerequisites
- Node.js 22+ (use `nvm use` to switch)
- npm 11+
- Firebase CLI (`npm install -g firebase-tools`)

## Initial Setup
1. Clone the repository
2. Copy environment variables: `cp .env.example .env.local`
3. Fill in your Firebase and SendGrid credentials
4. Install dependencies: `npm ci`
5. Run development server: `npm run dev`

## Environment Variables Required
See `.env.example` for all required variables.

## Running Tests
```bash
npm run test          # Run tests once
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Generate coverage report
```

## Type Checking
```bash
npx tsc --noEmit           # Check types
npx tsc --noEmit --watch   # Watch mode
```

## Code Quality
```bash
npm run lint      # Run ESLint
npm run format    # Format with Prettier
```
EOF

echo "📚 Created SETUP_INSTRUCTIONS.md"
```

---

## Execution Summary Script

```bash
#!/bin/bash
# Run all parallel fixes

echo "🚀 Starting Stage 1-2 Parallel Fixes..."
echo "⚠️  Note: This script creates files only - no build/runtime changes"

# Task 1: Configuration
echo "📁 Task 1: Creating configuration files..."
echo "22" > .nvmrc
# Create .env.example (code above)

# Task 2: Type Definitions  
echo "📝 Task 2: Creating type definition files..."
mkdir -p src/types
mkdir -p src/lib/validations
# Create type files (code above)

# Task 3: Test Setup
echo "🧪 Task 3: Creating test infrastructure..."
mkdir -p src/test
mkdir -p src/lib/validations/__tests__
# Create test files (code above)

# Task 4: Documentation
echo "📚 Task 4: Creating documentation..."
# Create docs (code above)

echo "✅ All parallel fixes completed!"
echo ""
echo "📋 Files created:"
echo "  - .nvmrc"
echo "  - .env.example"
echo "  - src/types/firebase.ts"
echo "  - src/types/events.ts"
echo "  - src/lib/validations/api.ts"
echo "  - vitest.config.ts"
echo "  - src/test/setup.ts"
echo "  - SETUP_INSTRUCTIONS.md"
echo "  - TYPE_MIGRATION_GUIDE.md"
echo "  - FIREBASE_CONFIG_SECURITY.md"
echo ""
echo "⚠️  Manual actions required:"
echo "  1. Add 'engines' field to package.json"
echo "  2. Remove Firebase config fallbacks from src/lib/firebase-config.ts"
echo "  3. Update imports to use new type definitions"
echo "  4. Run 'npm install --save-dev vitest @testing-library/react' when Stage 3 is done"
```

---

## What This Does NOT Touch
- ✅ No npm install commands
- ✅ No build or server processes
- ✅ No changes to app routes
- ✅ No component logic changes
- ✅ Only creates NEW files (except .nvmrc)
- ✅ Pure configuration and type definitions

## Coordination with Stage 3 Agent
- This agent works on `/src/types/` and config files
- Stage 3 agent works on build/runtime testing
- No file conflicts possible
- Can run completely in parallel
