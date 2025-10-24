# Production Readiness Plan

**Date**: October 23, 2025
**Status**: 🟡 Implementation Required
**Priority**: High - Critical for production operations

---

## Overview

This plan addresses the three critical production needs:
1. **Sentry Integration** - Error tracking and monitoring
2. **robots.txt Configuration** - SEO and crawler management
3. **Improved Error Handling & Logging** - Operational reliability

---

## Phase 1: Sentry Integration (Priority: CRITICAL)

**Timeline**: 2-3 hours
**Blocker Status**: YES - No production error visibility currently

### 1.1 Install and Configure Sentry

**Dependencies**:
```bash
bun add @sentry/nextjs
```

**Configuration Steps**:

1. **Run Sentry Wizard** (automated setup):
   ```bash
   export SENTRY_AUTH_TOKEN='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'
   export SENTRY_ORG='happy-patterns-llc'
   export SENTRY_PROJECT='javascript-nextjs'
   bunx @sentry/wizard@latest -i nextjs
   ```

2. **Files Created** (by wizard):
   - `sentry.client.config.ts` - Browser error tracking
   - `sentry.server.config.ts` - Server-side error tracking
   - `sentry.edge.config.ts` - Edge runtime tracking
   - `instrumentation.ts` - Next.js instrumentation hook
   - Updated `next.config.js` - Sentry webpack plugin

3. **Environment Variables** (already in Vercel & Infisical):
   - ✅ `NEXT_PUBLIC_SENTRY_DSN` - Public client key
   - ✅ `SENTRY_ORG` - Organization slug
   - ✅ `SENTRY_PROJECT` - Project slug
   - ✅ `SENTRY_AUTH_TOKEN` - Build-time source map upload

### 1.2 Integrate with Existing Logger

**Update `src/lib/logger.ts`**:

```typescript
import * as Sentry from '@sentry/nextjs';

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  error(message: string, error?: Error | unknown, context?: Record<string, unknown>): void {
    const errorContext = {
      ...context,
      ...(error instanceof Error ? {
        errorMessage: error.message,
        errorStack: error.stack,
        errorName: error.name,
      } : { error: String(error) }),
    };

    this.log('error', message, errorContext);

    // Send to Sentry in production
    if (!this.isDevelopment && error) {
      if (error instanceof Error) {
        Sentry.captureException(error, {
          contexts: {
            additional: context,
          },
          tags: {
            logger: 'custom',
          },
        });
      } else {
        Sentry.captureMessage(message, {
          level: 'error',
          contexts: {
            additional: errorContext,
          },
        });
      }
    }
  }

  warn(message: string, context?: Record<string, unknown>): void {
    this.log('warn', message, context);

    // Optional: Send warnings to Sentry as breadcrumbs
    if (!this.isDevelopment) {
      Sentry.addBreadcrumb({
        message,
        level: 'warning',
        data: context,
      });
    }
  }

  // ... rest of logger
}
```

**Benefits**:
- ✅ Zero code changes needed in application (logger already used everywhere)
- ✅ Automatic error aggregation and deduplication
- ✅ Stack traces with source maps
- ✅ User context tracking (email, user ID)
- ✅ Release tracking for deployments

### 1.3 Configure User Context

**Update authentication flows** to set Sentry user context:

**In `src/hooks/use-supabase-auth.tsx`**:
```typescript
import * as Sentry from '@sentry/nextjs';

useEffect(() => {
  if (user) {
    // Set Sentry user context
    Sentry.setUser({
      id: user.id,
      email: user.email,
    });
  } else {
    Sentry.setUser(null);
  }
}, [user]);
```

### 1.4 Add Performance Monitoring (Optional)

**In `sentry.client.config.ts`**:
```typescript
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1, // 10% of transactions
  replaysSessionSampleRate: 0.1, // 10% of sessions
  replaysOnErrorSampleRate: 1.0, // 100% of error sessions
});
```

**Benefits**:
- Track slow API routes
- Monitor page load times
- Identify performance bottlenecks

### 1.5 Test Sentry Integration

**Create test endpoint** (`src/app/api/sentry-test/route.ts`):
```typescript
import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

export async function GET() {
  // Test error logging
  try {
    throw new Error('Sentry test error from API route');
  } catch (error) {
    logger.error('Testing Sentry integration', error, {
      testType: 'api-route',
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      message: 'Error logged to Sentry',
      check: 'https://sentry.io/organizations/happy-patterns-llc/issues/',
    });
  }
}
```

