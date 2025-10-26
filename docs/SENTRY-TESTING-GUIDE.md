# Sentry Testing & Verification Guide

**Status**: Production-Ready
**Date**: 2025-10-24
**Purpose**: Comprehensive guide for testing and verifying Sentry integration

## Overview

This guide walks you through testing your Sentry integration from development to production. It covers local testing, deployment verification, and troubleshooting common issues.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Testing](#local-testing)
3. [Production Testing](#production-testing)
4. [Test Sequence](#test-sequence)
5. [Interpreting Results](#interpreting-results)
6. [Common Issues](#common-issues)
7. [Advanced Testing](#advanced-testing)

---

## Prerequisites

### Required Environment Variables

Verify these are set before testing:

```bash
# Check local environment
echo $SENTRY_ORG                # Your Sentry organization slug
echo $SENTRY_PROJECT            # Your Sentry project slug
echo $SENTRY_AUTH_TOKEN         # Your auth token
echo $NEXT_PUBLIC_SENTRY_DSN    # Your project DSN

# All should return values, not empty strings
```

If any are missing, set them up using the [SENTRY-READY.md](SENTRY-READY.md) guide.

### Verify Sentry CLI

```bash
bun run sentry:status

# Expected output:
# Sentry Server: https://sentry.io/
# Default Organization: <your-org>
# Default Project: <your-project>
# Authentication Info:
#   Auth token: present
```

### Build the Application

```bash
bun run build
# Ensure no build errors
```

---

## Local Testing

### 1. Development Environment Testing

Sentry **only sends events in production** by default. To test locally:

**Option A: Use NODE_ENV=production**
```bash
NODE_ENV=production bun run dev
```

**Option B: Enable in development** (temporary)
```typescript
// In sentry.client.config.ts or sentry.server.config.ts
Sentry.init({
  // ... other options
  enabled: true, // Add this temporarily
});
```

### 2. Test Client-Side Errors

Visit the interactive test page:

```bash
# Start dev server
bun run dev

# Visit in browser
open http://localhost:3000/test-sentry
```

**What to test**:
- Click "Throw Client Error" button
- Check browser console for Sentry logs
- Verify error appears in Sentry dashboard

### 3. Test Server-Side Errors

**Using API endpoint**:
```bash
# In production mode
NODE_ENV=production curl http://localhost:3000/api/sentry-test
```

**Expected**:
- 500 error response
- Error logged to console
- Event sent to Sentry (production only)

---

## Production Testing

### Recommended Test Sequence

Test these endpoints **in order** after deployment:

#### Step 1: Test Raw HTTP (Most Important)

```bash
curl https://homerenrichment.com/api/sentry-raw-test
```

**Why first?**: Determines if issue is network-related or SDK-related

**What to check**:
```json
{
  "success": true,  // ← Should be true
  "tests": {
    "directHttp": {
      "ok": true,   // ← Should be true
      "status": 200 // ← Should be 200
    }
  }
}
```

**Interpretation**:
- ✅ `success: true` → Network is fine, check SDK initialization
- ❌ `success: false` → Network/firewall issue, contact Vercel support

#### Step 2: Check Status

```bash
curl https://homerenrichment.com/api/sentry-status
```

**What to check**:
```json
{
  "status": {
    "initialized": true,        // ← Should be true
    "dsn": {
      "present": true           // ← Should be true
    },
    "client": {
      "exists": true,           // ← Should be true
      "enabled": true           // ← Should be true
    },
    "test": {
      "captureTestMessage": true // ← Should be true
    }
  }
}
```

**Interpretation**:
- All `true` → Sentry configured correctly
- `initialized: false` → Check DSN in Vercel env vars
- `enabled: false` → Check config files

#### Step 3: Force Test

```bash
curl https://homerenrichment.com/api/sentry-force-test
```

**What to check**:
```json
{
  "success": true,               // ← Should be true
  "testResults": {
    "initialized": true,         // ← Should be true
    "testMessageId": "abc123",   // ← Should have value
    "testErrorId": "def456"      // ← Should have value
  }
}
```

**Note**: This endpoint throws an error intentionally - check Vercel logs!

#### Step 4: Verify in Dashboard

1. Open your Sentry dashboard:
   ```bash
   open "https://sentry.io/organizations/$SENTRY_ORG/issues/?project=YOUR_PROJECT_ID"
   ```

2. Look for these test events:
   - `[RAW-TEST] Direct HTTP test...`
   - `[DIAGNOSTIC] Sentry status check...`
   - `[FORCE-TEST] Server error...`
   - `[MINIMAL-TEST] Direct test error...`

3. Events should appear within **1-2 minutes**

#### Step 5: Check Vercel Logs

```bash
# Using Vercel CLI
vercel logs homerenrichment.com --since=10m

# Or in Vercel dashboard
# Project > Deployments > [Latest] > Functions > View Logs
```

**Look for these patterns**:
- `[RAW-TEST]` - Raw HTTP test results
- `[SENTRY-STATUS]` - Status check results
- `[SERVER-SENTRY]` - Initialization logs
- `[FORCE-TEST]` - Force test results

---

## Test Sequence Summary

| Step | Endpoint | Tests | Time | Critical |
|------|----------|-------|------|----------|
| 1 | `/api/sentry-raw-test` | Network connectivity | 30s | ✅ YES |
| 2 | `/api/sentry-status` | Configuration & init | 1m | ✅ YES |
| 3 | `/api/sentry-force-test` | Force initialization | 1m | ⚠️ If issues |
| 4 | Dashboard check | Event delivery | 2m | ✅ YES |
| 5 | Vercel logs | Detailed diagnostics | 2m | ⚠️ If issues |

**Total time**: ~6 minutes for complete verification

---

## Interpreting Results

### Scenario 1: Everything Works ✅

**Signs**:
- Raw test: `success: true`
- Status: `initialized: true`
- Events appear in dashboard
- No errors in Vercel logs

**Next steps**:
- Reduce sampling rates (see [Production Configuration](#production-configuration))
- Consider disabling debug endpoints
- Monitor for real errors

### Scenario 2: Raw HTTP Works, SDK Doesn't ⚠️

**Signs**:
- Raw test: `success: true`
- Status: `initialized: false`
- No events in dashboard (except raw test)

**Likely cause**: SDK initialization issue

**Solutions**:
1. Check `instrumentation.ts` is registered:
   ```typescript
   // instrumentation.ts
   export async function register() {
     // Should be called automatically
   }
   ```

2. Verify Next.js version compatibility:
   ```bash
   grep '"next"' package.json
   # Should be compatible with @sentry/nextjs
   ```

3. Check middleware runtime:
   ```typescript
   // middleware.ts
   export const config = {
     matcher: '/((?!_next/static|_next/image|favicon.ico).*)',
   };
   ```

4. Try minimal test:
   ```bash
   curl https://homerenrichment.com/api/sentry-minimal-test
   ```

### Scenario 3: Nothing Works ❌

**Signs**:
- Raw test: `success: false`
- Status: `initialized: false`
- No events anywhere

**Likely cause**: Network/firewall or DSN issue

**Solutions**:
1. Verify DSN in Vercel:
   ```bash
   # In Vercel dashboard
   # Project Settings > Environment Variables
   # Check NEXT_PUBLIC_SENTRY_DSN exists and is correct
   ```

2. Check Sentry project status:
   ```bash
   open "https://status.sentry.io"
   ```

3. Test DSN format:
   ```bash
   curl https://homerenrichment.com/api/sentry-dsn-test
   ```

4. Contact Vercel support for firewall settings

### Scenario 4: Events Sent But Not in Dashboard 🤔

**Signs**:
- Test returns event IDs
- Logs show "Event sent"
- Dashboard shows nothing

**Likely cause**: Filtering or quota

**Solutions**:
1. Check Sentry inbound filters:
   ```
   Sentry Dashboard > Settings > Projects > [Your Project] > Inbound Filters
   ```

2. Check quota:
   ```
   Sentry Dashboard > Settings > Subscription
   ```

3. Check `beforeSend` filtering:
   ```typescript
   // sentry.server.config.ts
   beforeSend(event, hint) {
     console.log('beforeSend called:', event.event_id);
     return event; // Make sure it's not filtering
   }
   ```

4. Wait longer (events can take up to 5 minutes)

---

## Common Issues

### Issue: "Production only" Response

**Symptom**:
```json
{ "error": "Production only" }
```

**Cause**: Testing in development/preview environment

**Solution**:
```bash
# Test on production deployment only
curl https://homerenrichment.com/api/sentry-test
# NOT: curl https://preview.vercel.app/api/sentry-test
```

### Issue: "Sentry not initialized"

**Symptom**:
```json
{ "initialized": false }
```

**Cause**: DSN not set or initialization failed

**Solution**:
```bash
# Check Vercel env vars
vercel env ls

# Should show NEXT_PUBLIC_SENTRY_DSN

# If missing, add it:
vercel env add NEXT_PUBLIC_SENTRY_DSN
```

### Issue: Events Not Flushing

**Symptom**: Logs show "Event sent" but no event ID

**Cause**: Function terminates before flush completes

**Solution**:
```typescript
// Always await flush
await Sentry.flush(5000); // Increase timeout to 5s
```

### Issue: Source Maps Not Working

**Symptom**: Stack traces show minified code

**Cause**: Source maps not uploaded

**Solution**:
```bash
# After build, upload source maps
bun run build
bun run sentry:release production

# Verify maps were uploaded
sentry-cli releases files $(git rev-parse HEAD) list
```

---

## Advanced Testing

### Testing with Custom Events

```typescript
// Send custom event with context
import * as Sentry from '@sentry/nextjs';

Sentry.captureException(new Error('Test error'), {
  tags: {
    component: 'auth',
    test: 'true',
  },
  extra: {
    userId: '123',
    action: 'login',
  },
  level: 'error',
});

await Sentry.flush(2000);
```

### Testing Performance Monitoring

```typescript
import * as Sentry from '@sentry/nextjs';

const transaction = Sentry.startTransaction({
  name: 'test-transaction',
  op: 'test',
});

// Do some work
await someSlowOperation();

transaction.finish();
await Sentry.flush(2000);
```

### Testing with Breadcrumbs

```typescript
import * as Sentry from '@sentry/nextjs';

Sentry.addBreadcrumb({
  category: 'auth',
  message: 'User logged in',
  level: 'info',
});

Sentry.addBreadcrumb({
  category: 'navigation',
  message: 'Navigated to dashboard',
  level: 'info',
});

// Trigger error
throw new Error('Test error with breadcrumbs');
```

### Load Testing

```bash
# Send 10 test requests
for i in {1..10}; do
  curl https://homerenrichment.com/api/sentry-test &
done
wait

# Check rate limiting in Sentry
# Dashboard > Settings > Projects > Rate Limits
```

---

## Production Configuration

After successful testing, adjust sampling rates:

### Server-Side Config

Edit `sentry.server.config.ts:69`:
```typescript
Sentry.init({
  // ...
  tracesSampleRate: 0.05, // 5% (change from 1.0)
});
```

### Client-Side Config

Edit `sentry.client.config.ts:1`:
```typescript
Sentry.init({
  // ...
  tracesSampleRate: 0.03, // 3%
  replaysSessionSampleRate: 0.03, // 3%
  replaysOnErrorSampleRate: 1.0, // 100% on errors
});
```

### Force Init Library

Edit `src/lib/server-sentry.ts:69`:
```typescript
Sentry.init({
  // ...
  tracesSampleRate: 0.05, // 5% (change from 1.0)
  debug: false, // Disable debug mode
});
```

### Disable Debug Endpoints

**Option A: Add authentication**
```typescript
// src/middleware.ts
export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api/sentry-')) {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.DEBUG_API_KEY}`) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
  }
}
```

**Option B: Remove endpoints**
```bash
# Delete test endpoints
rm -rf src/app/api/sentry-debug
rm -rf src/app/api/sentry-raw-test
rm -rf src/app/api/sentry-minimal-test
rm -rf src/app/api/sentry-force-test
# Keep sentry-status for monitoring
```

---

## Monitoring Checklist

After deployment, monitor these:

- [ ] Check Sentry dashboard daily for new issues
- [ ] Set up Sentry alerts for critical errors
- [ ] Review error trends weekly
- [ ] Monitor quota usage (Settings > Subscription)
- [ ] Review and triage issues regularly
- [ ] Update sampling rates based on volume
- [ ] Check for degraded performance (slow transactions)
- [ ] Review and resolve high-volume errors

---

## Testing Automation

### Create a Test Script

```bash
#!/bin/bash
# test-sentry.sh

BASE_URL="https://homerenrichment.com"

echo "Testing Sentry integration..."

echo -e "\n1. Testing raw HTTP..."
curl -s "$BASE_URL/api/sentry-raw-test" | jq '.success'

echo -e "\n2. Checking status..."
curl -s "$BASE_URL/api/sentry-status" | jq '.status.initialized'

echo -e "\n3. Force test..."
curl -s "$BASE_URL/api/sentry-force-test" | jq '.success'

echo -e "\nDone! Check dashboard for events."
```

Make executable:
```bash
chmod +x test-sentry.sh
./test-sentry.sh
```

### Add to CI/CD

```yaml
# .github/workflows/test-sentry.yml
name: Test Sentry
on:
  deployment_status:
    types: [success]

jobs:
  test:
    runs-on: ubuntu-latest
    if: github.event.deployment_status.state == 'success'
    steps:
      - name: Test Sentry Raw
        run: |
          response=$(curl -s ${{ env.DEPLOYMENT_URL }}/api/sentry-raw-test)
          success=$(echo $response | jq -r '.success')
          if [ "$success" != "true" ]; then
            echo "Sentry test failed!"
            exit 1
          fi
```

---

## Related Documentation

- [SENTRY-DEBUG-ENDPOINTS.md](SENTRY-DEBUG-ENDPOINTS.md) - Debug endpoint reference
- [SENTRY-READY.md](SENTRY-READY.md) - Quick setup guide
- [SENTRY-DEPLOYMENT-READY.md](SENTRY-DEPLOYMENT-READY.md) - Deployment instructions
- [SENTRY-CONFIGURATION-SUMMARY.md](SENTRY-CONFIGURATION-SUMMARY.md) - Configuration details

---

## Getting Help

If you're stuck:

1. **Check Vercel logs** for detailed error messages
2. **Review Sentry dashboard** for rejected/filtered events
3. **Test raw HTTP endpoint** to isolate network issues
4. **Check environment variables** in Vercel dashboard
5. **Review this guide's** troubleshooting section
6. **Contact support**:
   - Sentry: https://sentry.io/support/
   - Vercel: https://vercel.com/support

---

**Last Updated**: 2025-10-24
**Maintainer**: Development Team
**Status**: Production-ready testing guide
