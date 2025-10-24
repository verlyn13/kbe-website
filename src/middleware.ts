import { createServerClient } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';

// Track if Sentry has been initialized to avoid multiple initializations
let sentryInitialized = false;

/**
 * Initialize Sentry for server-side error tracking
 * This is a workaround for Next.js 15 instrumentation hook not being called on Vercel
 */
function initializeSentry() {
  if (sentryInitialized) {
    return;
  }

  // Only initialize in production
  if (process.env.NODE_ENV !== 'production') {
    console.log('[MIDDLEWARE] Skipping Sentry initialization in non-production environment');
    return;
  }

  try {
    console.log('[MIDDLEWARE] Initializing Sentry in middleware (workaround for instrumentation hook)');

    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      environment: process.env.NODE_ENV,
      enabled: true, // We already check for production above

      // Release tracking - use VERCEL_GIT_COMMIT_SHA or fallback
      release: process.env.VERCEL_GIT_COMMIT_SHA || process.env.SENTRY_RELEASE || 'dev',

      // SAFE FREE TIER: Very low sample rate for server performance
      tracesSampleRate: 0.05, // 5% of server transactions

      // Reduce breadcrumb noise
      maxBreadcrumbs: 30,

      // Always attach stack traces for better debugging
      attachStacktrace: true,

      // Ignore common server noise
      ignoreErrors: [
        // Network errors
        'ECONNRESET',
        'ECONNREFUSED',
        'ETIMEDOUT',
        'TimeoutError',
        'NetworkError',
        'Request aborted',

        // Common client disconnects
        'Client closed request',
        'Socket hang up',

        // Database connection errors (transient)
        'Connection terminated unexpectedly',
        'Connection lost',

        // Next.js dev noise
        'NEXT_NOT_FOUND',
        'NEXT_REDIRECT',
      ],

      // Filter before sending
      beforeSend(event, hint) {
        // Filter health check endpoints
        const url = event.request?.url || '';
        if (
          url.includes('/health') ||
          url.includes('/status') ||
          url.includes('/api/health') ||
          url.includes('/api/ping')
        ) {
          return null;
        }

        // Filter monitoring endpoints
        if (url.includes('/metrics') || url.includes('/prometheus')) {
          return null;
        }

        // Filter bot requests
        const userAgent = event.request?.headers?.['user-agent'] || '';
        const botPattern = /bot|crawler|spider|crawling|monitoring/i;
        if (botPattern.test(userAgent)) {
          return null;
        }

        return event;
      },
    });

    sentryInitialized = true;
    console.log('[MIDDLEWARE] Sentry initialized successfully via middleware workaround');
  } catch (error) {
    console.error('[MIDDLEWARE] Failed to initialize Sentry:', error);
  }
}

export async function middleware(request: NextRequest) {
  // Initialize Sentry on first request (workaround for instrumentation hook not working)
  initializeSentry();

  try {
    // If env is missing (e.g., during static build), skip auth checks gracefully
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !anon) {
      return NextResponse.next();
    }

    let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(url, anon, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          supabaseResponse.cookies.set(name, value, options);
        });
      },
    },
  });

  // Check if user is authenticated for protected routes
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Define protected routes
  const protectedRoutes = ['/dashboard', '/admin', '/profile', '/students'];
  const authRoutes = ['/login', '/signup'];

  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  const isAuthRoute = authRoutes.some((route) => request.nextUrl.pathname.startsWith(route));

  // Redirect to login if accessing protected route without auth
  if (isProtectedRoute && !user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/login';
    redirectUrl.searchParams.set('redirectedFrom', request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Redirect to dashboard if accessing auth routes while logged in
  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

    return supabaseResponse;
  } catch (error) {
    // Capture middleware errors to Sentry
    if (sentryInitialized) {
      Sentry.captureException(error, {
        tags: {
          location: 'middleware',
          path: request.nextUrl.pathname,
        },
      });
    }
    console.error('[MIDDLEWARE] Error in middleware:', error);

    // Return a basic response to prevent the app from crashing
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     *
     * NOTE: We DO want to run on API routes to ensure Sentry initializes
     * for server-side error tracking (workaround for instrumentation hook issue)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
