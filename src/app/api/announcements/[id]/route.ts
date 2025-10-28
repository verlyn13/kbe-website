import { type NextRequest, NextResponse } from 'next/server';
import { createErrorResponse, logApiError } from '@/lib/api-error-handler';
import { announcementService, profileService } from '@/lib/services';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  let userId: string | undefined;
  let userRole: string | undefined;
  let announcementId: string | undefined;

  try {
    const params = await context.params;
    announcementId = params.id;

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
        `[ANNOUNCEMENT_UPDATE] Access denied for user ${user.id} with role ${profile.role}`
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

    const body = await req.json();
    const { title, content, priority, expiresAt, status, pinned } = body;

    // Update the announcement
    const announcement = await announcementService.update(announcementId, {
      title,
      content,
      priority,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
    });

    console.log(`[ANNOUNCEMENT_UPDATE] Admin ${user.id} updated announcement ${announcementId}`);

    return NextResponse.json(announcement, { status: 200 });
  } catch (error) {
    logApiError(error, {
      context: 'ANNOUNCEMENT_UPDATE',
      userId,
      requestPath: req.url,
      requestMethod: 'PUT',
      additionalData: {
        userRole,
        announcementId,
      },
    });

    return createErrorResponse(error, { context: 'ANNOUNCEMENT_UPDATE' });
  }
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  let userId: string | undefined;
  let userRole: string | undefined;
  let announcementId: string | undefined;

  try {
    const params = await context.params;
    announcementId = params.id;

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
        `[ANNOUNCEMENT_DELETE] Access denied for user ${user.id} with role ${profile.role}`
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

    // Delete the announcement
    await announcementService.delete(announcementId);

    console.log(`[ANNOUNCEMENT_DELETE] Admin ${user.id} deleted announcement ${announcementId}`);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    logApiError(error, {
      context: 'ANNOUNCEMENT_DELETE',
      userId,
      requestPath: req.url,
      requestMethod: 'DELETE',
      additionalData: {
        userRole,
        announcementId,
      },
    });

    return createErrorResponse(error, { context: 'ANNOUNCEMENT_DELETE' });
  }
}
