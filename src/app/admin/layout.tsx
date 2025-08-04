'use client';

import Link from 'next/link';
import { 
  Shield, 
  FileText, 
  Home, 
  Users, 
  Mail, 
  Calendar, 
  FileSpreadsheet, 
  Settings,
  LayoutDashboard 
} from 'lucide-react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
  useSidebar,
  SidebarGroupLabel,
  SidebarGroup,
} from '@/components/ui/sidebar';
import { DashboardHeader } from '@/components/dashboard-header';
import { AdminProvider } from '@/hooks/use-admin';
import { Skeleton } from '@/components/ui/skeleton';
import { useAdmin } from '@/hooks/use-admin';
import { usePathname } from 'next/navigation';

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
                    <SidebarMenuButton 
                      asChild 
                      isActive={pathname === item.href}
                      tooltip={item.label}
                    >
                      <Link href={item.href}>
                        <item.icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
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
            <SidebarMenuButton asChild tooltip="Back to Portal">
              <Link href="/dashboard">
                <Home />
                <span>Back to Portal</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { loading, isAdmin } = useAdmin();

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
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <DashboardHeader />
        <main className="h-[calc(100vh-4rem)] overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
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