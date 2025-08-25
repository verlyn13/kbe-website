'use client';

import {
  Calendar,
  FileCheck,
  FileSpreadsheet,
  FileText,
  Home,
  LayoutDashboard,
  Mail,
  Settings,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { DashboardHeader } from '@/components/dashboard-header';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  useSidebar,
} from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import { AdminProvider, useAdmin } from '@/hooks/use-admin';
import { useIsMobile } from '@/hooks/use-mobile';

function HehLogo() {
  const { state } = useSidebar();
  return (
    <Link href="/admin/dashboard" className="flex items-center gap-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-sidebar-primary h-8 w-8"
      >
        <title>HEH Admin Logo</title>
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
      <h1 className="text-lg font-bold text-white transition-all duration-200 group-data-[collapsible=icon]:-translate-x-96 group-data-[collapsible=icon]:opacity-0">
        HEH Admin
      </h1>
    </Link>
  );
}

function MobileAwareSidebarMenuButton({
  href,
  children,
  isActive,
  tooltip,
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
    <SidebarMenuButton asChild isActive={isActive} tooltip={tooltip}>
      <Link href={href} onClick={handleClick}>
        {children}
      </Link>
    </SidebarMenuButton>
  );
}

function AdminSidebar() {
  const pathname = usePathname();
  const { hasPermission } = useAdmin();

  const navItems = [
    {
      group: 'Overview',
      items: [
        {
          href: '/admin/dashboard',
          label: 'Dashboard',
          icon: LayoutDashboard,
          permission: 'view_dashboard',
        },
        {
          href: '/dashboard',
          label: 'Guardian Portal',
          icon: Home,
          permission: 'view_dashboard',
        },
      ],
    },
    {
      group: 'Management',
      items: [
        {
          href: '/admin/registrations',
          label: 'Registrations',
          icon: Users,
          permission: 'manage_registrations',
        },
        {
          href: '/admin/waivers',
          label: 'Waivers',
          icon: FileCheck,
          permission: 'manage_users',
        },
        {
          href: '/admin/communications',
          label: 'Communications',
          icon: Mail,
          permission: 'send_announcements',
        },
        {
          href: '/admin/programs',
          label: 'Programs',
          icon: Calendar,
          permission: 'manage_programs',
        },
        {
          href: '/calendar',
          label: 'Calendar',
          icon: Calendar,
          permission: 'manage_programs',
        },
      ],
    },
    {
      group: 'Reports',
      items: [
        {
          href: '/admin/reports',
          label: 'Reports',
          icon: FileSpreadsheet,
          permission: 'view_reports',
        },
      ],
    },
    {
      group: 'System',
      items: [
        {
          href: '/admin/activity',
          label: 'Activity Log',
          icon: FileText,
          permission: 'view_reports',
        },
        {
          href: '/admin/users',
          label: 'Users',
          icon: Users,
          permission: 'manage_settings',
        },
        {
          href: '/admin/email-settings',
          label: 'Email Settings',
          icon: Mail,
          permission: 'manage_settings',
        },
        {
          href: '/admin/settings',
          label: 'Settings',
          icon: Settings,
          permission: 'manage_settings',
        },
      ],
    },
  ];

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader>
        <HehLogo />
      </SidebarHeader>
      <SidebarContent>
        {navItems.map((group) => (
          <SidebarGroup key={group.group}>
            <SidebarGroupLabel>{group.group}</SidebarGroupLabel>
            <SidebarMenu>
              {group.items.map((item) => {
                if (!hasPermission(item.permission)) return null;

                return (
                  <SidebarMenuItem key={item.href}>
                    <MobileAwareSidebarMenuButton
                      href={item.href}
                      isActive={pathname === item.href}
                      tooltip={item.label}
                    >
                      <item.icon />
                      <span>{item.label}</span>
                    </MobileAwareSidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <MobileAwareSidebarMenuButton href="/dashboard" tooltip="Back to Portal">
              <Home />
              <span>Back to Portal</span>
            </MobileAwareSidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { loading, isAdmin } = useAdmin();
  const isMobile = useIsMobile();

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

  if (!isAdmin) {
    return null; // Will redirect in useAdmin hook
  }

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <AdminSidebar />
      <SidebarInset>
        <DashboardHeader />
        <main className="h-[calc(100vh-4rem)] overflow-y-auto p-4 sm:p-6 lg:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AdminProvider>
  );
}
