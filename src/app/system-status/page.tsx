'use client';

import {
  AlertCircle,
  CheckCircle,
  Database,
  FileText,
  Mail,
  Shield,
  Users,
  XCircle,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSupabaseAuth as useAuth } from '@/hooks/use-supabase-auth';

interface SystemCheck {
  name: string;
  status: 'ok' | 'error' | 'warning';
  message: string;
  icon: any;
}

export default function SystemStatusPage() {
  const [checks, setChecks] = useState<SystemCheck[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const runSystemChecks = useCallback(async () => {
    const systemChecks: SystemCheck[] = [];

    // 1. Check Authentication
    try {
      systemChecks.push({
        name: 'Authentication',
        status: user ? 'ok' : 'warning',
        message: user ? `Logged in as ${user.email}` : 'Not logged in',
        icon: Shield,
      });
    } catch (error) {
      systemChecks.push({
        name: 'Authentication',
        status: 'error',
        message: `Error: ${error}`,
        icon: Shield,
      });
    }

    // 2. Check Database Connection
    try {
      const response = await fetch('/api/system/health');
      const health = await response.json();
      systemChecks.push({
        name: 'Database Connection',
        status: health.database ? 'ok' : 'error',
        message: health.database ? 'Connected to Supabase' : 'Database connection failed',
        icon: Database,
      });
    } catch (error) {
      systemChecks.push({
        name: 'Database Connection',
        status: 'error',
        message: `Error: ${error}`,
        icon: Database,
      });
    }

    // 3. Check Announcements
    try {
      const response = await fetch('/api/announcements');
      if (response.ok) {
        const announcements = await response.json();
        const publishedCount = announcements.filter((a: any) => a.status === 'PUBLISHED').length;

        systemChecks.push({
          name: 'Announcements',
          status: announcements.length > 0 ? 'ok' : 'warning',
          message: `${announcements.length} total announcements (${publishedCount} published)`,
          icon: Mail,
        });
      } else {
        throw new Error('Failed to fetch announcements');
      }
    } catch (error) {
      systemChecks.push({
        name: 'Announcements',
        status: 'error',
        message: `Error: ${error}`,
        icon: Mail,
      });
    }

    // 4. Check Programs
    try {
      const response = await fetch('/api/programs');
      if (response.ok) {
        const programs = await response.json();
        systemChecks.push({
          name: 'Programs',
          status: programs.length > 0 ? 'ok' : 'warning',
          message: `${programs.length} programs configured`,
          icon: FileText,
        });
      } else {
        throw new Error('Failed to fetch programs');
      }
    } catch (error) {
      systemChecks.push({
        name: 'Programs',
        status: 'error',
        message: `Error: ${error}`,
        icon: FileText,
      });
    }

    // 5. Check Registrations
    try {
      const response = await fetch('/api/admin/registrations');
      if (response.ok) {
        const registrations = await response.json();
        systemChecks.push({
          name: 'Registrations',
          status: 'ok',
          message: `${registrations.length} registrations in system`,
          icon: Users,
        });
      } else {
        throw new Error('Failed to fetch registrations');
      }
    } catch (error) {
      systemChecks.push({
        name: 'Registrations',
        status: 'error',
        message: `Error: ${error}`,
        icon: Users,
      });
    }

    // 6. Check Admin Access
    try {
      const response = await fetch('/api/admin/check');
      if (response.ok) {
        const { isAdmin } = await response.json();
        systemChecks.push({
          name: 'Admin Access',
          status: isAdmin ? 'ok' : 'warning',
          message: isAdmin ? 'Admin access enabled' : 'No admin access',
          icon: Shield,
        });
      } else {
        throw new Error('Failed to check admin status');
      }
    } catch (error) {
      systemChecks.push({
        name: 'Admin Access',
        status: 'error',
        message: `Error: ${error}`,
        icon: Shield,
      });
    }

    setChecks(systemChecks);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    runSystemChecks();
  }, [runSystemChecks]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ok':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ok':
        return <Badge className="bg-green-500">OK</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-500">Warning</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return null;
    }
  };

  if (loading) {
    return <div className="container mx-auto p-6">Loading system status...</div>;
  }

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <h1 className="mb-6 text-3xl font-bold">System Status Check</h1>

      <div className="space-y-4">
        {checks.map((check) => (
          <Card key={check.name}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <check.icon className="text-muted-foreground h-5 w-5" />
                  <CardTitle className="text-lg">{check.name}</CardTitle>
                </div>
                {getStatusBadge(check.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                {getStatusIcon(check.status)}
                <p className="text-sm">{check.message}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Quick Links</CardTitle>
          <CardDescription>Debug and test pages</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <a href="/debug-announcements" className="block text-blue-600 hover:underline">
              → Debug Announcements
            </a>
            <a href="/debug-auth" className="block text-blue-600 hover:underline">
              → Debug Authentication
            </a>
            <a href="/test-admin" className="block text-blue-600 hover:underline">
              → Test Admin Route
            </a>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Console Output</CardTitle>
          <CardDescription>Check browser console for detailed logs</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
