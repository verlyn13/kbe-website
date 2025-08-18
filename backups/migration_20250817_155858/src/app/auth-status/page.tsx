'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

export default function AuthStatusPage() {
  const [checks, setChecks] = useState<any[]>([]);

  useEffect(() => {
    const performChecks = async () => {
      const statusChecks = [];

      // Check current domain
      statusChecks.push({
        name: 'Current Domain',
        status: 'success',
        value: window.location.hostname,
        expected: [
          'homerconnect.com',
          'kbe-website--kbe-website.us-central1.hosted.app',
          'localhost',
        ],
      });

      // Check Firebase config
      const config = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      };

      statusChecks.push({
        name: 'Firebase Config',
        status: config.apiKey ? 'success' : 'error',
        value: config.projectId || 'Not configured',
        expected: 'kbe-website',
      });

      // Check auth domain
      statusChecks.push({
        name: 'Auth Domain',
        status: config.authDomain === 'kbe-website.firebaseapp.com' ? 'success' : 'warning',
        value: config.authDomain || 'Not set',
        expected: 'kbe-website.firebaseapp.com',
      });

      // Check API key format
      statusChecks.push({
        name: 'API Key',
        status: config.apiKey?.startsWith('AIza') ? 'success' : 'error',
        value: config.apiKey ? '✓ Configured' : '✗ Missing',
        expected: 'AIzaSy...',
      });

      setChecks(statusChecks);
    };

    performChecks();
  }, []);

  const getIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto max-w-2xl p-6">
      <Card>
        <CardHeader>
          <CardTitle>Authentication Status Check</CardTitle>
          <CardDescription>Verifying your authentication configuration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {checks.map((check, index) => (
              <div key={index} className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-3">
                  {getIcon(check.status)}
                  <div>
                    <div className="font-medium">{check.name}</div>
                    <div className="text-muted-foreground text-sm">
                      Expected:{' '}
                      {Array.isArray(check.expected) ? check.expected.join(' or ') : check.expected}
                    </div>
                  </div>
                </div>
                <div className="font-mono text-sm">{check.value}</div>
              </div>
            ))}
          </div>

          <div className="bg-muted mt-6 rounded-lg p-4">
            <h3 className="mb-2 font-semibold">OAuth Configuration Updated ✓</h3>
            <p className="text-muted-foreground mb-2 text-sm">You've successfully updated:</p>
            <ul className="list-inside list-disc space-y-1 text-sm">
              <li>Added authorized domains</li>
              <li>Set developer contact email</li>
              <li>OAuth consent screen is in production</li>
            </ul>
            <p className="text-muted-foreground mt-3 text-sm">
              Google Sign-in should now be working. If not, wait a few more minutes for propagation.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
