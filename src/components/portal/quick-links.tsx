import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Book, Calendar, ExternalLink, FileText, Mail } from 'lucide-react';

const links = [
  {
    title: 'MathCounts Official Site',
    description: 'Competition rules and practice problems',
    icon: Book,
    href: 'https://www.mathcounts.org/',
  },
  {
    title: 'Google Calendar',
    description: 'Add our schedule to your calendar',
    icon: Calendar,
    href: '#',
  },
  {
    title: 'Parent Handbook',
    description: 'Program guidelines and expectations',
    icon: FileText,
    href: '#',
  },
  {
    title: 'Contact Coach',
    description: 'Email our MathCounts coach',
    icon: Mail,
    href: 'mailto:coach@homerenrichmenthub.org',
  },
];

export function QuickLinks() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Links</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          {links.map((link) => (
            <Button
              key={link.title}
              variant="outline"
              className="h-auto justify-start p-3 text-left"
              asChild
            >
              <a href={link.href} target={link.href.startsWith('http') ? '_blank' : undefined}>
                <link.icon className="mr-3 h-4 w-4 shrink-0" />
                <div className="flex-1">
                  <p className="font-medium text-sm">{link.title}</p>
                  <p className="text-xs text-muted-foreground">{link.description}</p>
                </div>
                {link.href.startsWith('http') && (
                  <ExternalLink className="ml-2 h-3 w-3 text-muted-foreground" />
                )}
              </a>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}