**Test Steps**:
1. Deploy to Vercel preview: `vercel`
2. Visit: `https://your-preview.vercel.app/api/sentry-test`
3. Check Sentry dashboard: https://sentry.io/organizations/happy-patterns-llc/projects/javascript-nextjs/
4. Verify error appears with stack trace and context
5. Delete test endpoint after verification

### 1.6 Configure Release Tracking

**Update deployment workflow** to create Sentry releases:

**In `.github/workflows/deploy.yml`** (if exists) or manual:
```bash
# During deployment
export SENTRY_AUTH_TOKEN='...'
export SENTRY_ORG='happy-patterns-llc'
export SENTRY_PROJECT='javascript-nextjs'
RELEASE=$(git rev-parse HEAD)

sentry-cli releases new $RELEASE
sentry-cli releases set-commits $RELEASE --auto
sentry-cli releases finalize $RELEASE
```

**Vercel automatically handles**:
- Source map upload during build (via `next.config.js` plugin)
- Release association with deployments

---

## Phase 2: robots.txt Configuration (Priority: HIGH)

**Timeline**: 30 minutes
**Blocker Status**: No - But important for SEO

### 2.1 Current State

**Missing**: No `robots.txt` file exists
**Impact**:
- Search engines use defaults (index everything)
- No control over crawler behavior
- Admin routes may be indexed
- No sitemap reference

### 2.2 Create robots.txt

**Using Next.js Metadata API** (preferred for Next.js 15):

**Create `src/app/robots.ts`**:
```typescript
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://homerenrichment.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/programs',
          '/programs/mathcounts',
          '/schedule',
          '/resources',
        ],
        disallow: [
          '/api/',
          '/admin/',
          '/dashboard/',
          '/register/', // Registration requires auth
          '/_next/',
          '/private/',
        ],
      },
      {
        userAgent: 'GPTBot', // OpenAI crawler
        disallow: ['/'], // Block AI training on private content
      },
      {
        userAgent: 'CCBot', // Common Crawl
        disallow: ['/'], // Block AI training
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
```

**Output** (generated at `/robots.txt`):
```
User-Agent: *
Allow: /
Allow: /programs
Allow: /programs/mathcounts
Allow: /schedule
Allow: /resources
Disallow: /api/
Disallow: /admin/
Disallow: /dashboard/
Disallow: /register/
Disallow: /_next/
Disallow: /private/

User-Agent: GPTBot
Disallow: /

User-Agent: CCBot
Disallow: /

Sitemap: https://homerenrichment.com/sitemap.xml
```

### 2.3 Create sitemap.xml

**Create `src/app/sitemap.ts`**:
```typescript
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://homerenrichment.com';

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/programs`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/programs/mathcounts`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/schedule`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/resources`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];
}
```

### 2.4 Verify Configuration

**Test locally**:
```bash
bun run dev
curl http://localhost:9002/robots.txt
curl http://localhost:9002/sitemap.xml
```

**Test in production** (after deployment):
```bash
curl https://homerenrichment.com/robots.txt
curl https://homerenrichment.com/sitemap.xml
```

**Google Search Console**:
1. Submit sitemap: https://search.google.com/search-console
2. Test robots.txt: Tools → robots.txt Tester
3. Request indexing for key pages

---

## Phase 3: Improved Error Handling (Priority: HIGH)

**Timeline**: 4-6 hours
**Blocker Status**: No - But critical for reliability

### 3.1 Service Layer Error Handling

**Problem**: Service methods throw raw Prisma errors

**Create custom error classes** (`src/lib/errors.ts`):

```typescript
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public isOperational: boolean = true,
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR', 400);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 'NOT_FOUND', 404);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(message, 'UNAUTHORIZED', 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden') {
    super(message, 'FORBIDDEN', 403);
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 'CONFLICT', 409);
  }
}

export class DatabaseError extends AppError {
  constructor(message: string, originalError?: unknown) {
    super(message, 'DATABASE_ERROR', 500);
    if (originalError instanceof Error) {
      this.stack = originalError.stack;
    }
  }
}
```

**Update services** to wrap Prisma errors:

```typescript
// src/lib/services/registration-service.ts
import { Prisma } from '@prisma/client';
import { ConflictError, NotFoundError, DatabaseError } from '@/lib/errors';

async create(data: Prisma.RegistrationCreateInput) {
  try {
    return await prisma.registration.create({ data });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Unique constraint violation
      if (error.code === 'P2002') {
        throw new ConflictError('Student already registered for this program');
      }
      // Foreign key constraint
      if (error.code === 'P2003') {
        throw new NotFoundError('Referenced record');
      }
    }
    throw new DatabaseError('Failed to create registration', error);
  }
}
```

### 3.2 API Route Error Handler

**Create centralized error handler** (`src/lib/api-error-handler.ts`):

```typescript
import { NextResponse } from 'next/server';
import { AppError } from '@/lib/errors';
import { logger } from '@/lib/logger';
import * as Sentry from '@sentry/nextjs';

export function handleApiError(error: unknown): NextResponse {
  // Log all errors
  logger.error('API error', error);

  // Handle known application errors
  if (error instanceof AppError) {
    // Don't send operational errors to Sentry (expected errors)
    if (!error.isOperational) {
      Sentry.captureException(error);
    }

    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
      },
      { status: error.statusCode }
    );
  }

  // Handle unknown errors (bugs)
  Sentry.captureException(error);

  return NextResponse.json(
    {
      error: 'Internal Server Error',
      code: 'INTERNAL_ERROR',
    },
    { status: 500 }
  );
}
```

**Usage in API routes**:

```typescript
import { handleApiError } from '@/lib/api-error-handler';

export async function POST(request: Request) {
  try {
    // ... business logic
  } catch (error) {
    return handleApiError(error);
  }
}
```

### 3.3 Health Check Endpoint

**Create health check** (`src/app/api/health/route.ts`):

```typescript
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const checks: Record<string, string> = {};
  let isHealthy = true;

  // Check database connection
  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.database = 'ok';
  } catch (error) {
    checks.database = 'error';
    isHealthy = false;
  }

  // Check Supabase auth
  try {
    const supabase = await createClient();
    await supabase.auth.getSession();
    checks.auth = 'ok';
  } catch (error) {
    checks.auth = 'error';
    isHealthy = false;
  }

  // Check environment variables
  const requiredEnvVars = [
    'DATABASE_URL',
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'NEXTAUTH_SECRET',
  ];

  const missingEnvVars = requiredEnvVars.filter(
    (envVar) => !process.env[envVar]
  );

  if (missingEnvVars.length > 0) {
    checks.environment = `missing: ${missingEnvVars.join(', ')}`;
    isHealthy = false;
  } else {
    checks.environment = 'ok';
  }

  return NextResponse.json(
    {
      status: isHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      checks,
      version: process.env.VERCEL_GIT_COMMIT_SHA?.substring(0, 7) || 'unknown',
    },
    { status: isHealthy ? 200 : 503 }
  );
}
```

**Set up external monitoring**:
- Uptime Robot (free): https://uptimerobot.com/
- Monitor: `https://homerenrichment.com/api/health`
- Alert on: Status code !== 200
- Frequency: Every 5 minutes

### 3.4 Improve Client Error Handling

**Create API client wrapper** (`src/lib/api-client.ts`):

```typescript
import { logger } from '@/lib/logger';
import * as Sentry from '@sentry/nextjs';

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiClient<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      const error = new ApiError(
        data.error || 'Request failed',
        response.status,
        data.code || 'UNKNOWN_ERROR'
      );

      // Log client errors
      logger.error('API request failed', error, {
        url,
        statusCode: response.status,
      });

      throw error;
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    // Network errors, etc.
    logger.error('API request error', error, { url });
    Sentry.captureException(error);

    throw new ApiError('Network error', 0, 'NETWORK_ERROR');
  }
}
```

**Usage in components**:

```typescript
import { apiClient, ApiError } from '@/lib/api-client';

try {
  const student = await apiClient<Student>('/api/students', {
    method: 'POST',
    body: JSON.stringify(formData),
  });

  toast({ title: 'Student added successfully' });
} catch (error) {
  if (error instanceof ApiError) {
    toast({
      variant: 'destructive',
      title: 'Failed to add student',
      description: error.message,
    });
  }
}
```

### 3.5 Error Boundary Enhancements

