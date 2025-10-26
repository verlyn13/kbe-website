# Error Handling & Logging Implementation Guide

**Date**: October 2025
**Status**: Production-Ready Best Practices
**Priority**: Critical for Production Deployment

## Overview

This guide provides the complete implementation plan for upgrading error handling and logging across the Homer Enrichment Hub project. It includes code examples, patterns, and a prioritized rollout plan.

## Quick Summary

**What was done:**
- ✅ Fixed critical email enumeration vulnerability
- ✅ Removed hardcoded Sentry DSN
- ✅ Created unified error handling utilities (`api-error-handler.ts`)
- ✅ Demonstrated new pattern in `/api/register` endpoint

**What's next:**
- Roll out to all 15+ remaining API routes
- Optimize Sentry configuration
- Add production monitoring

---

## The New Error Handling Pattern

### Core Utilities (`src/lib/api-error-handler.ts`)

The new utilities provide:

1. **`logApiError()`** - Unified logging with Sentry integration
2. **`batchOperation()`** - Safe batch processing with `Promise.allSettled()`
3. **`withRetry()`** - Automatic retry for transient failures
4. **`withErrorHandling()`** - Route wrapper with automatic error handling
5. **`validateRequestBody()`** - Simple request validation
6. **`getErrorResponse()`** - Maps errors to HTTP status codes
7. **`createErrorResponse()`** - Standardized error responses

### Key Improvements

| Before | After |
|--------|-------|
| `console.error('Error:', error)` | `logApiError(error, { context, userId, ... })` |
| `Promise.all(operations)` | `batchOperation(operations, context)` |
| Generic 500 errors | Specific error codes and messages |
| No Sentry integration | Auto Sentry on all errors |
| No retry logic | Automatic retry for transient failures |
| Inconsistent logging | Standardized contextual logging |

---

## Implementation Pattern

### Example: Before and After

**BEFORE** (Old Pattern):
```typescript
// src/app/api/students/route.ts - OLD
export async function GET(_req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const students = await studentService.getByUserId(user.id);
    return NextResponse.json({ students });
  } catch (error) {
    console.error('Students GET API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
```

**AFTER** (New Pattern):
```typescript
// src/app/api/students/route.ts - NEW
import { logApiError, createErrorResponse } from '@/lib/api-error-handler';

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        {
          error: 'Unauthorized',
          code: 'UNAUTHORIZED',
          timestamp: new Date().toISOString(),
        },
        { status: 401 }
      );
    }

    const students = await studentService.getByUserId(user.id);

    console.log(`[STUDENTS_GET] Retrieved ${students.length} students for user ${user.id}`);

    return NextResponse.json({ students });
  } catch (error) {
    // Automatic logging AND Sentry integration
    logApiError(error, {
      context: 'STUDENTS_GET',
      userId: user?.id,
      requestPath: req.url,
      requestMethod: 'GET',
    });

    // Standardized error response with appropriate status code
    return createErrorResponse(error, { context: 'STUDENTS_GET' });
  }
}
```

### Key Changes:
1. ✅ Import error handling utilities
2. ✅ Use `logApiError()` instead of `console.error()`
3. ✅ Add context object with userId, path, method
4. ✅ Use `createErrorResponse()` for standardized errors
5. ✅ Add contextual logging for success cases too
6. ✅ Include error codes in responses

---

## Using the Wrapper Pattern (Even Easier!)

For simple routes, use the `withErrorHandling()` wrapper:

**BEFORE**:
```typescript
export async function GET(req: NextRequest) {
  try {
    const data = await getData();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
```

**AFTER**:
```typescript
import { withErrorHandling } from '@/lib/api-error-handler';

export const GET = withErrorHandling(
  'GET_DATA', // Context string
  async (req) => {
    const data = await getData();
    return NextResponse.json(data);
  }
);
```

That's it! Error handling, logging, and Sentry integration are automatic.

---

## Batch Operations Pattern

For operations that create/update multiple records:

**BEFORE** (Fails if ANY operation fails):
```typescript
const students = await Promise.all(
  studentData.map(data => studentService.create(data))
);
```

**AFTER** (Tracks partial success):
```typescript
import { batchOperation } from '@/lib/api-error-handler';

const studentPromises = studentData.map(data => studentService.create(data));

const results = await batchOperation(studentPromises, {
  context: 'CREATE_STUDENTS',
  userId: user.id,
  additionalData: { count: studentData.length },
});

console.log(`Created ${results.succeeded.length} of ${results.total} students`);

if (results.failed.length > 0) {
  console.warn(`${results.failed.length} students failed to create`);
  // Failures are automatically logged to Sentry
}

// Use succeeded students
return NextResponse.json({
  students: results.succeeded,
  warnings: results.failed.length > 0 ? {
    failedCount: results.failed.length
  } : undefined
});
```

