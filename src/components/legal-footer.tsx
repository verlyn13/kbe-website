'use client';

import Link from 'next/link';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { usePathname } from 'next/navigation';

export function LegalFooter() {
  const pathname = usePathname();
  const hasSidebar = pathname.startsWith('/dashboard') || pathname.startsWith('/admin');

  return (
    <footer className={`bg-muted/30 mt-auto border-t ${hasSidebar ? 'lg:ml-[240px]' : ''}`}>
      <div className="px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {/* Compact disclaimer bar */}
          <Alert className="border-primary/20 bg-primary/5 mb-6 py-2">
            <Info className="text-primary h-4 w-4" />
            <AlertDescription className="text-xs sm:text-sm">
              <strong>Homer Enrichment Hub</strong> is an independent educational initiative.{' '}
              <Link href="/about" className="text-primary hover:underline">
                Learn more
              </Link>
            </AlertDescription>
          </Alert>

          {/* Mobile-first stacked layout, then grid on larger screens */}
          <div className="space-y-6 text-xs sm:grid sm:grid-cols-2 sm:gap-8 sm:space-y-0 lg:grid-cols-4">
            {/* Quick Links */}
            <div className="space-y-1">
              <h3 className="mb-2 text-sm font-medium">Quick Links</h3>
              <ul className="space-y-1">
                <li>
                  <Link
                    href="/about"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/programs"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Programs
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Terms & Privacy
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal Notice */}
            <div className="space-y-1">
              <h3 className="mb-2 text-sm font-medium">Important Info</h3>
              <ul className="space-y-1">
                <li>
                  <Link
                    href="/waiver"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Liability Waiver Required
                  </Link>
                </li>
                <li className="text-muted-foreground">No institutional affiliation</li>
                <li className="text-muted-foreground">Volunteer-run program</li>
              </ul>
            </div>

            {/* Contact */}
            <div className="space-y-1">
              <h3 className="mb-2 text-sm font-medium">Contact</h3>
              <div className="text-muted-foreground">
                <p>
                  Email us at
                  <br />
                  <a
                    href="mailto:info@homerenrichment.com"
                    className="hover:text-primary transition-colors"
                  >
                    info@homerenrichment.com
                  </a>
                </p>
              </div>
            </div>

            {/* Copyright - centered on mobile, right-aligned on desktop */}
            <div className="border-border/50 border-t pt-4 text-center sm:border-0 sm:pt-0 sm:text-left lg:text-right">
              <p className="text-muted-foreground">© 2025 Homer Enrichment Hub</p>
              <p className="text-muted-foreground">Independent Organization</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
