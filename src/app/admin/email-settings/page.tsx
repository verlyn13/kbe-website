'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { InfoIcon, Mail, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function EmailSettingsPage() {
  return (
    <div className="container max-w-4xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Email Settings</h1>
        <p className="text-muted-foreground">
          Configure how emails are sent from Homer Enrichment Hub
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current Email Configuration</CardTitle>
          <CardDescription>
            Emails are currently sent using Firebase Authentication
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium mb-1">From Address</p>
              <code className="text-sm bg-muted px-2 py-1 rounded">
                noreply@kbe-website.firebaseapp.com
              </code>
            </div>
            <div>
              <p className="text-sm font-medium mb-1">Sender Name</p>
              <code className="text-sm bg-muted px-2 py-1 rounded">
                Homer Enrichment Hub
              </code>
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
              <Link href="https://console.firebase.google.com/project/kbe-website/authentication/emails" target="_blank">
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
            Send emails from your own domain (noreply@homerenrichment.com)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline">Not Configured</Badge>
              <span className="text-sm text-muted-foreground">Requires additional setup</span>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Available Options:</h4>
            
            <div className="border rounded-lg p-4 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <h5 className="font-medium">SendGrid Integration</h5>
                  <p className="text-sm text-muted-foreground">
                    Professional email delivery with analytics. Free tier: 100 emails/day.
                  </p>
                </div>
                <Badge variant="secondary">Recommended</Badge>
              </div>
            </div>

            <div className="border rounded-lg p-4 space-y-2">
              <div>
                <h5 className="font-medium">Firebase Email Extension</h5>
                <p className="text-sm text-muted-foreground">
                  Use your existing email service (Gmail, Office 365) with SMTP.
                </p>
              </div>
            </div>

            <div className="border rounded-lg p-4 space-y-2">
              <div>
                <h5 className="font-medium">Custom Email Function</h5>
                <p className="text-sm text-muted-foreground">
                  Build a custom Cloud Function for complete control.
                </p>
              </div>
            </div>
          </div>

          <Alert>
            <Mail className="h-4 w-4" />
            <AlertTitle>Benefits of Custom Domain</AlertTitle>
            <AlertDescription>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Professional appearance (noreply@homerenrichment.com)</li>
                <li>Better email deliverability</li>
                <li>Reduced spam filtering</li>
                <li>Email analytics and tracking</li>
              </ul>
            </AlertDescription>
          </Alert>

          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/docs/sendgrid-email-setup.md">
                View Setup Guide
              </Link>
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
          <CardDescription>
            Different types of emails sent by the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Magic Link Sign-in</p>
                <p className="text-sm text-muted-foreground">Passwordless authentication emails</p>
              </div>
              <Badge variant="success">Active</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Password Reset</p>
                <p className="text-sm text-muted-foreground">Account recovery emails</p>
              </div>
              <Badge variant="success">Active</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Email Verification</p>
                <p className="text-sm text-muted-foreground">New account verification</p>
              </div>
              <Badge variant="success">Active</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Welcome Email</p>
                <p className="text-sm text-muted-foreground">Sent after successful registration</p>
              </div>
              <Badge variant="outline">Planned</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Announcement Notifications</p>
                <p className="text-sm text-muted-foreground">Important updates and news</p>
              </div>
              <Badge variant="outline">Planned</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}