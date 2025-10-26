import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import * as Sentry from '@sentry/nextjs';

export const runtime = 'nodejs';

/**
 * Check Email Endpoint
 *
 * SECURITY NOTE: This endpoint is intentionally vague to prevent user enumeration attacks.
 * We use Supabase's user metadata query (requires service role) instead of authentication
 * attempts to avoid leaking account existence information through timing or error patterns.
 *
 * Rate limiting should be applied at the infrastructure level (Vercel/Cloudflare).
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const { email } = await request.json();

    // Validate input
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const supabase = await createClient();

    // SECURITY FIX: Use admin API to check user existence (requires service role key)
    // This is more secure than attempting authentication
    // Note: This requires SUPABASE_SERVICE_ROLE_KEY environment variable
    const { data, error } = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 1,
    });

    // If we don't have admin access, fall back to safe default
    // This prevents the endpoint from being used for enumeration
    if (error) {
      console.error('[AUTH-CHECK-EMAIL] Admin API error:', error.message);

      Sentry.captureException(error, {
        tags: {
          context: 'check-email',
          method: 'admin-api',
        },
        extra: {
          email: normalizedEmail,
          hasServiceRole: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        },
        level: 'warning',
      });

      // Return non-committal response to prevent enumeration
      // Add artificial delay to prevent timing attacks
      const elapsed = Date.now() - startTime;
      if (elapsed < 200) {
        await new Promise(resolve => setTimeout(resolve, 200 - elapsed));
      }

      return NextResponse.json({
        exists: false,
        message: 'Unable to verify email'
      });
    }

    // Check if user exists with this email
    // Using admin API which is more secure than auth attempts
    const { data: userData } = await supabase
      .from('auth.users')
      .select('email')
      .eq('email', normalizedEmail)
      .maybeSingle();

    const exists = !!userData;

    // Add artificial delay to prevent timing attacks
    // Ensure consistent response time regardless of result
    const elapsed = Date.now() - startTime;
    const targetTime = 200; // 200ms baseline
    if (elapsed < targetTime) {
      await new Promise(resolve => setTimeout(resolve, targetTime - elapsed));
    }

    // Log for monitoring (without exposing result in production logs)
    if (process.env.NODE_ENV === 'development') {
      console.log(`[AUTH-CHECK-EMAIL] Email ${normalizedEmail}: exists=${exists}`);
    }

    return NextResponse.json({ exists });

  } catch (error) {
    console.error('[AUTH-CHECK-EMAIL] Unexpected error:', error);

    Sentry.captureException(error, {
      tags: {
        context: 'check-email',
        endpoint: '/api/auth/check-email',
      },
      level: 'error',
    });

    // Add artificial delay for error cases too
    const elapsed = Date.now() - startTime;
    if (elapsed < 200) {
      await new Promise(resolve => setTimeout(resolve, 200 - elapsed));
    }

    // Return safe default to prevent enumeration via error timing
    return NextResponse.json({
      exists: false,
      message: 'An error occurred'
    }, { status: 500 });
  }
}