# Sentry Production Setup - Free Tier Optimized

**Status**: ✅ **CONFIGURED**
**Date**: 2025-10-24
**Tier**: Sentry Free Plan (10,000 errors/month)

## ✅ Configuration Summary

This setup is **optimized for the Sentry Free Tier** with:

- ✅ **Production-only error tracking** (no dev noise)
- ✅ **Smart sampling** to stay within quota (3-5% traces)
- ✅ **Aggressive noise filtering** (bots, health checks, network errors)
- ✅ **Source map upload** for readable stack traces
- ✅ **Release tracking** for issue grouping
- ✅ **No surprise billing** (rate limits enforced)

---

## 📊 Free Tier Budget Protection

### Sample Rates (Safe for Free Plan)

| Runtime    | Sample Rate | Purpose                  |
| ---------- | ----------- | ------------------------ |
| **Client** | 3%          | Browser performance      |
| **Server** | 5%          | API/Server performance   |
| **Edge**   | 2%          | Middleware performance   |
| **Replay** | 0% / 10%    | No sessions, 10% errors  |

### Event Filtering

✅ **Automatically filtered**:
- Bot traffic (crawlers, spiders)
- Health check endpoints (`/health`, `/status`, `/api/health`)
- Network errors (ECONNRESET, timeouts, aborts)
- Browser extension errors
- Localhost development errors
- ResizeObserver noise
- Chunk loading errors

---

## 🔧 Files Created

### 1. Sentry Configuration Files

```
sentry.client.config.ts   # Browser error tracking
sentry.server.config.ts   # Server-side error tracking
sentry.edge.config.ts     # Middleware/Edge runtime
instrumentation.ts        # Next.js instrumentation hook
```

### 2. Next.js Integration

```
next.config.js            # Sentry webpack plugin + source maps
```

---

## 🚀 How It Works

### In Development

```bash
# Sentry is DISABLED in development
bun run dev
# No errors sent to Sentry
```

### In Production

```bash
# Build with source maps
bun run build

# Source maps automatically uploaded via next.config.js
# Release tracking via SENTRY_RELEASE env var

# Deploy
vercel --prod
```

### Error Capture Flow

1. **Error occurs in production** → Sentry SDK captures it
2. **Filtered by beforeSend** → Bots, health checks dropped
3. **Checked against ignoreErrors** → Network noise dropped
4. **Rate limited** → Max events per day enforced
5. **Sent to Sentry** → With source maps for readable stack
6. **Grouped by release** → Easy to track which deploy broke

---

## 📋 Required Sentry UI Configuration

**IMPORTANT**: Configure these in the Sentry web UI to protect your quota.

### 1. Inbound Filters

Go to: **Settings → Inbound Filters**

Enable these filters:
- ✅ **Discard known web crawlers**
- ✅ **Filter out 404 errors**
- ✅ **Filter Network Errors**
- ✅ **Discard transactions below X duration** (optional)

### 2. Rate Limits

Go to: **Settings → Client Keys (DSN)**

Set **Rate Limit**: `100 events per day`

**This is your safety net** - prevents quota overrun even if sampling fails.

### 3. Issue Grouping

Go to: **Settings → Issue Grouping**

- ✅ **Enable grouping by fingerprint**
- ✅ **Enable grouping by stack trace**

---

## 🧪 Testing the Integration

### Test Error Capture (Development)

Create a test route at `src/app/api/sentry-test/route.ts`:

```typescript
import { NextResponse } from "next/server";

export async function GET() {
  // This will only send to Sentry in production
  throw new Error("Sentry Test Error - This should appear in Sentry");

  return NextResponse.json({ message: "This won't be reached" });
}
```

**In development**: Error logged to console only
**In production**: Error sent to Sentry

### Verify Source Maps

1. Deploy to production
2. Trigger an error
3. Check Sentry dashboard
4. Stack trace should show **original TypeScript/JSX**, not minified code

---

