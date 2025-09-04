'use client';

import { formatDistanceToNow } from 'date-fns';
import { CheckCircle, Eye, EyeOff, MoreVertical } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Announcement } from '@/lib/services';

interface AnnouncementCardProps {
  announcement: Announcement;
  isHidden?: boolean;
  user: any;
  getPriorityIcon: (priority: string) => React.ReactNode;
  onSelect: (announcement: Announcement) => void;
  onHide: (announcement: Announcement) => void;
  onUnhide: (announcement: Announcement) => void;
  onDelete: (announcement: Announcement) => void;
}

export function AnnouncementCard({
  announcement,
  isHidden = false,
  user,
  getPriorityIcon,
  onSelect,
  onHide,
  onUnhide,
  onDelete,
}: AnnouncementCardProps) {
  return (
    <Card
      className={`cursor-pointer transition-shadow hover:shadow-lg ${isHidden ? 'opacity-60' : ''}`}
      onClick={() => onSelect(announcement)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            {getPriorityIcon(announcement.priority)}
            {announcement.pinned && (
              <Badge variant="secondary" className="h-5 px-1.5 text-[10px] uppercase">
                Pinned
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {announcement.recipients === 'all' ? 'All' : announcement.recipients}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button
                  aria-label={`More actions for ${announcement.title}`}
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {isHidden ? (
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      onUnhide(announcement);
                    }}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Restore
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      onHide(announcement);
                    }}
                  >
                    <EyeOff className="mr-2 h-4 w-4" />
                    Hide
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <CardTitle className="line-clamp-1">{announcement.title}</CardTitle>
        <CardDescription className="text-xs">
          {announcement.publishedAt &&
            formatDistanceToNow(new Date(announcement.publishedAt), { addSuffix: true })}{' '}
          by {announcement.createdByName}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground line-clamp-3 text-sm">{announcement.content}</p>
        <div className="text-muted-foreground mt-4 flex items-center gap-4 text-xs">
          <span>{announcement.viewCount || 0} views</span>
          {announcement.acknowledgedBy?.includes(user?.id || '') && (
            <span className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3" /> Read
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
