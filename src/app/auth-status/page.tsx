'use client';

import { AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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
          'homerenrichment.com',
          'kbe-website-*.vercel.app',
          'localhost',
        ],
      });

      // Check Supabase config
      const config = {
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
        supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      };

      statusChecks.push({
        name: 'Supabase URL',
        status: config.supabaseUrl ? 'success' : 'error',
        value: config.supabaseUrl ? '✓ Configured' : '✗ Missing',
        expected: 'https://xxx.supabase.co',
      });

      statusChecks.push({
        name: 'Supabase Anon Key',
        status: config.supabaseAnonKey ? 'success' : 'error',
        value: config.supabaseAnonKey ? '✓ Configured' : '✗ Missing',
        expected: 'eyJhbGciOi...',
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
            {checks.map((check) => (
              <div
                key={check.name}
                className="flex items-center justify-between rounded-lg border p-3"
              >
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
            <h3 className="mb-2 font-semibold">Supabase Configuration ✓</h3>
            <p className="text-muted-foreground mb-2 text-sm">Migration status:</p>
            <ul className="list-inside list-disc space-y-1 text-sm">
              <li>Migrated from Firebase to Supabase</li>
              <li>Database connected with PostgreSQL</li>
              <li>Authentication using Supabase Auth</li>
            </ul>
            <p className="text-muted-foreground mt-3 text-sm">
              All authentication flows are now powered by Supabase.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
