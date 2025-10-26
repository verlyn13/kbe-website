import { type NextRequest, NextResponse } from 'next/server';
import { profileService } from '@/lib/services';
import { createClient } from '@/lib/supabase/server';
import { logApiError, createErrorResponse } from '@/lib/api-error-handler';

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

    const isComplete = await profileService.isProfileComplete(user.id);

    console.log(`[PROFILE_STATUS_GET] User ${user.id} profile complete: ${isComplete}`);

    return NextResponse.json({ complete: isComplete }, { status: 200 });
  } catch (error) {
    logApiError(error, {
      context: 'PROFILE_STATUS_GET',
      userId,
      requestPath: req.url,
      requestMethod: 'GET',
    });

    return createErrorResponse(error, { context: 'PROFILE_STATUS_GET' });
  }
}
