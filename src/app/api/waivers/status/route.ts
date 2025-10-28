import { type NextRequest, NextResponse } from 'next/server';
import { createErrorResponse, logApiError } from '@/lib/api-error-handler';
import { waiverService } from '@/lib/services';
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

    const statuses = await waiverService.getStatusesForGuardian(user.id);

    console.log(
      `[WAIVER_STATUS_GET] Retrieved ${statuses.length} waiver statuses for guardian ${user.id}`
    );

    return NextResponse.json({ students: statuses });
  } catch (error) {
    logApiError(error, {
      context: 'WAIVER_STATUS_GET',
      userId,
      requestPath: req.url,
      requestMethod: 'GET',
    });

    return createErrorResponse(error, { context: 'WAIVER_STATUS_GET' });
  }
}
