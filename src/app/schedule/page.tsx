import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Download, Clock } from 'lucide-react';

const schedule = {
  regular: {
    title: 'Weekly MathCounts Meetings',
    day: 'Tuesday',
    time: '4:00-5:30 PM',
    location: 'Homer Middle School, Room 203',
    startDate: 'September 9, 2025',
    endDate: 'March 4, 2025',
  },
  specialEvents: [
    {
      date: 'September 9, 2025',
      title: 'First Meeting & Orientation',
      time: '4:00-5:30 PM',
      type: 'meeting' as const,
    },
    {
      date: 'October 31, 2025',
      title: 'No Meeting - Halloween',
      type: 'holiday',
    },
    {
      date: 'November 25-29, 2025',
      title: 'No Meeting - Thanksgiving Break',
      type: 'holiday',
    },
    {
      date: 'December 10, 2025',
      title: 'Practice Competition',
      time: '4:00-6:00 PM',
      type: 'special',
    },
    {
      date: 'December 23-27, 2025',
      title: 'No Meeting - Winter Break',
      type: 'holiday',
    },
    {
      date: 'January 18, 2025',
      title: 'Chapter Competition',
      time: '9:00 AM - 1:00 PM',
      location: 'Homer High School',
      type: 'competition',
    },
    {
      date: 'March 8, 2025',
      title: 'State Competition',
      time: 'All Day',
      location: 'Anchorage',
      type: 'competition',
    },
    {
      date: 'March 11, 2025',
      title: 'End of Season Celebration',
      time: '4:00-5:30 PM',
      type: 'special',
    },
  ],
};

const typeColors: Record<string, string> = {
  meeting: 'bg-blue-100 text-blue-800',
  holiday: 'bg-gray-100 text-gray-800',
  special: 'bg-purple-100 text-purple-800',
  competition: 'bg-green-100 text-green-800',
};

import { PublicHeader } from '@/components/public-header';

export default function SchedulePage() {
  return (
    <>
      <PublicHeader />
      <main className="min-h-screen bg-background">
        <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight">Schedule</h1>
          <p className="text-muted-foreground mt-2 text-lg">
            MathCounts meeting times and important dates for 2025
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Regular Meeting Schedule</CardTitle>
                <CardDescription>
                  Weekly practice sessions run from September through March
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg bg-primary/5 p-6 border border-primary/20">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Day & Time</p>
                      <p className="text-lg font-semibold">{schedule.regular.day}s</p>
                      <p className="text-muted-foreground">{schedule.regular.time}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Location</p>
                      <p className="text-lg font-semibold">{schedule.regular.location}</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm text-muted-foreground">
                      <strong>Season:</strong> {schedule.regular.startDate} - {schedule.regular.endDate}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Special Events & Holidays</CardTitle>
                <CardDescription>
                  Important dates, competitions, and schedule changes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {schedule.specialEvents.map((event, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg border">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium">{event.title}</p>
                          <Badge className={typeColors[event.type]} variant="secondary">
                            {event.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{event.date}</p>
                        {event.time && (
                          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                            <Clock className="h-3 w-3" />
                            {event.time}
                          </p>
                        )}
                        {event.location && (
                          <p className="text-sm text-muted-foreground">
                            📍 {event.location}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Add to Your Calendar</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" variant="outline">
                  <Calendar className="mr-2 h-4 w-4" />
                  Subscribe to Calendar
                </Button>
                <Button className="w-full" variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Download Schedule (PDF)
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Get automatic updates when the schedule changes
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Schedule Notes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="font-medium mb-1">Weather Cancellations</p>
                  <p className="text-muted-foreground">
                    If Homer schools are closed due to weather, MathCounts is also cancelled.
                  </p>
                </div>
                <div>
                  <p className="font-medium mb-1">Make-up Sessions</p>
                  <p className="text-muted-foreground">
                    Cancelled meetings may be rescheduled. Check your email for updates.
                  </p>
                </div>
                <div>
                  <p className="font-medium mb-1">Competition Attendance</p>
                  <p className="text-muted-foreground">
                    Chapter competition attendance is required for all team members.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-primary text-primary-foreground">
              <CardHeader>
                <CardTitle className="text-primary-foreground">Questions?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-3 text-primary-foreground/90">
                  Contact us about schedule changes or conflicts
                </p>
                <Button variant="secondary" className="w-full" asChild>
                  <a href="mailto:schedule@homerenrichmenthub.org">
                    Email Coordinator
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        </div>
      </main>
    </>
  );
}