import { Book, Calendar, ExternalLink, FileText, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
                  <p className="text-sm font-medium">{link.title}</p>
                  <p className="text-muted-foreground text-xs">{link.description}</p>
                </div>
                {link.href.startsWith('http') && (
                  <ExternalLink className="text-muted-foreground ml-2 h-3 w-3" />
                )}
              </a>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
