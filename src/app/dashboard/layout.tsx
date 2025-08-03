'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { Bell, Calendar, Home, Puzzle, Settings, Shield, BookOpen } from 'lucide-react';
// Temporarily commented out to test performance
// import {
//   SidebarProvider,
//   Sidebar,
//   SidebarHeader,
//   SidebarContent,
//   SidebarMenu,
//   SidebarMenuItem,
//   SidebarMenuButton,
//   SidebarFooter,
//   SidebarRail,
//   useSidebar,
// } from '@/components/ui/sidebar';
import { DashboardHeader } from '@/components/dashboard-header';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

function KbeLogo() {
  // const { state } = useSidebar();
  return (
    <Link href="/dashboard" className="flex items-center gap-2 px-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-sidebar-primary h-8 w-8 shrink-0"
      >
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
      <h1 className="text-sidebar-foreground text-lg font-bold">
        KBE Portal
      </h1>
    </Link>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  console.log('[DashboardLayout] Component rendering');
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log('[DashboardLayout] Auth check:', { user: !!user, loading });
    if (!user && !loading) {
      console.log('[DashboardLayout] No user, redirecting to login');
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex h-screen">
        <div className="w-64">
          <Skeleton className="h-full w-full" />
        </div>
        <div className="flex-1">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-full w-full" />
        </div>
      </div>
    );
  }

  if (!user) {
    console.log('[DashboardLayout] No user found, redirecting to login');
    router.push('/');
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Temporarily replaced with simple sidebar to test performance */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-sidebar text-sidebar-foreground border-r">
        <div className="p-4">
          <KbeLogo />
        </div>
        <nav className="space-y-2 p-4">
          <Link href="/dashboard" className="flex items-center gap-2 p-2 rounded hover:bg-sidebar-accent">
            <Home className="h-4 w-4" />
            <span>Dashboard</span>
          </Link>
          <Link href="#" className="flex items-center gap-2 p-2 rounded hover:bg-sidebar-accent">
            <Calendar className="h-4 w-4" />
            <span>Calendar</span>
          </Link>
          <Link href="/dashboard/weekly-challenges" className="flex items-center gap-2 p-2 rounded hover:bg-sidebar-accent">
            <Puzzle className="h-4 w-4" />
            <span>Weekly Challenges</span>
          </Link>
          <Link href="/dashboard/announcements" className="flex items-center gap-2 p-2 rounded hover:bg-sidebar-accent">
            <Bell className="h-4 w-4" />
            <span>Announcements</span>
          </Link>
          <Link href="/admin/content-generator" className="flex items-center gap-2 p-2 rounded hover:bg-sidebar-accent">
            <Shield className="h-4 w-4" />
            <span>Admin</span>
          </Link>
        </nav>
      </div>
      <main 
        className="flex-1 overflow-y-auto bg-background"
        style={{ marginLeft: '16rem' }}
      >
        <DashboardHeader />
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