**Benefits**:
- ✅ Partial success tracking
- ✅ Automatic Sentry logging for failures
- ✅ No all-or-nothing failures
- ✅ Better user experience

---

## Retry Pattern

For operations that might fail transiently (network, timeouts):

```typescript
import { withRetry } from '@/lib/api-error-handler';

const result = await withRetry(
  () => externalApiCall(),
  {
    context: 'EXTERNAL_API_CALL',
    userId: user.id,
  },
  3, // Max 3 retries
  1000 // 1 second delay
);
```

**Auto-retries for**:
- Network timeouts
- Database connection failures
- Service unavailable errors

**Does NOT retry**:
- Validation errors (400)
- Authorization errors (401/403)
- Not found errors (404)

---

## Rollout Plan

### Phase 1: Critical Routes (Week 1) - HIGH PRIORITY

**Files to update** (in order):

1. **`/api/auth/check-email/route.ts`** ✅ DONE
   - Fixed user enumeration vulnerability
   - Added Sentry integration

2. **`/api/register/route.ts`** ✅ DONE
   - Demonstrated full pattern
   - Added batch operations
   - Added retry logic

3. **`/api/students/route.ts`** ⚠️ TODO
   - GET, POST, DELETE endpoints
   - Estimated: 30 minutes

4. **`/api/students/[id]/route.ts`** ⚠️ TODO
   - GET, PUT, DELETE endpoints
   - Estimated: 30 minutes

5. **`/api/profile/route.ts`** ⚠️ TODO
   - GET, POST, PUT endpoints
   - Estimated: 30 minutes

**Total Phase 1**: ~2 hours

### Phase 2: Admin Routes (Week 2) - MEDIUM PRIORITY

**Files to update**:

1. **`/api/admin/registrations/route.ts`**
   - GET, PUT endpoints
   - Estimated: 20 minutes

2. **`/api/admin/stats/route.ts`**
   - GET endpoint
   - Estimated: 15 minutes

3. **`/api/admin/waivers/route.ts`**
   - Multiple endpoints
   - Add admin auth check
   - Estimated: 30 minutes

4. **`/api/admin/notify/route.ts`**
   - POST endpoint
   - Estimated: 15 minutes

**Total Phase 2**: ~1.5 hours

### Phase 3: Supporting Routes (Week 3) - LOWER PRIORITY

**Files to update**:

1. **`/api/announcements/route.ts`**
   - GET endpoint
   - Add auth check
   - Estimated: 15 minutes

2. **`/api/announcements/[id]/route.ts`**
   - Multiple endpoints
   - Estimated: 20 minutes

3. **`/api/profile-status/route.ts`**
   - Estimated: 15 minutes

4. **`/api/waivers/status/route.ts`**
   - Estimated: 15 minutes

5. **`/api/webhooks/sendgrid/route.ts`**
   - Already has good error handling
   - Just add Sentry
   - Estimated: 10 minutes

**Total Phase 3**: ~1.25 hours

### Phase 4: Server Actions (Week 3)

**Files to update**:

1. **`/app/actions/send-welcome-email.ts`**
   - Add error logging and Sentry
   - Estimated: 10 minutes

**Total Phase 4**: ~10 minutes

---

## Implementation Checklist

For each API route, follow this checklist:

### 1. Import Utilities
```typescript
import {
  logApiError,
  createErrorResponse,
  batchOperation,
  validateRequestBody,
} from '@/lib/api-error-handler';
```

### 2. Add Request Validation (if applicable)
```typescript
const validation = validateRequestBody(body, ['requiredField1', 'requiredField2']);
if (!validation.valid) {
  return NextResponse.json(
    {
      error: 'Missing required fields',
      code: 'VALIDATION_ERROR',
      details: { missing: validation.missing },
      timestamp: new Date().toISOString(),
    },
    { status: 400 }
  );
}
```

### 3. Update Success Logging
```typescript
// Before
// No logging

// After
console.log(`[CONTEXT_NAME] Operation successful for user ${userId}`);
```

### 4. Update Error Handling
```typescript
// Replace this:
} catch (error) {
  console.error('Generic error:', error);
  return NextResponse.json({ error: 'Failed' }, { status: 500 });
}

// With this:
} catch (error) {
  logApiError(error, {
    context: 'SPECIFIC_CONTEXT',
    userId: user?.id,
    requestPath: req.url,
    requestMethod: req.method,
    additionalData: { /* relevant context */ },
  });

  return createErrorResponse(error, { context: 'SPECIFIC_CONTEXT' });
}
```

### 5. Update Batch Operations
```typescript
// Replace Promise.all() with batchOperation()
const results = await batchOperation(promises, {
  context: 'BATCH_CONTEXT',
  userId,
  additionalData: { count: promises.length },
});
```

