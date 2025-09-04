# Supabase Migration Plan (Next.js 15 + Bun 1.2.21 + Prisma + Supabase on Vercel)

Last updated: 2025-08-31

This plan builds on the Firebase Usage Report and provides a practical, production-ready path to complete the migration from Firebase/Firestore to Supabase + Prisma, aligned with current best practices for Next.js 15 on Vercel.

## Migration Status Overview

### ✅ Completed
- Prisma schema defined with all core models (User, Student, Program, Registration, Waiver, Announcement)
- Core Prisma services implemented in `src/lib/services/*`
- Enum mappings for Prisma↔Legacy conversions
- Some UI components migrated (dashboard-header, admin pages partially)

### 🚧 In Progress
- Auth migration from Firebase to Supabase
- Firestore → Prisma data access in UI components
- Real-time features replacement

### ❌ Not Started
- Supabase client/server setup
- Row Level Security (RLS) policies
- Data migration from Firestore
- Firebase App Hosting removal

## Priority 1: Authentication Migration (Week 0-1)

### 1.1 Supabase Client Setup

Create the foundation for Supabase auth:

```typescript
// src/lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

```typescript
// src/lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )
}
```

### 1.2 Replace use-auth Hook

```typescript
// src/hooks/use-supabase-auth.tsx
'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'

interface AuthContext {
  user: User | null
  session: Session | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContext>({
  user: null,
  session: null,
  loading: true,
  signOut: async () => {},
})

export function SupabaseAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
```

### 1.3 Migrate Auth Pages

```typescript
// src/app/signup/page.tsx
import { createClient } from '@/lib/supabase/server'
import { profileService } from '@/lib/services'

export default async function SignUpPage() {
  const signup = async (formData: FormData) => {
    'use server'
    
    const supabase = await createClient()
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    })
    
    if (data.user) {
      // Create initial profile
      await profileService.upsert({
        id: data.user.id,
        email: data.user.email!,
        role: 'GUARDIAN',
      })
    }
    
    // Handle redirect
  }
  
  // Form JSX...
}
```

## Priority 2: Database Connection Optimization (Week 0)

### 2.1 Configure Pooling

Update your `.env.local`:

```bash
# Use pooled connection for serverless
DATABASE_URL="postgresql://[user]:[password]@[host]:6543/[database]?pgbouncer=true&connection_limit=1"
# Direct connection for migrations
DIRECT_URL="postgresql://[user]:[password]@[host]:5432/[database]"
```

### 2.2 Prisma Client Singleton

```typescript
// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Force Node.js runtime for Prisma routes
export const runtime = 'nodejs'
```

## Priority 3: Core Data Migration (Week 1-2)

### 3.1 Profile Completion Checks

Replace Firestore calls with Prisma:

```typescript
// src/components/profile-completion-check.tsx
import { profileService } from '@/lib/services'

export async function ProfileCompletionCheck({ userId }: { userId: string }) {
  const profile = await profileService.getById(userId)
  
  const isComplete = !!(
    profile?.name && 
    profile?.phone && 
    profile?.students?.length > 0
  )
  
  if (!isComplete) {
    return <ProfileIncompleteAlert />
  }
  
  return null
}
```

### 3.2 Registration Flow

```typescript
// src/app/api/registrations/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { registrationService } from '@/lib/services'

export const runtime = 'nodejs' // Required for Prisma

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const body = await request.json()
  
  const registration = await registrationService.create({
    userId: user.id,
    studentId: body.studentId,
    programId: body.programId,
    status: 'PENDING',
  })
  
  return NextResponse.json(registration)
}
```

## Priority 4: Real-time Features (Week 2)

### 4.1 Replace onSnapshot with Supabase Realtime

For the waiver status widget:

```typescript
// src/components/waiver-status-widget.tsx
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export function WaiverStatusWidget() {
  const [waivers, setWaivers] = useState<Waiver[]>([])
  const supabase = createClient()
  
  useEffect(() => {
    // Initial fetch
    const fetchWaivers = async () => {
      const { data } = await supabase
        .from('waiver')
        .select('*')
        .order('createdAt', { ascending: false })
      
      if (data) setWaivers(data)
    }
    
    fetchWaivers()
    
    // Set up realtime subscription
    const channel = supabase
      .channel('waiver-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'waiver'
        },
        (payload) => {
          // Handle insert/update/delete
          if (payload.eventType === 'INSERT') {
            setWaivers(prev => [payload.new as Waiver, ...prev])
          }
          // Handle other events...
        }
      )
      .subscribe()
    
    return () => {
      supabase.removeChannel(channel)
    }
  }, [])
  
  return <WaiverList waivers={waivers} />
}
```

### 4.2 Alternative: Server Components with Revalidation

For less dynamic content:

```typescript
// src/app/admin/waivers/page.tsx
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'

