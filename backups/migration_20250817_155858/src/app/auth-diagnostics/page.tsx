'use client';

import {
  GoogleAuthProvider,
  getRedirectResult,
  signInWithPopup,
  signInWithRedirect,
} from 'firebase/auth';
import { useEffect, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { auth } from '@/lib/firebase';

export default function AuthDiagnosticsPage() {
  const [status, setStatus] = useState<string[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Check for redirect result
    getRedirectResult(auth)
      .then((result) => {
        if (result) {
          addStatus('✅ Redirect sign-in successful!');
          addStatus(`User: ${result.user.email}`);
        }
      })
      .catch((error) => {
        if (error.code !== 'auth/popup-blocked-by-browser') {
          addStatus(`❌ Redirect error: ${error.message}`);
        }
      });

    // Log current environment
    addStatus(`🌐 Current URL: ${window.location.href}`);
    addStatus(`🔑 Auth Domain: ${auth.app.options.authDomain}`);
    addStatus(`📱 Project ID: ${auth.app.options.projectId}`);
  }, []);

  const addStatus = (message: string) => {
    setStatus((prev) => [...prev, message]);
  };

  const testGooglePopup = async () => {
    try {
      setError('');
      addStatus('🔄 Testing Google sign-in with popup...');

      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      addStatus('✅ Popup sign-in successful!');
      addStatus(`User: ${result.user.email}`);
      addStatus(`Provider: ${result.providerId}`);
    } catch (error: any) {
      setError(error.message);
      addStatus(`❌ Popup error: ${error.code}`);
      addStatus(`Details: ${error.message}`);

      if (error.code === 'auth/popup-blocked-by-browser') {
        addStatus('💡 Popup was blocked. Trying redirect...');
        testGoogleRedirect();
      }
    }
  };

  const testGoogleRedirect = async () => {
    try {
      setError('');
      addStatus('🔄 Testing Google sign-in with redirect...');

      const provider = new GoogleAuthProvider();
      await signInWithRedirect(auth, provider);
    } catch (error: any) {
      setError(error.message);
      addStatus(`❌ Redirect error: ${error.code}`);
      addStatus(`Details: ${error.message}`);
    }
  };

  const checkAuthState = () => {
    addStatus('🔍 Checking auth state...');
    addStatus(`Current user: ${auth.currentUser ? auth.currentUser.email : 'None'}`);
    addStatus(`Auth ready: ${auth.authStateReady ? 'Yes' : 'No'}`);
  };

  return (
    <div className="container mx-auto max-w-3xl p-6">
      <Card>
        <CardHeader>
          <CardTitle>Firebase Auth Diagnostics</CardTitle>
          <CardDescription>Comprehensive authentication testing and diagnostics</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Button onClick={testGooglePopup} variant="default">
              Test Google Popup
            </Button>
            <Button onClick={testGoogleRedirect} variant="secondary">
              Test Google Redirect
            </Button>
            <Button onClick={checkAuthState} variant="outline">
              Check Auth State
            </Button>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>
                <strong>Error:</strong> {error}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <h3 className="font-semibold">Status Log:</h3>
            <div className="bg-muted h-96 overflow-y-auto rounded-lg p-4">
              {status.map((s, i) => (
                <div key={i} className="py-1 font-mono text-sm">
                  {s}
                </div>
              ))}
            </div>
          </div>

          <Alert>
            <AlertDescription>
              <strong>Common Issues:</strong>
              <ul className="mt-2 list-inside list-disc space-y-1">
                <li>OAuth consent screen not configured</li>
                <li>Domain not in authorized domains list</li>
                <li>Google provider not enabled in Firebase</li>
                <li>API restrictions blocking auth</li>
              </ul>
            </AlertDescription>
          </Alert>

          <div className="bg-muted rounded-lg p-4">
            <h4 className="mb-2 font-semibold">Required Firebase Console Checks:</h4>
            <ol className="list-inside list-decimal space-y-1 text-sm">
              <li>
                <a
                  href="https://console.firebase.google.com/project/kbe-website/authentication/providers"
                  target="_blank"
                  className="text-primary hover:underline"
                  rel="noopener"
                >
                  Check Google Provider is Enabled
                </a>
              </li>
              <li>
                <a
                  href="https://console.firebase.google.com/project/kbe-website/authentication/settings"
                  target="_blank"
                  className="text-primary hover:underline"
                  rel="noopener"
                >
                  Check Authorized Domains
                </a>
              </li>
              <li>
                <a
                  href="https://console.cloud.google.com/apis/credentials/consent?project=kbe-website"
                  target="_blank"
                  className="text-primary hover:underline"
                  rel="noopener"
                >
                  Check OAuth Consent Screen
                </a>
              </li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
