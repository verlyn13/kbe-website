'use client';

import { useRouter } from 'next/navigation';
import { lazy, Suspense, useEffect } from 'react';
import { ThemeBackgroundImage } from '@/components/theme-image';
import { Card, CardContent } from '@/components/ui/card';
import { useSupabaseAuth as useAuth } from '@/hooks/use-supabase-auth';

const IntelligentAuth = lazy(() =>
  import('@/components/intelligent-auth-form').then((m) => ({ default: m.IntelligentAuthForm }))
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
        <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
          <CardContent className="pt-8 pb-8 px-8">
            <Suspense fallback={<div className="text-center py-8">Loading…</div>}>
              <IntelligentAuth />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
