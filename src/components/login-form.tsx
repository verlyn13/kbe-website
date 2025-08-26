'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  GoogleAuthProvider,
  getRedirectResult,
  isSignInWithEmailLink,
  sendSignInLinkToEmail,
  signInWithEmailAndPassword,
  signInWithEmailLink,
  signInWithPopup,
  signInWithRedirect,
} from 'firebase/auth';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
  // Magic-link email confirmation modal state (replaces window.prompt on iOS)
  const [showEmailConfirm, setShowEmailConfirm] = useState(false);
  const [emailForMagicLink, setEmailForMagicLink] = useState('');
  const [pendingMagicLinkUrl, setPendingMagicLinkUrl] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      remember: false,
    },
  });

  // OAuth redirect handler - runs unconditionally on mount
  useEffect(() => {
    const checkRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result?.user) {
          // Check if this is a new user
          const isNewUser =
            result.user.metadata.creationTime === result.user.metadata.lastSignInTime;

          if (isNewUser) {
            // Check if profile is completed
            const { doc, getDoc } = await import('firebase/firestore');
            const { db } = await import('@/lib/firebase');
            const profileDoc = await getDoc(doc(db, 'profiles', result.user.uid));
            if (!profileDoc.exists() || !profileDoc.data()?.profileCompleted) {
              router.push('/welcome');
              return;
            }
          }

          // Immediately leave the login page
          router.push('/dashboard');
          return;
        } else {
          // Check if user is already signed in
          if (auth.currentUser) {
            router.push('/dashboard');
          }
        }
      } catch (error: any) {
        // Silently handle popup cancellation errors
        if (error.code !== 'auth/popup-closed-by-user') {
          logger.error('OAuth redirect error', error);
        }
      }
    };

    checkRedirectResult();
  }, [router]); // Runs on every mount

  // SECONDARY: Handle magic links (only if not redirected above)
  useEffect(() => {
    const completeMagicLinkSignIn = async () => {
      if (isSignInWithEmailLink(auth, window.location.href)) {
        setIsLoading(true);
        const email = window.localStorage.getItem('emailForSignIn');

        if (!email) {
          // Store URL and request email via modal to avoid window.prompt (iOS restrictions)
          setPendingMagicLinkUrl(window.location.href);
          setShowEmailConfirm(true);
          setIsLoading(false);
          return;
        }

        try {
          const userCredential = await signInWithEmailLink(auth, email, window.location.href);
          window.localStorage.removeItem('emailForSignIn');

          // Check if new user needs welcome flow
          const isNewUser =
            userCredential.user.metadata.creationTime ===
            userCredential.user.metadata.lastSignInTime;

          if (isNewUser) {
            router.push('/welcome');
          } else {
            router.push('/dashboard');
          }
        } catch (error) {
          logger.error('Magic link sign in failed', error);
          toast({
            variant: 'destructive',
            title: 'Magic link sign in failed',
            description: getErrorMessage(error),
          });
        } finally {
          setIsLoading(false);
        }
      }
    };

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
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

      if (isMobile) {
        await signInWithRedirect(auth, provider);
        return; // Result is handled by getRedirectResult on mount
      }

      const result = await signInWithPopup(auth, provider);
      const isNewUser = result.user.metadata.creationTime === result.user.metadata.lastSignInTime;
      await (async () => {
        if (isNewUser) {
          const { doc, getDoc } = await import('firebase/firestore');
          const { db } = await import('@/lib/firebase');
          const profileDoc = await getDoc(doc(db, 'profiles', result.user.uid));
          if (!profileDoc.exists() || !profileDoc.data()?.profileCompleted) {
            router.push('/welcome');
            return;
          }
        }
        router.push('/dashboard');
      })();
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

  const handleMagicLink = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const email = form.getValues('email');
    if (!email || !z.string().email().safeParse(email).success) {
      form.setError('email', { type: 'manual', message: 'Please enter a valid email.' });
      return;
    }

    setIsMagicLinkLoading(true);
    const actionCodeSettings = {
      // URL where the user will complete sign-in (must be authorized in Firebase Console)
      url: `${window.location.origin}/login`,
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
      {/* Email confirmation dialog for magic-link completion (iOS-safe) */}
      <Dialog open={showEmailConfirm} onOpenChange={setShowEmailConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm your email</DialogTitle>
            <DialogDescription>
              To complete sign-in, please confirm the email address where you received the link.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              type="email"
              placeholder="name@example.com"
              value={emailForMagicLink}
              onChange={(e) => setEmailForMagicLink(e.target.value)}
              aria-label="Email address for magic link"
            />
          </div>
          <DialogFooter>
            <Button
              onClick={async () => {
                const email = emailForMagicLink.trim();
                if (!z.string().email().safeParse(email).success || !pendingMagicLinkUrl) {
                  toast({
                    variant: 'destructive',
                    title: 'Invalid email',
                    description: 'Please enter a valid email address.',
                  });
                  return;
                }
                try {
                  setIsLoading(true);
                  const cred = await signInWithEmailLink(auth, email, pendingMagicLinkUrl);
                  window.localStorage.removeItem('emailForSignIn');
                  setShowEmailConfirm(false);
                  const isNewUser =
                    cred.user.metadata.creationTime === cred.user.metadata.lastSignInTime;
                  await (async () => {
                    if (isNewUser) {
                      const { doc, getDoc } = await import('firebase/firestore');
                      const { db } = await import('@/lib/firebase');
                      const profileDoc = await getDoc(doc(db, 'profiles', cred.user.uid));
                      if (!profileDoc.exists() || !profileDoc.data()?.profileCompleted) {
                        router.push('/welcome');
                        return;
                      }
                    }
                    router.push('/dashboard');
                  })();
                } catch (error) {
                  logger.error('Magic link sign in failed (modal)', error as any);
                  toast({
                    variant: 'destructive',
                    title: 'Magic link sign in failed',
                    description: getErrorMessage(error),
                  });
                } finally {
                  setIsLoading(false);
                }
              }}
            >
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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

          <Button
            type={authMethod === 'password' ? 'submit' : 'button'}
            className="h-11 w-full"
            disabled={isLoading || isMagicLinkLoading}
            onClick={authMethod === 'magic' ? () => handleMagicLink() : undefined}
          >
            {(isLoading || isMagicLinkLoading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {authMethod === 'password' ? 'Sign In' : 'Send Magic Link'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
