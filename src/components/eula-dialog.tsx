'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface EULADialogProps {
  open: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

export function EULADialog({ open, onAccept, onDecline }: EULADialogProps) {
  const [agreements, setAgreements] = useState({
    termsAccepted: false,
    independenceAcknowledged: false,
    waiverAcknowledged: false,
    communicationConsent: false,
  });

  const allAgreed = Object.values(agreements).every((v) => v);

  const handleAccept = () => {
    if (allAgreed) {
      onAccept();
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="max-h-[90vh] max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Homer Enrichment Hub - Terms of Service</DialogTitle>
          <DialogDescription>Please read carefully before creating your account</DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-6 text-sm">
            <Alert className="border-destructive/50 bg-destructive/10">
              <AlertCircle className="text-destructive h-4 w-4" />
              <AlertDescription>
                <p className="mb-2 font-bold">CRITICAL NOTICE - THIS PROGRAM IS:</p>
                <ul className="ml-4 space-y-1">
                  <li>
                    • <strong>NOT</strong> a Kenai Peninsula College program
                  </li>
                  <li>
                    • <strong>NOT</strong> a University of Alaska program
                  </li>
                  <li>
                    • <strong>NOT</strong> affiliated with any educational institution
                  </li>
                  <li>
                    • <strong>NOT</strong> affiliated with the school district or City of Homer
                  </li>
                </ul>
              </AlertDescription>
            </Alert>

            <section>
              <h3 className="mb-2 font-semibold">1. PROGRAM DESCRIPTION AND INDEPENDENCE</h3>
              <p className="mb-2">
                The Homer Enrichment Hub is a <strong>COMPLETELY INDEPENDENT ORGANIZATION</strong>{' '}
                providing supplemental educational programs for students in the Homer, Alaska area.
              </p>
              <p className="mb-2">
                This program is organized by Jeffrey Johnson and Lia Calhoun acting in their
                <strong> PERSONAL CAPACITIES</strong> as private individuals. While they are
                employed as professors at Kenai Peninsula College, that employment is{' '}
                <strong>completely separate</strong> from this program.
              </p>
            </section>

            <section>
              <h3 className="mb-2 font-semibold">2. LIABILITY ACKNOWLEDGMENT</h3>
              <p className="mb-2">You acknowledge and agree that:</p>
              <ul className="ml-4 space-y-1">
                <li>• This is an independent program with no institutional backing</li>
                <li>• Participation involves inherent risks</li>
                <li>• A signed physical waiver will be required before participation</li>
                <li>• Program coordinators have limited liability as private individuals</li>
                <li>• No educational institution has any liability for this program</li>
                <li>• The program does not provide insurance coverage</li>
              </ul>
            </section>

            <section>
              <h3 className="mb-2 font-semibold">3. DATA PRIVACY</h3>
              <p className="mb-2">
                We collect only necessary information for program administration. Your data will not
                be sold or shared with third parties. Records are not official school records and
                are not subject to FERPA protections.
              </p>
            </section>

            <section>
              <h3 className="mb-2 font-semibold">4. COMMUNICATION CONSENT</h3>
              <p className="mb-2">
                By providing your contact information, you consent to receive program announcements,
                schedule changes, emergency notifications, and general program information. You may
                opt out of non-emergency communications at any time.
              </p>
            </section>

            <section>
              <h3 className="mb-2 font-semibold">5. ACCOUNT REQUIREMENTS</h3>
              <p className="mb-2">
                You must be at least 18 years old to create an account. If registering a child, you
                must be their parent or legal guardian. You agree to provide accurate information
                and keep your password secure.
              </p>
            </section>

            <div className="bg-muted mt-6 rounded-lg p-4">
              <p className="text-xs">
                For the complete Terms of Service, please visit{' '}
                <a href="/terms" target="_blank" className="text-primary hover:underline">
                  our full terms page
                </a>
                .
              </p>
            </div>
          </div>
        </ScrollArea>

        <div className="space-y-3 border-t pt-4">
          <label className="flex items-start space-x-2 text-sm">
            <Checkbox
              checked={agreements.termsAccepted}
              onCheckedChange={(checked) =>
                setAgreements((prev) => ({ ...prev, termsAccepted: checked as boolean }))
              }
              className="mt-0.5"
            />
            <span>
              <strong>I AGREE</strong> to the Terms of Service
            </span>
          </label>

          <label className="flex items-start space-x-2 text-sm">
            <Checkbox
              checked={agreements.independenceAcknowledged}
              onCheckedChange={(checked) =>
                setAgreements((prev) => ({ ...prev, independenceAcknowledged: checked as boolean }))
              }
              className="mt-0.5"
            />
            <span>
              <strong>I UNDERSTAND</strong> this is an independent program not affiliated with any
              educational institution
            </span>
          </label>

          <label className="flex items-start space-x-2 text-sm">
            <Checkbox
              checked={agreements.waiverAcknowledged}
              onCheckedChange={(checked) =>
                setAgreements((prev) => ({ ...prev, waiverAcknowledged: checked as boolean }))
              }
              className="mt-0.5"
            />
            <span>
              <strong>I ACKNOWLEDGE</strong> that a signed physical waiver will be required for
              participation
            </span>
          </label>

          <label className="flex items-start space-x-2 text-sm">
            <Checkbox
              checked={agreements.communicationConsent}
              onCheckedChange={(checked) =>
                setAgreements((prev) => ({ ...prev, communicationConsent: checked as boolean }))
              }
              className="mt-0.5"
            />
            <span>
              <strong>I CONSENT</strong> to receive program communications
            </span>
          </label>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onDecline}>
            Decline
          </Button>
          <Button onClick={handleAccept} disabled={!allAgreed}>
            I Agree and Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
