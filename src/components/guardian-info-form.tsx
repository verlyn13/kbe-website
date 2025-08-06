'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Icons } from '@/components/icons';
import { formatPhoneNumber } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { profileService } from '@/lib/firebase-admin';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Mail, Phone, User, ArrowRight, BookOpen, UserPlus, Calendar } from 'lucide-react';
import Link from 'next/link';

export function GuardianInfoForm() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    async function loadUserData() {
      if (!user) return;

      try {
        // Check if profile is already complete
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const userData = userDoc.data();
        
        if (userData?.profileCompleted) {
          setIsProfileComplete(true);
          return;
        }

        // Pre-fill form with existing data
        setFormData({
          displayName: userData?.displayName || user.displayName || '',
          email: userData?.email || user.email || '',
          phone: userData?.phone || '',
        });
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    }

    loadUserData();
  }, [user]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    try {
      // Update user profile
      await profileService.createOrUpdate(user.uid, {
        displayName: formData.displayName,
        email: formData.email,
        phone: formData.phone.replace(/\D/g, ''),
        profileCompleted: true,
      });

      toast({
        title: 'Profile updated successfully',
        description: 'Your guardian information has been saved.',
      });

      // Mark as complete
      setIsProfileComplete(true);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error updating profile',
        description: 'Please try again or contact support.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    const formatted = formatPhoneNumber(e.target.value);
    setFormData(prev => ({ ...prev, phone: formatted }));
  }

  // Don't show form if user hasn't verified email
  if (!user?.emailVerified) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Please Verify Your Email</CardTitle>
          <CardDescription>
            Check your email for a verification link to continue setting up your account.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // Show next steps if profile is complete
  if (isProfileComplete) {
    return (
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome to Homer Enrichment Hub! 🎉</CardTitle>
          <CardDescription>
            Your guardian profile is all set. Here's what to do next:
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Link href="/students/add" className="block">
              <div className="group cursor-pointer rounded-lg border bg-card p-4 transition-all hover:bg-accent hover:shadow-md">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <UserPlus className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-medium group-hover:text-primary">Add Your Children</h3>
                    <p className="text-sm text-muted-foreground">
                      Register your children in the system
                    </p>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/programs" className="block">
              <div className="group cursor-pointer rounded-lg border bg-card p-4 transition-all hover:bg-accent hover:shadow-md">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-medium group-hover:text-primary">Browse Programs</h3>
                    <p className="text-sm text-muted-foreground">
                      Explore MathCounts and other activities
                    </p>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/calendar" className="block">
              <div className="group cursor-pointer rounded-lg border bg-card p-4 transition-all hover:bg-accent hover:shadow-md">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-medium group-hover:text-primary">View Schedule</h3>
                    <p className="text-sm text-muted-foreground">
                      Check dates and deadlines
                    </p>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/dashboard" className="block">
              <div className="group cursor-pointer rounded-lg border bg-card p-4 transition-all hover:bg-accent hover:shadow-md">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <ArrowRight className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-medium group-hover:text-primary">Go to Dashboard</h3>
                    <p className="text-sm text-muted-foreground">
                      Access all features
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          <Alert>
            <Mail className="h-4 w-4" />
            <AlertDescription>
              <strong>Questions?</strong> Contact Jeffrey at{' '}
              <a href="mailto:jeffreyverlynjohnson@gmail.com" className="text-primary hover:underline">
                jeffreyverlynjohnson@gmail.com
              </a>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Complete Your Guardian Profile</CardTitle>
        <CardDescription>
          Let's make sure we have your correct information for program communications
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">
                <User className="inline h-4 w-4 mr-1" />
                Full Name
              </Label>
              <Input
                id="displayName"
                placeholder="Your full name"
                value={formData.displayName}
                onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                <Mail className="inline h-4 w-4 mr-1" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">
                <Phone className="inline h-4 w-4 mr-1" />
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(555) 123-4567"
                value={formData.phone}
                onChange={handlePhoneChange}
                required
                disabled={loading}
              />
            </div>
          </div>

          <Alert>
            <AlertDescription>
              <strong>Remember:</strong> You can always sign in using:
              <ul className="mt-2 ml-4 list-disc text-sm">
                <li>Your email and password</li>
                <li>Google sign-in</li>
                <li>Magic link (we'll email you a sign-in link)</li>
              </ul>
            </AlertDescription>
          </Alert>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            Save and Continue
          </Button>

          <p className="text-sm text-center text-muted-foreground">
            Need help? Contact Jeffrey at{' '}
            <a href="mailto:jeffreyverlynjohnson@gmail.com" className="text-primary hover:underline">
              jeffreyverlynjohnson@gmail.com
            </a>
          </p>
        </CardContent>
      </form>
    </Card>
  );
}