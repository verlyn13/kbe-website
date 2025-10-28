import { type NextRequest, NextResponse } from 'next/server';
import { createErrorResponse, logApiError } from '@/lib/api-error-handler';
import { profileService } from '@/lib/services';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  let userId: string | undefined;

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

    const profile = await profileService.getById(user.id);

    if (!profile) {
      // User exists in auth but not in database - this is fine for new users
      console.log(`[PROFILE_GET] No profile found for user ${user.id} (new user)`);
      return NextResponse.json({ profile: null }, { status: 200 });
    }

    console.log(`[PROFILE_GET] Retrieved profile for user ${user.id}`);

    return NextResponse.json({ profile }, { status: 200 });
  } catch (error) {
    logApiError(error, {
      context: 'PROFILE_GET',
      userId,
      requestPath: req.url,
      requestMethod: 'GET',
    });

    return createErrorResponse(error, { context: 'PROFILE_GET' });
  }
}

export async function POST(req: NextRequest) {
  let userId: string | undefined;

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

    const body = await req.json();
    const { name, phone, email } = body;

    // Validate required fields
    const missingFields: string[] = [];
    if (!name) missingFields.push('name');
    if (!email) missingFields.push('email');

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

    // First sync with auth to handle ID migration if needed
    await profileService.syncWithAuth({
      id: user.id,
      email: user.email!,
      user_metadata: {
        name: name,
        phone: phone ? phone.replace(/\D/g, '') : undefined,
      },
    });

    // Then update the profile with the form data
    const profile = await profileService.update(user.id, {
      name: name,
      phone: phone ? phone.replace(/\D/g, '') : undefined,
    });

    console.log(`[PROFILE_CREATE] Created/updated profile for user ${user.id}`);

    return NextResponse.json({ profile }, { status: 200 });
  } catch (error) {
    logApiError(error, {
      context: 'PROFILE_CREATE',
      userId,
      requestPath: req.url,
      requestMethod: 'POST',
    });

    return createErrorResponse(error, { context: 'PROFILE_CREATE' });
  }
}

export async function PUT(req: NextRequest) {
  let userId: string | undefined;

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

    const body = await req.json();
    const { name, phone } = body;

    // Update existing profile
    const profile = await profileService.update(user.id, {
      name,
      phone: phone ? phone.replace(/\D/g, '') : undefined,
    });

    console.log(`[PROFILE_UPDATE] Updated profile for user ${user.id}`);

    return NextResponse.json({ profile }, { status: 200 });
  } catch (error) {
    logApiError(error, {
      context: 'PROFILE_UPDATE',
      userId,
      requestPath: req.url,
      requestMethod: 'PUT',
    });

    return createErrorResponse(error, { context: 'PROFILE_UPDATE' });
  }
}