### 6. Test the Endpoint
- ✅ Test success case
- ✅ Test validation errors
- ✅ Test unauthorized access
- ✅ Check Sentry dashboard for errors
- ✅ Verify logs have context

---

## Context Naming Convention

Use consistent, descriptive context strings:

**Pattern**: `<ENTITY>_<ACTION>`

**Examples**:
- `STUDENT_CREATE`
- `STUDENT_UPDATE`
- `STUDENT_DELETE`
- `STUDENT_GET`
- `STUDENTS_LIST`
- `PROFILE_UPDATE`
- `REGISTRATION_CREATE`
- `AUTH_SIGNUP`
- `AUTH_LOGIN`
- `ADMIN_STATS_GET`

**Why?**: Makes it easy to filter logs and Sentry errors by operation type.

---

## Sentry Tag Best Practices

Always include these tags:

```typescript
{
  context: 'OPERATION_NAME',      // What operation failed
  endpoint: '/api/students',       // Which endpoint
  method: 'POST',                  // HTTP method
}
```

Optional but recommended:
```typescript
{
  userId: 'user-123',             // Who was affected
  errorType: 'VALIDATION_ERROR',  // Type of error
  severity: 'error',              // Severity level
}
```

---

## Error Response Standards

All error responses should follow this format:

```typescript
{
  error: string;        // User-friendly message
  code: string;         // Machine-readable code
  timestamp: string;    // ISO 8601 timestamp
  details?: object;     // Optional details (dev mode only)
}
```

**Example**:
```json
{
  "error": "Invalid data provided",
  "code": "VALIDATION_ERROR",
  "timestamp": "2025-10-24T12:34:56.789Z",
  "details": {
    "missing": ["email", "password"]
  }
}
```

---

## Testing Your Implementation

### 1. Test Success Cases
```bash
# Should see contextual logging
curl -X GET https://yourdomain.com/api/students

# Check logs:
# [STUDENTS_GET] Retrieved 5 students for user abc123
```

### 2. Test Error Cases
```bash
# Trigger a validation error
curl -X POST https://yourdomain.com/api/students -d '{}'

# Should return:
# {
#   "error": "Missing required fields",
#   "code": "VALIDATION_ERROR",
#   "timestamp": "...",
#   "details": { "missing": ["name", "grade"] }
# }
```

### 3. Check Sentry
1. Visit Sentry dashboard
2. Look for events tagged with your context
3. Verify all context is present (userId, endpoint, method)
4. Check error grouping is working

### 4. Check Logs
```bash
# Vercel logs
vercel logs homerenrichment.com --since=10m

# Look for:
# [CONTEXT_NAME] messages
# Error details with full context
```

---

## Estimated Total Effort

| Phase | Routes | Time | Priority |
|-------|--------|------|----------|
| Phase 1 | 3 critical routes | 2 hours | HIGH |
| Phase 2 | 4 admin routes | 1.5 hours | MEDIUM |
| Phase 3 | 5 supporting routes | 1.25 hours | LOW |
| Phase 4 | 1 server action | 0.25 hours | LOW |
| **Total** | **13 files** | **5 hours** | - |

**Recommendation**: Complete Phase 1 before next production deployment.

---

## Benefits Summary

### Before This Update:
- ❌ 15+ API routes with no Sentry integration
- ❌ Inconsistent error logging
- ❌ Generic "Internal Server Error" messages
- ❌ Promise.all() failures take down entire operations
- ❌ No retry logic for transient failures
- ❌ User enumeration vulnerability
- ❌ Hardcoded credentials

### After This Update:
- ✅ 100% Sentry coverage on all errors
- ✅ Standardized contextual logging
- ✅ Specific error messages and codes
- ✅ Partial success tracking
- ✅ Automatic retry for transient failures
- ✅ Security vulnerabilities fixed
- ✅ No hardcoded credentials
- ✅ Better observability and debugging

---

## Next Steps

1. **This Week**: Implement Phase 1 (critical routes)
2. **Next Week**: Implement Phase 2 (admin routes)
3. **Week 3**: Implement Phase 3 (supporting routes)
4. **Ongoing**: Monitor Sentry for new error patterns

---

## Questions & Support

**Need help?** Refer to:
- **Code examples**: `/src/app/api/register/route.ts` (fully implemented)
- **Utilities**: `/src/lib/api-error-handler.ts` (documented)
- **Sentry docs**: `/docs/SENTRY-DEBUG-ENDPOINTS.md`
- **Testing guide**: `/docs/SENTRY-TESTING-GUIDE.md`

---

**Last Updated**: October 24, 2025
**Status**: Production-ready patterns
**Next Review**: After Phase 1 completion
