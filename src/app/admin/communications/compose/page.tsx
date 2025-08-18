'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { announcementService } from '@/lib/firebase-admin';
import { useAdmin } from '@/hooks/use-admin';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Send, Save } from 'lucide-react';
import Link from 'next/link';

export default function ComposeAnnouncementPage() {
  const router = useRouter();
  const { admin } = useAdmin();
  const { toast } = useToast();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [recipients, setRecipients] = useState<'all' | 'mathcounts' | 'enrichment'>('all');
  const [priority, setPriority] = useState<'low' | 'normal' | 'high'>('normal');
  const [pinned, setPinned] = useState(false);
  const [sending, setSending] = useState(false);

  async function handleSubmit(status: 'draft' | 'published') {
    if (!title || !content) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    if (!admin) {
      toast({
        title: 'Error',
        description: 'Admin session not found',
        variant: 'destructive',
      });
      return;
    }

    setSending(true);

    try {
      await announcementService.create({
        title,
        content,
        priority,
        recipients,
        status,
        pinned,
        createdBy: admin.id,
        createdByName: admin.name,
        viewCount: 0,
        acknowledgedBy: [],
      });

      toast({
        title: 'Success',
        description: status === 'published' ? 'Announcement published!' : 'Draft saved!',
      });

      router.push('/admin/communications');
    } catch (error) {
      console.error('Error creating announcement:', error);
      toast({
        title: 'Error',
        description: 'Failed to create announcement',
        variant: 'destructive',
      });
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/communications">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Communications
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Compose Announcement</CardTitle>
          <CardDescription>Create a new announcement for families in your programs</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Announcement title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              placeholder="Write your announcement here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="recipients">Recipients</Label>
              <Select value={recipients} onValueChange={(value: any) => setRecipients(value)}>
                <SelectTrigger id="recipients">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Families</SelectItem>
                  <SelectItem value="mathcounts">MathCounts Only</SelectItem>
                  <SelectItem value="enrichment">Enrichment Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={priority} onValueChange={(value: any) => setPriority(value)}>
                <SelectTrigger id="priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="pinned"
              checked={pinned}
              onCheckedChange={(checked) => setPinned(checked as boolean)}
            />
            <Label htmlFor="pinned" className="font-normal">
              Pin this announcement to the top
            </Label>
          </div>

          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => handleSubmit('draft')} disabled={sending}>
              <Save className="mr-2 h-4 w-4" />
              Save Draft
            </Button>
            <Button onClick={() => handleSubmit('published')} disabled={sending}>
              <Send className="mr-2 h-4 w-4" />
              Publish Now
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
