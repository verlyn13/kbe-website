'use client';
import { ArrowLeft, Info } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useId, useState } from 'react';
import { sendWelcomeEmailAction } from '@/app/actions/send-welcome-email';
import { EULADialog } from '@/components/eula-dialog';
import { Icons } from '@/components/icons';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSupabaseAuth } from '@/hooks/use-supabase-auth';
import { useToast } from '@/hooks/use-toast';
import { profileService } from '@/lib/services/profile-service';
import { formatPhoneNumber } from '@/lib/utils';

export default function SignUpPage() {
  const signupFormId = useId();
  const displayNameId = useId();
  const emailId = useId();
  const phoneId = useId();
  const passwordId = useId();
  const confirmPasswordId = useId();
  const announcementsId = useId();
  const programUpdatesId = useId();
  const newslettersId = useId();
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading: authLoading, signUp } = useSupabaseAuth();
  const [loading, setLoading] = useState(false);
  const [showEULA, setShowEULA] = useState(false);
  const [eulaAccepted, setEulaAccepted] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
    phone: '',
    emailPreferences: {
      announcements: true,
      programUpdates: true,
      newsletters: false,
    },
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user && !authLoading) {
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});

    // Show EULA if not accepted yet
    if (!eulaAccepted) {
      setShowEULA(true);
      return;
    }

    // Validate form
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.displayName) {
      newErrors.displayName = 'Name is required';
    }

    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (formData.phone.replace(/\D/g, '').length !== 10) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      // Create user account via Supabase (will send confirmation email by default if configured)
      const { error } = await signUp(formData.email, formData.password);
      if (error) throw error;

      // Provision a basic user profile record (no auth id yet). Sync on first login.
      await profileService.create({
        email: formData.email,
        name: formData.displayName,
        phone: formData.phone.replace(/\D/g, ''),
        role: 'GUARDIAN',
      });

      // Send welcome email if they opted in for any emails
      if (
        formData.emailPreferences.announcements ||
        formData.emailPreferences.programUpdates ||
        formData.emailPreferences.newsletters
      ) {
        try {
          await sendWelcomeEmailAction(formData.email, formData.displayName);
        } catch (emailError) {
          console.error('Failed to send welcome email:', emailError);
          // Don't block the sign-up process if email fails
        }
      }

      toast({
        title: 'Account created successfully',
        description: 'Welcome to Homer Enrichment Hub! Check your email for next steps.',
      });

      // Redirect to login so user can complete email verification/login
      router.push('/login');
    } catch (error: any) {
      console.error('Sign up error:', error);

      const errorMessage = 'Failed to create account. Please try again.';

      // Supabase error messages are descriptive; keep generic fallback

      toast({
        title: 'Sign up failed',
        description: errorMessage,
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

  const handleEULAAccept = () => {
    setEulaAccepted(true);
    setShowEULA(false);
    // Resubmit the form after EULA acceptance
    const form = document.getElementById('signup-form') as HTMLFormElement;
    if (form) {
      form.requestSubmit();
    }
  };

  const handleEULADecline = () => {
    setShowEULA(false);
    toast({
      title: 'Terms not accepted',
      description: 'You must accept the terms of service to create an account.',
      variant: 'destructive',
    });
  };

  // Show loading while checking auth status
  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Icons.spinner className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="mb-2 flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <CardTitle className="text-2xl">Welcome to Homer Enrichment Hub!</CardTitle>
          </div>
          <CardDescription>
            Create your account with email and password. After signing up, you can also use Google
            sign-in or magic links to access your account.
          </CardDescription>
        </CardHeader>
        <form id={signupFormId} onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={displayNameId}>Full Name</Label>
              <Input
                id={displayNameId}
                placeholder="John Doe"
                value={formData.displayName}
                onChange={(e) => setFormData((prev) => ({ ...prev, displayName: e.target.value }))}
                disabled={loading}
                className={errors.displayName ? 'border-destructive' : ''}
              />
              {errors.displayName && (
                <p className="text-destructive text-sm">{errors.displayName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor={emailId}>Email</Label>
              <Input
                id={emailId}
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                disabled={loading}
                className={errors.email ? 'border-destructive' : ''}
              />
              {errors.email && <p className="text-destructive text-sm">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor={phoneId}>Phone Number</Label>
              <Input
                id={phoneId}
                type="tel"
                placeholder="(555) 123-4567"
                value={formData.phone}
                onChange={handlePhoneChange}
                disabled={loading}
                className={errors.phone ? 'border-destructive' : ''}
              />
              {errors.phone && <p className="text-destructive text-sm">{errors.phone}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor={passwordId}>Password</Label>
              <Input
                id={passwordId}
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                disabled={loading}
                className={errors.password ? 'border-destructive' : ''}
              />
              {errors.password && <p className="text-destructive text-sm">{errors.password}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor={confirmPasswordId}>Confirm Password</Label>
              <Input
                id={confirmPasswordId}
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))
                }
                disabled={loading}
                className={errors.confirmPassword ? 'border-destructive' : ''}
              />
              {errors.confirmPassword && (
                <p className="text-destructive text-sm">{errors.confirmPassword}</p>
              )}
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
                      Information about MathCounts, new programs, and registration openings
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id={newslettersId}
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
                    disabled={true}
                  />
                  <div className="space-y-1">
                    <label
                      htmlFor={newslettersId}
                      className="text-sm leading-none font-medium text-muted-foreground"
                    >
                      Community Newsletter <span className="text-xs">(Coming Soon)</span>
                    </label>
                    <p className="text-muted-foreground text-xs">
                      Monthly updates about student achievements and upcoming events - will be
                      available in the future
                    </p>
                  </div>
                </div>
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  We recommend keeping announcements enabled to stay informed about important
                  program updates. You can change these preferences anytime in your profile
                  settings.
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
              Create Account
            </Button>
            <div className="space-y-2 text-center">
              <p className="text-muted-foreground text-sm">
                Already have an account?{' '}
                <Link href="/login" className="text-primary hover:underline">
                  Sign in
                </Link>
              </p>
              <p className="text-muted-foreground text-xs">
                After creating your account, you can sign in using your password, Google, or magic
                links
              </p>
            </div>
          </CardFooter>
        </form>
      </Card>

      <EULADialog open={showEULA} onAccept={handleEULAAccept} onDecline={handleEULADecline} />
    </div>
  );
}
