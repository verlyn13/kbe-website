import { type NextRequest, NextResponse } from 'next/server';
import { announcementService } from '@/lib/services';
import { logApiError } from '@/lib/api-error-handler';

export const runtime = 'nodejs';

/**
 * Cron job to archive expired announcements
 * Runs daily at 2 AM UTC (defined in vercel.json)
 */
export async function GET(req: NextRequest) {
  try {
    // Verify this is a Vercel Cron request
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      console.warn('[CRON_ARCHIVE] Unauthorized cron request attempt');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('[CRON_ARCHIVE] Starting expired announcements archival');

    const archivedCount = await announcementService.archiveExpired();

    console.log(`[CRON_ARCHIVE] Archived ${archivedCount} expired announcements`);

    return NextResponse.json({
      success: true,
      archivedCount,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[CRON_ARCHIVE] Error archiving expired announcements:', error);
    logApiError(error, {
      context: 'CRON_ARCHIVE_EXPIRED',
      requestPath: req.url,
      requestMethod: 'GET',
    });

    return NextResponse.json(
      {
        error: 'Failed to archive expired announcements',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
