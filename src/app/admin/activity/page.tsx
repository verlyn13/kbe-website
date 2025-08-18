'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Activity, User, Mail, FileText, Settings } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ActivityLog {
  id: string;
  type: 'registration' | 'announcement' | 'settings' | 'login';
  action: string;
  user: string;
  timestamp: Date;
  details?: string;
}

// Mock data for now - in production this would come from Firestore
const mockActivities: ActivityLog[] = [
  {
    id: '1',
    type: 'announcement',
    action: 'Published announcement',
    user: 'Jeffrey Johnson',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    details: 'Welcome to Homer Enrichment Hub!',
  },
  {
    id: '2',
    type: 'login',
    action: 'Admin login',
    user: 'Jeffrey Johnson',
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
  },
  {
    id: '3',
    type: 'registration',
    action: 'Approved registration',
    user: 'System',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    details: 'Jane Doe - 2 students',
  },
];

export default function AdminActivityPage() {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setActivities(mockActivities);
      setLoading(false);
    }, 1000);
  }, []);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'registration':
        return <User className="h-4 w-4" />;
      case 'announcement':
        return <Mail className="h-4 w-4" />;
      case 'settings':
        return <Settings className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'registration':
        return 'text-blue-600';
      case 'announcement':
        return 'text-green-600';
      case 'settings':
        return 'text-orange-600';
      default:
        return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-[400px]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Activity Log</h1>
        <p className="text-muted-foreground">Track all administrative actions and system events</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>All administrative actions from the last 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activities.length === 0 ? (
              <p className="text-muted-foreground py-8 text-center">No recent activity</p>
            ) : (
              activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 border-b pb-4 last:border-0 last:pb-0"
                >
                  <div className={`mt-1 ${getActivityColor(activity.type)}`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{activity.action}</p>
                      <p className="text-muted-foreground text-sm">
                        {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                      </p>
                    </div>
                    <p className="text-muted-foreground text-sm">by {activity.user}</p>
                    {activity.details && <p className="mt-1 text-sm">{activity.details}</p>}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
