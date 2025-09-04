'use client';

import { formatDistanceToNow } from 'date-fns';
import { AlertCircle, ArrowRight, Info, Pin } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { useSupabaseAuth as useAuth } from '@/hooks/use-supabase-auth';
import { type Announcement, announcementService } from '@/lib/services';
import { mapAnnouncementStatusEnumToLC, mapPriorityEnumToLC } from '@/types/enum-mappings';
import { Button } from './ui/button';

export function Announcements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  const loadAnnouncements = useCallback(async () => {
    try {
      const data = await announcementService.getAll();
      // Filter for published announcements and limit to 5
      const filtered = data
        .filter((a) => mapAnnouncementStatusEnumToLC(a.status) === 'published')
        .slice(0, 5);
      setAnnouncements(filtered);
    } catch (error) {
      console.error('Error loading announcements:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      loadAnnouncements();
    }
  }, [user, loadAnnouncements]);

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
              <p className="text-muted-foreground py-8 text-center">
                No announcements at this time
              </p>
            ) : (
              announcements.map((item) => (
                <div
                  key={item.id}
                  className="hover:bg-muted/50 -m-2 flex cursor-pointer gap-4 rounded-lg p-2 transition-colors"
                  onClick={() => router.push('/announcements')}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      router.push('/announcements');
                    }
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <div
                    className={`w-1.5 rounded-full ${getPriorityColor(mapPriorityEnumToLC(item.priority))}`}
                  ></div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {item.pinned && <Pin className="text-muted-foreground h-3 w-3" />}
                        <h3 className="font-semibold">{item.title}</h3>
                      </div>
                      <p className="text-muted-foreground text-xs whitespace-nowrap">
                        {item.publishedAt &&
                          formatDistanceToNow(new Date(item.publishedAt), { addSuffix: true })}
                      </p>
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      {getPriorityIcon(mapPriorityEnumToLC(item.priority))}
                      <Badge variant="secondary" className="text-xs">
                        {item.recipients === 'all' ? 'All Families' : item.recipients}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mt-2 line-clamp-2 text-sm">
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
