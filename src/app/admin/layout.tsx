'use client';

import {
  Bell,
  Calendar,
  FileCheck,
  FileSpreadsheet,
  FileText,
  Home,
  LayoutDashboard,
  Mail,
  Settings,
  Shield,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { DashboardHeader } from '@/components/dashboard-header';
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
import { useIsMobile } from '@/hooks/use-mobile';
import { useSupabaseAuth as useAuth } from '@/hooks/use-supabase-auth';

function HehLogo() {
  const { state } = useSidebar();
  return (
    <Link href="/admin/dashboard" className="flex items-center gap-2 px-2">
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
        <title>Admin Portal Logo</title>
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
      <h1 className="text-sidebar-foreground text-lg font-bold transition-opacity duration-200 group-data-[collapsible=icon]:w-0 group-data-[collapsible=icon]:opacity-0">
        Admin Portal
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

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    async function checkAdmin() {
      if (user) {
        try {
          const response = await fetch('/api/admin/check');
          const data = await response.json();
          setIsAdmin(data.isAdmin);
          if (!data.isAdmin) {
            router.push('/dashboard');
          }
        } catch (error) {
          console.error('Error checking admin status:', error);
          setIsAdmin(false);
          router.push('/dashboard');
        }
      } else if (!loading) {
        router.push('/');
      }
    }
    checkAdmin();
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

  if (!user || !isAdmin) {
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
              <MobileAwareSidebarMenuButton href="/admin/dashboard" isActive tooltip="Dashboard">
                <LayoutDashboard />
                <span>Dashboard</span>
              </MobileAwareSidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <MobileAwareSidebarMenuButton href="/admin/registrations" tooltip="Registrations">
                <Users />
                <span>Registrations</span>
              </MobileAwareSidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <MobileAwareSidebarMenuButton href="/admin/waivers" tooltip="Waivers">
                <FileCheck />
                <span>Waivers</span>
              </MobileAwareSidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <MobileAwareSidebarMenuButton href="/admin/communications" tooltip="Communications">
                <Mail />
                <span>Communications</span>
              </MobileAwareSidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <MobileAwareSidebarMenuButton href="/admin/programs" tooltip="Programs">
                <Calendar />
                <span>Programs</span>
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
            <SidebarMenuItem>
              <MobileAwareSidebarMenuButton href="/admin/reports" tooltip="Reports">
                <FileSpreadsheet />
                <span>Reports</span>
              </MobileAwareSidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <MobileAwareSidebarMenuButton href="/admin/users" tooltip="Users">
                <Users />
                <span>Users</span>
              </MobileAwareSidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <MobileAwareSidebarMenuButton href="/admin/activity" tooltip="Activity Log">
                <FileText />
                <span>Activity Log</span>
              </MobileAwareSidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <MobileAwareSidebarMenuButton href="/dashboard" tooltip="Guardian Portal">
                <Home />
                <span>Guardian Portal</span>
              </MobileAwareSidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <MobileAwareSidebarMenuButton href="/admin/settings" tooltip="Settings">
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
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}