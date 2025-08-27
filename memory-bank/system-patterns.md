# System Patterns & Best Practices

## Development Patterns

### 1. Server Component First Pattern
```typescript
// Default to server components
// app/components/user-list.tsx
export default async function UserList() {
  const users = await fetchUsers(); // Direct DB call
  return <div>{/* render users */}</div>;
}

// Only use client when needed
// app/components/interactive-filter.tsx
'use client';
export default function InteractiveFilter() {
  const [filter, setFilter] = useState('');
  // Interactive logic
}
```

### 2. Bun Script Pattern
```json
// package.json scripts with Bun
{
  "scripts": {
    "dev": "next dev --turbopack -p 9002",
    "test": "vitest",
    "db:seed": "bun run scripts/seed.ts"
  }
}
```

### 3. Type-Safe Environment Variables
```typescript
// lib/env.ts
import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_FIREBASE_API_KEY: z.string(),
  FIREBASE_ADMIN_KEY: z.string(),
  SENDGRID_API_KEY: z.string(),
});

export const env = envSchema.parse(process.env);
```

### 4. Firebase Auth Pattern
```typescript
// lib/auth/server.ts
import { cookies } from 'next/headers';
import { verifyIdToken } from '@/lib/firebase-admin';

export async function getServerUser() {
  const token = cookies().get('auth-token');
  if (!token) return null;

  try {
    return await verifyIdToken(token.value);
  } catch {
    return null;
  }
}
```

## Architecture Patterns

### 1. Feature-Based Organization
```
src/app/
├── (auth)/
│   ├── login/
│   ├── signup/
│   └── layout.tsx
├── (dashboard)/
│   ├── overview/
│   ├── students/
│   └── layout.tsx
└── (public)/
    ├── about/
    └── programs/
```

### 2. Shared Component Structure
```
src/components/
├── ui/           # shadcn/ui base components
├── forms/        # Form components with validation
├── layouts/      # Layout components
└── features/     # Feature-specific components
```

### 3. API Route Pattern
```typescript
// app/api/students/route.ts
import { NextRequest } from 'next/server';
import { getServerUser } from '@/lib/auth/server';

export async function GET(request: NextRequest) {
  const user = await getServerUser();
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Handle request
}
```

## Testing Patterns

### 1. Component Testing
```typescript
// __tests__/button.test.tsx
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });
});
```

### 2. Integration Testing
```typescript
// __tests__/auth-flow.test.tsx
import { test, expect } from 'vitest';
import { createUser, loginUser } from '@/test/helpers';

test('complete auth flow', async () => {
  const user = await createUser();
  const session = await loginUser(user);
  expect(session).toBeDefined();
});
```

## Performance Patterns

### 1. Dynamic Imports
```typescript
// Lazy load heavy components
const HeavyChart = dynamic(
  () => import('@/components/charts/heavy-chart'),
  {
    loading: () => <Skeleton />,
    ssr: false
  }
);
```

### 2. Image Optimization
```typescript
import Image from 'next/image';

<Image
  src="/hero.jpg"
  alt="Hero"
  width={1200}
  height={600}
  priority // For above-fold images
  placeholder="blur"
  blurDataURL={blurData}
/>
```

### 3. Data Fetching
```typescript
// Parallel data fetching
async function Page() {
  const [users, programs] = await Promise.all([
    fetchUsers(),
    fetchPrograms()
  ]);

  return <Dashboard users={users} programs={programs} />;
}
```

## Error Handling Patterns

### 1. Error Boundary
```typescript
// app/error.tsx
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

### 2. Form Validation
```typescript
// Using Zod with React Hook Form
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const form = useForm({
  resolver: zodResolver(schema),
});
```

## Security Patterns

### 1. API Key Protection
```typescript
// Never expose sensitive keys
const publicConfig = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL,
  // Public keys only
};

const serverConfig = {
  adminKey: process.env.FIREBASE_ADMIN_KEY,
  // Server-only keys
};
```

### 2. Input Sanitization
```typescript
import DOMPurify from 'isomorphic-dompurify';

function sanitizeInput(input: string): string {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong'],
  });
}
```

## Deployment Patterns

### 1. Environment Configuration
```bash
# .env.local (development)
NEXT_PUBLIC_FIREBASE_API_KEY=dev_key
DATABASE_URL=postgresql://localhost/dev

# Production (Google Secret Manager)
# Managed via Firebase App Hosting
```

### 2. Build Optimization
```javascript
// next.config.js
module.exports = {
  images: {
    domains: ['firebasestorage.googleapis.com'],
  },
  experimental: {
    optimizeCss: true,
  },
};
```

## Agent Collaboration Patterns

### 1. Mode Handoff
```markdown
## Handoff: Architect → Code
**Task**: Implement user dashboard
**Context**: See memory-bank/active-context.md
**Requirements**:
- Server component for data fetching
- Client component for interactions
- Type-safe with Zod validation
**Success Criteria**: All tests pass
```

### 2. Error Escalation
```markdown
## Escalation: Code → Debug
**Issue**: Hydration mismatch in dashboard
**Error**: Text content does not match
**Context**: After implementing date formatting
**Attempted**: Checked timezone issues
**Need**: Root cause analysis
```

### 3. Review Request
```markdown
## Review: Code → Architect
**Changes**: Refactored auth flow
**Impact**: All auth-dependent components
**Breaking**: None expected
**Tests**: All passing
**Review**: Architecture alignment check
```

## Common Commands

### Bun Commands
```bash
# Development
bun dev                 # Start dev server
bun test               # Run tests
bun run build          # Production build

# Package Management
bun add package        # Add dependency
bun remove package     # Remove dependency
bun update            # Update all packages

# Scripts
bun run script.ts     # Execute TypeScript directly
```

### Firebase Commands
```bash
# Deployment
firebase deploy --only hosting
firebase deploy --only firestore:rules

# Local Development
firebase emulators:start
firebase emulators:export ./data
```

### Git Workflow
```bash
# Feature branch workflow
git checkout -b feature/add-dashboard
git add .
git commit -m "feat: add user dashboard"
git push origin feature/add-dashboard
# Create PR for review
```

---
*Last Updated: December 26, 2024*
