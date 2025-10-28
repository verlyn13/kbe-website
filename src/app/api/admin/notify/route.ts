import { type NextRequest, NextResponse } from 'next/server';
import { createErrorResponse, logApiError } from '@/lib/api-error-handler';
import { profileService } from '@/lib/services';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  let userId: string | undefined;
  let userRole: string | undefined;
  let notificationType: string | undefined;

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
      console.warn(`[ADMIN_NOTIFY] Access denied for user ${user.id} with role ${profile.role}`);

      return NextResponse.json(
        {
          error: 'Forbidden - Admin or Instructor role required',
          code: 'FORBIDDEN',
          timestamp: new Date().toISOString(),
        },
        { status: 403 }
      );
    }

    const body = await req.json();
    notificationType = body.type || 'unknown';

    // Log the notification for now
    // In production, this would send an email, create a notification record, etc.
    console.log(
      `[ADMIN_NOTIFY] Admin ${user.id} triggered notification of type '${notificationType}'`,
      {
        timestamp: new Date().toISOString(),
        userId: user.id,
        userEmail: user.email,
        userRole: profile.role,
        ...body,
      }
    );

    // TODO: Implement actual notification system
    // Options:
    // 1. Send email to admin
    // 2. Create notification record in database
    // 3. Send to webhook/Slack/Discord
    // 4. Add to admin dashboard notification feed

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    logApiError(error, {
      context: 'ADMIN_NOTIFY',
      userId,
      requestPath: req.url,
      requestMethod: 'POST',
      additionalData: {
        userRole,
        notificationType,
      },
    });

    return createErrorResponse(error, { context: 'ADMIN_NOTIFY' });
  }
}
