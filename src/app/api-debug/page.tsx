'use client';

import { useEffect, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ApiDebugPage() {
  const [info, setInfo] = useState<any>({});

  useEffect(() => {
    const debugInfo = {
      currentUrl: window.location.href,
      origin: window.location.origin,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      firebaseConfig: {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.substring(0, 10) + '...',
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      },
    };
    setInfo(debugInfo);
  }, []);

  return (
    <div className="container mx-auto max-w-2xl p-6">
      <Card>
        <CardHeader>
          <CardTitle>API Debug Information</CardTitle>
          <CardDescription>This page helps diagnose API key restriction issues</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertDescription>
              <strong>Current URL:</strong> {info.currentUrl}
            </AlertDescription>
          </Alert>

          <Alert>
            <AlertDescription>
              <strong>Origin (what API sees):</strong> {info.origin}
            </AlertDescription>
          </Alert>

          <div className="bg-muted rounded-lg p-4">
            <h3 className="mb-2 font-semibold">Add this to API Key HTTP Referrers:</h3>
            <code className="bg-background block rounded p-2">{info.origin}/*</code>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">All Debug Info:</h3>
            <pre className="bg-muted overflow-auto rounded-lg p-4 text-xs">
              {JSON.stringify(info, null, 2)}
            </pre>
          </div>

          <div className="border-destructive mt-6 rounded-lg border-2 p-4">
            <h3 className="text-destructive mb-2 font-semibold">Two Issues to Fix:</h3>
            <ol className="list-inside list-decimal space-y-2">
              <li>
                <strong>DNS Records:</strong> Delete the two 151.101.x.x A records in Cloudflare.
                Keep only 35.219.200.11
              </li>
              <li>
                <strong>API Key:</strong> Add <code>{info.origin}/*</code> to allowed HTTP referrers
              </li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
