'use client';

import { useState } from 'react';
import { sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function TestAuthPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const sendTestLink = async () => {
    try {
      setError('');
      setStatus('Sending magic link...');
      
      // Get the current URL for redirect
      const currentUrl = window.location.origin;
      
      const actionCodeSettings = {
        url: `${currentUrl}/test-auth`,
        handleCodeInApp: true,
      };
      
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      
      // Store email for later
      window.localStorage.setItem('emailForSignIn', email);
      
      setStatus(`Magic link sent to ${email}! Check your email.`);
    } catch (err: any) {
      setError(`Error: ${err.message}`);
      setStatus('');
    }
  };

  const completeSignIn = async () => {
    try {
      if (isSignInWithEmailLink(auth, window.location.href)) {
        let emailForSignIn = window.localStorage.getItem('emailForSignIn');
        if (!emailForSignIn) {
          emailForSignIn = window.prompt('Please provide your email for confirmation');
        }
        
        if (emailForSignIn) {
          const result = await signInWithEmailLink(auth, emailForSignIn, window.location.href);
          window.localStorage.removeItem('emailForSignIn');
          setStatus(`Successfully signed in as ${result.user.email}!`);
          
          // Redirect to dashboard after 2 seconds
          setTimeout(() => {
            window.location.href = '/dashboard';
          }, 2000);
        }
      }
    } catch (err: any) {
      setError(`Sign in error: ${err.message}`);
    }
  };

  // Check if this is a sign-in link on load
  if (typeof window !== 'undefined' && isSignInWithEmailLink(auth, window.location.href)) {
    completeSignIn();
  }

  return (
    <div className="container max-w-md mx-auto p-6 mt-10">
      <Card>
        <CardHeader>
          <CardTitle>Test Authentication</CardTitle>
          <CardDescription>
            Test magic link authentication directly from the App Hosting URL
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertDescription>
              <strong>Current URL:</strong> {typeof window !== 'undefined' ? window.location.origin : 'Loading...'}
            </AlertDescription>
          </Alert>
          
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button onClick={sendTestLink} className="w-full">
              Send Magic Link
            </Button>
          </div>
          
          {status && (
            <Alert>
              <AlertDescription className="text-green-600">
                {status}
              </AlertDescription>
            </Alert>
          )}
          
          {error && (
            <Alert variant="destructive">
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
          )}
          
          <div className="mt-6 p-4 bg-muted rounded-lg text-sm">
            <h4 className="font-semibold mb-2">How this helps:</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Tests auth without domain issues</li>
              <li>Uses the current URL for redirect</li>
              <li>Bypasses API key domain restrictions</li>
              <li>Shows exact error messages</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}