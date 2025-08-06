'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { GuardianInfoForm } from '@/components/guardian-info-form';
import { Skeleton } from '@/components/ui/skeleton';

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
      <div className="min-h-screen flex items-center justify-center p-4">
        <Skeleton className="h-[600px] w-full max-w-2xl" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background p-4 py-8">
      <div className="container max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-primary mb-2">Homer Enrichment Hub</h1>
          <p className="text-muted-foreground">Empowering Young Minds in Homer, Alaska</p>
        </div>
        
        <GuardianInfoForm />
      </div>
    </div>
  );
}