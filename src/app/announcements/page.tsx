'use client';

import { format, formatDistanceToNow } from 'date-fns';
import { AlertCircle, ArrowLeft, Info } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { AnnouncementCard } from '@/components/announcement-card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { type Announcement, announcementService } from '@/lib/firebase-admin';

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [hiddenAnnouncements, setHiddenAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [announcementToDelete, setAnnouncementToDelete] = useState<Announcement | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const loadAnnouncements = useCallback(async () => {
    if (!user) return;

    try {
      // Load visible announcements
      const visibleData = await announcementService.getAll({
        status: 'published',
        userId: user.uid,
        showHidden: false,
      });
      setAnnouncements(visibleData);

      // Load hidden announcements
      const allData = await announcementService.getAll({
        status: 'published',
        userId: user.uid,
        showHidden: true,
      });
      const hidden = allData.filter((a) => a.hiddenBy?.includes(user.uid));
      setHiddenAnnouncements(hidden);

      // Mark as viewed
      if (visibleData.length > 0) {
        visibleData.forEach(async (announcement) => {
          if (!announcement.acknowledgedBy.includes(user.uid)) {
            await announcementService.markAsRead(announcement.id, user.uid);
          }
        });
      }
    } catch (error) {
      console.error('Error loading announcements:', error);
      toast({
        title: 'Error',
        description: 'Failed to load announcements',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    loadAnnouncements();
  }, [loadAnnouncements]);

  async function handleHide(announcement: Announcement) {
    if (!user) return;

    try {
      await announcementService.hide(announcement.id, user.uid);
      toast({
        title: 'Hidden',
        description: 'Announcement hidden from your view',
      });
      loadAnnouncements();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to hide announcement',
        variant: 'destructive',
      });
    }
  }

  async function handleUnhide(announcement: Announcement) {
    if (!user) return;

    try {
      await announcementService.unhide(announcement.id, user.uid);
      toast({
        title: 'Restored',
        description: 'Announcement restored to your view',
      });
      loadAnnouncements();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to restore announcement',
        variant: 'destructive',
      });
    }
  }

  async function handleDelete() {
    if (!announcementToDelete) return;

    try {
      await announcementService.delete(announcementToDelete.id);
      toast({
        title: 'Deleted',
        description: 'Announcement deleted permanently',
      });
      loadAnnouncements();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete announcement',
        variant: 'destructive',
      });
    } finally {
      setDeleteDialogOpen(false);
      setAnnouncementToDelete(null);
      setSelectedAnnouncement(null);
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'normal':
        return <Info className="h-5 w-5 text-blue-500" />;
      default:
        return <Info className="h-5 w-5 text-gray-500" />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">High Priority</Badge>;
      case 'normal':
        return <Badge>Normal</Badge>;
      default:
        return <Badge variant="secondary">Low</Badge>;
    }
  };

  const handleAnnouncementDelete = (announcement: Announcement) => {
    setAnnouncementToDelete(announcement);
    setDeleteDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="container mx-auto max-w-6xl space-y-6 p-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      </div>
    );
  }

  if (selectedAnnouncement) {
    const isOwner = user && selectedAnnouncement.createdBy === user.uid;

    return (
      <div className="container mx-auto max-w-4xl p-6">
        <Button variant="ghost" onClick={() => setSelectedAnnouncement(null)} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to all announcements
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {selectedAnnouncement.pinned && <Pin className="h-4 w-4" />}
                  <CardTitle className="text-2xl">{selectedAnnouncement.title}</CardTitle>
                </div>
                <CardDescription>
                  By {selectedAnnouncement.createdByName} •{' '}
                  {selectedAnnouncement.publishedAt &&
                    format(new Date(selectedAnnouncement.publishedAt), 'MMMM d, yyyy at h:mm a')}
                </CardDescription>
              </div>
              <div className="flex flex-col items-end gap-2">
                {getPriorityBadge(selectedAnnouncement.priority)}
                <Badge variant="outline">
                  {selectedAnnouncement.recipients === 'all'
                    ? 'All Families'
                    : selectedAnnouncement.recipients}
                </Badge>
                {isOwner && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      setAnnouncementToDelete(selectedAnnouncement);
                      setDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <p className="whitespace-pre-wrap">{selectedAnnouncement.content}</p>
            </div>
            <Separator className="my-6" />
            <div className="text-muted-foreground flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span>{selectedAnnouncement.viewCount} views</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>
                  Posted{' '}
                  {selectedAnnouncement.publishedAt &&
                    formatDistanceToNow(new Date(selectedAnnouncement.publishedAt), {
                      addSuffix: true,
                    })}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Announcements</h1>
          <p className="text-muted-foreground mt-1">
            Stay up to date with all program announcements
          </p>
        </div>
        <Button variant="ghost" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="visible" className="w-full">
        <TabsList>
          <TabsTrigger value="visible">Announcements ({announcements.length})</TabsTrigger>
          <TabsTrigger value="hidden">Hidden ({hiddenAnnouncements.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="visible" className="mt-6">
          {announcements.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Info className="text-muted-foreground mb-4 h-12 w-12" />
                <p className="text-muted-foreground text-lg">No announcements to show</p>
                <p className="text-muted-foreground mt-2 text-sm">
                  Check the hidden tab if you've hidden any announcements
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {announcements.map((announcement) => (
                <AnnouncementCard
                  key={announcement.id}
                  announcement={announcement}
                  user={user}
                  getPriorityIcon={getPriorityIcon}
                  onSelect={setSelectedAnnouncement}
                  onHide={handleHide}
                  onUnhide={handleUnhide}
                  onDelete={handleAnnouncementDelete}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="hidden" className="mt-6">
          {hiddenAnnouncements.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <EyeOff className="text-muted-foreground mb-4 h-12 w-12" />
                <p className="text-muted-foreground text-lg">No hidden announcements</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {hiddenAnnouncements.map((announcement) => (
                <AnnouncementCard
                  key={announcement.id}
                  announcement={announcement}
                  isHidden
                  user={user}
                  getPriorityIcon={getPriorityIcon}
                  onSelect={setSelectedAnnouncement}
                  onHide={handleHide}
                  onUnhide={handleUnhide}
                  onDelete={handleAnnouncementDelete}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Announcement</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{announcementToDelete?.title}"? This will remove it
              for all users and cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
