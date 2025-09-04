'use client';

import { zodResolver } from '@hookform/resolvers/zod';
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
import { useSupabaseAuth } from '@/hooks/use-supabase-auth';
import { useToast } from '@/hooks/use-toast';
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
  const supabaseAuth = useSupabaseAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isMagicLinkLoading, setIsMagicLinkLoading] = useState(false);
  const [authMethod, setAuthMethod] = useState<'password' | 'magic'>('password');
  // Magic-link email confirmation modal state (replaces window.prompt on iOS)
  const [showEmailConfirm, setShowEmailConfirm] = useState(false);
  const [emailForMagicLink, setEmailForMagicLink] = useState('');
  const [pendingMagicLinkUrl] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      remember: false,
    },
  });

  // With Supabase, redirects are handled via /auth/callback and middleware
  useEffect(() => {
    // If already authenticated, leave the page
    if (!supabaseAuth.loading && supabaseAuth.user) {
      router.push('/dashboard');
    }
  }, [router, supabaseAuth.loading, supabaseAuth.user]);

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
        const { error } = await supabaseAuth.signIn(values.email, values.password);
        if (error) throw error;
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
    try {
      const { error } = await supabaseAuth.signInWithGoogle();
      if (error) throw error;
      // Redirect handled by Supabase OAuth flow
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
    try {
      const { error } = await supabaseAuth.signInWithMagicLink(email);
      if (error) throw error;
      toast({
        title: 'Check your email',
        description: `A sign-in link has been sent to ${email}.`,
      });
    } catch (error: unknown) {
      logger.error('Magic link send failed', {
        error,
        message: (error as { message?: string })?.message,
      });

      const errorMessage = getErrorMessage(error);

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
                  const { error } = await supabaseAuth.signInWithMagicLink(email);
                  if (error) throw error;
                  setShowEmailConfirm(false);
                  toast({ title: 'Check your email', description: `Link sent to ${email}` });
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
