import { type NextRequest, NextResponse } from 'next/server';
import { profileService, registrationService } from '@/lib/services';
import { createClient } from '@/lib/supabase/server';
import { logApiError, createErrorResponse } from '@/lib/api-error-handler';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  let userId: string | undefined;
  let userRole: string | undefined;
  let programId: string | null = null;

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        {
          error: 'Unauthorized',
          code: 'UNAUTHORIZED',
          timestamp: new Date().toISOString(),
        },
        { status: 401 }
      );
    }

    userId = user.id;

    // Check if user is admin
    const profile = await profileService.getById(user.id);

    if (!profile) {
      return NextResponse.json(
        {
          error: 'Profile not found',
          code: 'NOT_FOUND',
          timestamp: new Date().toISOString(),
        },
        { status: 404 }
      );
    }

    userRole = profile.role;

    if (profile.role !== 'ADMIN' && profile.role !== 'INSTRUCTOR') {
      console.warn(
        `[ADMIN_STATS_GET] Access denied for user ${user.id} with role ${profile.role}`
      );

      return NextResponse.json(
        {
          error: 'Forbidden - Admin or Instructor role required',
          code: 'FORBIDDEN',
          timestamp: new Date().toISOString(),
        },
        { status: 403 }
      );
    }

    // Get program ID from query params
    const url = new URL(req.url);
    programId = url.searchParams.get('programId') || 'mathcounts-2025';

    // Get registration stats
    const stats = await registrationService.getStats(programId);

    console.log(
      `[ADMIN_STATS_GET] Admin ${user.id} retrieved stats for program ${programId}`
    );

    return NextResponse.json(stats, { status: 200 });
  } catch (error) {
    logApiError(error, {
      context: 'ADMIN_STATS_GET',
      userId,
      requestPath: req.url,
      requestMethod: 'GET',
      additionalData: {
        userRole,
        programId: programId || 'unknown',
      },
    });

    return createErrorResponse(error, { context: 'ADMIN_STATS_GET' });
  }
}