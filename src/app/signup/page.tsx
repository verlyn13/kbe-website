'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { profileService } from '@/lib/firebase-admin';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Icons } from '@/components/icons';
import { formatPhoneNumber } from '@/lib/utils';
import { ArrowLeft, Info } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { sendWelcomeEmailAction } from '@/app/actions/send-welcome-email';

export default function SignUpPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
    phone: '',
    emailPreferences: {
      announcements: true,
      programUpdates: true,
      newsletters: true,
    },
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});

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
      // Create user account
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // Update display name
      await updateProfile(userCredential.user, {
        displayName: formData.displayName,
      });

      // Create user profile with email preferences
      await profileService.createOrUpdate(userCredential.user.uid, {
        displayName: formData.displayName,
        email: formData.email,
        phone: formData.phone.replace(/\D/g, ''),
        role: 'guardian',
        emailPreferences: formData.emailPreferences,
      });

      // Send welcome email if they opted in for any emails
      if (formData.emailPreferences.announcements || 
          formData.emailPreferences.programUpdates || 
          formData.emailPreferences.newsletters) {
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

      // Redirect to welcome page for profile completion
      router.push('/welcome');
    } catch (error: any) {
      console.error('Sign up error:', error);
      
      let errorMessage = 'Failed to create account. Please try again.';
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered. Please sign in instead.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Please use a stronger password.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address.';
      }

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
    setFormData(prev => ({ ...prev, phone: formatted }));
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <CardTitle className="text-2xl">Welcome to Homer Enrichment Hub!</CardTitle>
          </div>
          <CardDescription>
            Let's get you set up so you can register your children for MathCounts and other programs
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">Full Name</Label>
              <Input
                id="displayName"
                placeholder="John Doe"
                value={formData.displayName}
                onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                disabled={loading}
                className={errors.displayName ? 'border-destructive' : ''}
              />
              {errors.displayName && (
                <p className="text-sm text-destructive">{errors.displayName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                disabled={loading}
                className={errors.email ? 'border-destructive' : ''}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(555) 123-4567"
                value={formData.phone}
                onChange={handlePhoneChange}
                disabled={loading}
                className={errors.phone ? 'border-destructive' : ''}
              />
              {errors.phone && (
                <p className="text-sm text-destructive">{errors.phone}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                disabled={loading}
                className={errors.password ? 'border-destructive' : ''}
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                disabled={loading}
                className={errors.confirmPassword ? 'border-destructive' : ''}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">{errors.confirmPassword}</p>
              )}
            </div>

            <div className="space-y-4 pt-4 border-t">
              <div className="space-y-2">
                <Label className="text-base font-semibold">Email Preferences</Label>
                <p className="text-sm text-muted-foreground">
                  Stay connected with updates about programs and activities
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="announcements"
                    checked={formData.emailPreferences.announcements}
                    onCheckedChange={(checked) =>
                      setFormData(prev => ({
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
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Important Announcements
                    </label>
                    <p className="text-xs text-muted-foreground">
                      Receive updates about schedule changes, deadlines, and urgent information
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="programUpdates"
                    checked={formData.emailPreferences.programUpdates}
                    onCheckedChange={(checked) =>
                      setFormData(prev => ({
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
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Program Updates
                    </label>
                    <p className="text-xs text-muted-foreground">
                      Information about MathCounts, new programs, and registration openings
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="newsletters"
                    checked={formData.emailPreferences.newsletters}
                    onCheckedChange={(checked) =>
                      setFormData(prev => ({
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
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Community Newsletter
                    </label>
                    <p className="text-xs text-muted-foreground">
                      Monthly updates about student achievements and upcoming events
                    </p>
                  </div>
                </div>
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  We recommend keeping announcements enabled to stay informed about important program updates.
                  You can change these preferences anytime in your profile settings.
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
              Create Account
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              Already have an account?{' '}
              <Link href="/" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}