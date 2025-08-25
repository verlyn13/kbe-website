'use client';

import {
  AlertCircle,
  Calendar,
  Clock,
  Download,
  FileSpreadsheet,
  Send,
  UserPlus,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAdmin } from '@/hooks/use-admin';
import { registrationService } from '@/lib/firebase-admin';

interface DashboardStats {
  registrations: {
    pending: number;
    active: number;
    waitlist: number;
    totalStudents: number;
  };
  upcomingEvents: Array<{
    id: string;
    title: string;
    date: Date;
    type: 'meeting' | 'competition' | 'deadline';
  }>;
  recentActivity: Array<{
    id: string;
    action: string;
    timestamp: Date;
    user?: string;
  }>;
}

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
}: {
  title: string;
  value: number | string;
  description?: string;
  icon: React.ElementType;
  trend?: 'up' | 'down' | 'neutral';
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="text-muted-foreground h-4 w-4" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-muted-foreground text-xs">{description}</p>}
      </CardContent>
    </Card>
  );
}

function QuickActionCard({
  title,
  subtitle,
  icon: Icon,
  href,
  onClick,
}: {
  title: string;
  subtitle: string;
  icon: React.ElementType;
  href?: string;
  onClick?: () => void;
}) {
  const content = (
    <>
      <Icon className="text-primary mb-2 h-6 w-6" />
      <h3 className="font-semibold">{title}</h3>
      <p className="text-muted-foreground text-sm">{subtitle}</p>
    </>
  );

  if (href) {
    return (
      <Link href={href}>
        <Card className="hover:bg-accent h-full cursor-pointer transition-colors">
          <CardContent className="pt-6">{content}</CardContent>
        </Card>
      </Link>
    );
  }

  return (
    <Card className="hover:bg-accent h-full cursor-pointer transition-colors" onClick={onClick}>
      <CardContent className="pt-6">{content}</CardContent>
    </Card>
  );
}

export default function AdminDashboardPage() {
  const { admin } = useAdmin();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadDashboard() {
      try {
        const registrationStats = await registrationService.getStats('mathcounts-2025');

        // Mock upcoming events for now
        const upcomingEvents = [
          {
            id: '1',
            title: 'MathCounts Meeting',
            date: new Date('2025-09-09T16:00:00'),
            type: 'meeting' as const,
          },
          {
            id: '2',
            title: 'Chapter Competition',
            date: new Date('2025-01-18T09:00:00'),
            type: 'competition' as const,
          },
          {
            id: '3',
            title: 'Registration Deadline',
            date: new Date('2025-08-31T23:59:59'),
            type: 'deadline' as const,
          },
        ];

        // Mock recent activity
        const recentActivity = [
          {
            id: '1',
            action: 'New registration from Jane Smith',
            timestamp: new Date(),
          },
          {
            id: '2',
            action: 'Announcement sent to all families',
            timestamp: new Date(Date.now() - 3600000),
            user: 'Admin',
          },
        ];

        setStats({
          registrations: registrationStats,
          upcomingEvents,
          recentActivity,
        });
      } catch (error) {
        console.error('Error loading dashboard:', error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {admin?.name}. Here's an overview of your programs.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Pending Registrations"
          value={stats?.registrations.pending || 0}
          description="Awaiting approval"
          icon={AlertCircle}
        />
        <StatCard
          title="Active Students"
          value={stats?.registrations.totalStudents || 0}
          description={`${stats?.registrations.active || 0} families`}
          icon={Users}
        />
        <StatCard
          title="Waitlist"
          value={stats?.registrations.waitlist || 0}
          description="Students waiting"
          icon={Clock}
        />
        <StatCard
          title="Next Meeting"
          value="Sep 9"
          description="Tuesday, 4:00 PM"
          icon={Calendar}
        />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <QuickActionCard
              title="Send Announcement"
              subtitle="Email all families"
              icon={Send}
              href="/admin/communications/compose"
            />
            <QuickActionCard
              title="Export Roster"
              subtitle="Download student list"
              icon={Download}
              onClick={() => {
                // TODO: Implement export
                console.log('Export roster');
              }}
            />
            <QuickActionCard
              title="View Schedule"
              subtitle="Today's activities"
              icon={Calendar}
              href="/calendar"
            />
            <QuickActionCard
              title="Registration Report"
              subtitle="View analytics"
              icon={FileSpreadsheet}
              href="/admin/reports"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>Important dates and deadlines</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="hover:bg-accent flex cursor-pointer items-start gap-3 rounded-lg p-2 transition-colors"
                  onClick={() =>
                    router.push(`/calendar?eventId=${event.id}&date=${event.date.toISOString()}`)
                  }
                >
                  <div
                    className={`rounded-full p-2 ${
                      event.type === 'competition'
                        ? 'bg-green-100'
                        : event.type === 'deadline'
                          ? 'bg-red-100'
                          : 'bg-blue-100'
                    }`}
                  >
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{event.title}</p>
                    <p className="text-muted-foreground text-sm">
                      {event.date.toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <Badge
                    variant={
                      event.type === 'competition'
                        ? 'default'
                        : event.type === 'deadline'
                          ? 'destructive'
                          : 'secondary'
                    }
                  >
                    {event.type}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates and changes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="bg-muted rounded-full p-2">
                    <UserPlus className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">{activity.action}</p>
                    <p className="text-muted-foreground text-xs">
                      {activity.timestamp.toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                      {activity.user && ` by ${activity.user}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="mt-4 w-full" asChild>
              <Link href="/admin/activity">View All Activity</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Pending Actions Alert */}
      {stats?.registrations.pending && stats.registrations.pending > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              Pending Actions Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm">
              You have {stats.registrations.pending} registration
              {stats.registrations.pending > 1 ? 's' : ''} waiting for approval.
            </p>
            <Button asChild>
              <Link href="/admin/registrations?filter=pending">Review Pending Registrations</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
