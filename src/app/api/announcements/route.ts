import { type NextRequest, NextResponse } from 'next/server';
import { createErrorResponse, logApiError } from '@/lib/api-error-handler';
import { prisma } from '@/lib/prisma';
import { announcementService } from '@/lib/services';
import { sendAnnouncementEmail } from '@/lib/sendgrid-email-service';
import { createClient } from '@/lib/supabase/server';

/**
 * Get user emails by recipient group
 * Server-side only to avoid SendGrid imports in client
 */
async function getUserEmailsByRecipients(recipients: string): Promise<string[]> {
  if (recipients === 'all') {
    const users = await prisma.user.findMany({
      where: { role: 'GUARDIAN' },
      select: { email: true },
    });
    return users.map(u => u.email);
  }

  if (recipients === 'mathcounts') {
    const users = await prisma.user.findMany({
      where: {
        role: 'GUARDIAN',
        students: {
          some: {
            registrations: {
              some: {
                program: {
                  category: { contains: 'mathcounts', mode: 'insensitive' },
                },
              },
            },
          },
        },
      },
      select: { email: true },
    });
    return users.map(u => u.email);
  }

  if (recipients === 'enrichment') {
    const users = await prisma.user.findMany({
      where: {
        role: 'GUARDIAN',
        students: {
          some: {
            registrations: {
              some: {
                program: {
                  category: { contains: 'enrichment', mode: 'insensitive' },
                },
              },
            },
          },
        },
      },
      select: { email: true },
    });
    return users.map(u => u.email);
  }

  return [];
}

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

    // Check if user is admin or instructor
    const profile = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true, name: true },
    });

    if (!profile || (profile.role !== 'ADMIN' && profile.role !== 'INSTRUCTOR')) {
      console.log(`[ANNOUNCEMENTS_CREATE] Access denied for user ${user.id} with role ${profile?.role}`);
      return NextResponse.json(
        {
          error: 'Forbidden',
          code: 'FORBIDDEN',
          timestamp: new Date().toISOString(),
        },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { title, content, priority, expiresAt, recipients, status, pinned } = body;

    // Validate required fields
    if (!title || !content) {
      return NextResponse.json(
        {
          error: 'Missing required fields',
          code: 'VALIDATION_ERROR',
          details: { required: ['title', 'content'] },
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    const announcement = await announcementService.create({
      title,
      content,
      priority,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      recipients: recipients || 'all',
      status: status || 'PUBLISHED',
      pinned: pinned || false,
      createdByName: profile.name || user.email,
    });

    console.log(`[ANNOUNCEMENTS_CREATE] Created announcement ${announcement.id} by user ${user.id}`);

    // Send emails if published and has recipients
    if (announcement.status === 'PUBLISHED' && announcement.recipients) {
      try {
        const emails = await getUserEmailsByRecipients(announcement.recipients);

        if (emails.length > 0) {
          console.log(`[ANNOUNCEMENTS_CREATE] Sending to ${emails.length} recipients`);

          // Send emails in batches to avoid overwhelming SendGrid
          const batchSize = 50;
          for (let i = 0; i < emails.length; i += batchSize) {
            const batch = emails.slice(i, i + batchSize);
            await sendAnnouncementEmail(
              batch,
              announcement.title,
              announcement.content
            );
          }

          console.log(`[ANNOUNCEMENTS_CREATE] Sent announcement emails successfully`);
        }
      } catch (emailError) {
        // Log error but don't fail the announcement creation
        console.error('[ANNOUNCEMENTS_CREATE] Failed to send emails:', emailError);
      }
    }

    return NextResponse.json(announcement, { status: 201 });
  } catch (error) {
    logApiError(error, {
      context: 'ANNOUNCEMENTS_CREATE',
      userId,
      requestPath: req.url,
      requestMethod: 'POST',
    });

    return createErrorResponse(error, { context: 'ANNOUNCEMENTS_CREATE' });
  }
}
