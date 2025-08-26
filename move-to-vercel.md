
## Updated Migration Path (Post-Bun)

### 1. **Vercel CLI Installation**
Since you're now on Bun, use it for the Vercel CLI:
```bash
bun install --global vercel
```

### 2. **Updated vercel.json Configuration**
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
  },
  "rewrites": [
    {
      "source": "/__/auth/:path*",
      "destination": "https://kbe-website.firebaseapp.com/__/auth/:path*"
    }
  ]
}
```

### 3. **Pre-Migration Cleanup**
```bash
# You're on the right track with Bun
git checkout -b vercel-migration

# Remove Firebase App Hosting artifacts
rm apphosting.yaml
rm -rf .firebase/
rm firebase-debug.js test-firebase-redirect.html

# Clean debug code from login-form.tsx (lines 113-116, 139-145, 149-151, 244-251)

# Add vercel.json
git add -A
git commit -m "Configure for Vercel deployment with Bun"
```

### 4. **Environment Variable Migration Script (Bun-powered)**
Create `scripts/migrate-env.ts`:
```typescript
#!/usr/bin/env bun

const secrets = {
  // Firebase Core
  NEXT_PUBLIC_FIREBASE_API_KEY: "your-value-from-secret-manager",
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: "kbe-website.firebaseapp.com",
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: "kbe-website",
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: "your-value",
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: "your-value",
  NEXT_PUBLIC_FIREBASE_APP_ID: "your-value",
  
  // Security
  NEXTAUTH_SECRET: "your-value",
  JWT_SECRET: "your-value",
  
  // App Config
  NEXT_PUBLIC_APP_URL: "https://homerenrichment.com",
  NEXT_PUBLIC_RECAPTCHA_ENTERPRISE_SITE_KEY: "6LeRvaorAAAAAKFB3hEtz28ofFmKTkbwu5-OE8XP",
  
  // SendGrid
  SENDGRID_API_KEY: "your-value",
  SENDGRID_TEMPLATE_MAGIC_LINK: "your-value",
  SENDGRID_TEMPLATE_WELCOME: "your-value",
  SENDGRID_TEMPLATE_PASSWORD_RESET: "your-value",
  SENDGRID_TEMPLATE_ANNOUNCEMENT: "your-value",
  SENDGRID_TEMPLATE_REGISTRATION_CONFIRMATION: "your-value",
};

for (const [key, value] of Object.entries(secrets)) {
  const proc = Bun.spawn(["vercel", "env", "add", key, "production"], {
    stdin: "pipe",
  });
  
  const writer = proc.stdin.getWriter();
  await writer.write(new TextEncoder().encode(value + "\n"));
  await writer.close();
  await proc.exited;
  
  console.log(`✓ Added ${key}`);
}
```

Run with: `bun run scripts/migrate-env.ts`

### 5. **Deployment Commands**
```bash
# Initial setup
vercel login
vercel link

# Set up environment variables
bun run scripts/migrate-env.ts

# Deploy to preview
vercel

# Test, then deploy to production
vercel --prod
```

### 6. **CI/CD Updates for Bun**
`.github/workflows/preview.yml`:
```yaml
name: Vercel Preview Deployment

env:
  VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
  VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}

on:
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  deploy-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Bun
        uses: oven-sh/setup-bun@v1
        
      - name: Install dependencies
        run: bun install
        
      - name: Run type checking
        run: bun run typecheck
        
      - name: Build with Vercel
        run: vercel build --token=${{ secrets.VERCEL_TOKEN }}
        
      - name: Deploy Preview
        id: deploy
        run: echo "url=$(vercel deploy --prebuilt --token=${{ secrets.VERCEL_TOKEN }})" >> $GITHUB_OUTPUT
        
      - name: Comment PR
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: `Preview: ${{ steps.deploy.outputs.url }}`
            })
```

### 7. **Performance Optimizations Available**
With Bun + Vercel in 2025:
- **Fluid Compute**: Enable immediately for SendGrid webhooks (up to 90% cost reduction)
- **Edge Runtime**: Consider for auth checks (faster globally)
- **Build Cache**: Bun's speed + Vercel's caching = sub-30 second builds

### 8. **Testing Script (Bun-native)**
Create `scripts/test-auth.ts`:
```typescript
#!/usr/bin/env bun

const BASE_URL = process.env.VERCEL_URL || "http://localhost:3000";

async function testEndpoint(path: string, expectedStatus: number) {
  const res = await fetch(`${BASE_URL}${path}`);
  console.log(`${path}: ${res.status === expectedStatus ? "✓" : "✗"} (${res.status})`);
  return res.status === expectedStatus;
}

// Test auth endpoints
await testEndpoint("/api/auth/session", 200);
await testEndpoint("/__/auth/handler", 200); // Critical: OAuth callback
await testEndpoint("/login", 200);
```

### 9. **Migration Timeline (Accelerated)**
Since you're already on Bun:
- **Prep**: 30 minutes (cleanup, vercel.json)
- **Migration**: 2 hours total
  - 15 min: Vercel setup
  - 15 min: Environment variables (scripted)
  - 30 min: Preview deployment & testing
  - 30 min: Production deployment
  - 30 min: DNS switch & monitoring

### 10. **Post-Migration Enhancements**
The blueprint suggests these Bun-specific optimizations:
```typescript
// bun.config.ts (future consideration)
export default {
  // Optimize for Vercel's infrastructure
  target: "node",
  minify: true,
  sourcemap: "external",
};
```

Your Bun migration positions you perfectly for Vercel's 2025 infrastructure. The ~3x faster install times and built-in TypeScript support will significantly improve your deployment speed compared to the npm-based approach in the original blueprint.
