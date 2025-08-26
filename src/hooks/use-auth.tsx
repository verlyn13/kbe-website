'use client';

import { signOut as firebaseSignOut, onAuthStateChanged, type User } from 'firebase/auth';
import { usePathname, useRouter } from 'next/navigation';
import { createContext, type ReactNode, useContext, useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { auth } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const isDev = process.env.NODE_ENV === 'development';

  useEffect(() => {
    if (isDev) {
      console.log('[AuthProvider] Setting up auth listener');
      console.time('[AuthProvider] First auth state change');
    }

    // Add a timeout to detect if auth is hanging
    const timeoutId = setTimeout(() => {
      if (isDev) {
        console.error('[AuthProvider] WARNING: Auth state change is taking too long (>5s)');
        console.log('[AuthProvider] Current auth instance:', auth);
      }
    }, 5000);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      clearTimeout(timeoutId);
      if (isDev) {
        console.timeEnd('[AuthProvider] First auth state change');
        console.log('[AuthProvider] Auth state changed:', { user: !!user });
      }
      setUser(user);
      setLoading(false);
    });

    return () => {
      clearTimeout(timeoutId);
      unsubscribe();
    };
  }, [isDev]);

  // Remove automatic redirects - let individual pages handle their own routing
  // This prevents conflicts with the signup flow

  const signOut = async () => {
    await firebaseSignOut(auth);
    router.push('/');
  };

  if (loading) {
    return (
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-y-0 lg:space-x-12">
        <div className="flex-1">
          <Skeleton className="h-screen w-full" />
        </div>
      </div>
    );
  }

  return <AuthContext.Provider value={{ user, loading, signOut }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
