'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { adminService, AdminUser } from '@/lib/firebase-admin';
import { useRouter } from 'next/navigation';

interface AdminContextType {
  admin: AdminUser | null;
  loading: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  hasPermission: (permission: string) => boolean;
}

const AdminContext = createContext<AdminContextType>({
  admin: null,
  loading: true,
  isAdmin: false,
  isSuperAdmin: false,
  hasPermission: () => false,
});

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAdminStatus() {
      if (!user) {
        setAdmin(null);
        setLoading(false);
        return;
      }

      try {
        // Temporary: Check if user email is in admin list
        // This allows testing while Firebase admin records are being set up
        const TEMP_ADMIN_EMAILS = [
          'jeffreyverlynjohnson@gmail.com',
          'admin@example.com', // Replace with your actual admin emails
        ];
        
        console.log('[AdminCheck] Checking admin status for:', user.email);
        
        if (TEMP_ADMIN_EMAILS.includes(user.email || '')) {
          // Create temporary admin object
          const tempAdmin: AdminUser = {
            id: user.uid,
            email: user.email || '',
            name: user.displayName || user.email || 'Admin',
            role: 'superAdmin',
            permissions: ['all'],
            createdAt: new Date(),
          };
          setAdmin(tempAdmin);
        } else {
          // Try to get from Firebase
          const adminData = await adminService.checkAdminRole(user.uid);
          
          if (adminData) {
            setAdmin(adminData);
            await adminService.updateLastLogin(user.uid);
          } else {
            setAdmin(null);
            // Not an admin, redirect to parent portal
            console.log('[AdminCheck] User is not admin, redirecting to dashboard');
            router.push('/dashboard');
          }
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        setAdmin(null);
      } finally {
        setLoading(false);
      }
    }

    checkAdminStatus();
  }, [user, router]);

  const hasPermission = (permission: string): boolean => {
    if (!admin) return false;
    if (admin.role === 'superAdmin') return true;
    return admin.permissions.includes(permission);
  };

  const value = {
    admin,
    loading,
    isAdmin: !!admin,
    isSuperAdmin: admin?.role === 'superAdmin',
    hasPermission,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}