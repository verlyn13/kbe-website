'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { LoginForm } from '@/components/login-form';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { ThemeBackgroundImage } from '@/components/theme-image';

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
    <main className="bg-background flex min-h-screen flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden">
      <ThemeBackgroundImage />
      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-6 text-muted-foreground hover:text-foreground transition-colors">
            <div className="h-1 w-8 bg-gradient-to-r from-primary to-accent rounded-full" />
            <span className="text-sm">Homer Enrichment Hub</span>
          </Link>
          <h1 className="text-3xl font-bold mb-2">Sign In</h1>
          <p className="text-muted-foreground">
            Welcome back! Sign in to access your guardian portal.
          </p>
        </div>
        <Card className="shadow-lg">
          <CardContent className="pt-6">
            <LoginForm />
          </CardContent>
          <div className="border-t px-6 py-4">
            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link href="/signup" className="text-primary hover:underline font-medium">
                Create one here
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </main>
  );
}
