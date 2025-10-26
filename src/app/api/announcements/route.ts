import { type NextRequest, NextResponse } from 'next/server';
import { announcementService } from '@/lib/services';
import { logApiError, createErrorResponse } from '@/lib/api-error-handler';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    const announcements = await announcementService.getAll();

    console.log(`[ANNOUNCEMENTS_GET] Retrieved ${announcements.length} announcements`);

    return NextResponse.json(announcements);
  } catch (error) {
    logApiError(error, {
      context: 'ANNOUNCEMENTS_GET',
      requestPath: req.url,
      requestMethod: 'GET',
    });

    return createErrorResponse(error, { context: 'ANNOUNCEMENTS_GET' });
  }
}