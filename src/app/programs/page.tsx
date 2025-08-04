import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Calendar, MapPin, Users } from 'lucide-react';
import Link from 'next/link';

const programs = [
  {
    id: 'mathcounts-2025',
    name: 'MathCounts 2025',
    description: 'National mathematics competition program for middle school students',
    grades: '4-8',
    schedule: 'Tuesdays, 4:00-5:30pm',
    location: 'Homer Middle School',
    startDate: 'September 9, 2025',
    status: 'registration-open',
    featured: true,
  },
  {
    id: 'summer-stem-2025',
    name: 'Summer STEM Camp',
    description: 'Hands-on science, technology, engineering, and math activities',
    grades: 'K-8',
    schedule: 'June 2025',
    location: 'Various locations',
    startDate: 'June 2025',
    status: 'coming-soon',
    featured: false,
  },
];

import { PublicHeader } from '@/components/public-header';

export default function ProgramsPage() {
  return (
    <>
      <PublicHeader />
      <main className="min-h-screen bg-background">
        <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight">Our Programs</h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Quality enrichment programs for Homer students
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {programs.map((program) => (
            <Card key={program.id} className={program.featured ? 'border-primary shadow-lg' : ''}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{program.name}</CardTitle>
                    <CardDescription className="mt-1">{program.description}</CardDescription>
                  </div>
                  {program.status === 'registration-open' ? (
                    <Badge className="bg-green-100 text-green-800">Open</Badge>
                  ) : (
                    <Badge variant="secondary">Coming Soon</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>Grades {program.grades}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{program.schedule}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{program.location}</span>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  {program.status === 'registration-open' ? (
                    <>
                      <Button asChild className="flex-1">
                        <Link href="/register">Register Now</Link>
                      </Button>
                      <Button variant="outline" asChild>
                        <Link href={`/programs/${program.id.replace('-2025', '')}`}>
                          Learn More <ArrowRight className="ml-1 h-4 w-4" />
                        </Link>
                      </Button>
                    </>
                  ) : (
                    <Button variant="outline" className="w-full" disabled>
                      Registration Opens Soon
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-12 bg-muted/50">
          <CardHeader>
            <CardTitle>More Programs Coming Soon</CardTitle>
            <CardDescription>
              We're working on expanding our offerings to include more enrichment opportunities.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Stay tuned for announcements about:
            </p>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Creative Writing Workshops</li>
              <li>• Science Olympiad Preparation</li>
              <li>• Art & Design Studio</li>
              <li>• Environmental Studies Field Trips</li>
            </ul>
          </CardContent>
        </Card>
        </div>
      </main>
    </>
  );
}