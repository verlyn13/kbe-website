'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { GuardianInfoForm } from '@/components/guardian-info-form';
import { SimpleHeader } from '@/components/simple-header';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/use-auth';

export default function WelcomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Skeleton className="h-[600px] w-full max-w-2xl" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <SimpleHeader />
      <div className="flex-1 p-4 py-8">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8 text-center">
            <h1 className="text-primary mb-2 text-3xl font-bold">
              Welcome to Homer Enrichment Hub
            </h1>
            <p className="text-muted-foreground">
              Let's complete your guardian profile to get started
            </p>
          </div>

          <GuardianInfoForm />
        </div>
      </div>
    </div>
  );
}
