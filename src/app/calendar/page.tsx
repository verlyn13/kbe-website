'use client';

import { addMonths } from 'date-fns/addMonths';
import { eachDayOfInterval } from 'date-fns/eachDayOfInterval';
import { endOfMonth } from 'date-fns/endOfMonth';
import { endOfWeek } from 'date-fns/endOfWeek';
// Optimize date-fns imports by importing only what we need
import { format } from 'date-fns/format';
import { isSameDay } from 'date-fns/isSameDay';
import { isSameMonth } from 'date-fns/isSameMonth';
import { isToday } from 'date-fns/isToday';
import { startOfMonth } from 'date-fns/startOfMonth';
import { startOfWeek } from 'date-fns/startOfWeek';
import { subMonths } from 'date-fns/subMonths';
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Coffee,
  MapPin,
  MoreVertical,
  Palmtree,
  Plus,
  Trophy,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LazyEventDialog } from '@/components/lazy';
import { CalendarSkeleton } from '@/components/loading/calendar-skeleton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { AdminProvider, useAdmin } from '@/hooks/use-admin';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { type CalendarEvent, calendarService } from '@/lib/firebase-admin';
import { cn } from '@/lib/utils';

const eventTypeConfig = {
  class: { icon: Users, color: 'bg-blue-500', label: 'Class' },
  competition: { icon: Trophy, color: 'bg-purple-500', label: 'Competition' },
  meeting: { icon: Coffee, color: 'bg-green-500', label: 'Meeting' },
  holiday: { icon: Palmtree, color: 'bg-orange-500', label: 'Holiday' },
  other: { icon: CalendarIcon, color: 'bg-gray-500', label: 'Other' },
};

