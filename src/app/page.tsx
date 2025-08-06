'use client';

import Image from 'next/image';
import { useEffect } from 'react';
import { LoginForm } from '@/components/login-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
      <div className="flex w-full max-w-4xl flex-col items-center justify-center gap-8 md:flex-row md:gap-16 relative z-10">
        <div className="flex w-full flex-col items-center text-center md:w-1/2 md:items-start md:text-left">
          <div className="mb-8 flex items-center gap-2">
            <div className="h-1 w-12 bg-gradient-to-r from-primary to-accent rounded-full" />
            <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Welcome to</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Homer Enrichment Hub
          </h1>
          <h2 className="text-foreground mb-4 text-xl md:text-2xl font-medium leading-relaxed">
            Sign up here for MathCounts registration and other enrichment activities (coming soon)
          </h2>
          <p className="text-muted-foreground max-w-md mb-8 text-lg">
            Join our community of young learners in Homer, Alaska. Registration is quick and easy!
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="/programs" className="text-primary hover:underline text-sm font-medium">
              View Programs →
            </a>
            <a href="/schedule" className="text-primary hover:underline text-sm font-medium">
              Schedule →
            </a>
            <a href="/resources" className="text-primary hover:underline text-sm font-medium">
              Resources →
            </a>
          </div>
        </div>
        <Card className="w-full max-w-sm shadow-2xl md:w-1/2">
          <CardHeader>
            <CardTitle className="text-2xl">Welcome!</CardTitle>
            <CardDescription>
              New here? Click "Sign up" below to create your guardian account. 
              Returning users can sign in with their email.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
