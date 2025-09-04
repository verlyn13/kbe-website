'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
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

const formSchema = z.object({
  email: emailSchema,
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
 * Unified authentication form that handles both sign-in and sign-up
 * with a streamlined, unidirectional flow.
 */
export function UnifiedAuthForm() {
  const router = useRouter();
  const { toast } = useToast();
  const supabaseAuth = useSupabaseAuth();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isMagicLinkLoading, setIsMagicLinkLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

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

  const handleMagicLink = async (values: z.infer<typeof formSchema>) => {
    setIsMagicLinkLoading(true);
    try {
      const { error } = await supabaseAuth.signInWithMagicLink(values.email);
      if (error) throw error;

      toast({
        title: 'Check your email',
        description: `We sent a secure sign-in link to ${values.email}. Click it to sign in or create your account automatically.`,
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
      {/* Primary CTA: Google Sign-in */}
      <Button
        variant="outline"
        className="h-12 w-full text-base"
        onClick={handleGoogleSignIn}
        disabled={isGoogleLoading}
        aria-label="Continue with Google"
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
          <Separator />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card text-muted-foreground px-2">Or with email</span>
        </div>
      </div>

      {/* Email-based magic link */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleMagicLink)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
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

          <Button type="submit" className="h-11 w-full" disabled={isMagicLinkLoading}>
            {isMagicLinkLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Send Magic Link
          </Button>
        </form>
      </Form>

      <div className="text-center">
        <p className="text-muted-foreground text-sm">
          We'll sign you in or create your account automatically.
        </p>
        <p className="text-muted-foreground text-xs mt-1">
          No passwords needed – just click the link in your email.
        </p>
      </div>

      {/* Alternative auth methods */}
      <div className="border-t pt-4 text-center">
        <p className="text-muted-foreground text-xs mb-2">Need to use a password instead?</p>
        <div className="flex gap-2 justify-center">
          <Button variant="ghost" size="sm" asChild>
            <a href="/login" className="text-xs">
              Sign In
            </a>
          </Button>
          <span className="text-muted-foreground text-xs">•</span>
          <Button variant="ghost" size="sm" asChild>
            <a href="/signup" className="text-xs">
              Create Account
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
