'use client';

import { collection, getDocs } from 'firebase/firestore';
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
import { useAuth } from '@/hooks/use-auth';
import { auth, db } from '@/lib/firebase';

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
      const currentUser = auth.currentUser;
      systemChecks.push({
        name: 'Authentication',
        status: currentUser ? 'ok' : 'warning',
        message: currentUser ? `Logged in as ${currentUser.email}` : 'Not logged in',
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

    // 2. Check Firestore Connection
    try {
      const testCollection = collection(db, 'test-connection');
      systemChecks.push({
        name: 'Firestore Connection',
        status: 'ok',
        message: 'Connected to Firestore',
        icon: Database,
      });
    } catch (error) {
      systemChecks.push({
        name: 'Firestore Connection',
        status: 'error',
        message: `Error: ${error}`,
        icon: Database,
      });
    }

    // 3. Check Announcements Collection
    try {
      const announcementsSnapshot = await getDocs(collection(db, 'announcements'));
      const count = announcementsSnapshot.size;
      const publishedCount = announcementsSnapshot.docs.filter(
        (doc) => doc.data().status === 'published'
      ).length;

      systemChecks.push({
        name: 'Announcements',
        status: count > 0 ? 'ok' : 'warning',
        message: `${count} total announcements (${publishedCount} published)`,
        icon: Mail,
      });

      // Show first announcement structure
      if (announcementsSnapshot.docs.length > 0) {
        const firstDoc = announcementsSnapshot.docs[0];
        console.log('First announcement structure:', {
          id: firstDoc.id,
          data: firstDoc.data(),
        });
      }
    } catch (error) {
      systemChecks.push({
        name: 'Announcements',
        status: 'error',
        message: `Error: ${error}`,
        icon: Mail,
      });
    }

    // 4. Check Programs Collection
    try {
      const programsSnapshot = await getDocs(collection(db, 'programs'));
      const count = programsSnapshot.size;
      systemChecks.push({
        name: 'Programs',
        status: count > 0 ? 'ok' : 'warning',
        message: `${count} programs configured`,
        icon: FileText,
      });
    } catch (error) {
      systemChecks.push({
        name: 'Programs',
        status: 'error',
        message: `Error: ${error}`,
        icon: FileText,
      });
    }

    // 5. Check Registrations Collection
    try {
      const registrationsSnapshot = await getDocs(collection(db, 'registrations'));
      const count = registrationsSnapshot.size;
      systemChecks.push({
        name: 'Registrations',
        status: 'ok',
        message: `${count} registrations in system`,
        icon: Users,
      });
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
      if (user?.email) {
        const adminEmails = ['jeffreyverlynjohnson@gmail.com', 'admin@example.com'];
        const isAdmin = adminEmails.includes(user.email);

        systemChecks.push({
          name: 'Admin Access',
          status: isAdmin ? 'ok' : 'warning',
          message: isAdmin ? 'Admin access enabled' : 'No admin access',
          icon: Shield,
        });
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
