'use client';

import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';

export function ProfileCompletionCheck({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function checkProfileCompletion() {
      if (!user || authLoading) return;

      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const userData = userDoc.data();

        // If profile is not completed, redirect to welcome
        // This applies to all users regardless of sign-in method
        if (!userData?.profileCompleted) {
          router.push('/welcome');
          return;
        }
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
