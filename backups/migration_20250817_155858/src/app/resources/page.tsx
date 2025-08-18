import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Book, Video, FileText, Globe, Users, Calculator } from 'lucide-react';

const resourceCategories = [
  {
    title: 'MathCounts Resources',
    icon: Calculator,
    resources: [
      {
        title: 'MathCounts Official Website',
        description: 'Competition rules, practice problems, and official resources',
        url: 'https://www.mathcounts.org/',
      },
      {
        title: 'Problem of the Week Archive',
        description: 'Weekly practice problems with solutions',
        url: 'https://www.mathcounts.org/resources/problem-of-the-week',
      },
      {
        title: 'MathCounts Trainer',
        description: 'Interactive problem-solving app',
        url: 'https://www.mathcounts.org/resources/mathcounts-trainer-app',
      },
    ],
  },
  {
    title: 'Math Practice Sites',
    icon: Book,
    resources: [
      {
        title: 'Art of Problem Solving',
        description: 'Advanced math problems and online courses',
        url: 'https://artofproblemsolving.com/',
      },
      {
        title: 'Khan Academy',
        description: 'Free video lessons and practice exercises',
        url: 'https://www.khanacademy.org/math',
      },
      {
        title: 'Brilliant.org',
        description: 'Interactive problem solving in math and science',
        url: 'https://brilliant.org/',
      },
    ],
  },
  {
    title: 'Competition Math',
    icon: Globe,
    resources: [
      {
        title: 'AMC 8',
        description: 'American Mathematics Competition for middle school',
        url: 'https://www.maa.org/math-competitions/amc-8',
      },
      {
        title: 'Math League',
        description: 'Mathematics competitions for elementary through high school',
        url: 'https://mathleague.org/',
      },
      {
        title: 'MOEMS',
        description: 'Math Olympiads for Elementary and Middle Schools',
        url: 'https://www.moems.org/',
      },
    ],
  },
  {
    title: 'Parent Resources',
    icon: Users,
    resources: [
      {
        title: 'Supporting Your Math Student',
        description: 'Tips for parents from MathCounts',
        url: 'https://www.mathcounts.org/resources/parents',
      },
      {
        title: 'Growth Mindset in Mathematics',
        description: 'Stanford research on math learning',
        url: 'https://www.youcubed.org/evidence/mindset/',
      },
      {
        title: 'Family Math Night Ideas',
        description: 'Fun math activities for home',
        url: 'https://www.nctm.org/fammath/',
      },
    ],
  },
];

import { PublicHeader } from '@/components/public-header';

export default function ResourcesPage() {
  return (
    <>
      <PublicHeader />
      <main className="min-h-screen bg-background">
        <div className="container px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight">Resources</h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Curated links to help students excel in mathematics
          </p>
        </div>

        <div className="grid gap-6">
          {resourceCategories.map((category) => (
            <Card key={category.title}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <category.icon className="h-5 w-5" />
                  {category.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {category.resources.map((resource) => (
                    <Button
                      key={resource.title}
                      variant="outline"
                      className="h-auto p-4 justify-start text-left"
                      asChild
                    >
                      <a href={resource.url} target="_blank" rel="noopener noreferrer">
                        <div className="flex-1">
                          <div className="font-medium text-sm">{resource.title}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {resource.description}
                          </div>
                        </div>
                        <ExternalLink className="ml-2 h-4 w-4 shrink-0" />
                      </a>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-8 bg-muted/50">
          <CardHeader>
            <CardTitle>Additional Resources</CardTitle>
            <CardDescription>
              Looking for something specific? Here are more places to explore.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Video className="h-4 w-4" />
                Video Resources
              </h4>
              <ul className="space-y-1 text-sm text-muted-foreground ml-6">
                <li>• YouTube: MathCounts Official Channel</li>
                <li>• YouTube: Art of Problem Solving Videos</li>
                <li>• TED-Ed Mathematics Lessons</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Recommended Books
              </h4>
              <ul className="space-y-1 text-sm text-muted-foreground ml-6">
                <li>• "Competition Math for Middle School" by Jason Batteron</li>
                <li>• "MathCounts Solutions" series</li>
                <li>• "The Art of Problem Solving" series</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Have a great resource to share? Contact us at{' '}
            <a href="mailto:resources@homerenrichmenthub.org" className="underline">
              resources@homerenrichmenthub.org
            </a>
          </p>
        </div>
        </div>
      </main>
    </>
  );
}