**Update `src/components/error-boundary.tsx`**:

```typescript
import * as Sentry from '@sentry/nextjs';

class ErrorBoundary extends React.Component<Props, State> {
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logger.error('React Error Boundary caught error', error, {
      componentStack: errorInfo.componentStack,
    });

    // Send to Sentry with component stack
    Sentry.captureException(error, {
      contexts: {
        react: {
          componentStack: errorInfo.componentStack,
        },
      },
    });
  }

  // ... rest of component
}
```

---

## Phase 4: Build Configuration Improvements (Priority: MEDIUM)

**Timeline**: 1 hour
**Blocker Status**: No - But needed for production quality

### 4.1 Remove Build Error Ignoring

**Current problem** (`next.config.js`):
```javascript
typescript: {
  ignoreBuildErrors: true,  // ❌ Masks problems
},
eslint: {
  ignoreDuringBuilds: true,  // ❌ Masks problems
},
```

**Solution**: Fix TypeScript/ESLint errors, then remove ignores

**Action Plan**:
1. Run `bun run typecheck` - Fix all TypeScript errors
2. Run `bun run lint` - Fix all ESLint errors
3. Update `next.config.js`:
   ```javascript
   typescript: {
     ignoreBuildErrors: false,
   },
   eslint: {
     ignoreDuringBuilds: false,
   },
   ```

**Benefits**:
- Catch bugs at build time
- Enforce code quality
- Prevent production regressions

### 4.2 Add Source Map Support

**Update `next.config.js`** (if not already added by Sentry wizard):

```javascript
const nextConfig = {
  // ... existing config

  productionBrowserSourceMaps: true, // Enable source maps for debugging

  // Sentry webpack plugin (added by wizard)
  webpack: (config, { isServer }) => {
    // ... Sentry config
    return config;
  },
};
```

---

## Phase 5: Monitoring and Alerting (Priority: MEDIUM)

**Timeline**: 2 hours
**Blocker Status**: No - But critical for operations

### 5.1 Set Up Uptime Monitoring

**Uptime Robot** (free tier):
1. Sign up: https://uptimerobot.com/
2. Add monitor:
   - Type: HTTP(s)
   - URL: `https://homerenrichment.com/api/health`
   - Interval: 5 minutes
   - Alert contacts: Your email
3. Expected response: `"status":"healthy"`

### 5.2 Configure Sentry Alerts

**In Sentry dashboard**:
1. Go to Alerts → Create Alert Rule
2. Configure:
   - **Alert Name**: "High Error Rate"
   - **Conditions**:
     - When: Number of events
     - Is: Greater than 10
     - In: 1 hour
   - **Actions**: Send notification to email
3. Create second alert:
   - **Alert Name**: "New Error Type"
   - **Conditions**: First seen
   - **Actions**: Send notification

### 5.3 Vercel Monitoring

**Already included** with Vercel deployment:
- ✅ Build status notifications
- ✅ Deployment logs
- ✅ Function execution logs
- ✅ Analytics (page views, etc.)

**Enable**:
1. Vercel dashboard → kbe-website → Analytics
2. Enable Web Analytics (free)
3. Enable Speed Insights (free)

---

## Implementation Checklist

### Phase 1: Sentry (CRITICAL)
- [ ] Install `@sentry/nextjs`
- [ ] Run Sentry wizard
- [ ] Update logger.ts with Sentry integration
- [ ] Add user context tracking
- [ ] Create and test `/api/sentry-test` endpoint
- [ ] Verify errors appear in Sentry dashboard
- [ ] Configure release tracking
- [ ] Delete test endpoint

### Phase 2: robots.txt (HIGH)
- [ ] Create `src/app/robots.ts`
- [ ] Create `src/app/sitemap.ts`
- [ ] Test locally (curl endpoints)
- [ ] Deploy and verify in production
- [ ] Submit sitemap to Google Search Console

### Phase 3: Error Handling (HIGH)
- [ ] Create `src/lib/errors.ts` custom error classes
- [ ] Update service layer with error wrapping
- [ ] Create `src/lib/api-error-handler.ts`
- [ ] Update API routes to use error handler
- [ ] Create `/api/health` endpoint
- [ ] Create `src/lib/api-client.ts` wrapper
- [ ] Update error boundary with Sentry
- [ ] Set up Uptime Robot monitoring

