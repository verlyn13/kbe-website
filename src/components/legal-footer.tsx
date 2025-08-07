'use client';

import Link from 'next/link';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { usePathname } from 'next/navigation';

export function LegalFooter() {
  const pathname = usePathname();
  const hasSidebar = pathname.startsWith('/dashboard') || pathname.startsWith('/admin');
  
  return (
    <footer className={`mt-auto border-t bg-muted/30 ${hasSidebar ? 'lg:ml-[240px]' : ''}`}>
      <div className="container mx-auto max-w-7xl px-4 py-3 sm:py-4 lg:py-6">
        {/* Compact disclaimer bar */}
        <Alert className="mb-4 border-primary/20 bg-primary/5 py-2">
          <Info className="h-4 w-4 text-primary" />
          <AlertDescription className="text-xs sm:text-sm">
            <strong>Homer Enrichment Hub</strong> is an independent educational initiative.
            {' '}
            <Link href="/about" className="text-primary hover:underline">
              Learn more
            </Link>
          </AlertDescription>
        </Alert>

        <div className="grid gap-3 text-xs sm:grid-cols-2 lg:grid-cols-4">
          {/* Quick Links */}
          <div>
            <ul className="space-y-1">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/programs" className="text-muted-foreground hover:text-primary">
                  Programs
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-primary">
                  Terms & Privacy
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Notice */}
          <div>
            <ul className="space-y-1">
              <li>
                <Link href="/waiver" className="text-muted-foreground hover:text-primary">
                  Liability Waiver
                </Link>
              </li>
              <li className="text-muted-foreground">No institutional affiliation</li>
              <li className="text-muted-foreground">Volunteer-run program</li>
            </ul>
          </div>

          {/* Contact */}
          <div className="text-muted-foreground">
            <p>
              Contact:<br />
              <a href="mailto:info@homerconnect.com" className="hover:text-primary">
                info@homerconnect.com
              </a>
            </p>
          </div>

          {/* Copyright */}
          <div className="text-muted-foreground sm:text-right">
            <p>© 2025 Homer Enrichment Hub</p>
            <p>Independent Organization</p>
          </div>
        </div>
      </div>
    </footer>
  );
}