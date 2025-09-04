'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSupabaseAuth } from '@/hooks/use-supabase-auth';

export function ProfileCompletionCheck({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useSupabaseAuth();
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function checkProfileCompletion() {
      if (!user || authLoading) return;

      try {
        const res = await fetch('/api/profile-status', { cache: 'no-store' });
        if (!res.ok) throw new Error('Profile status request failed');
        const data = (await res.json()) as { complete: boolean };
        if (!data.complete) router.push('/welcome');
      } catch (error) {
        console.error('Error checking profile completion:', error);
      } finally {
        setChecking(false);
      }
    }

    checkProfileCompletion();
  }, [user, authLoading, router]);

  if (authLoading || checking) {
    return null; // Or a loading spinner
  }

  return <>{children}</>;
}
