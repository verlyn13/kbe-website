'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function TermsPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      {/* Navigation */}
      <div className="mb-6 flex items-center justify-between">
        <Button variant="ghost" asChild>
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back to Home</span>
          </Link>
        </Button>
      </div>
      <h1 className="mb-6 text-3xl font-bold">Terms of Service</h1>

      <div className="space-y-6">
        <section>
          <h2 className="mb-3 text-xl font-semibold">1. Acceptance of Terms</h2>
          <p className="text-muted-foreground">
            By accessing and using the Homer Enrichment Hub website, you accept and agree to be
            bound by the terms and provision of this agreement.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold">2. Use of Service</h2>
          <p className="text-muted-foreground">
            The Homer Enrichment Hub provides information about enrichment programs and facilitates
            registration. Users must provide accurate information during registration.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold">3. Privacy</h2>
          <p className="text-muted-foreground">
            Your use of our service is also governed by our Privacy Policy. Please review our
            Privacy Policy, which also governs the Site and informs users of our data collection
            practices.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold">4. Program Registration</h2>
          <p className="text-muted-foreground">
            Registration for programs is subject to availability and program-specific requirements.
            The Homer Enrichment Hub acts as a facilitator and is not responsible for individual
            program operations.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold">5. Limitation of Liability</h2>
          <p className="text-muted-foreground">
            Homer Enrichment Hub shall not be liable for any indirect, incidental, special,
            consequential, or punitive damages resulting from your use or inability to use the
            service.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold">6. Changes to Terms</h2>
          <p className="text-muted-foreground">
            We reserve the right to modify these terms at any time. Continued use of the service
            after changes constitutes acceptance of the modified terms.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold">7. Contact Information</h2>
          <p className="text-muted-foreground">
            For questions about these Terms, please contact us through the website.
          </p>
        </section>
      </div>

      <div className="border-border mt-8 border-t pt-6">
        <p className="text-muted-foreground text-sm">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
