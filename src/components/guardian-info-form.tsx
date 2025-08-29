'use client';

import { ArrowRight, BookOpen, Calendar, Info, Mail, Phone, User, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useId, useState } from 'react';
import { Icons } from '@/components/icons';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { profileService } from '@/lib/services';
import { createClient } from '@/lib/supabase/client';
import { formatPhoneNumber } from '@/lib/utils';

export function GuardianInfoForm() {
  const displayNameId = useId();
  const emailId = useId();
  const phoneId = useId();
  const announcementsId = useId();
  const programUpdatesId = useId();
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
    },
  });

  useEffect(() => {
    async function loadUserData() {
      if (!user) return;

      try {
        // Check if profile is already complete
        const supabase = createClient();
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileData?.profileCompleted) {
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
      // Update user profile (Prisma)
      await profileService.upsert({
        id: user.id,
        email: formData.email,
        name: formData.displayName,
        phone: formData.phone.replace(/\D/g, ''),
      });

      toast({
        title: 'Profile updated successfully',
        description: 'Your guardian information has been saved.',
      });

      // Mark as complete
      setIsProfileComplete(true);

      // Force reload to ensure all auth state is refreshed
      // This is necessary because ProfileCompletionCheck caches the initial state
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 500);
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
            Your guardian profile has been saved successfully. Ready to explore?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="mb-6 text-center">
            <Button
              onClick={() => {
                window.location.href = '/dashboard';
              }}
              size="lg"
              className="px-8"
            >
              Go to Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="border-t pt-6">
            <p className="text-muted-foreground text-center text-sm mb-4">
              Or explore other areas:
            </p>
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
            </div>
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
              <Label htmlFor={displayNameId}>
                <User className="mr-1 inline h-4 w-4" />
                Full Name
              </Label>
              <Input
                id={displayNameId}
                placeholder="Your full name"
                value={formData.displayName}
                onChange={(e) => setFormData((prev) => ({ ...prev, displayName: e.target.value }))}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={emailId}>
                <Mail className="mr-1 inline h-4 w-4" />
                Email Address
              </Label>
              <Input
                id={emailId}
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={phoneId}>
                <Phone className="mr-1 inline h-4 w-4" />
                Phone Number <span className="text-destructive">*</span>
              </Label>
              <Input
                id={phoneId}
                type="tel"
                placeholder="(555) 123-4567"
                value={formData.phone}
                onChange={handlePhoneChange}
                required
                disabled={loading}
              />
              <p className="text-muted-foreground text-xs">
                Required for program communications and emergency contact
              </p>
            </div>
          </div>

          <div className="space-y-4 border-t pt-4">
            <div className="space-y-2">
              <Label className="text-base font-semibold">Email Notifications</Label>
              <p className="text-muted-foreground text-sm">
                Choose what you'd like to receive via email (recommended)
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id={announcementsId}
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
                    htmlFor={announcementsId}
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
                  id={programUpdatesId}
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
                    htmlFor={programUpdatesId}
                    className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Program Updates
                  </label>
                  <p className="text-muted-foreground text-xs">
                    Updates about MathCounts, new programs, and registration openings
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
