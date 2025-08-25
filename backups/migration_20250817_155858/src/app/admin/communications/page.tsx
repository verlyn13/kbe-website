'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { Check, Clock, Eye, Plus, Send, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { DataTable } from '@/components/admin/data-table';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { type Announcement, announcementService } from '@/lib/firebase-admin';

export default function AdminCommunicationsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [announcementToDelete, setAnnouncementToDelete] = useState<Announcement | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadAnnouncements();
  }, [loadAnnouncements]);

  async function loadAnnouncements() {
    try {
      const data = await announcementService.getAll();
      setAnnouncements(data);
    } catch (error) {
      console.error('Error loading announcements:', error);
    } finally {
      setLoading(false);
    }
  }

  const columns: ColumnDef<Announcement>[] = [
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => {
        const pinned = row.original.pinned;
        return (
          <div className="flex items-center gap-2">
            {pinned && (
              <Badge variant="secondary" className="text-xs">
                Pinned
              </Badge>
            )}
            <span>{row.getValue('title')}</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'recipients',
      header: 'Recipients',
      cell: ({ row }) => {
        const recipients = row.getValue('recipients') as string;
        return recipients.charAt(0).toUpperCase() + recipients.slice(1);
      },
    },
    {
      accessorKey: 'publishedAt',
      header: 'Published',
      cell: ({ row }) => {
        const date = row.getValue('publishedAt') as Date | null;
        if (!date) return '-';
        return date.toLocaleDateString();
      },
    },
    {
      accessorKey: 'createdByName',
      header: 'Created By',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as Announcement['status'];
        const icon =
          status === 'published' ? (
            <Check className="h-3 w-3" />
          ) : status === 'archived' ? (
            <Clock className="h-3 w-3" />
          ) : (
            <Send className="h-3 w-3" />
          );

        const variant =
          status === 'published' ? 'default' : status === 'archived' ? 'secondary' : 'outline';

        return (
          <Badge variant={variant} className="gap-1">
            {icon}
            {status}
          </Badge>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const announcement = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setSelectedAnnouncement(announcement)}>
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setAnnouncementToDelete(announcement);
                setDeleteDialogOpen(true);
              }}
            >
              <Trash2 className="text-destructive h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  async function handleDelete() {
    if (!announcementToDelete) return;

    try {
      await announcementService.delete(announcementToDelete.id);
      toast({
        title: 'Success',
        description: 'Announcement deleted successfully',
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
    }
  }

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Communications</h1>
          <p className="text-muted-foreground">
            Send announcements and manage communications with families
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/communications/compose">
            <Plus className="mr-2 h-4 w-4" />
            New Announcement
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Sent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {announcements.filter((a) => a.status === 'published').length}
            </div>
            <p className="text-muted-foreground text-xs">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Archived</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {announcements.filter((a) => a.status === 'archived').length}
            </div>
            <p className="text-muted-foreground text-xs">Upcoming</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Drafts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {announcements.filter((a) => a.status === 'draft').length}
            </div>
            <p className="text-muted-foreground text-xs">Saved</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Announcement History</CardTitle>
          <CardDescription>View all sent and scheduled announcements</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={announcements} searchKey="title" />
        </CardContent>
      </Card>

      {/* View Announcement Dialog */}
      <Dialog open={!!selectedAnnouncement} onOpenChange={() => setSelectedAnnouncement(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedAnnouncement?.title}</DialogTitle>
            <DialogDescription>
              {selectedAnnouncement?.publishedAt &&
                format(new Date(selectedAnnouncement.publishedAt), 'MMMM d, yyyy at h:mm a')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Badge
                variant={selectedAnnouncement?.priority === 'high' ? 'destructive' : 'default'}
              >
                {selectedAnnouncement?.priority} priority
              </Badge>
              <Badge variant="outline">
                {selectedAnnouncement?.recipients === 'all'
                  ? 'All Families'
                  : selectedAnnouncement?.recipients}
              </Badge>
              {selectedAnnouncement?.pinned && <Badge variant="secondary">Pinned</Badge>}
            </div>
            <div className="bg-muted rounded-lg p-4">
              <p className="whitespace-pre-wrap">{selectedAnnouncement?.content}</p>
            </div>
            <div className="text-muted-foreground text-sm">
              <p>Created by: {selectedAnnouncement?.createdByName}</p>
              <p>Views: {selectedAnnouncement?.viewCount || 0}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Announcement</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{announcementToDelete?.title}"? This action cannot be
              undone.
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
