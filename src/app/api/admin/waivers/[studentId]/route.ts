import { type NextRequest, NextResponse } from 'next/server';
import { createErrorResponse, logApiError } from '@/lib/api-error-handler';
import { profileService, waiverService } from '@/lib/services';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

export async function PATCH(req: NextRequest, context: { params: Promise<{ studentId: string }> }) {
  let userId: string | undefined;
  let userRole: string | undefined;
  let studentId: string | undefined;

  try {
    const params = await context.params;
    studentId = params.studentId;

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
        `[ADMIN_WAIVER_UPDATE] Access denied for user ${user.id} with role ${profile.role}`
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

    const body = (await req.json()) as { status: 'pending' | 'received' | 'rejected' };

    if (!body?.status) {
      return NextResponse.json(
        {
          error: 'Missing required fields',
          code: 'VALIDATION_ERROR',
          details: { missing: ['status'] },
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    const updated = await waiverService.setStatus(params.studentId, body.status);

    console.log(
      `[ADMIN_WAIVER_UPDATE] Admin ${user.id} updated waiver for student ${params.studentId} to ${body.status}`
    );

    return NextResponse.json({ student: updated });
  } catch (error) {
    logApiError(error, {
      context: 'ADMIN_WAIVER_UPDATE',
      userId,
      requestPath: req.url,
      requestMethod: 'PATCH',
      additionalData: {
        userRole,
        studentId,
      },
    });

    return createErrorResponse(error, { context: 'ADMIN_WAIVER_UPDATE' });
  }
}
