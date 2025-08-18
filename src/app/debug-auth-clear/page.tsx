'use client';

import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function DebugAuthClearPage() {
  const [status, setStatus] = useState<string[]>([]);

  const clearAuthState = async () => {
    const newStatus = [...status];

    try {
      // Sign out from Firebase
      await signOut(auth);
      newStatus.push('✓ Signed out from Firebase Auth');

      // Clear local storage
      localStorage.clear();
      newStatus.push('✓ Cleared localStorage');

      // Clear session storage
      sessionStorage.clear();
      newStatus.push('✓ Cleared sessionStorage');

      // Clear cookies (what we can)
      document.cookie.split(';').forEach((c) => {
        document.cookie = c
          .replace(/^ +/, '')
          .replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
      });
      newStatus.push('✓ Cleared accessible cookies');

      // Clear IndexedDB (Firebase uses this)
      if ('indexedDB' in window) {
        const databases = await indexedDB.databases();
        databases.forEach((db) => {
          if (db.name?.includes('firebase')) {
            indexedDB.deleteDatabase(db.name);
            newStatus.push(`✓ Cleared IndexedDB: ${db.name}`);
          }
        });
      }

      newStatus.push('✅ All auth state cleared! You can now try logging in again.');
    } catch (error) {
      newStatus.push(`❌ Error: ${error}`);
    }

    setStatus(newStatus);
  };

  return (
    <div className="container mx-auto max-w-2xl p-6">
      <Card>
        <CardHeader>
          <CardTitle>Clear Authentication State</CardTitle>
          <CardDescription>
            Use this tool to completely clear your authentication state when debugging login issues.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={clearAuthState} size="lg">
            Clear All Auth State
          </Button>

          {status.length > 0 && (
            <div className="mt-4 space-y-2">
              <h3 className="font-semibold">Status:</h3>
              {status.map((s, i) => (
                <div key={i} className="font-mono text-sm">
                  {s}
                </div>
              ))}
            </div>
          )}

          <div className="bg-muted mt-6 rounded-lg p-4">
            <h4 className="mb-2 font-semibold">After clearing:</h4>
            <ol className="list-inside list-decimal space-y-1 text-sm">
              <li>Close this tab</li>
              <li>Open a new incognito/private window</li>
              <li>Navigate to https://homerenrichment.com</li>
              <li>Try logging in again</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
