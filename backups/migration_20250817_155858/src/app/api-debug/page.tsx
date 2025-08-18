'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
      }
    };
    setInfo(debugInfo);
  }, []);

  return (
    <div className="container max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>API Debug Information</CardTitle>
          <CardDescription>
            This page helps diagnose API key restriction issues
          </CardDescription>
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

          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2">Add this to API Key HTTP Referrers:</h3>
            <code className="block p-2 bg-background rounded">
              {info.origin}/*
            </code>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">All Debug Info:</h3>
            <pre className="p-4 bg-muted rounded-lg overflow-auto text-xs">
              {JSON.stringify(info, null, 2)}
            </pre>
          </div>

          <div className="mt-6 p-4 border-2 border-destructive rounded-lg">
            <h3 className="font-semibold text-destructive mb-2">Two Issues to Fix:</h3>
            <ol className="list-decimal list-inside space-y-2">
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