export default async function WaiversPage() {
  const waivers = await prisma.waiver.findMany({
    include: {
      student: true,
      user: true,
    },
    orderBy: { createdAt: 'desc' },
  })
  
  async function approveWaiver(waiverId: string) {
    'use server'
    
    await prisma.waiver.update({
      where: { id: waiverId },
      data: { signedAt: new Date() },
    })
    
    revalidatePath('/admin/waivers')
  }
  
  return <WaiverTable waivers={waivers} onApprove={approveWaiver} />
}
```

## Priority 5: Row Level Security (Week 2)

### 5.1 Enable RLS on Tables

```sql
-- Enable RLS for all tables
ALTER TABLE public."User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Student" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Registration" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Waiver" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Program" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Announcement" ENABLE ROW LEVEL SECURITY;
```

### 5.2 User Profile Policies

```sql
-- Users can read and update their own profile
CREATE POLICY "Users can view own profile"
ON public."User" FOR SELECT
TO authenticated
USING (auth.uid()::text = id);

CREATE POLICY "Users can update own profile"
ON public."User" FOR UPDATE
TO authenticated
USING (auth.uid()::text = id)
WITH CHECK (auth.uid()::text = id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
ON public."User" FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public."User"
    WHERE id = auth.uid()::text
    AND role = 'ADMIN'
  )
);
```

### 5.3 Student Access Policies

```sql
-- Users can manage their own students
CREATE POLICY "Users can view own students"
ON public."Student" FOR SELECT
TO authenticated
USING (auth.uid()::text = "userId");

CREATE POLICY "Users can create own students"
ON public."Student" FOR INSERT
TO authenticated
WITH CHECK (auth.uid()::text = "userId");

CREATE POLICY "Users can update own students"
ON public."Student" FOR UPDATE
TO authenticated
USING (auth.uid()::text = "userId")
WITH CHECK (auth.uid()::text = "userId");
```

### 5.4 Registration Policies

```sql
-- Users can view their own registrations
CREATE POLICY "Users can view own registrations"
ON public."Registration" FOR SELECT
TO authenticated
USING (auth.uid()::text = "userId");

-- Users can create registrations for their students
CREATE POLICY "Users can create registrations"
ON public."Registration" FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid()::text = "userId" AND
  EXISTS (
    SELECT 1 FROM public."Student"
    WHERE id = "studentId"
    AND "userId" = auth.uid()::text
  )
);

-- Admins can view all registrations
CREATE POLICY "Admins can view all registrations"
ON public."Registration" FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public."User"
    WHERE id = auth.uid()::text
    AND role = 'ADMIN'
  )
);
```

## Priority 6: Data Migration (Week 3)

### 6.1 Export from Firestore

Use Firebase CLI:

```bash
# Export Firestore data
gcloud firestore export gs://your-bucket/firestore-export

# Or use the Firebase Admin SDK script
bun run scripts/export-firestore.ts
```

### 6.2 Transform and Import

Create a migration script:

```typescript
// scripts/migrate-to-supabase.ts
import { createClient } from '@supabase/supabase-js'
import { firebaseExport } from './firestore-export.json'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY! // Use service key for migrations
)

async function migrate() {
  // Migrate users
  for (const user of firebaseExport.users) {
    await supabase.auth.admin.createUser({
      email: user.email,
      email_confirm: true,
      user_metadata: {
        firebase_uid: user.uid,
        name: user.displayName,
      },
    })
    
    // Create profile
    await supabase.from('User').insert({
      id: user.uid, // Keep same ID for references
      email: user.email,
      name: user.displayName,
      phone: user.phoneNumber,
      role: user.customClaims?.admin ? 'ADMIN' : 'GUARDIAN',
    })
  }
  
  // Migrate other collections...
}
```

### 6.3 Verify Migration

```typescript
// scripts/verify-migration.ts
async function verifyMigration() {
  const checks = [
    { 
      name: 'User count',
      firebase: await getFirestoreCount('users'),
      supabase: await supabase.from('User').select('id', { count: 'exact' })
    },
    // Add more checks...
  ]
  
  checks.forEach(check => {
    console.log(`${check.name}: Firebase=${check.firebase}, Supabase=${check.supabase}`)
  })
}
```

## Week-by-Week Implementation Schedule

### Week 0: Foundation (Current)
- [x] Document current state (Firebase Usage Report)
- [x] Plan migration strategy (this document)
- [ ] Set up Supabase project and environment variables
- [ ] Configure Prisma with pooled connections
- [ ] Create Supabase client/server utilities

### Week 1: Authentication
- [ ] Implement Supabase auth provider
- [ ] Migrate login/signup/signout pages
- [ ] Update protected route middleware
- [ ] Test auth flows (email, Google OAuth)
- [ ] Implement password reset flow

### Week 2: Core Data Access
- [ ] Replace profile completion checks
- [ ] Migrate registration flow to Prisma
- [ ] Convert admin pages to server components
- [ ] Implement waiver management service
- [ ] Add student roster functionality

### Week 3: Real-time & Polish
- [ ] Set up Supabase Realtime for critical features
- [ ] Implement RLS policies
- [ ] Run data migration in staging
- [ ] Update all remaining Firestore references
- [ ] Remove Firebase dependencies

### Week 4: Production Cutover
- [ ] Final data migration to production
- [ ] DNS/domain updates if needed
- [ ] Monitor for issues
- [ ] Remove Firebase project resources
- [ ] Update documentation

## Common Pitfalls & Solutions

### Issue 1: Too Many Database Connections

**Problem**: Serverless functions create new connections on each invocation.

**Solution**:
```typescript
// Always use pooled connection
DATABASE_URL="...?pgbouncer=true&connection_limit=1"