function CalendarPageContent() {
  const searchParams = useSearchParams();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const [eventDialogOpen, setEventDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const { user } = useAuth();
  const { isAdmin } = useAdmin();
  const { toast } = useToast();

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  useEffect(() => {
    // Handle navigation from upcoming events
    const eventDate = searchParams.get('date');
    const eventId = searchParams.get('eventId');

    if (eventDate) {
      const date = new Date(eventDate);
      setCurrentDate(date);
      setSelectedDate(date);

      // Scroll to selected date section after render
      setTimeout(() => {
        const selectedDateElement = document.getElementById('selected-date-events');
        if (selectedDateElement) {
          selectedDateElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 500);
    }
  }, [searchParams]);

  async function loadEvents() {
    try {
      const start = startOfMonth(currentDate);
      const end = endOfMonth(currentDate);
      const data = await calendarService.getEvents(start, end);
      setEvents(data);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  }

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const previousMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const goToToday = () => setCurrentDate(new Date());

  const getEventsForDay = (day: Date) => {
    return events.filter((event) => {
      const eventDate = new Date(event.startDate);
      return isSameDay(eventDate, day);
    });
  };

  const handleAddEvent = () => {
    setSelectedEvent(null);
    setEventDialogOpen(true);
  };

  const handleEditEvent = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setEventDialogOpen(true);
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!user || !window.confirm('Are you sure you want to delete this event?')) return;

    try {
      await calendarService.delete(eventId, user.uid, user.displayName || user.email || 'Unknown');
      toast({
        title: 'Event deleted',
        description: 'The event has been removed from the calendar.',
      });
      loadEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete event. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto max-w-7xl space-y-6 px-4 py-6">
        <Skeleton className="h-10 w-64" />
        <CalendarSkeleton />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl space-y-4 p-4 sm:space-y-6 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild className="sm:hidden">
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-2xl font-bold sm:text-3xl">Calendar</h1>
          </div>
          <p className="text-muted-foreground text-sm sm:text-base">
            View upcoming classes, competitions, and events
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" asChild className="hidden sm:inline-flex">
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
          {isAdmin && (
            <Button onClick={handleAddEvent} size="sm" className="sm:size-default">
              <Plus className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Add Event</span>
              <span className="sm:hidden">Add</span>
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-xl sm:text-2xl">
              {format(currentDate, 'MMMM yyyy')}
            </CardTitle>
            <div className="flex items-center gap-1 sm:gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={goToToday}
                className="text-xs sm:text-sm"
              >
                Today
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={previousMonth}
                className="h-8 w-8 sm:h-9 sm:w-9"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={nextMonth}
                className="h-8 w-8 sm:h-9 sm:w-9"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Calendar Grid */}
          <div className="bg-muted grid grid-cols-7 gap-px overflow-hidden rounded-lg">
            {/* Day Headers */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div
                key={day}
                className="bg-background text-muted-foreground p-1 text-center text-xs font-medium sm:p-2 sm:text-sm"
              >
                <span className="sm:hidden">{day.slice(0, 1)}</span>
                <span className="hidden sm:inline">{day}</span>
              </div>
            ))}

            {/* Calendar Days */}
            {calendarDays.map((day) => {
              const dayEvents = getEventsForDay(day);
              const isCurrentMonth = isSameMonth(day, currentDate);
              const isSelectedDay = selectedDate && isSameDay(day, selectedDate);
              const isTodayDate = isToday(day);
              const dayKey = format(day, 'yyyy-MM-dd');

              return (
                <div
                  key={dayKey}
                  onClick={() => setSelectedDate(day)}
                  className={cn(
                    'bg-background hover:bg-muted/50 min-h-[60px] cursor-pointer p-1 transition-colors sm:min-h-[100px] sm:p-2',
                    !isCurrentMonth && 'text-muted-foreground bg-muted/30',
                    isSelectedDay && 'ring-primary ring-2',
                    isTodayDate && 'bg-primary/5'
                  )}
                >
                  <div className="mb-1 flex items-start justify-between">
                    <span
                      className={cn(
                        'text-xs font-medium sm:text-sm',
                        isTodayDate &&
                          'bg-primary text-primary-foreground flex h-5 w-5 items-center justify-center rounded-full text-[10px] sm:h-7 sm:w-7 sm:text-xs'
                      )}
                    >
                      {format(day, 'd')}
                    </span>
                  </div>

                  {/* Event Dots - Mobile */}
                  <div className="sm:hidden">
                    {dayEvents.length > 0 && (
                      <div className="flex gap-0.5">
                        {dayEvents.slice(0, 3).map((event, idx) => {
                          const config = eventTypeConfig[event.type];
                          return (
                            <div
                              key={idx}
                              className={cn('h-1.5 w-1.5 rounded-full', config.color)}
                            />
                          );
                        })}
                        {dayEvents.length > 3 && (
                          <span className="text-muted-foreground ml-0.5 text-[8px]">
                            +{dayEvents.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Event List - Desktop */}
                  <div className="hidden space-y-1 sm:block">
                    {dayEvents.slice(0, 3).map((event, eventIndex) => {
                      const config = eventTypeConfig[event.type];
                      return (
                        <div key={eventIndex} className="flex items-center gap-1">
                          <div className={cn('h-2 w-2 flex-shrink-0 rounded-full', config.color)} />
                          <span className="truncate text-xs">{event.title}</span>
                        </div>
                      );
                    })}
                    {dayEvents.length > 3 && (
                      <span className="text-muted-foreground text-xs">
                        +{dayEvents.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Selected Day Events */}
      {selectedDate && (
        <Card id="selected-date-events">
          <CardHeader>
            <CardTitle>Events on {format(selectedDate, 'MMMM d, yyyy')}</CardTitle>
          </CardHeader>
          <CardContent>
            {getEventsForDay(selectedDate).length === 0 ? (
              <p className="text-muted-foreground py-8 text-center">
                No events scheduled for this day
              </p>
            ) : (
              <div className="space-y-4">
                {getEventsForDay(selectedDate).map((event) => {
                  const config = eventTypeConfig[event.type];
                  const Icon = config.icon;

                  return (
                    <div key={event.id} className="flex items-start gap-4 rounded-lg border p-4">
                      <div className={cn('rounded-lg p-2', config.color, 'bg-opacity-20')}>
                        <Icon className={cn('h-5 w-5', config.color.replace('bg-', 'text-'))} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold">{event.title}</h3>
                            <div className="text-muted-foreground mt-1 flex items-center gap-4 text-sm">
                              {!event.allDay && (
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {format(new Date(event.startDate), 'h:mm a')}
                                  {event.endDate &&
                                    ` - ${format(new Date(event.endDate), 'h:mm a')}`}
                                </span>
                              )}
                              {event.location && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {event.location}
                                </span>
                              )}
                            </div>
                            {event.description && (
                              <p className="text-muted-foreground mt-2 text-sm">
                                {event.description}
                              </p>
                            )}
                          </div>
                          {isAdmin && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEditEvent(event)}>
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={() => handleDeleteEvent(event.id)}
                                >
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Event Type Legend */}
      <Card>
        <CardHeader>
          <CardTitle>Event Types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {Object.entries(eventTypeConfig).map(([type, config]) => {
              const Icon = config.icon;
              return (
                <div key={type} className="flex items-center gap-2">
                  <div className={cn('h-4 w-4 rounded-full', config.color)} />
                  <span className="text-sm">{config.label}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Event Dialog - Only load when needed */}
      {eventDialogOpen && (
        <LazyEventDialog
          open={eventDialogOpen}
          onOpenChange={setEventDialogOpen}
          event={selectedEvent}
          initialDate={selectedDate || undefined}
          onSuccess={loadEvents}
        />
      )}
    </div>
  );
}

export default function CalendarPage() {
  return (
    <AdminProvider>
      <CalendarPageContent />
    </AdminProvider>
  );
}
