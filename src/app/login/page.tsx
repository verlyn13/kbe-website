'use client';

import { useRouter } from 'next/navigation';
import { lazy, Suspense, useEffect } from 'react';
import { ThemeBackgroundImage } from '@/components/theme-image';
import { Card, CardContent } from '@/components/ui/card';
import { useSupabaseAuth as useAuth } from '@/hooks/use-supabase-auth';

const UnifiedAuth = lazy(() =>
  import('@/components/unified-auth-form').then((m) => ({ default: m.UnifiedAuthForm }))
);

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) router.push('/dashboard');
  }, [loading, user, router]);

  return (
    <main className="bg-background relative flex min-h-screen flex-col items-center justify-center overflow-hidden p-4 md:p-8">
      <ThemeBackgroundImage />
      <div className="relative z-10 w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="mb-2 text-3xl font-bold">Sign in or create an account</h1>
          <p className="text-muted-foreground">Use email, magic link, or Google</p>
        </div>
        <Card className="shadow-lg">
          <CardContent className="pt-6">
            <Suspense fallback={<div className="text-center">Loading…</div>}>
              <UnifiedAuth />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
