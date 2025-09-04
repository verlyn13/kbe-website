'use client';

import { useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';
import { useSupabaseAuth as useAuth } from '@/hooks/use-supabase-auth';
import { type AdminUser, adminService } from '@/lib/services';

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
        // Allows testing while admin records are being provisioned
        const TEMP_ADMIN_EMAILS = [
          'jeffreyverlynjohnson@gmail.com',
          'admin@example.com', // Replace with your actual admin emails
        ];

        console.log('[AdminCheck] Checking admin status for:', user.email);

        if (TEMP_ADMIN_EMAILS.includes(user.email || '')) {
          // Create temporary admin object
          const tempAdmin: AdminUser = {
            id: user.id,
            email: user.email || '',
            name: user.user_metadata?.name || user.email || 'Admin',
            role: 'ADMIN',
            permissions: adminService.getPermissionsByRole('ADMIN'),
            createdAt: new Date(),
            updatedAt: new Date(),
            phone: null,
          };
          setAdmin(tempAdmin);
        } else {
          // Check via Prisma
          const isAdmin = await adminService.isAdmin(user.id);
          if (isAdmin) {
            const adminData = await adminService.getById(user.id);
            setAdmin(adminData);
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
    return admin.permissions?.includes(permission) || false;
  };

  const value = {
    admin,
    loading,
    isAdmin: !!admin,
    isSuperAdmin: admin?.role === 'ADMIN',
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
