'use client';

import { format, set } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';
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
import { useSupabaseAuth as useAuth } from '@/hooks/use-supabase-auth';
import { useToast } from '@/hooks/use-toast';
import { type CalendarEvent, calendarService } from '@/lib/services';
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

function plusOneHour(time: string): string {
  const idx = timeOptions.findIndex((t) => t.value === time);
  if (idx === -1) return time;
  // 2 slots = 1 hour in 30-minute increments
  const next = Math.min(idx + 2, timeOptions.length - 1);
  return timeOptions[next].value;
}

// Helper function to copy time from one date to another
function copyTime(from: Date, to: Date) {
  const d = new Date(to);
  d.setHours(from.getHours(), from.getMinutes(), from.getSeconds(), from.getMilliseconds());
  return d;
}

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
  const titleId = useId();
  const typeId = useId();
  const allDayId = useId();
  const locationId = useId();
  const descriptionId = useId();

  // Control popovers explicitly so we can close on select
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);

  // Track whether user has manually adjusted end after auto-sync
  const userAdjustedEndRef = useRef(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'class' as 'class' | 'competition' | 'meeting' | 'holiday' | 'other',
    location: '',
    allDay: false,
    startDate: initialDate || new Date(),
    startTime: '09:00',
    endDate: initialDate || new Date(),
    endTime: '10:00',
  });

  useEffect(() => {
    if (event) {
      const startDate = new Date(event.start);
      const endDate = event.end ? new Date(event.end) : new Date(event.start);

      setFormData({
        title: event.title,
        description: event.description || '',
        // Map service event type to a default category for editing
        type: 'class',
        location: event.location || '',
        allDay: false,
        startDate,
        startTime: format(startDate, 'HH:mm'),
        endDate,
        endTime: format(endDate, 'HH:mm'),
      });

      // When editing existing event, user has already set end date
      userAdjustedEndRef.current = true;
    } else if (initialDate) {
      setFormData((prev) => ({
        ...prev,
        startDate: initialDate,
        endDate: initialDate,
      }));

      // Reset for new events
      userAdjustedEndRef.current = false;
    } else {
      // Reset for completely new events
      userAdjustedEndRef.current = false;
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

      const eventData = {
        title: formData.title,
        description: formData.description,
        start: startDateTime,
        end: endDateTime,
        category: formData.type,
        location: formData.location || undefined,
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
              <Label htmlFor={titleId}>Title</Label>
              <Input
                id={titleId}
                placeholder="Event title"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor={typeId}>Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value as any }))}
              >
                <SelectTrigger id={typeId}>
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
                id={allDayId}
                checked={formData.allDay}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, allDay: checked }))}
              />
              <Label htmlFor={allDayId}>All day event</Label>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label>Start Date</Label>
                <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'justify-between text-left font-normal',
                        !formData.startDate && 'text-muted-foreground'
                      )}
                    >
                      <span>{format(formData.startDate, 'PPP')}</span>
                      <CalendarIcon className="h-4 w-4 opacity-70" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-2" align="start" sideOffset={6}>
                    <Calendar
                      mode="single"
                      selected={formData.startDate}
                      onSelect={(date) => {
                        if (date) {
                          // Preserve existing time if available, else default to 9:00 AM
                          const withTime = formData.startDate
                            ? copyTime(formData.startDate, date)
                            : set(date, { hours: 9, minutes: 0, seconds: 0, milliseconds: 0 });

                          setFormData((prev) => ({
                            ...prev,
                            startDate: withTime,
                            // Auto-sync end date only if user hasn't manually adjusted it
                            endDate: !userAdjustedEndRef.current
                              ? copyTime(withTime, withTime)
                              : prev.endDate,
                          }));
                        }
                        setStartDateOpen(false); // Close on select
                      }}
                      weekStartsOn={1}
                      showOutsideDays
                      captionLayout="dropdown"
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
                    onValueChange={(value) => {
                      setFormData((prev) => ({
                        ...prev,
                        startTime: value,
                        endTime: !userAdjustedEndRef.current ? plusOneHour(value) : prev.endTime,
                      }));
                    }}
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
                <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'justify-between text-left font-normal',
                        !formData.endDate && 'text-muted-foreground'
                      )}
                    >
                      <span>{format(formData.endDate, 'PPP')}</span>
                      <CalendarIcon className="h-4 w-4 opacity-70" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-2" align="start" sideOffset={6}>
                    <Calendar
                      mode="single"
                      selected={formData.endDate}
                      onSelect={(date) => {
                        if (date) {
                          // Preserve existing time if available, else default to 10:00 AM
                          const withTime = formData.endDate
                            ? copyTime(formData.endDate, date)
                            : set(date, { hours: 10, minutes: 0, seconds: 0, milliseconds: 0 });

                          // Ensure end >= start
                          const finalDate =
                            formData.startDate && withTime < formData.startDate
                              ? copyTime(formData.startDate, formData.startDate)
                              : withTime;

                          setFormData((prev) => ({ ...prev, endDate: finalDate }));
                          userAdjustedEndRef.current = true; // User has manually adjusted end date
                        }
                        setEndDateOpen(false); // Close on select
                      }}
                      weekStartsOn={1}
                      showOutsideDays
                      captionLayout="dropdown"
                      fromDate={formData.startDate} // Constrain end date to be >= start date
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
                    onValueChange={(value) => {
                      userAdjustedEndRef.current = true;
                      setFormData((prev) => ({ ...prev, endTime: value }));
                    }}
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
              <Label htmlFor={locationId}>Location (Optional)</Label>
              <Input
                id={locationId}
                placeholder="Event location"
                value={formData.location}
                onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor={descriptionId}>Description (Optional)</Label>
              <Textarea
                id={descriptionId}
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
