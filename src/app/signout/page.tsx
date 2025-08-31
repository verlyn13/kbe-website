'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function SignOutPage() {
  const router = useRouter();

  useEffect(() => {
    async function handleSignOut() {
      try {
        const supabase = createClient();
        await supabase.auth.signOut();
        console.log('Signed out successfully');
        router.push('/');
      } catch (error) {
        console.error('Error signing out:', error);
        router.push('/');
      }
    }

    handleSignOut();
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p>Signing out...</p>
    </div>
  );
}