## 🔐 Environment Variables

### Required in .envrc (local)

```bash
# From Infisical
export SENTRY_ORG="$(infisical secrets get SENTRY_ORG --plain)"
export SENTRY_PROJECT="$(infisical secrets get SENTRY_PROJECT --plain)"
export NEXT_PUBLIC_SENTRY_DSN="$(infisical secrets get NEXT_PUBLIC_SENTRY_DSN --plain)"

# From gopass
export SENTRY_AUTH_TOKEN="$(gopass show sentry/happy-patterns-llc/auth-token)"

# Git-based release tracking
export SENTRY_RELEASE="$(git rev-parse --short HEAD)"
```

### Required in Vercel

Add these environment variables in Vercel project settings:

| Variable                    | Value                         | Environment |
| --------------------------- | ----------------------------- | ----------- |
| `NEXT_PUBLIC_SENTRY_DSN`    | (from Infisical)              | Production  |
| `SENTRY_ORG`                | (from Infisical)              | Production  |
| `SENTRY_PROJECT`            | (from Infisical)              | Production  |
| `SENTRY_AUTH_TOKEN`         | (from gopass or Infisical)    | Production  |
| `SENTRY_RELEASE`            | `$VERCEL_GIT_COMMIT_SHA`      | Production  |

---

## 📈 Monitoring Your Quota

### Check Usage

1. Go to **Sentry Dashboard** → **Stats**
2. Monitor: **Events Accepted** vs **Events Dropped**
3. Adjust sample rates if needed

### If You're Hitting Limits

**Reduce sample rates** in config files:

```typescript
// sentry.client.config.ts
tracesSampleRate: 0.01, // Lower from 0.03 to 1%

// sentry.server.config.ts
tracesSampleRate: 0.02, // Lower from 0.05 to 2%
```

**Add more filters** in `beforeSend`:

```typescript
beforeSend(event) {
  // Example: Filter specific routes
  if (event.request?.url?.includes("/api/webhooks")) {
    return null;
  }
  return event;
}
```

---

## 🎯 What You Get

✅ **Production error monitoring** with full context
✅ **Source-mapped stack traces** for easy debugging
✅ **Release tracking** to know which deploy broke
✅ **Performance insights** (3-5% sampling)
✅ **Error replays** on 10% of error sessions
✅ **Zero dev noise** (production-only)
✅ **Budget protection** (rate limits + filtering)
✅ **Free forever** (within 10k events/month)

---

## 🔗 Quick Links

- **Sentry Dashboard**: https://sentry.io/organizations/happy-patterns-llc/
- **Project Issues**: https://sentry.io/organizations/happy-patterns-llc/projects/javascript-nextjs/
- **Releases**: https://sentry.io/organizations/happy-patterns-llc/releases/

---

## 📚 Related Documentation

- `docs/SENTRY-READY.md` - Quick reference
- `docs/SENTRY-QUICKSTART.md` - 5-minute setup
- `docs/SENTRY-CLI-GUIDE.md` - CLI reference
- `scripts/sentry-release.sh` - Release automation

---

## ✅ Checklist

**Code Configuration**:
- [x] Sentry SDK installed (`@sentry/nextjs`)
- [x] Client config created (`sentry.client.config.ts`)
- [x] Server config created (`sentry.server.config.ts`)
- [x] Edge config created (`sentry.edge.config.ts`)
- [x] Instrumentation added (`instrumentation.ts`)
- [x] Next.js config updated (`next.config.js`)

**Environment Setup**:
- [x] `.envrc` configured with Sentry variables
- [ ] Vercel environment variables added
- [ ] Rate limit set in Sentry UI (100 events/day)
- [ ] Inbound filters enabled in Sentry UI

**Testing**:
- [ ] Build successful with source maps
- [ ] Test error sent to Sentry (production)
- [ ] Source maps working (readable stack traces)
- [ ] Release tracking verified

---

**Status**: Ready for production deployment 🚀
