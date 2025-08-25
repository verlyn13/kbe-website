'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  GoogleAuthProvider,
  isSignInWithEmailLink,
  sendSignInLinkToEmail,
  signInWithEmailAndPassword,
  signInWithEmailLink,
  signInWithPopup,
} from 'firebase/auth';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { getErrorMessage } from '@/lib/error-utils';
import { auth } from '@/lib/firebase';
import { logger } from '@/lib/logger';
import { emailSchema, passwordSchema } from '@/lib/validation';

const formSchema = z.object({
  email: emailSchema,
  password: passwordSchema.optional(),
  remember: z.boolean().default(false).optional(),
});

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <title>Google logo</title>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a10 10 0 0 0-4.5 18.5" />
      <path d="M22 12a10 10 0 0 0-18.5-4.5" />
    </svg>
  );
}

/**
 * Login form component with multiple authentication methods.
 * Supports email/password, Google OAuth, and magic link authentication.
 *
 * @component
 * @example
 * <LoginForm />
 */
export function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isMagicLinkLoading, setIsMagicLinkLoading] = useState(false);
  const [authMethod, setAuthMethod] = useState<'password' | 'magic'>('password');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      remember: false,
    },
  });

  useEffect(() => {
    const completeMagicLinkSignIn = async () => {
      // Log current URL for debugging
      logger.info('Checking if URL is magic link', {
        url: window.location.href,
        isMagicLink: isSignInWithEmailLink(auth, window.location.href),
      });

      if (isSignInWithEmailLink(auth, window.location.href)) {
        setIsLoading(true);
        let email = window.localStorage.getItem('emailForSignIn');

        logger.info('Magic link detected, attempting sign in', {
          emailFromStorage: email ? 'found' : 'not found',
        });

        if (!email) {
          email = window.prompt('Please provide your email for confirmation');
        }
        try {
          if (email) {
            const userCredential = await signInWithEmailLink(auth, email, window.location.href);
            window.localStorage.removeItem('emailForSignIn');
            logger.info('Magic link sign in successful');

            // Check if this is a new user (first time sign in)
            const isNewUser =
              userCredential.user.metadata.creationTime ===
              userCredential.user.metadata.lastSignInTime;

            if (isNewUser) {
              router.push('/welcome');
            } else {
              router.push('/dashboard');
            }
          }
        } catch (error) {
          logger.error('Magic link sign in failed', {
            error,
            code: (error as { code?: string })?.code,
            message: (error as { message?: string })?.message,
            email,
            url: window.location.href,
          });

          let errorMessage = getErrorMessage(error);

          // Provide more specific error messages for sign-in
          if ((error as { code?: string })?.code === 'auth/invalid-action-code') {
            errorMessage = 'This sign-in link is invalid, expired, or has already been used.';
          } else if ((error as { code?: string })?.code === 'auth/user-disabled') {
            errorMessage = 'This account has been disabled.';
          }

          toast({
            variant: 'destructive',
            title: 'Magic link sign in failed',
            description: errorMessage,
          });
        } finally {
          setIsLoading(false);
        }
      }
    };

    // Only run once on mount
    completeMagicLinkSignIn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, toast]); // Add router and toast to dependencies

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (authMethod === 'password') {
      setIsLoading(true);
      try {
        if (!values.password) {
          toast({
            variant: 'destructive',
            title: 'Sign in failed',
            description: 'Password is required for this sign-in method.',
          });
          setIsLoading(false);
          return;
        }
        await signInWithEmailAndPassword(auth, values.email, values.password);
        router.push('/dashboard');
      } catch (error) {
        logger.error('Email/password sign in failed', error);
        toast({
          variant: 'destructive',
          title: 'Sign in failed',
          description: getErrorMessage(error),
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      handleMagicLink();
    }
  }

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);

      // Check if this is a new user (first time sign in)
      const isNewUser = result.user.metadata.creationTime === result.user.metadata.lastSignInTime;

      if (isNewUser) {
        // Check if user profile exists
        const { doc, getDoc } = await import('firebase/firestore');
        const { db } = await import('@/lib/firebase');
        const userDoc = await getDoc(doc(db, 'users', result.user.uid));

        if (!userDoc.exists() || !userDoc.data()?.profileCompleted) {
          router.push('/welcome');
        } else {
          router.push('/dashboard');
        }
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      logger.error('Google sign in failed', error);
      toast({
        variant: 'destructive',
        title: 'Google sign in failed',
        description: getErrorMessage(error),
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleMagicLink = async () => {
    const email = form.getValues('email');
    if (!email || !z.string().email().safeParse(email).success) {
      form.setError('email', { type: 'manual', message: 'Please enter a valid email.' });
      return;
    }

    setIsMagicLinkLoading(true);
    const actionCodeSettings = {
      // URL where the user will complete sign-in (must be authorized in Firebase Console)
      url: `${window.location.origin}/`,
      // This must be true for email link sign-in
      handleCodeInApp: true,
    };

    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem('emailForSignIn', email);
      toast({
        title: 'Check your email',
        description: `A sign-in link has been sent to ${email}.`,
      });
    } catch (error: unknown) {
      logger.error('Magic link send failed', {
        error,
        code: (error as { code?: string })?.code,
        message: (error as { message?: string })?.message,
        url: actionCodeSettings.url,
      });

      let errorMessage = getErrorMessage(error);

      // Provide more specific error messages
      if ((error as { code?: string })?.code === 'auth/invalid-continue-uri') {
        errorMessage = 'The redirect URL is not authorized. Please contact support.';
      } else if ((error as { code?: string })?.code === 'auth/unauthorized-continue-uri') {
        errorMessage = 'The domain is not authorized for OAuth operations.';
      } else if ((error as { code?: string })?.code === 'auth/operation-not-allowed') {
        errorMessage = 'Email link sign-in is not enabled. Please contact support.';
      }

      toast({
        variant: 'destructive',
        title: 'Magic link failed',
        description: errorMessage,
      });
    } finally {
      setIsMagicLinkLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Google Sign-in - Most prominent */}
      <Button
        variant="outline"
        className="h-12 w-full text-base"
        onClick={handleGoogleSignIn}
        disabled={isGoogleLoading}
        aria-label="Sign in with Google"
      >
        {isGoogleLoading ? (
          <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
        ) : (
          <GoogleIcon className="mr-2 h-5 w-5" aria-hidden="true" />
        )}
        Continue with Google
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card text-muted-foreground px-2">Or use email</span>
        </div>
      </div>

      {/* Email-based authentication */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="name@example.com"
                    type="email"
                    {...field}
                    aria-label="Email address"
                    aria-required="true"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Tabs
            value={authMethod}
            onValueChange={(value) => setAuthMethod(value as 'password' | 'magic')}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="password">Password</TabsTrigger>
              <TabsTrigger value="magic">Magic Link</TabsTrigger>
            </TabsList>

            <TabsContent value="password" className="mt-4 space-y-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Password</FormLabel>
                      <Button variant="link" asChild className="px-0 text-xs font-normal">
                        <a href="/forgot-password">Forgot password?</a>
                      </Button>
                    </div>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="remember"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-sm font-normal">Remember me for 30 days</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </TabsContent>

            <TabsContent value="magic" className="mt-4">
              <p className="text-muted-foreground text-sm">
                We'll email you a secure link to sign in instantly - no password needed!
              </p>
            </TabsContent>
          </Tabs>

          <Button type="submit" className="h-11 w-full" disabled={isLoading || isMagicLinkLoading}>
            {(isLoading || isMagicLinkLoading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {authMethod === 'password' ? 'Sign In' : 'Send Magic Link'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
