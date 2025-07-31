import Link from "next/link";
import {
  Shield,
  FileText,
  Home,
} from "lucide-react";
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
} from "@/components/ui/sidebar";
import { DashboardHeader } from "@/components/dashboard-header";

function KbeLogo() {
  const { state } = useSidebar();
  return (
    <Link href="/dashboard" className="flex items-center gap-2">
       <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-8 w-8 text-sidebar-primary"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      <h1
        className="text-lg font-bold text-white transition-all duration-200 group-data-[collapsible=icon]:-translate-x-96 group-data-[collapsible=icon]:opacity-0"
      >
        KBE Admin
      </h1>
    </Link>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <Sidebar variant="sidebar" collapsible="icon">
        <SidebarHeader>
          <KbeLogo />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton href="/admin/content-generator" isActive tooltip="Content Generator">
                <FileText />
                <span>Content Generator</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
             <SidebarMenuItem>
              <SidebarMenuButton href="/dashboard" tooltip="Back to Portal">
                <Home />
                <span>Back to Portal</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <DashboardHeader />
        <main className="p-4 sm:p-6 lg:p-8 h-[calc(100vh-4rem)] overflow-y-auto">
            {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
