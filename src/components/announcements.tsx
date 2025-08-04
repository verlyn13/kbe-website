'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from './ui/button';
import { ArrowRight, Pin, AlertCircle, Info } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { announcementService, Announcement } from '@/lib/firebase-admin';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

export function Announcements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      loadAnnouncements();
    }
  }, [user]);

  async function loadAnnouncements() {
    try {
      const data = await announcementService.getAll({
        status: 'published',
        limitCount: 5,
        userId: user?.uid,
        showHidden: false,
      });
      setAnnouncements(data);
    } catch (error) {
      console.error('Error loading announcements:', error);
    } finally {
      setLoading(false);
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'normal':
        return <Info className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500';
      case 'normal':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <Card className="flex h-full flex-col shadow-lg">
        <CardHeader>
          <CardTitle>Announcements</CardTitle>
          <CardDescription>Latest news and updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex h-full flex-col shadow-lg">
      <CardHeader>
        <CardTitle>Announcements</CardTitle>
        <CardDescription>Latest news and updates for families</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-6">
            {announcements.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No announcements at this time
              </p>
            ) : (
              announcements.map((item) => (
                <div 
                  key={item.id} 
                  className="flex gap-4 cursor-pointer hover:bg-muted/50 rounded-lg p-2 -m-2 transition-colors"
                  onClick={() => router.push('/announcements')}
                >
                  <div className={`w-1.5 rounded-full ${getPriorityColor(item.priority)}`}></div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {item.pinned && <Pin className="h-3 w-3 text-muted-foreground" />}
                        <h3 className="font-semibold">{item.title}</h3>
                      </div>
                      <p className="text-muted-foreground text-xs whitespace-nowrap">
                        {item.publishedAt && formatDistanceToNow(new Date(item.publishedAt), { addSuffix: true })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      {getPriorityIcon(item.priority)}
                      <Badge variant="secondary" className="text-xs">
                        {item.recipients === 'all' ? 'All Families' : item.recipients}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mt-2 text-sm line-clamp-2">
                      {item.content}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <Button variant="ghost" className="w-full" asChild>
          <Link href="/announcements">
            View All Announcements <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}