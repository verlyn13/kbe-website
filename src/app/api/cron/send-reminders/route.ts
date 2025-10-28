import { type NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendAnnouncementEmail } from '@/lib/sendgrid-email-service';
import { logApiError } from '@/lib/api-error-handler';

export const runtime = 'nodejs';

/**
 * Cron job to send event reminders
 * Runs daily at 9 AM UTC (defined in vercel.json)
 */
export async function GET(req: NextRequest) {
  try {
    // Verify this is a Vercel Cron request
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      console.warn('[CRON_REMINDERS] Unauthorized cron request attempt');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('[CRON_REMINDERS] Starting daily reminder checks');

    // Get programs starting tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const dayAfterTomorrow = new Date(tomorrow);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

    const upcomingPrograms = await prisma.program.findMany({
      where: {
        startDate: {
          gte: tomorrow,
          lt: dayAfterTomorrow,
        },
      },
      include: {
        registrations: {
          include: {
            user: {
              select: {
                email: true,
                name: true,
              },
            },
            student: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    let remindersSent = 0;

    for (const program of upcomingPrograms) {
      // Get unique user emails from registrations
      const userEmails = Array.from(
        new Set(program.registrations.map(r => r.user.email))
      );

      if (userEmails.length > 0) {
        try {
          await sendAnnouncementEmail(
            userEmails,
            `Reminder: ${program.name} starts tomorrow`,
            `This is a friendly reminder that ${program.name} begins tomorrow at ${program.startDate.toLocaleTimeString()}.\n\nWe look forward to seeing you there!`
          );
          remindersSent += userEmails.length;
          console.log(`[CRON_REMINDERS] Sent ${userEmails.length} reminders for ${program.name}`);
        } catch (emailError) {
          console.error(`[CRON_REMINDERS] Failed to send reminders for ${program.name}:`, emailError);
        }
      }
    }

    console.log(`[CRON_REMINDERS] Sent ${remindersSent} total reminders`);

    return NextResponse.json({
      success: true,
      remindersSent,
      programsChecked: upcomingPrograms.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[CRON_REMINDERS] Error sending reminders:', error);
    logApiError(error, {
      context: 'CRON_SEND_REMINDERS',
      requestPath: req.url,
      requestMethod: 'GET',
    });

    return NextResponse.json(
      {
        error: 'Failed to send reminders',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
