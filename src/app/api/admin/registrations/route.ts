import { type NextRequest, NextResponse } from 'next/server';
import { profileService, registrationService } from '@/lib/services';
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
        `[ADMIN_REGISTRATIONS_GET] Access denied for user ${user.id} with role ${profile.role}`
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

    // Get all registrations
    const registrations = await registrationService.getAll();

    console.log(
      `[ADMIN_REGISTRATIONS_GET] Retrieved ${registrations.length} registrations for admin ${user.id}`
    );

    return NextResponse.json(registrations, { status: 200 });
  } catch (error) {
    logApiError(error, {
      context: 'ADMIN_REGISTRATIONS_GET',
      userId,
      requestPath: req.url,
      requestMethod: 'GET',
      additionalData: {
        userRole,
      },
    });

    return createErrorResponse(error, { context: 'ADMIN_REGISTRATIONS_GET' });
  }
}

export async function PUT(req: NextRequest) {
  let userId: string | undefined;
  let userRole: string | undefined;
  let registrationId: string | undefined;

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
        `[ADMIN_REGISTRATIONS_UPDATE] Access denied for user ${user.id} with role ${profile.role}`
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
    const { id, status } = body;

    // Validate required fields
    const missingFields: string[] = [];
    if (!id) missingFields.push('id');
    if (!status) missingFields.push('status');

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          error: 'Missing required fields',
          code: 'VALIDATION_ERROR',
          details: { missing: missingFields },
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    registrationId = id;

    // Update registration status
    const updated = await registrationService.updateStatus(id, status);

    console.log(
      `[ADMIN_REGISTRATIONS_UPDATE] Admin ${user.id} updated registration ${id} to status ${status}`
    );

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    logApiError(error, {
      context: 'ADMIN_REGISTRATIONS_UPDATE',
      userId,
      requestPath: req.url,
      requestMethod: 'PUT',
      additionalData: {
        userRole,
        registrationId,
      },
    });

    return createErrorResponse(error, { context: 'ADMIN_REGISTRATIONS_UPDATE' });
  }
}