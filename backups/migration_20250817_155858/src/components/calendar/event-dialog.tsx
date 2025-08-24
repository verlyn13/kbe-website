'use client';

import { format, set } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { type CalendarEvent, calendarService } from '@/lib/firebase-admin';
import { cn } from '@/lib/utils';

interface EventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event?: CalendarEvent | null;
  initialDate?: Date;
  onSuccess?: () => void;
}

const eventTypes = [
  { value: 'class', label: 'Class' },
  { value: 'competition', label: 'Competition' },
  { value: 'meeting', label: 'Meeting' },
  { value: 'holiday', label: 'Holiday' },
  { value: 'other', label: 'Other' },
];

const timeOptions = Array.from({ length: 48 }, (_, i) => {
  const hour = Math.floor(i / 2);
  const minute = i % 2 === 0 ? '00' : '30';
  const period = hour < 12 ? 'AM' : 'PM';
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return {
    value: `${hour.toString().padStart(2, '0')}:${minute}`,
    label: `${displayHour}:${minute} ${period}`,
  };
});

export function EventDialog({
  open,
  onOpenChange,
  event,
  initialDate,
  onSuccess,
}: EventDialogProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'class' as CalendarEvent['type'],
    location: '',
    allDay: false,
    startDate: initialDate || new Date(),
    startTime: '09:00',
    endDate: initialDate || new Date(),
    endTime: '10:00',
  });

  useEffect(() => {
    if (event) {
      const startDate = new Date(event.startDate);
      const endDate = new Date(event.endDate);

      setFormData({
        title: event.title,
        description: event.description || '',
        type: event.type,
        location: event.location || '',
        allDay: event.allDay,
        startDate,
        startTime: format(startDate, 'HH:mm'),
        endDate,
        endTime: format(endDate, 'HH:mm'),
      });
    } else if (initialDate) {
      setFormData((prev) => ({
        ...prev,
        startDate: initialDate,
        endDate: initialDate,
      }));
    }
  }, [event, initialDate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    try {
      // Combine date and time
      const [startHour, startMinute] = formData.startTime.split(':').map(Number);
      const [endHour, endMinute] = formData.endTime.split(':').map(Number);

      const startDateTime = set(formData.startDate, {
        hours: formData.allDay ? 0 : startHour,
        minutes: formData.allDay ? 0 : startMinute,
        seconds: 0,
        milliseconds: 0,
      });

      const endDateTime = set(formData.endDate, {
        hours: formData.allDay ? 23 : endHour,
        minutes: formData.allDay ? 59 : endMinute,
        seconds: formData.allDay ? 59 : 0,
        milliseconds: 0,
      });

      const eventData: Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'> = {
        title: formData.title,
        description: formData.description || undefined,
        type: formData.type,
        location: formData.location || undefined,
        allDay: formData.allDay,
        startDate: startDateTime,
        endDate: endDateTime,
        createdBy: user.uid,
        createdByName: user.displayName || user.email || 'Unknown',
      };

      if (event) {
        await calendarService.update(event.id, eventData);
        toast({
          title: 'Event updated',
          description: 'The event has been updated successfully.',
        });
      } else {
        await calendarService.create(eventData);
        toast({
          title: 'Event created',
          description: 'The event has been created successfully.',
        });
      }

      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error('Error saving event:', error);
      toast({
        title: 'Error',
        description: 'Failed to save event. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[525px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{event ? 'Edit Event' : 'Create Event'}</DialogTitle>
            <DialogDescription className="text-sm">
              {event ? 'Update the event details' : 'Add a new event to the calendar'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Event title"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="type">Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value as any }))}
              >
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {eventTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="all-day"
                checked={formData.allDay}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, allDay: checked }))}
              />
              <Label htmlFor="all-day">All day event</Label>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'justify-start text-left font-normal',
                        !formData.startDate && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(formData.startDate, 'PPP')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.startDate}
                      onSelect={(date) =>
                        date && setFormData((prev) => ({ ...prev, startDate: date }))
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {!formData.allDay && (
                <div className="grid gap-2">
                  <Label>Start Time</Label>
                  <Select
                    value={formData.startTime}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, startTime: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timeOptions.map((time) => (
                        <SelectItem key={time.value} value={time.value}>
                          {time.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label>End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'justify-start text-left font-normal',
                        !formData.endDate && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(formData.endDate, 'PPP')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.endDate}
                      onSelect={(date) =>
                        date && setFormData((prev) => ({ ...prev, endDate: date }))
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {!formData.allDay && (
                <div className="grid gap-2">
                  <Label>End Time</Label>
                  <Select
                    value={formData.endTime}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, endTime: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timeOptions.map((time) => (
                        <SelectItem key={time.value} value={time.value}>
                          {time.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="location">Location (Optional)</Label>
              <Input
                id="location"
                placeholder="Event location"
                value={formData.location}
                onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Event description"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : event ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
