'use client';

import { format, formatDistanceToNow } from 'date-fns';
import { AlertCircle, ArrowLeft, CheckCircle, Clock, Info, Pin } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useId, useState } from 'react';
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSupabaseAuth as useAuth } from '@/hooks/use-supabase-auth';
import { useToast } from '@/hooks/use-toast';
import { type Announcement, announcementService } from '@/lib/services';
import { mapPriorityEnumToLC } from '@/types/enum-mappings';

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [hiddenAnnouncements, setHiddenAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [announcementToDelete, setAnnouncementToDelete] = useState<Announcement | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const [showPinnedOnly, setShowPinnedOnly] = useState(false);
  const filterPinnedId = useId();

  const loadAnnouncements = useCallback(async () => {
    if (!user) return;

    try {
      // Load visible announcements
      const visibleData = await announcementService.getAll();
      setAnnouncements(visibleData);

      // Hidden announcements feature not supported in Prisma model; keep empty list
      setHiddenAnnouncements([]);
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

  // Hide/Unhide not available post-migration; keep no-ops to satisfy UI handlers
  async function handleHide(_announcement: Announcement) {}
  async function handleUnhide(_announcement: Announcement) {}

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
    // Owner concept not tracked in Prisma model post-migration

    return (
      <div className="container mx-auto max-w-4xl p-6">
        <Button variant="ghost" onClick={() => setSelectedAnnouncement(null)} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Back to all announcements</span>
          <span className="sm:hidden">Back</span>
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
                  Posted by {selectedAnnouncement.createdByName}{' '}
                  {selectedAnnouncement.publishedAt && (
                    <>
                      on {format(new Date(selectedAnnouncement.publishedAt), 'MMMM d, yyyy h:mm a')}
                    </>
                  )}
                </CardDescription>
              </div>
              <div className="flex flex-col items-end gap-2">
                {getPriorityBadge(mapPriorityEnumToLC(selectedAnnouncement.priority))}
                <Badge variant="outline">
                  {selectedAnnouncement.recipients === 'all'
                    ? 'All Families'
                    : selectedAnnouncement.recipients}
                </Badge>
                {/* Delete button hidden: owner not tracked in Prisma model */}
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

  const visibleAnnouncements = showPinnedOnly
    ? announcements.filter((a) => a.pinned)
    : announcements;

  return (
    <div className="container mx-auto max-w-6xl space-y-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild className="sm:hidden">
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-2xl font-bold sm:text-3xl">Announcements</h1>
          </div>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            Stay up to date with all program announcements
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Checkbox
              id={filterPinnedId}
              checked={showPinnedOnly}
              onCheckedChange={(checked) => setShowPinnedOnly(Boolean(checked))}
            />
            <label htmlFor={filterPinnedId} className="text-sm text-muted-foreground">
              Show pinned only
            </label>
          </div>
          <Button variant="ghost" asChild className="hidden sm:flex">
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="visible" className="w-full">
        <TabsList>
          <TabsTrigger value="visible">Announcements ({visibleAnnouncements.length})</TabsTrigger>
          {hiddenAnnouncements.length > 0 && (
            <TabsTrigger value="hidden">Hidden ({hiddenAnnouncements.length})</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="visible" className="mt-6">
          {visibleAnnouncements.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Info className="text-muted-foreground mb-4 h-12 w-12" />
                <p className="text-muted-foreground text-lg">No announcements to show</p>
                <p className="text-muted-foreground mt-2 text-sm">
                  {showPinnedOnly
                    ? 'Try turning off the pinned filter to see all announcements.'
                    : "Check the hidden tab if you've hidden any announcements"}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {visibleAnnouncements.map((announcement) => (
                <AnnouncementCard
                  key={announcement.id}
                  announcement={announcement}
                  user={user}
                  getPriorityIcon={(p) => getPriorityIcon(mapPriorityEnumToLC(p as any))}
                  onSelect={setSelectedAnnouncement}
                  onHide={handleHide}
                  onUnhide={handleUnhide}
                  onDelete={handleAnnouncementDelete}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {hiddenAnnouncements.length > 0 && (
          <TabsContent value="hidden" className="mt-6">
            <div className="grid gap-4 md:grid-cols-2">
              {hiddenAnnouncements.map((announcement) => (
                <AnnouncementCard
                  key={announcement.id}
                  announcement={announcement}
                  isHidden
                  user={user}
                  getPriorityIcon={(p) => getPriorityIcon(mapPriorityEnumToLC(p as any))}
                  onSelect={setSelectedAnnouncement}
                  onHide={handleHide}
                  onUnhide={handleUnhide}
                  onDelete={handleAnnouncementDelete}
                />
              ))}
            </div>
          </TabsContent>
        )}
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
