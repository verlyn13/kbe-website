import { Trophy } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Competition {
  name: string;
  date: Date;
  level: 'chapter' | 'state' | 'national';
}

const competitions: Competition[] = [
  {
    name: 'Chapter Competition',
    date: new Date('2025-01-18'),
    level: 'chapter',
  },
  {
    name: 'State Competition',
    date: new Date('2025-03-08'),
    level: 'state',
  },
  {
    name: 'National Competition',
    date: new Date('2025-05-11'),
    level: 'national',
  },
];

const levelColors: Record<string, string> = {
  chapter: 'bg-blue-100 text-blue-800',
  state: 'bg-purple-100 text-purple-800',
  national: 'bg-amber-100 text-amber-800',
};

export function UpcomingCompetitions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Upcoming Competitions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {competitions.map((competition) => (
            <div
              key={competition.name}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <div>
                <p className="font-medium">{competition.name}</p>
                <p className="text-muted-foreground text-sm">
                  {competition.date.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <Badge className={levelColors[competition.level]} variant="secondary">
                {competition.level}
              </Badge>
            </div>
          ))}
        </div>
        <p className="text-muted-foreground mt-4 text-xs">
          * National competition is for qualifying teams only
        </p>
      </CardContent>
    </Card>
  );
}
