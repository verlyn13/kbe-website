'use client';

import Link from 'next/link';
import {
  Bell,
  CircleUser,
  Home,
  LineChart,
  Menu,
  Package,
  Package2,
  Search,
  ShoppingCart,
  Users,
  User,
  LogOut,
  Repeat,
  ChevronDown,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/use-auth';

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
  return (
    <header className="bg-card sticky top-0 z-30 flex h-16 items-center gap-4 border-b px-4 lg:px-6">
      <SidebarTrigger className="md:hidden" />
      <div className="w-full flex-1">{/* Can add breadcrumbs or search here */}</div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={user?.photoURL || 'https://placehold.co/100x100.png'}
                alt={user?.displayName || 'User'}
                data-ai-hint="person"
              />
              <AvatarFallback>
                {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuLabel>
            <p>{user?.displayName || 'User'}</p>
            <p className="text-muted-foreground text-xs font-normal">{user?.email}</p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Repeat className="mr-2 h-4 w-4" />
              <span>Quick Switch</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem>Alex Doe</DropdownMenuItem>
                <DropdownMenuItem>Sam Doe</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={signOut}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
