'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { Mail, Loader2 } from 'lucide-react';
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
} from 'firebase/auth';
import { auth } from '@/lib/firebase-config';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { getErrorMessage } from '@/lib/error-utils';
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
        isMagicLink: isSignInWithEmailLink(auth, window.location.href)
      });
      
      if (isSignInWithEmailLink(auth, window.location.href)) {
        setIsLoading(true);
        let email = window.localStorage.getItem('emailForSignIn');
        
        logger.info('Magic link detected, attempting sign in', { 
          emailFromStorage: email ? 'found' : 'not found'
        });
        
        if (!email) {
          email = window.prompt('Please provide your email for confirmation');
        }
        try {
          if (email) {
            await signInWithEmailLink(auth, email, window.location.href);
            window.localStorage.removeItem('emailForSignIn');
            logger.info('Magic link sign in successful');
            router.push('/dashboard');
          }
        } catch (error: any) {
          logger.error('Magic link sign in failed', {
            error,
            code: error?.code,
            message: error?.message,
            email,
            url: window.location.href
          });
          
          let errorMessage = getErrorMessage(error);
          
          // Provide more specific error messages for sign-in
          if (error?.code === 'auth/invalid-action-code') {
            errorMessage = 'This sign-in link is invalid, expired, or has already been used.';
          } else if (error?.code === 'auth/user-disabled') {
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
  }, []); // Remove dependencies to prevent multiple calls

  async function onSubmit(values: z.infer<typeof formSchema>) {
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
  }

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push('/dashboard');
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
      // Optional: iOS and Android settings for future mobile apps
      // iOS: {
      //   bundleId: 'com.kbe.website'
      // },
      // android: {
      //   packageName: 'com.kbe.website',
      //   installApp: false,
      //   minimumVersion: '12'
      // },
      // Optional: Use custom domain for links (if configured)
      // dynamicLinkDomain: 'kbewebsite.page.link' // Deprecated - don't use
    };

    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem('emailForSignIn', email);
      toast({
        title: 'Check your email',
        description: `A sign-in link has been sent to ${email}.`,
      });
    } catch (error: any) {
      logger.error('Magic link send failed', {
        error,
        code: error?.code,
        message: error?.message,
        url: actionCodeSettings.url,
      });
      
      let errorMessage = getErrorMessage(error);
      
      // Provide more specific error messages
      if (error?.code === 'auth/invalid-continue-uri') {
        errorMessage = 'The redirect URL is not authorized. Please contact support.';
      } else if (error?.code === 'auth/unauthorized-continue-uri') {
        errorMessage = 'The domain is not authorized for OAuth operations.';
      } else if (error?.code === 'auth/operation-not-allowed') {
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
    <div className="grid gap-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading}
            aria-label="Sign in with Google"
          >
            {isGoogleLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <GoogleIcon className="mr-2 h-4 w-4" aria-hidden="true" />
            )}
            Sign in with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card text-muted-foreground px-2">Or</span>
            </div>
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="name@example.com"
                    {...field}
                    aria-label="Email address"
                    aria-required="true"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 gap-2">
            <Button
              variant="outline"
              onClick={handleMagicLink}
              disabled={isMagicLinkLoading}
              aria-label="Send magic link to your email"
            >
              {isMagicLinkLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <Mail className="mr-2 h-4 w-4" aria-hidden="true" />
              )}
              Use magic link
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card text-muted-foreground px-2">Or</span>
            </div>
          </div>

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center">
                  <FormLabel>Password</FormLabel>
                  <Button variant="link" asChild className="ml-auto text-xs font-normal">
                    <a href="#">Forgot password?</a>
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
                  <FormLabel className="font-normal">Remember me for 30 days</FormLabel>
                </div>
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign In with Password
          </Button>
        </form>
      </Form>
    </div>
  );
}
