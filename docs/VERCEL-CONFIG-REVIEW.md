# Vercel Configuration Review

## Current Configuration (`vercel.json`)

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "nextjs",
  "installCommand": "bun install",
  "buildCommand": "bun run build",
  "functions": {
    "app/api/webhooks/**/*.ts": {
      "maxDuration": 30
    }
  }
}
```

### Status: ✅ GOOD

The current configuration is solid and follows best practices for a Next.js + Bun project.

## Analysis

### What's Working Well

1. **Framework Detection** ✅
   ```json
   "framework": "nextjs"
   ```
   - Correctly identifies Next.js
   - Enables automatic optimizations

2. **Bun Integration** ✅
   ```json
   "installCommand": "bun install",
   "buildCommand": "bun run build"
   ```
   - Uses Bun as package manager
   - Faster than npm/yarn
   - Consistent with project setup

3. **Webhook Timeout** ✅
   ```json
   "functions": {
     "app/api/webhooks/**/*.ts": {
       "maxDuration": 30
     }
   }
   ```
   - 30 seconds for webhooks (good for async operations)
   - Prevents premature timeouts

## Recommended Enhancements

### Optional Improvements

These are **optional** enhancements. The current config works fine!

#### 1. Add Default API Timeout

```json
{
  "functions": {
    "app/api/webhooks/**/*.ts": {
      "maxDuration": 30
    },
    "app/api/**/*.ts": {
      "maxDuration": 10
    }
  }
}
```

**Why**: Sets default 10s timeout for non-webhook APIs (Vercel default is 10s anyway, this makes it explicit)

#### 2. Specify Region

```json
{
  "regions": ["iad1"]
}
```

**Why**:
- `iad1` = US East (Virginia)
- Closer to Alaska than other regions
- Lower latency for Alaska users
- Consider `sfo1` (San Francisco) if West Coast is better

**Other region options**:
- `sfo1` - San Francisco (closest to Alaska)
- `pdx1` - Portland
- `iad1` - Washington DC

#### 3. Add Security Headers

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "SAMEORIGIN"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "camera=(), microphone=(), geolocation=()"
        }
      ]
    }
  ]
}
```

**Why**: Adds security headers to all responses

#### 4. Add Health Check Rewrite

```json
{
  "rewrites": [
    {
      "source": "/health",
      "destination": "/api/health"
    }
  ]
}
```

**Why**: Allows monitoring tools to check `/health` instead of `/api/health`

## Migration Path

### If You Want to Apply Enhancements

```bash
# 1. Backup current config
cp vercel.json vercel.json.backup

# 2. Apply recommended config
cp vercel.json.recommended vercel.json

# 3. Test locally
vercel build

# 4. Deploy to preview first
vercel

# 5. If all looks good, deploy to production
vercel --prod
```

### If Current Config is Fine

**Do nothing!** The current configuration is production-ready.

Only apply enhancements if you need:
- Regional optimization
- Additional security headers
- Custom URL rewrites
- Specific timeout controls

## Production Checklist

### Environment Variables

Ensure these are set in Vercel dashboard:

**Required**:
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `DATABASE_URL`
- [ ] `DIRECT_URL`
- [ ] `NEXT_PUBLIC_APP_URL`
- [ ] `NEXTAUTH_SECRET`
- [ ] `JWT_SECRET`

**Optional**:
- [ ] `SENDGRID_API_KEY`
- [ ] `SENDGRID_TEMPLATE_*`
- [ ] `NEXT_PUBLIC_SENTRY_DSN`
- [ ] `SENTRY_AUTH_TOKEN` (build-time only)

### Domain Configuration

- [ ] Custom domain configured: `kbe.homerenrichment.com`
- [ ] HTTPS enabled (automatic with Vercel)
- [ ] DNS records pointing to Vercel

### Git Integration

- [ ] Repository connected to Vercel
- [ ] Auto-deploy enabled for `main` branch
- [ ] Preview deployments enabled for PRs

### Build Configuration

- [ ] Build command: `bun run build` ✅
- [ ] Install command: `bun install` ✅
- [ ] Output directory: `.next` (automatic)
- [ ] Node.js version: 22.x (from `package.json` engines)

### Function Configuration

- [ ] Webhook timeout: 30s ✅
- [ ] Default API timeout: 10s (default)
- [ ] Region: Auto (or specify if needed)

## Comparison: Current vs Recommended

| Feature | Current | Recommended | Priority |
|---------|---------|-------------|----------|
| Framework | ✅ nextjs | Same | - |
| Bun commands | ✅ Configured | Same | - |
| Webhook timeout | ✅ 30s | Same | - |
| Default API timeout | ⚠️ Implicit (10s) | Explicit 10s | Low |
| Region | ⚠️ Auto | Specify `sfo1` or `iad1` | Low |
| Security headers | ❌ None | Add security headers | Medium |
| Health check | ❌ None | Add rewrite | Low |

## Recommendation

### Keep Current Config If:
- Everything is working fine
- No latency issues reported
- Security is handled elsewhere (middleware, etc.)

### Apply Recommended Config If:
- You want explicit timeout control
- Need regional optimization
- Want additional security headers
- Planning to add monitoring

## Testing

Before deploying any changes:

```bash
# 1. Test build locally
bun run build

# 2. Test with Vercel CLI
vercel build

# 3. Deploy to preview
vercel

# 4. Check preview deployment
# - Test all pages
# - Test API routes
# - Check function timeouts
# - Verify security headers (dev tools → Network)

# 5. Only then deploy to production
vercel --prod
```

## Resources

- Vercel Configuration: https://vercel.com/docs/projects/project-configuration
- Function Configuration: https://vercel.com/docs/functions/serverless-functions/runtimes
- Headers: https://vercel.com/docs/projects/project-configuration#headers
- Regions: https://vercel.com/docs/functions/serverless-functions/regions

---

**Status**: Current config is production-ready ✅
**Action Needed**: None (optional enhancements available)
**Last Reviewed**: 2025-10-23
