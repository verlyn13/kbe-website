'use client';

import { ExternalLink, InfoIcon, Mail } from 'lucide-react';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function EmailSettingsPage() {
  return (
    <div className="container mx-auto max-w-4xl space-y-6 p-6">
      <div>
        <h1 className="mb-2 text-3xl font-bold">Email Settings</h1>
        <p className="text-muted-foreground">
          Configure how emails are sent from Homer Enrichment Hub
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current Email Configuration</CardTitle>
          <CardDescription>Emails are currently sent using Firebase Authentication</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="mb-1 text-sm font-medium">From Address</p>
              <code className="bg-muted rounded px-2 py-1 text-sm">
                noreply@kbe-website.firebaseapp.com
              </code>
            </div>
            <div>
              <p className="mb-1 text-sm font-medium">Sender Name</p>
              <code className="bg-muted rounded px-2 py-1 text-sm">Homer Enrichment Hub</code>
            </div>
          </div>

          <Alert>
            <InfoIcon className="h-4 w-4" />
            <AlertTitle>Email Templates Updated</AlertTitle>
            <AlertDescription>
              Firebase email templates have been customized with Homer Enrichment Hub branding.
              Emails will show "Homer Enrichment Hub" as the sender name.
            </AlertDescription>
          </Alert>

          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link
                href="https://console.firebase.google.com/project/kbe-website/authentication/emails"
                target="_blank"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                View Email Templates
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Custom Domain Email Setup</CardTitle>
          <CardDescription>
            Send emails from your own domain (noreply@homerconnect.com)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline">Not Configured</Badge>
              <span className="text-muted-foreground text-sm">Requires additional setup</span>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Available Options:</h4>

            <div className="space-y-2 rounded-lg border p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h5 className="font-medium">SendGrid Integration</h5>
                  <p className="text-muted-foreground text-sm">
                    Professional email delivery with analytics. Free tier: 100 emails/day.
                  </p>
                </div>
                <Badge variant="secondary">Recommended</Badge>
              </div>
            </div>

            <div className="space-y-2 rounded-lg border p-4">
              <div>
                <h5 className="font-medium">Firebase Email Extension</h5>
                <p className="text-muted-foreground text-sm">
                  Use your existing email service (Gmail, Office 365) with SMTP.
                </p>
              </div>
            </div>

            <div className="space-y-2 rounded-lg border p-4">
              <div>
                <h5 className="font-medium">Custom Email Function</h5>
                <p className="text-muted-foreground text-sm">
                  Build a custom Cloud Function for complete control.
                </p>
              </div>
            </div>
          </div>

          <Alert>
            <Mail className="h-4 w-4" />
            <AlertTitle>Benefits of Custom Domain</AlertTitle>
            <AlertDescription>
              <ul className="mt-2 list-inside list-disc space-y-1">
                <li>Professional appearance (noreply@homerconnect.com)</li>
                <li>Better email deliverability</li>
                <li>Reduced spam filtering</li>
                <li>Email analytics and tracking</li>
              </ul>
            </AlertDescription>
          </Alert>

          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/docs/sendgrid-email-setup.md">View Setup Guide</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="https://sendgrid.com" target="_blank">
                <ExternalLink className="mr-2 h-4 w-4" />
                SendGrid Website
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Email Types</CardTitle>
          <CardDescription>Different types of emails sent by the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="font-medium">Magic Link Sign-in</p>
                <p className="text-muted-foreground text-sm">Passwordless authentication emails</p>
              </div>
              <Badge variant="success">Active</Badge>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="font-medium">Password Reset</p>
                <p className="text-muted-foreground text-sm">Account recovery emails</p>
              </div>
              <Badge variant="success">Active</Badge>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="font-medium">Email Verification</p>
                <p className="text-muted-foreground text-sm">New account verification</p>
              </div>
              <Badge variant="success">Active</Badge>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="font-medium">Welcome Email</p>
                <p className="text-muted-foreground text-sm">Sent after successful registration</p>
              </div>
              <Badge variant="outline">Planned</Badge>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="font-medium">Announcement Notifications</p>
                <p className="text-muted-foreground text-sm">Important updates and news</p>
              </div>
              <Badge variant="outline">Planned</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
