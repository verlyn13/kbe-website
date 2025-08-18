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
import { Mail, Phone, User, ArrowRight, BookOpen, UserPlus, Calendar, Info } from 'lucide-react';
import Link from 'next/link';
import { Checkbox } from '@/components/ui/checkbox';

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
    emailPreferences: {
      announcements: true,
      programUpdates: true,
      newsletters: true,
    },
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

        // Only pre-fill with auth provider data, not database data
        // This ensures new users get a clean form
        setFormData({
          displayName: user.displayName || '',
          email: user.email || '',
          phone: '',
          emailPreferences: {
            announcements: true,
            programUpdates: true,
            newsletters: true,
          },
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
        emailPreferences: formData.emailPreferences,
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
    setFormData((prev) => ({ ...prev, phone: formatted }));
  }

  // Don't show email verification message for Google/OAuth users
  // They are automatically verified through their provider
  if (!user) {
    return null;
  }

  // Show next steps if profile is complete
  if (isProfileComplete) {
    return (
      <Card className="mx-auto max-w-3xl">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome to Homer Enrichment Hub! 🎉</CardTitle>
          <CardDescription>
            Your guardian profile is all set. Here's what to do next:
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Link href="/students/add" className="block">
              <div className="group bg-card hover:bg-accent cursor-pointer rounded-lg border p-4 transition-all hover:shadow-md">
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 rounded-lg p-2">
                    <UserPlus className="text-primary h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="group-hover:text-primary font-medium">Add Your Children</h3>
                    <p className="text-muted-foreground text-sm">
                      Register your children in the system
                    </p>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/programs" className="block">
              <div className="group bg-card hover:bg-accent cursor-pointer rounded-lg border p-4 transition-all hover:shadow-md">
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 rounded-lg p-2">
                    <BookOpen className="text-primary h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="group-hover:text-primary font-medium">Browse Programs</h3>
                    <p className="text-muted-foreground text-sm">
                      Explore MathCounts and other activities
                    </p>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/calendar" className="block">
              <div className="group bg-card hover:bg-accent cursor-pointer rounded-lg border p-4 transition-all hover:shadow-md">
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 rounded-lg p-2">
                    <Calendar className="text-primary h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="group-hover:text-primary font-medium">View Schedule</h3>
                    <p className="text-muted-foreground text-sm">Check dates and deadlines</p>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/dashboard" className="block">
              <div className="group bg-card hover:bg-accent cursor-pointer rounded-lg border p-4 transition-all hover:shadow-md">
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 rounded-lg p-2">
                    <ArrowRight className="text-primary h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="group-hover:text-primary font-medium">Go to Dashboard</h3>
                    <p className="text-muted-foreground text-sm">Access all features</p>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          <Alert>
            <Mail className="h-4 w-4" />
            <AlertDescription>
              <strong>Questions?</strong> Contact Jeffrey at{' '}
              <a
                href="mailto:jeffreyverlynjohnson@gmail.com"
                className="text-primary hover:underline"
              >
                jeffreyverlynjohnson@gmail.com
              </a>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-auto max-w-2xl">
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
                <User className="mr-1 inline h-4 w-4" />
                Full Name
              </Label>
              <Input
                id="displayName"
                placeholder="Your full name"
                value={formData.displayName}
                onChange={(e) => setFormData((prev) => ({ ...prev, displayName: e.target.value }))}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                <Mail className="mr-1 inline h-4 w-4" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">
                <Phone className="mr-1 inline h-4 w-4" />
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

          <div className="space-y-4 border-t pt-4">
            <div className="space-y-2">
              <Label className="text-base font-semibold">Email Preferences</Label>
              <p className="text-muted-foreground text-sm">
                Stay connected with updates about programs and activities
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="announcements"
                  checked={formData.emailPreferences.announcements}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      emailPreferences: {
                        ...prev.emailPreferences,
                        announcements: checked as boolean,
                      },
                    }))
                  }
                  disabled={loading}
                />
                <div className="space-y-1">
                  <label
                    htmlFor="announcements"
                    className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Important Announcements
                  </label>
                  <p className="text-muted-foreground text-xs">
                    Receive updates about schedule changes, deadlines, and urgent information
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="programUpdates"
                  checked={formData.emailPreferences.programUpdates}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      emailPreferences: {
                        ...prev.emailPreferences,
                        programUpdates: checked as boolean,
                      },
                    }))
                  }
                  disabled={loading}
                />
                <div className="space-y-1">
                  <label
                    htmlFor="programUpdates"
                    className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Program Updates
                  </label>
                  <p className="text-muted-foreground text-xs">
                    Information about MathCounts, new programs, and registration openings
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="newsletters"
                  checked={formData.emailPreferences.newsletters}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      emailPreferences: {
                        ...prev.emailPreferences,
                        newsletters: checked as boolean,
                      },
                    }))
                  }
                  disabled={loading}
                />
                <div className="space-y-1">
                  <label
                    htmlFor="newsletters"
                    className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Community Newsletter
                  </label>
                  <p className="text-muted-foreground text-xs">
                    Monthly updates about student achievements and upcoming events
                  </p>
                </div>
              </div>
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                We recommend keeping announcements enabled to stay informed about important program
                updates. You can change these preferences anytime in your profile settings.
              </AlertDescription>
            </Alert>
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

          <p className="text-muted-foreground text-center text-sm">
            Need help? Contact Jeffrey at{' '}
            <a
              href="mailto:jeffreyverlynjohnson@gmail.com"
              className="text-primary hover:underline"
            >
              jeffreyverlynjohnson@gmail.com
            </a>
          </p>
        </CardContent>
      </form>
    </Card>
  );
}
