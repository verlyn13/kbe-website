'use client';
import { Bell, Home, LogOut, Shield, User } from 'lucide-react';
import Link from 'next/link';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useAdmin } from '@/hooks/use-admin';
import { useSupabaseAuth as useAuth } from '@/hooks/use-supabase-auth';

/**
 * DashboardHeader component provides the top navigation bar for the dashboard layout.
 * It includes a sidebar trigger for mobile devices, user avatar with dropdown menu,
 * and quick switch functionality between different user profiles.
 * The header is sticky positioned and provides authentication-related actions.
 *
 * @component
 * @returns {JSX.Element} A sticky header with navigation and user controls
 *
 * @example
 * ```tsx
 * import { DashboardHeader } from "@/components/dashboard-header";
 *
 * function DashboardLayout({ children }: { children: React.ReactNode }) {
 *   return (
 *     <div className="flex h-screen">
 *       <DashboardHeader />
 *       <main className="flex-1 p-4">
 *         {children}
 *       </main>
 *     </div>
 *   );
 * }
 * ```
 */
export function DashboardHeader() {
  const { user, signOut } = useAuth();
  const { isAdmin } = useAdmin();

  return (
    <header className="bg-card sticky top-0 z-20 flex h-16 shrink-0 items-center gap-4 border-b px-4 lg:px-6">
      <SidebarTrigger className="-ml-1" />
      <div className="flex w-full flex-1 items-center gap-4">
        <h2 className="text-lg font-semibold">Dashboard</h2>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/announcements">
              <Bell className="mr-1 h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Announcements</span>
            </Link>
          </Button>
          <ThemeSwitcher />
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={user?.user_metadata?.avatar_url || 'https://placehold.co/100x100.png'}
                alt={user?.user_metadata?.name || user?.email || 'User'}
                data-ai-hint="person"
              />
              <AvatarFallback>
                {user?.user_metadata?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuLabel>
            <p>{user?.user_metadata?.name || user?.email || 'User'}</p>
            <p className="text-muted-foreground text-xs font-normal">{user?.email}</p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/profile">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
          {isAdmin && (
            <>
              <DropdownMenuItem asChild>
                <Link href="/admin">
                  <Shield className="mr-2 h-4 w-4" />
                  <span>Admin Panel</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard">
                  <Home className="mr-2 h-4 w-4" />
                  <span>Guardian Dashboard</span>
                </Link>
              </DropdownMenuItem>
            </>
          )}
          <DropdownMenuItem onClick={signOut}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
