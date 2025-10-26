# Sentry Debug & Test Endpoints

**Status**: Deployed
**Date**: 2025-10-24
**Purpose**: Comprehensive debugging suite for Sentry integration

## Overview

This suite of 7 debug endpoints was created to diagnose and verify server-side Sentry functionality in production. These endpoints bypass normal initialization paths and use direct approaches to isolate issues.

**Use these endpoints to:**
- Verify Sentry SDK initialization
- Test network connectivity to Sentry
- Validate environment variables
- Debug why errors aren't appearing in dashboard
- Compare SDK vs raw HTTP approaches

## Quick Test Sequence

Test these in order for systematic diagnosis:

1. **Start with**: `/api/sentry-raw-test` (bypasses SDK)
2. **Then try**: `/api/sentry-status` (comprehensive diagnostics)
3. **If needed**: `/api/sentry-minimal-test` (isolated SDK test)
4. **Advanced**: `/api/sentry-force-test` (aggressive initialization)

---

## Available Endpoints

### 1. `/api/sentry-raw-test`
**Most Important - Test This First**

Bypasses the Sentry SDK completely and sends events directly to Sentry's HTTP API.

**Purpose**: Determine if the issue is SDK-related or network-related

**Method**: `GET`

**What it does**:
- Sends raw HTTP POST to Sentry's ingest API
- Uses hardcoded project credentials
- Sends both a message and an error event
- Returns response status from Sentry

**Response**:
```json
{
  "timestamp": "2025-10-24T12:34:56.789Z",
  "tests": {
    "directHttp": {
      "status": 200,
      "statusText": "OK",
      "ok": true,
      "eventId": "abc123...",
      "message": "[RAW-TEST] Direct HTTP test at ..."
    },
    "directError": {
      "status": 200,
      "ok": true,
      "eventId": "def456..."
    }
  },
  "success": true,
  "instructions": "Direct HTTP to Sentry works! Check dashboard for events..."
}
```

**What the results mean**:
- ✅ `success: true` → Network connectivity is fine, issue is SDK initialization
- ❌ `success: false` → Network/firewall blocking Sentry requests

**Example**:
```bash
curl https://homerenrichment.com/api/sentry-raw-test
```

**Code**: `src/app/api/sentry-raw-test/route.ts:1`

---

### 2. `/api/sentry-status`
**Comprehensive Status Check**

Returns complete diagnostic information about Sentry's configuration and attempts test captures.

**Purpose**: Get full picture of Sentry status and configuration

**Method**: `GET`

**What it does**:
- Checks if Sentry client is initialized
- Validates DSN configuration
- Shows environment variables
- Tests capture capabilities
- Returns detailed configuration options

**Response**:
```json
{
  "message": "Sentry diagnostic information",
  "status": {
    "initialized": true,
    "environment": {
      "NODE_ENV": "production",
      "VERCEL_ENV": "production",
      "VERCEL": "1"
    },
    "dsn": {
      "present": true,
      "value": "https://4f44009c4ef6950362e6cba83db7c7ab@o...",
      "fromClient": "https://4f44009c4ef6950362e6cba83db7c7ab@o..."
    },
    "client": {
      "exists": true,
      "enabled": true,
      "environment": "production",
      "release": "abc123commit",
      "tracesSampleRate": 0.05
    },
    "test": {
      "captureTestMessage": true,
      "captureTestError": true,
      "eventId": "test-event-123"
    }
  },
  "instructions": {
    "checkDashboard": "Look for: '[DIAGNOSTIC] Sentry status check...'",
    "dashboardUrl": "https://sentry.io/...",
    "vercelLogs": "Check Vercel function logs for [SENTRY-STATUS]",
    "nextSteps": "Sentry appears to be initialized..."
  }
}
```

**Key fields to check**:
- `status.initialized` - Is Sentry SDK initialized?
- `status.dsn.present` - Is DSN env var set?
- `status.client.enabled` - Is Sentry enabled?
- `status.test.captureTestMessage` - Can it capture events?

**Example**:
```bash
curl https://homerenrichment.com/api/sentry-status
```

**Code**: `src/app/api/sentry-status/route.ts:1`

---

### 3. `/api/sentry-debug`
**Basic Debug Information**

Returns diagnostic information and captures a test event (production only).

**Purpose**: Quick debug check with minimal overhead

**Method**: `GET`

**What it does**:
- Shows environment configuration
- Validates DSN presence
- Captures test message in production
- Returns Sentry client status

