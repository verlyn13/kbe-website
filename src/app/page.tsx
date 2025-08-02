'use client';

import Image from 'next/image';
import { useEffect } from 'react';
import { LoginForm } from '@/components/login-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

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
    <main className="bg-background flex min-h-screen flex-col items-center justify-center p-4 md:p-8">
      <div className="flex w-full max-w-4xl flex-col items-center justify-center gap-8 md:flex-row md:gap-16">
        <div className="flex w-full flex-col items-center text-center md:w-1/2 md:items-start md:text-left">
          <div className="mb-4 flex items-center gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary h-10 w-10"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
            <h1 className="text-primary text-3xl font-bold">Kachemak Bay Enrichment</h1>
          </div>
          <h2 className="text-foreground mb-4 text-4xl font-bold tracking-tighter md:text-5xl">
            Your Portal for Learning
          </h2>
          <p className="text-muted-foreground max-w-md">
            Your portal for Homer Mathcounts registration, and other enrichment activities.
          </p>
        </div>
        <Card className="w-full max-w-sm shadow-2xl md:w-1/2">
          <CardHeader>
            <CardTitle className="text-2xl">Sign In</CardTitle>
            <CardDescription>Enter your credentials to access your portal.</CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
