'use client';

import { doc, getDoc } from 'firebase/firestore';
import { Bell, Calendar, Home, Settings, Shield } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { DashboardHeader } from '@/components/dashboard-header';
import { ProfileCompletionCheck } from '@/components/profile-completion-check';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/use-auth';
import { useIsMobile } from '@/hooks/use-mobile';
import { db } from '@/lib/firebase';

function HehLogo() {
  const { state } = useSidebar();
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
        <title>Guardian Portal Logo</title>
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
      <h1 className="text-sidebar-foreground text-lg font-bold transition-opacity duration-200 group-data-[collapsible=icon]:w-0 group-data-[collapsible=icon]:opacity-0">
        Guardian Portal
      </h1>
    </Link>
  );
}

function MobileAwareSidebarMenuButton({
  href,
  children,
  ...props
}: {
  href: string;
  children: React.ReactNode;
  isActive?: boolean;
  tooltip?: string;
}) {
  const { setOpenMobile } = useSidebar();
  const isMobile = useIsMobile();

  const handleClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <SidebarMenuButton asChild {...props}>
      <Link href={href as any} onClick={handleClick}>
        {children}
      </Link>
    </SidebarMenuButton>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!user && !loading) {
      router.push('/');
    }
  }, [user, loading, router]);

  useEffect(() => {
    async function checkAdmin() {
      if (user) {
        try {
          const adminDoc = await getDoc(doc(db, 'admins', user.uid));
          setIsAdmin(adminDoc.exists());
        } catch (error) {
          console.error('Error checking admin status:', error);
          setIsAdmin(false);
        }
      }
    }
    checkAdmin();
  }, [user]);

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
    router.push('/');
    return null;
  }

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <HehLogo />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <MobileAwareSidebarMenuButton href="/dashboard" isActive tooltip="Dashboard">
                <Home />
                <span>Home</span>
              </MobileAwareSidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <MobileAwareSidebarMenuButton href="/calendar" tooltip="Calendar">
                <Calendar />
                <span>Calendar</span>
              </MobileAwareSidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <MobileAwareSidebarMenuButton href="/announcements" tooltip="Announcements">
                <Bell />
                <span>Announcements</span>
              </MobileAwareSidebarMenuButton>
            </SidebarMenuItem>
            {isAdmin && (
              <SidebarMenuItem>
                <MobileAwareSidebarMenuButton href="/admin/dashboard" tooltip="Admin">
                  <Shield />
                  <span>Admin</span>
                </MobileAwareSidebarMenuButton>
              </SidebarMenuItem>
            )}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <MobileAwareSidebarMenuButton href="/settings" tooltip="Settings">
                <Settings />
                <span>Settings</span>
              </MobileAwareSidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <DashboardHeader />
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <ProfileCompletionCheck>{children}</ProfileCompletionCheck>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
