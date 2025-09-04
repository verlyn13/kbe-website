'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { LoginForm } from '@/components/login-form';
import { ThemeBackgroundImage } from '@/components/theme-image';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useSupabaseAuth as useAuth } from '@/hooks/use-supabase-auth';

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && !loading) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="bg-background flex min-h-screen flex-col items-center justify-center p-4 md:p-8">
        <Skeleton className="h-full w-full max-w-4xl" />
      </div>
    );
  }

  if (user) {
    return (
      <div className="bg-background flex min-h-screen flex-col items-center justify-center p-4 md:p-8">
        <Skeleton className="h-full w-full max-w-4xl" />
      </div>
    );
  }

  return (
    <main className="bg-background relative flex min-h-screen flex-col items-center justify-center overflow-hidden p-4 md:p-8">
      <ThemeBackgroundImage />
      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="text-muted-foreground hover:text-foreground mb-6 inline-flex items-center gap-2 transition-colors"
          >
            <div className="from-primary to-accent h-1 w-8 rounded-full bg-gradient-to-r" />
            <span className="text-sm">Homer Enrichment Hub</span>
          </Link>
          <h1 className="mb-2 text-3xl font-bold">Sign In</h1>
          <p className="text-muted-foreground">
            Welcome back! Sign in to access your guardian portal.
          </p>
        </div>
        <Card className="shadow-lg">
          <CardContent className="pt-6">
            <LoginForm />
          </CardContent>
          <div className="border-t px-6 py-4">
            <p className="text-muted-foreground text-center text-sm">
              Don't have an account?{' '}
              <Link href="/signup" className="text-primary font-medium hover:underline">
                Create one here
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </main>
  );
}