// Consider Prisma Accelerate for global caching
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

const prisma = new PrismaClient().$extends(withAccelerate())
```

### Issue 2: Edge Runtime Incompatibility

**Problem**: Prisma doesn't work on Edge runtime.

**Solution**:
```typescript
// Force Node.js runtime for Prisma routes
export const runtime = 'nodejs'

// Or use a separate API route that runs on Node
export async function GET() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/internal/prisma-query`)
  return response
}
```

### Issue 3: Auth State Mismatch

**Problem**: Client and server auth states can diverge.

**Solution**:
```typescript
// Always verify auth on server
export default async function ProtectedPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }
  
  // Render protected content
}
```

### Issue 4: Migration Data Integrity

**Problem**: Related data might have inconsistent references.

**Solution**:
```sql
-- Add constraints after migration
ALTER TABLE "Student" 
ADD CONSTRAINT fk_student_user 
FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE;

-- Verify referential integrity
SELECT s.* FROM "Student" s 
LEFT JOIN "User" u ON s."userId" = u.id 
WHERE u.id IS NULL;
```

## Environment Variables Checklist

### Remove from `.env*`:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_RECAPTCHA_ENTERPRISE_SITE_KEY`

### Add to `.env.local`:
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://[project-ref].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[anon-key]
SUPABASE_SERVICE_KEY=[service-key] # For admin operations only

# Database (via Supabase)
DATABASE_URL=postgresql://[user]:[password]@[host]:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://[user]:[password]@[host]:5432/postgres

# Site
NEXT_PUBLIC_SITE_URL=https://homerenrichment.com
```

## Testing Strategy

### 1. Unit Tests
```typescript
// Mock Prisma services
vi.mock('@/lib/services', () => ({
  profileService: {
    getById: vi.fn(),
    upsert: vi.fn(),
  },
  registrationService: {
    create: vi.fn(),
    getByUser: vi.fn(),
  },
}))
```

### 2. Integration Tests
```typescript
// Use test Supabase project
const testSupabase = createClient(
  process.env.TEST_SUPABASE_URL!,
  process.env.TEST_SUPABASE_ANON_KEY!
)
```

### 3. E2E Tests
```typescript
// Test critical user journeys
test('parent can register student', async ({ page }) => {
  await page.goto('/register')
  // Test full flow...
})
```

## Success Metrics

- [ ] All Firebase imports removed
- [ ] No `firebase` package in dependencies
- [ ] All tests passing with new stack
- [ ] RLS policies enforced on all tables
- [ ] Zero Firebase API calls in production
- [ ] Page load times ≤ current performance
- [ ] Successful load test with 100 concurrent users
- [ ] Clean deployment to Vercel

## Rollback Plan

If critical issues arise:

1. **Auth Issues**: Implement dual-auth support temporarily
2. **Data Issues**: Keep Firestore read-only backup for 30 days
3. **Performance Issues**: Use Prisma Accelerate or increase connection pool
4. **Feature Parity**: Maintain feature flags for gradual rollout

## References

- [Supabase Auth with Next.js App Router](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [Prisma with Supabase](https://supabase.com/partners/integrations/prisma)
- [Connection Pooling with Vercel](https://vercel.com/guides/connection-pooling-with-functions)
- [Supabase Realtime](https://supabase.com/docs/guides/realtime)
- [Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Migrating from Firebase](https://supabase.com/docs/guides/platform/migrating-to-supabase/firestore-data)