**Response** (production):
```json
{
  "environment": "production",
  "nextRuntime": "nodejs",
  "sentryDsnConfigured": true,
  "sentryDsnValue": "https://4f44009c4ef6950362e6cba83db7c7ab@o...",
  "sentryOrgConfigured": true,
  "sentryProjectConfigured": true,
  "sentryAuthTokenConfigured": true,
  "sentryReleaseConfigured": true,
  "sentryReleaseValue": "abc123",
  "sentryClientExists": true,
  "sentryEnabled": true,
  "sentryDsnInClient": "https://...",
  "timestamp": "2025-10-24T12:34:56.789Z",
  "testEventId": "event-123",
  "message": "Test event sent to Sentry. Check dashboard..."
}
```

**Example**:
```bash
curl https://homerenrichment.com/api/sentry-debug
```

**Code**: `src/app/api/sentry-debug/route.ts:1`

---

### 4. `/api/sentry-force-test`
**Force Initialization Test**

Uses the aggressive `server-sentry.ts` library to force Sentry initialization.

**Purpose**: Test if forcing initialization resolves the issue

**Method**: `GET`

**What it does**:
- Force initializes Sentry using `forceInitSentry()`
- Runs comprehensive test suite
- Captures test error with context
- **Intentionally throws error** to test error boundaries

**Response**:
```json
{
  "success": true,
  "timestamp": "2025-10-24T12:34:56.789Z",
  "testResults": {
    "initialized": true,
    "testMessageId": "msg-123",
    "testErrorId": "err-456"
  },
  "errorId": "captured-error-789",
  "environment": {
    "NODE_ENV": "production",
    "VERCEL_ENV": "production",
    "NEXT_PUBLIC_SENTRY_DSN": true
  },
  "instructions": "Check your Sentry dashboard for test errors"
}
```

**Note**: This endpoint throws an error after sending the response, so you'll see an error in Vercel logs - this is intentional!

**Example**:
```bash
curl https://homerenrichment.com/api/sentry-force-test
```

**Code**: `src/app/api/sentry-force-test/route.ts:1`

---

### 5. `/api/sentry-minimal-test`
**Minimal SDK Test**

Creates a new Sentry client from scratch with hardcoded DSN.

**Purpose**: Test SDK in isolation without any existing initialization

**Method**: `GET`

**What it does**:
- Dynamically imports Sentry SDK
- Creates new `NodeClient` with hardcoded DSN
- Creates new Hub and makes it current
- Sends message and error
- Flushes events
- **Throws error** to test

**Response**: Throws error (check Vercel logs)

**What to check**:
- Look for `[MINIMAL-TEST]` in Vercel function logs
- Check for events in Sentry dashboard
- If this works but normal SDK doesn't, initialization is the issue

**Example**:
```bash
curl https://homerenrichment.com/api/sentry-minimal-test
# Will return 500 error (intentional)
# Check Vercel logs for [MINIMAL-TEST] entries
```

**Code**: `src/app/api/sentry-minimal-test/route.ts:1`

---

### 6. `/api/sentry-test`
**Basic Test Error**

Simple endpoint that throws an error to test basic Sentry error capture.

**Purpose**: Quick smoke test

**Method**: `GET`

**What it does**:
- Simply throws an error
- Relies on normal Sentry error boundaries to capture it

**Response**: 500 error (if Sentry works, will be captured)

**Example**:
```bash
curl https://homerenrichment.com/api/sentry-test
# Check Sentry dashboard for error
```

**Code**: `src/app/api/sentry-test/route.ts:1`

---

### 7. `/api/sentry-dsn-test`
**DSN Validation Test**

Tests DSN configuration and validity.

**Purpose**: Verify DSN format and accessibility

**Method**: `GET`

**What it does**:
- Validates DSN format
- Checks DSN accessibility
- Tests project ID extraction

**Example**:
```bash
curl https://homerenrichment.com/api/sentry-dsn-test
```

**Code**: `src/app/api/sentry-dsn-test/route.ts:1`

---

## Helper Library: `server-sentry.ts`

Location: `src/lib/server-sentry.ts:1`

This module provides utilities for server-side Sentry operations:

### Functions

#### `forceInitSentry(): boolean`
Forces Sentry initialization for server-side operations.

**Returns**: `true` if successful, `false` otherwise

**Features**:
- Uses fallback DSN if env var missing
- Closes existing client before reinitializing
- Enables debug mode
- 100% trace sampling for testing
- Comprehensive logging

**Usage**:
```typescript
import { forceInitSentry } from '@/lib/server-sentry';

forceInitSentry();
```

#### `captureServerError(error, context?): Promise<string | null>`
Captures an error with forced initialization.

**Parameters**:
- `error`: Error object or unknown
- `context`: Optional record with additional data

**Returns**: Event ID or null if failed

**Usage**:
```typescript
import { captureServerError } from '@/lib/server-sentry';

try {
  // Your code
} catch (error) {
  await captureServerError(error, {
    endpoint: '/api/my-endpoint',
    userId: user.id,
  });
}
```

