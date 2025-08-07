import Link from 'next/link';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export function LegalFooter() {
  return (
    <footer className="mt-auto border-t bg-muted/30">
      <div className="container mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Program Information */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-primary">
              About Homer Enrichment Hub
            </h3>
            <p className="text-sm text-muted-foreground">
              An <strong>independent organization</strong> providing supplemental educational enrichment 
              programs including MATHCOUNTS for students in Homer, Alaska.
            </p>
            <div className="text-sm">
              <p className="font-medium">Organized by:</p>
              <p>Jeffrey Johnson<br />Lia Calhoun</p>
              <p className="text-xs italic text-muted-foreground mt-1">
                (acting as private individuals)
              </p>
            </div>
            <p className="text-xs italic text-muted-foreground">
              * Organizers happen to be employed at KPC but this is NOT a KPC program
            </p>
          </div>

          {/* Important Disclaimer */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-primary">
              CRITICAL NOTICE
            </h3>
            <Alert className="border-destructive/50 bg-destructive/10">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <AlertDescription className="text-sm">
                <p className="font-bold mb-2">THIS IS AN INDEPENDENT PROGRAM</p>
                <p className="mb-2">The Homer Enrichment Hub is <strong>NOT</strong> affiliated with, sponsored by, endorsed by, or organized by:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Kenai Peninsula College</li>
                  <li>• University of Alaska</li>
                  <li>• Kenai Peninsula Borough School District</li>
                  <li>• City of Homer</li>
                  <li>• Any school or facility used</li>
                </ul>
                <p className="mt-2 font-semibold">This is a private, independent educational initiative.</p>
              </AlertDescription>
            </Alert>
          </div>

          {/* Legal & Safety */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-primary">
              Legal & Safety
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/terms" className="hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/waiver" className="hover:text-primary transition-colors">
                  Liability Waiver Form (Required)
                </Link>
              </li>
              <li>
                <Link href="/safety" className="hover:text-primary transition-colors">
                  Safety Guidelines
                </Link>
              </li>
            </ul>
            <div className="mt-4 space-y-2 text-xs text-muted-foreground">
              <p>
                <strong>Participation requires signed waiver</strong><br />
                Alaska Statutes 09.65.290 & 09.65.292
              </p>
              <p className="text-destructive font-semibold">
                No institutional liability or coverage
              </p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-primary">
              Contact Us
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-medium">Jeffrey Johnson</p>
                <p className="text-muted-foreground">Independent Program Coordinator</p>
                <a href="mailto:jjohnson47@alaska.edu" className="hover:text-primary transition-colors">
                  jjohnson47@alaska.edu
                </a>
                <p className="text-xs italic text-muted-foreground">Email for identification only</p>
              </div>
              
              <div>
                <p className="font-medium">Lia Calhoun</p>
                <p className="text-muted-foreground">Independent Program Coordinator</p>
                <a href="mailto:eicalhoun@alaska.edu" className="hover:text-primary transition-colors">
                  eicalhoun@alaska.edu
                </a>
                <p className="text-xs italic text-muted-foreground">Email for identification only</p>
              </div>
              
              <div>
                <p className="font-medium">Location: Homer, Alaska</p>
                <p className="text-xs italic text-muted-foreground">Various venues - no permanent facility</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 border-t pt-8 text-center text-xs text-muted-foreground space-y-2">
          <p className="font-semibold text-sm">© 2025 Homer Enrichment Hub - An Independent Organization</p>
          <p>
            All rights reserved. | {' '}
            <Link href="/accessibility" className="hover:text-primary transition-colors">
              Accessibility
            </Link> | {' '}
            <Link href="/sitemap" className="hover:text-primary transition-colors">
              Sitemap
            </Link>
          </p>
          <p>
            Programs currently offered at no cost through personal funding by individual coordinators. 
            No institutional funding or support. No guarantee of program continuation.
          </p>
          <p>
            By using this website, you agree to our {' '}
            <Link href="/terms" className="text-primary hover:underline">
              Terms of Service
            </Link> {' '}
            and acknowledge that participation requires a signed liability waiver.
          </p>
          <p className="mt-4 text-destructive font-semibold text-sm">
            This is not a Kenai Peninsula College or University of Alaska program.
          </p>
        </div>
      </div>
    </footer>
  );
}