### Phase 4: Build Config (MEDIUM)
- [ ] Fix all TypeScript errors
- [ ] Fix all ESLint errors
- [ ] Remove `ignoreBuildErrors` and `ignoreDuringBuilds`
- [ ] Verify builds succeed with checks enabled

### Phase 5: Monitoring (MEDIUM)
- [ ] Set up Uptime Robot
- [ ] Configure Sentry alerts
- [ ] Enable Vercel Analytics
- [ ] Document monitoring in operations runbook

---

## Testing Strategy

### Before Deployment

1. **Local Testing**:
   ```bash
   # Test with Infisical secrets
   infisical run --env=prod --domain=https://secrets.jefahnierocks.com -- bun run dev

   # Test error logging
   # Trigger errors manually and check console for Sentry calls
   ```

2. **Preview Deployment**:
   ```bash
   vercel
   # Test preview URL for:
   # - /api/health (should be healthy)
   # - /api/sentry-test (check Sentry dashboard)
   # - /robots.txt (proper formatting)
   # - /sitemap.xml (correct URLs)
   ```

### After Production Deployment

1. **Verify Sentry**:
   - Check dashboard: https://sentry.io/organizations/happy-patterns-llc/projects/javascript-nextjs/
   - Trigger test error
   - Verify source maps working
   - Verify user context present

2. **Verify robots.txt**:
   ```bash
   curl https://homerenrichment.com/robots.txt
   curl https://homerenrichment.com/sitemap.xml
   ```

3. **Verify Health Check**:
   ```bash
   curl https://homerenrichment.com/api/health
   ```

4. **Verify Monitoring**:
   - Uptime Robot showing green
   - Sentry receiving events
   - Vercel Analytics collecting data

---

## Success Metrics

### Immediate (Week 1)
- ✅ Zero errors going untracked (Sentry captures all)
- ✅ Health check responds within 500ms
- ✅ Uptime monitoring active
- ✅ robots.txt and sitemap.xml accessible

### Short-term (Month 1)
- ✅ Mean time to detection (MTTD) < 5 minutes
- ✅ Mean time to resolution (MTTR) < 24 hours
- ✅ 99%+ uptime reported by Uptime Robot
- ✅ Error rate < 1% of total requests

### Long-term (Quarter 1)
- ✅ Proactive issue detection (catch before users report)
- ✅ Performance baseline established
- ✅ Zero critical errors in production
- ✅ Complete operational visibility

---

## Rollback Plan

If issues arise after deployment:

1. **Sentry Issues**:
   ```bash
   # Disable Sentry temporarily
   # Update logger.ts to skip Sentry calls
   vercel --prod
   ```

2. **Performance Issues**:
   - Reduce Sentry sample rates
   - Disable session replay
   - Check `/api/health` for bottlenecks

3. **Complete Rollback**:
   ```bash
   # List recent deployments
   vercel ls

   # Promote previous deployment
   vercel promote <previous-deployment-url> --prod
   ```

---

## Estimated Total Time

- **Phase 1 (Sentry)**: 2-3 hours
- **Phase 2 (robots.txt)**: 30 minutes
- **Phase 3 (Error Handling)**: 4-6 hours
- **Phase 4 (Build Config)**: 1 hour
- **Phase 5 (Monitoring)**: 2 hours

**Total**: 9.5-12.5 hours

---

## Priority Execution Order

1. **Phase 1 (Sentry)** - CRITICAL, do first
2. **Phase 2 (robots.txt)** - Quick win, do second
3. **Phase 3.3 (Health Check)** - Needed for monitoring
4. **Phase 5.1 (Uptime Robot)** - Set up immediately after health check
5. **Phase 3 (Rest of Error Handling)** - Iterative improvements
6. **Phase 4 (Build Config)** - Quality enforcement
7. **Phase 5 (Rest of Monitoring)** - Fine-tuning

---

## Next Steps

1. **Review and approve** this plan
2. **Create todos** for each phase
3. **Start with Phase 1** (Sentry integration)
4. **Test thoroughly** at each phase
5. **Deploy incrementally** (preview → production)
6. **Monitor results** and iterate

---

**Questions or concerns?** Review the plan and let me know if you want to:
- Adjust priorities
- Change implementation approach
- Add additional requirements
- Start implementation immediately
