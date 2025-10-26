import { type NextRequest, NextResponse } from 'next/server';
import { waiverService, profileService } from '@/lib/services';
import { createClient } from '@/lib/supabase/server';
import { logApiError, createErrorResponse } from '@/lib/api-error-handler';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  let userId: string | undefined;
  let userRole: string | undefined;

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

    // Enforce admin auth
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
        `[ADMIN_WAIVERS_GET] Access denied for user ${user.id} with role ${profile.role}`
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

    const data = await waiverService.getAllStatuses();

    console.log(`[ADMIN_WAIVERS_GET] Admin ${user.id} retrieved ${data.length} waiver statuses`);

    return NextResponse.json({ students: data });
  } catch (error) {
    logApiError(error, {
      context: 'ADMIN_WAIVERS_GET',
      userId,
      requestPath: req.url,
      requestMethod: 'GET',
      additionalData: {
        userRole,
      },
    });

    return createErrorResponse(error, { context: 'ADMIN_WAIVERS_GET' });
  }
}
