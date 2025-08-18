'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Download, Printer } from 'lucide-react';

export default function WaiverPage() {
  const handlePrint = () => {
    window.print();
  };

  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      {/* Screen Instructions */}
      <div className="mb-8 print-hidden">
        <Card>
          <CardHeader>
            <CardTitle>Liability Waiver Form</CardTitle>
            <CardDescription>
              Required for all students participating in Homer Enrichment Hub programs
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="border-amber-200 bg-amber-50">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertDescription>
                <strong>Important:</strong> This form must be printed, signed, and returned before your child can participate in any programs.
              </AlertDescription>
            </Alert>
            
            <div className="flex gap-4">
              <Button onClick={handlePrint}>
                <Printer className="h-4 w-4 mr-2" />
                Print Form
              </Button>
              <Button variant="outline" onClick={() => window.open('/waiver.pdf', '_blank')}>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
            
            <div className="text-sm text-muted-foreground">
              <p className="font-medium mb-2">Instructions:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Print this form</li>
                <li>Complete all sections</li>
                <li>Sign and date the form</li>
                <li>Return to Jeffrey Johnson at the next program meeting</li>
                <li>Or email a scanned copy to jjohnson47@alaska.edu</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Printable Waiver Form */}
      <div className="bg-white p-8 print:p-0">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-2xl font-bold">HOMER ENRICHMENT HUB</h1>
            <h2 className="text-xl mt-2">PARENTAL CONSENT, LIABILITY WAIVER, AND MEDICAL AUTHORIZATION FORM</h2>
            <p className="mt-2 font-semibold">
              IMPORTANT: This form must be completed, signed, and returned before your child can participate in any Homer Enrichment Hub programs.
            </p>
          </div>

          {/* Participant Information */}
          <section className="border-t pt-4">
            <h3 className="font-bold mb-3">PARTICIPANT INFORMATION</h3>
            <div className="space-y-2">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-sm">Child's Full Name:</label>
                  <div className="border-b border-gray-400 h-6"></div>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-sm">Date of Birth:</label>
                  <div className="border-b border-gray-400 h-6"></div>
                </div>
                <div className="w-24">
                  <label className="text-sm">Grade:</label>
                  <div className="border-b border-gray-400 h-6"></div>
                </div>
                <div className="flex-1">
                  <label className="text-sm">School:</label>
                  <div className="border-b border-gray-400 h-6"></div>
                </div>
              </div>
              <div>
                <label className="text-sm">Home Address:</label>
                <div className="border-b border-gray-400 h-6"></div>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-sm">City:</label>
                  <div className="border-b border-gray-400 h-6"></div>
                </div>
                <div className="w-16">
                  <label className="text-sm">State:</label>
                  <div className="border-b border-gray-400 h-6">AK</div>
                </div>
                <div className="w-32">
                  <label className="text-sm">Zip:</label>
                  <div className="border-b border-gray-400 h-6"></div>
                </div>
              </div>
            </div>
          </section>

          {/* Parent/Guardian Information */}
          <section className="border-t pt-4">
            <h3 className="font-bold mb-3">PARENT/GUARDIAN INFORMATION</h3>
            <div className="space-y-2">
              <div>
                <label className="text-sm">Parent/Guardian Name:</label>
                <div className="border-b border-gray-400 h-6"></div>
              </div>
              <div>
                <label className="text-sm">Relationship to Child:</label>
                <div className="border-b border-gray-400 h-6"></div>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-sm">Primary Phone:</label>
                  <div className="border-b border-gray-400 h-6"></div>
                </div>
                <div className="flex-1">
                  <label className="text-sm">Secondary Phone:</label>
                  <div className="border-b border-gray-400 h-6"></div>
                </div>
              </div>
              <div>
                <label className="text-sm">Email:</label>
                <div className="border-b border-gray-400 h-6"></div>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-sm">Emergency Contact (if different):</label>
                  <div className="border-b border-gray-400 h-6"></div>
                </div>
                <div className="w-48">
                  <label className="text-sm">Emergency Phone:</label>
                  <div className="border-b border-gray-400 h-6"></div>
                </div>
              </div>
            </div>
          </section>

          {/* Medical Information */}
          <section className="border-t pt-4">
            <h3 className="font-bold mb-3">MEDICAL INFORMATION</h3>
            <div className="space-y-2">
              <div>
                <label className="text-sm">Known Allergies:</label>
                <div className="border-b border-gray-400 h-6"></div>
              </div>
              <div>
                <label className="text-sm">Medical Conditions:</label>
                <div className="border-b border-gray-400 h-6"></div>
              </div>
              <div>
                <label className="text-sm">Current Medications:</label>
                <div className="border-b border-gray-400 h-6"></div>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-sm">Physician Name:</label>
                  <div className="border-b border-gray-400 h-6"></div>
                </div>
                <div className="w-48">
                  <label className="text-sm">Phone:</label>
                  <div className="border-b border-gray-400 h-6"></div>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-sm">Insurance Provider:</label>
                  <div className="border-b border-gray-400 h-6"></div>
                </div>
                <div className="flex-1">
                  <label className="text-sm">Policy #:</label>
                  <div className="border-b border-gray-400 h-6"></div>
                </div>
              </div>
            </div>
          </section>

          {/* Acknowledgment of Program Independence */}
          <section className="border-t pt-4">
            <h3 className="font-bold mb-3">ACKNOWLEDGMENT OF PROGRAM INDEPENDENCE</h3>
            <div className="bg-yellow-50 p-4 border border-yellow-300 mb-3">
              <p className="font-semibold mb-2">I understand and acknowledge that:</p>
              <p className="mb-2">The Homer Enrichment Hub is a <strong>COMPLETELY INDEPENDENT</strong> organization that is:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><strong>NOT organized by, affiliated with, sponsored by, or endorsed by Kenai Peninsula College or the University of Alaska system</strong></li>
                <li><strong>NOT affiliated with the Kenai Peninsula Borough School District</strong></li>
                <li><strong>NOT affiliated with the City of Homer</strong></li>
                <li><strong>NOT affiliated with any school or facility where activities may occur</strong></li>
              </ul>
              <p className="mt-3">
                This program is organized by Jeffrey Johnson and Lia Calhoun acting in their <strong>PERSONAL CAPACITIES</strong> as private individuals. 
                While they happen to be employed as professors at Kenai Peninsula College, this program is <strong>NOT a Kenai Peninsula College program</strong> and 
                their employment there is mentioned only for identification purposes.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Parent/Guardian Initials:</span>
              <div className="border border-gray-400 w-16 h-8"></div>
            </div>
          </section>

          {/* Assumption of Risk */}
          <section className="border-t pt-4">
            <h3 className="font-bold mb-3">ASSUMPTION OF RISK AND RELEASE OF LIABILITY</h3>
            <p className="mb-3"><strong>In accordance with Alaska Statutes 09.65.290 and 09.65.292</strong>, I acknowledge and agree:</p>
            
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-semibold">1. ASSUMPTION OF INHERENT RISKS:</p>
                <p>I understand that participation in educational and recreational activities involves inherent risks including, but not limited to:</p>
                <ul className="list-disc list-inside ml-4 mt-1">
                  <li>Risk of physical injury during activities or movement between locations</li>
                  <li>Risk of exposure to communicable diseases</li>
                  <li>Risk of accidents during transportation to/from activities</li>
                  <li>Risk of allergic reactions or medical emergencies</li>
                  <li>Risks inherent in academic competitions and group activities</li>
                </ul>
              </div>
              
              <div>
                <p className="font-semibold">2. EXPLICIT WAIVER OF NEGLIGENCE:</p>
                <p>I hereby <strong>RELEASE, WAIVE, DISCHARGE, AND HOLD HARMLESS</strong>:</p>
                <ul className="list-disc list-inside ml-4 mt-1">
                  <li>Jeffrey Johnson and Lia Calhoun (as private individuals)</li>
                  <li>The Homer Enrichment Hub organization</li>
                  <li>Any volunteers or assistants working with the program</li>
                  <li>The University of Alaska system and Kenai Peninsula College</li>
                  <li>The Kenai Peninsula Borough School District and individual schools</li>
                  <li>The City of Homer</li>
                  <li>Any facilities hosting Hub activities</li>
                </ul>
                <p className="mt-2">
                  From <strong>ANY AND ALL LIABILITY</strong>, including liability for <strong>NEGLIGENCE</strong>, for any injury, death, damage, 
                  or loss sustained by my child or me arising from participation in Hub activities, to the fullest extent permitted by Alaska law.
                </p>
              </div>
              
              <div>
                <p className="font-semibold">3. INDEMNIFICATION:</p>
                <p>
                  I agree to <strong>INDEMNIFY AND DEFEND</strong> all released parties from any claims, demands, or causes of action, 
                  including attorney fees, arising from my child's participation.
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 mt-4">
              <span className="font-semibold">Parent/Guardian Initials:</span>
              <div className="border border-gray-400 w-16 h-8"></div>
            </div>
          </section>

          {/* Medical Authorization */}
          <section className="border-t pt-4">
            <h3 className="font-bold mb-3">MEDICAL AUTHORIZATION</h3>
            <p className="mb-2">In the event of a medical emergency, I authorize program coordinators to:</p>
            <ul className="list-disc list-inside ml-4 text-sm">
              <li>Contact emergency medical services (911)</li>
              <li>Provide or arrange necessary emergency treatment</li>
              <li>Share relevant medical information with emergency responders</li>
            </ul>
            <p className="mt-2 text-sm">I understand that:</p>
            <ul className="list-disc list-inside ml-4 text-sm">
              <li>Program coordinators are not medical professionals</li>
              <li>The program does not provide health or accident insurance</li>
              <li>All medical costs are my sole responsibility</li>
              <li>Coordinators will not administer medications</li>
            </ul>
            <div className="flex items-center gap-2 mt-4">
              <span className="font-semibold">Parent/Guardian Initials:</span>
              <div className="border border-gray-400 w-16 h-8"></div>
            </div>
          </section>

          {/* Program Rules */}
          <section className="border-t pt-4">
            <h3 className="font-bold mb-3">PROGRAM RULES AND CONDUCT</h3>
            <p className="mb-2">I understand that my child must:</p>
            <ul className="list-disc list-inside ml-4 text-sm">
              <li>Follow all program rules and behavioral guidelines</li>
              <li>Respect coordinators, volunteers, and other participants</li>
              <li>Care for facilities and equipment</li>
            </ul>
            <p className="mt-2 text-sm">
              I acknowledge that violation of program rules may result in removal without refund (if fees apply).
            </p>
            <div className="flex items-center gap-2 mt-4">
              <span className="font-semibold">Parent/Guardian Initials:</span>
              <div className="border border-gray-400 w-16 h-8"></div>
            </div>
          </section>

          {/* Photography Release */}
          <section className="border-t pt-4">
            <h3 className="font-bold mb-3">PHOTOGRAPHY RELEASE</h3>
            <div className="flex gap-8">
              <label className="flex items-center gap-2">
                <div className="border border-gray-400 w-4 h-4"></div>
                <span className="font-semibold">YES</span> - I grant permission for my child to be photographed/recorded for program documentation and promotion
              </label>
              <label className="flex items-center gap-2">
                <div className="border border-gray-400 w-4 h-4"></div>
                <span className="font-semibold">NO</span> - I do not grant permission for photography/recording
              </label>
            </div>
          </section>

          {/* Certification and Signature */}
          <section className="border-t pt-4">
            <h3 className="font-bold mb-3">CERTIFICATION AND SIGNATURE</h3>
            <div className="bg-gray-100 p-4 mb-4">
              <p className="font-semibold mb-2">I CERTIFY THAT:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>I am the parent or legal guardian with authority to sign this form</li>
                <li>I have read and understood all provisions of this waiver</li>
                <li>I understand this is an independent program not affiliated with any educational institution</li>
                <li>I am signing this form voluntarily and without inducement</li>
                <li>All information provided is accurate and complete</li>
                <li>I understand this waiver is binding on me, my child, and our heirs</li>
              </ul>
              <p className="mt-3 font-semibold">
                THE TERMS OF THIS WAIVER SHALL BE EFFECTIVE FOR THE ENTIRE {currentYear}-{nextYear} ACADEMIC YEAR
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-sm">Parent/Guardian Printed Name:</label>
                  <div className="border-b border-gray-400 h-6"></div>
                </div>
                <div className="w-32">
                  <label className="text-sm">Date:</label>
                  <div className="border-b border-gray-400 h-6"></div>
                </div>
              </div>
              <div>
                <label className="text-sm">Parent/Guardian Signature:</label>
                <div className="border-b border-gray-400 h-12"></div>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-sm">Child's Signature (if 13 or older):</label>
                  <div className="border-b border-gray-400 h-12"></div>
                </div>
                <div className="w-32">
                  <label className="text-sm">Date:</label>
                  <div className="border-b border-gray-400 h-6"></div>
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <section className="border-t pt-4 text-sm">
            <p className="font-semibold mb-2">Return this form to:</p>
            <p>
              Homer Enrichment Hub<br />
              c/o Jeffrey Johnson<br />
              [Independent Program Coordinator]<br />
              Email: jjohnson47@alaska.edu
            </p>
            <p className="mt-2 italic text-xs">
              Note: Email address provided for identification purposes only. This is not a Kenai Peninsula College program.
            </p>
            <p className="mt-4 text-xs text-gray-500">
              Form Version 1.0 - August {currentYear}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}