'use client';

import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function DebugAuthPage() {
  const [authState, setAuthState] = useState<any>(null);
  const [indexedDBData, setIndexedDBData] = useState<string>('');

  useEffect(() => {
    // Check current auth state
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setAuthState({
        user: user
          ? {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              metadata: user.metadata,
            }
          : null,
        currentUser: auth.currentUser
          ? {
              uid: auth.currentUser.uid,
              email: auth.currentUser.email,
            }
          : null,
      });
    });

    // Check IndexedDB for Firebase data
    checkIndexedDB();

    return () => unsubscribe();
  }, []);

  const checkIndexedDB = async () => {
    try {
      const databases = await indexedDB.databases();
      const firebaseDbs = databases.filter((db) => db.name?.includes('firebase'));
      setIndexedDBData(JSON.stringify(firebaseDbs, null, 2));
    } catch (error) {
      setIndexedDBData('Error checking IndexedDB: ' + error);
    }
  };

  const clearAllAuth = async () => {
    try {
      // Sign out from Firebase
      await signOut(auth);

      // Clear all localStorage
      localStorage.clear();

      // Clear all sessionStorage
      sessionStorage.clear();

      // Clear IndexedDB Firebase databases
      const databases = await indexedDB.databases();
      for (const db of databases) {
        if (db.name?.includes('firebase')) {
          await indexedDB.deleteDatabase(db.name);
        }
      }

      // Reload the page
      window.location.href = '/';
    } catch (error) {
      console.error('Error clearing auth:', error);
      alert('Error clearing auth: ' + error);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl p-4">
      <h1 className="mb-4 text-2xl font-bold">Auth Debug Page</h1>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Current Auth State</CardTitle>
          <CardDescription>Firebase Auth current state</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="overflow-auto rounded bg-gray-100 p-4">
            {JSON.stringify(authState, null, 2)}
          </pre>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>IndexedDB Firebase Databases</CardTitle>
          <CardDescription>Persistent storage used by Firebase</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="overflow-auto rounded bg-gray-100 p-4">{indexedDBData}</pre>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>LocalStorage Keys</CardTitle>
          <CardDescription>Keys stored in localStorage</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="overflow-auto rounded bg-gray-100 p-4">
            {JSON.stringify(Object.keys(localStorage), null, 2)}
          </pre>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button onClick={clearAllAuth} variant="destructive">
          Clear All Auth Data & Sign Out
        </Button>
        <Button onClick={() => (window.location.href = '/')} variant="outline">
          Go to Login Page
        </Button>
        <Button onClick={() => (window.location.href = '/admin')} variant="outline">
          Try Admin Route
        </Button>
      </div>
    </div>
  );
}
