import { Calendar, Clock, MapPin, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function MathCountsSchedule() {
  const nextSession = new Date('2025-09-09T16:00:00');
  const daysUntil = Math.ceil(
    (nextSession.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>MathCounts Schedule</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-primary/5 border-primary/20 rounded-lg border p-4">
          <p className="text-primary mb-1 text-sm font-medium">Next Session</p>
          <p className="text-lg font-semibold">Tuesday, September 9, 2025</p>
          <p className="text-muted-foreground text-sm">{daysUntil} days from now</p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Clock className="text-muted-foreground h-4 w-4" />
            <span className="text-sm">Every Tuesday, 4:00-5:30pm</span>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="text-muted-foreground h-4 w-4" />
            <span className="text-sm">Homer Middle School, Room 203</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="flex-1">
            <Calendar className="mr-1 h-4 w-4" />
            Add to Calendar
          </Button>
          <Button size="sm" variant="outline" className="flex-1" disabled>
            <MapPin className="mr-1 h-4 w-4" />
            Directions (Coming Soon)
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
