'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Mail, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

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
import { Separator } from '@/components/ui/separator';
import { useSupabaseAuth } from '@/hooks/use-supabase-auth';
import { useToast } from '@/hooks/use-toast';
import { getErrorMessage } from '@/lib/error-utils';
import { logger } from '@/lib/logger';
import { emailSchema } from '@/lib/validation';
import { createClient } from '@/lib/supabase/client';

// Form schemas for different steps
const emailFormSchema = z.object({
  email: emailSchema,
});

const signUpFormSchema = z.object({
  email: emailSchema,
  name: z.string().min(2, 'Please enter your full name'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const signInFormSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Please enter your password'),
});

type AuthStep = 'email' | 'sign-up' | 'sign-in';

interface AuthState {
  step: AuthStep;
  email: string;
  isExistingUser: boolean;
}

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24">
      <title>Google</title>
      <path
        fill="currentColor"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="currentColor"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="currentColor"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="currentColor"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

/**
 * Intelligent authentication form that uses email-first flow
 * to automatically route users to sign-in or sign-up
 */
export function IntelligentAuthForm() {
  const router = useRouter();
  const { toast } = useToast();
  const supabaseAuth = useSupabaseAuth();
  const [authState, setAuthState] = useState<AuthState>({
    step: 'email',
    email: '',
    isExistingUser: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  // Email form for initial step
  const emailForm = useForm<z.infer<typeof emailFormSchema>>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: { email: '' },
  });

  // Sign-up form
  const signUpForm = useForm<z.infer<typeof signUpFormSchema>>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      email: authState.email,
      name: '',
      password: '',
    },
  });

  // Sign-in form
  const signInForm = useForm<z.infer<typeof signInFormSchema>>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: authState.email,
      password: '',
    },
  });

  const checkEmailExists = async (email: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.toLowerCase().trim() }),
      });
      
      if (!response.ok) {
        console.error('Email check failed:', response.statusText);
        return false;
      }
      
      const { exists } = await response.json();
      return exists === true;
    } catch (error) {
      console.error('Email check error:', error);
      // Fallback: assume email doesn't exist for security
      return false;
    }
  };

  const handleEmailSubmit = async (values: z.infer<typeof emailFormSchema>) => {
    setIsLoading(true);
    try {
      const exists = await checkEmailExists(values.email);
      
      setAuthState({
        step: exists ? 'sign-in' : 'sign-up',
        email: values.email,
        isExistingUser: exists,
      });

      // Pre-populate forms
      if (exists) {
        signInForm.setValue('email', values.email);
      } else {
        signUpForm.setValue('email', values.email);
      }
    } catch (error) {
      logger.error('Error checking email', error);
      toast({
        variant: 'destructive',
        title: 'Something went wrong',
        description: 'Please try again or contact support if the problem continues.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (values: z.infer<typeof signUpFormSchema>) => {
    setIsLoading(true);
    try {
      const { error } = await supabaseAuth.signUp(values.email, values.password, values.name);
      if (error) throw error;

      toast({
        title: '✅ Account Created!',
        description: 'Taking you to your dashboard...',
      });
      
      // Redirect after successful signup
      setTimeout(() => router.push('/dashboard'), 1500);
    } catch (error) {
      logger.error('Sign up failed', error);
      toast({
        variant: 'destructive',
        title: 'Account creation failed',
        description: getErrorMessage(error),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (values: z.infer<typeof signInFormSchema>) => {
    setIsLoading(true);
    try {
      const { error } = await supabaseAuth.signIn(values.email, values.password);
      if (error) throw error;

      toast({
        title: '✅ Signed In!',
        description: 'Taking you to your dashboard...',
      });
      
      setTimeout(() => router.push('/dashboard'), 1500);
    } catch (error) {
      logger.error('Sign in failed', error);
      toast({
        variant: 'destructive',
        title: 'Sign in failed',
        description: 'Please check your password and try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMagicLink = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabaseAuth.signInWithMagicLink(authState.email);
      if (error) throw error;

      toast({
        title: '📧 Check your email',
        description: `We sent a secure sign-in link to ${authState.email}. Click it to sign in instantly.`,
      });
    } catch (error) {
      logger.error('Magic link failed', error);
      toast({
        variant: 'destructive',
        title: 'Could not send sign-in link',
        description: 'Please try again or use your password instead.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabaseAuth.signInWithGoogle();
      if (error) throw error;
      // OAuth redirect handles the rest
    } catch (error) {
      logger.error('Google sign in failed', error);
      toast({
        variant: 'destructive',
        title: 'Google sign in failed',
        description: 'Please try again or use email instead.',
      });
      setIsLoading(false);
    }
  };

  const resetFlow = () => {
    setAuthState({ step: 'email', email: '', isExistingUser: false });
    emailForm.reset();
    signUpForm.reset();
    signInForm.reset();
  };

  // Email step
  if (authState.step === 'email') {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold">Let's get you started</h1>
          <p className="text-muted-foreground">
            Enter your email to continue
          </p>
        </div>

        <Form {...emailForm}>
          <form onSubmit={emailForm.handleSubmit(handleEmailSubmit)} className="space-y-4">
            <FormField
              control={emailForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email address</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="parent@email.com"
                      disabled={isLoading}
                      className="h-12 text-base"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full h-12" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Continue with Email
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>
        </Form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <Button
            variant="outline"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="h-12"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <GoogleIcon className="w-4 h-4 mr-2" />
                Continue with Google
              </>
            )}
          </Button>
        </div>
      </div>
    );
  }

  // Sign-up step
  if (authState.step === 'sign-up') {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold">Welcome! Let's create your account</h1>
          <p className="text-sm text-muted-foreground">
            Using: <span className="font-medium">{authState.email}</span>
          </p>
        </div>

        <Form {...signUpForm}>
          <form onSubmit={signUpForm.handleSubmit(handleSignUp)} className="space-y-4">
            <FormField
              control={signUpForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email address</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" disabled className="h-12 bg-muted" />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={signUpForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your full name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="John Smith"
                      disabled={isLoading}
                      className="h-12 text-base"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={signUpForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Create a password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="8+ characters, 1 number"
                      disabled={isLoading}
                      className="h-12 text-base"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full h-12" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'Create My Account'
              )}
            </Button>
          </form>
        </Form>

        <div className="text-center">
          <Button variant="link" onClick={resetFlow} className="text-sm">
            Use a different email address
          </Button>
        </div>
      </div>
    );
  }

  // Sign-in step
  if (authState.step === 'sign-in') {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold">Welcome back!</h1>
          <p className="text-sm text-muted-foreground">
            Signing in as: <span className="font-medium">{authState.email}</span>
          </p>
        </div>

        <Form {...signInForm}>
          <form onSubmit={signInForm.handleSubmit(handleSignIn)} className="space-y-4">
            <FormField
              control={signInForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email address</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" disabled className="h-12 bg-muted" />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={signInForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Enter your password"
                      disabled={isLoading}
                      className="h-12 text-base"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full h-12" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
        </Form>

        <div className="space-y-3">
          <div className="text-center">
            <Button variant="link" onClick={handleMagicLink} disabled={isLoading} className="text-sm">
              <Mail className="w-4 h-4 mr-2" />
              Email me a sign-in link instead
            </Button>
          </div>
          
          <div className="text-center">
            <Button variant="link" onClick={resetFlow} className="text-sm">
              Use a different email address
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}