#### `testSentry(): Promise<TestResult>`
Runs comprehensive Sentry test.

**Returns**: Object with initialization status and test event IDs

**Usage**:
```typescript
import { testSentry } from '@/lib/server-sentry';

const results = await testSentry();
console.log(results.initialized); // true/false
```

---

## Troubleshooting Guide

### Issue: Raw HTTP works, but SDK doesn't

**Diagnosis**: SDK initialization problem

**Solutions**:
1. Check Next.js 15 compatibility issues
2. Verify `instrumentation.ts` is being called
3. Check if middleware is interfering (Edge vs Node runtime)
4. Try the `sentry-minimal-test` endpoint

### Issue: Raw HTTP fails

**Diagnosis**: Network/firewall problem

**Solutions**:
1. Check Vercel firewall settings
2. Verify DSN is correct
3. Check if Sentry service is operational (status.sentry.io)
4. Review Vercel function logs for network errors

### Issue: Events sent but not appearing in dashboard

**Diagnosis**: Filtering or quota issues

**Solutions**:
1. Check Sentry project settings > Inbound Filters
2. Verify project quota hasn't been exceeded
3. Check if events are being filtered by `beforeSend`
4. Look in Sentry > Settings > Projects > Inbound Data Filters

### Issue: Initialization successful but captures don't work

**Diagnosis**: Flush timing or transport issues

**Solutions**:
1. Ensure `await Sentry.flush(2000)` is called before function ends
2. Increase flush timeout to 5000ms
3. Check `transportOptions.timeout` in config
4. Verify Vercel function isn't timing out

---

## Interpreting Vercel Logs

Each endpoint logs with a specific prefix:

| Prefix | Endpoint | What to look for |
|--------|----------|------------------|
| `[RAW-TEST]` | `/api/sentry-raw-test` | HTTP response status, event IDs |
| `[SENTRY-STATUS]` | `/api/sentry-status` | Initialization status, config details |
| `[MINIMAL-TEST]` | `/api/sentry-minimal-test` | Direct SDK initialization, event sends |
| `[FORCE-TEST]` | `/api/sentry-force-test` | Force init results, test captures |
| `[SERVER-SENTRY]` | (All using library) | Initialization, captures, flushes |

**How to view logs**:
```bash
# Using Vercel CLI
vercel logs homerenrichment.com

# Or visit Vercel dashboard
# Project > Deployments > [Latest] > Functions > Logs
```

---

## Testing Checklist

Use this checklist when testing Sentry integration:

- [ ] Test `/api/sentry-raw-test` - Verify network connectivity
- [ ] Check Sentry dashboard for raw test events
- [ ] Test `/api/sentry-status` - Check initialization status
- [ ] Verify DSN is present in status response
- [ ] Test `/api/sentry-debug` - Quick diagnostic
- [ ] Test `/api/sentry-force-test` - Force initialization
- [ ] Check Vercel function logs for error details
- [ ] Test `/api/sentry-minimal-test` - Isolated SDK test
- [ ] Verify events appear in Sentry within 1-2 minutes
- [ ] Check Sentry > Issues for test events
- [ ] Review Sentry > Settings > Inbound Filters
- [ ] Confirm error sampling rate (5% for server, 3% for client)

---

## Security Note

These test endpoints are designed for debugging and should be:
- Protected in production (add authentication if needed)
- Removed or disabled after debugging is complete
- Only used in authorized testing environments

Consider adding IP restrictions or API keys for production use.

---

## Production Configuration

After debugging, adjust sampling rates in config files:

**Server-side** (`sentry.server.config.ts:1`):
```typescript
tracesSampleRate: 0.05, // 5% in production (currently 100% for testing)
```

**Client-side** (`sentry.client.config.ts:1`):
```typescript
tracesSampleRate: 0.03, // 3% in production
```

**Force init** (`src/lib/server-sentry.ts:69`):
```typescript
tracesSampleRate: 0.05, // Currently 1.0 for testing
```

---

## Related Documentation

- [SENTRY-READY.md](SENTRY-READY.md) - Quick reference and setup
- [SENTRY-TESTING-GUIDE.md](SENTRY-TESTING-GUIDE.md) - Comprehensive testing guide
- [SENTRY-DEPLOYMENT-READY.md](SENTRY-DEPLOYMENT-READY.md) - Deployment instructions
- [SENTRY-CONFIGURATION-SUMMARY.md](SENTRY-CONFIGURATION-SUMMARY.md) - Configuration details

---

**Last Updated**: 2025-10-24
**Maintainer**: Development Team
**Status**: Active debugging suite
