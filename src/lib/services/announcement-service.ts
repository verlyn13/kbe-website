import type { Announcement, AnnouncementStatus, Priority } from '@prisma/client';
import { prisma } from '@/lib/prisma';

export type { Announcement, AnnouncementStatus, Priority };

/**
 * Get user emails by recipient group
 */
async function getUserEmailsByRecipients(recipients: string): Promise<string[]> {
  if (recipients === 'all') {
    // Get all user emails
    const users = await prisma.user.findMany({
      where: { role: 'GUARDIAN' },
      select: { email: true },
    });
    return users.map(u => u.email);
  }

  if (recipients === 'mathcounts') {
    // Get users with students in MathCounts programs
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
    // Get users with students in Enrichment programs
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

export const announcementService = {
  /**
   * Get all active announcements
   * Optionally filter by user's recipient group
   */
  async getAll(options?: { userId?: string; userGroup?: string }): Promise<Announcement[]> {
    const now = new Date();
    const where: any = {
      status: 'PUBLISHED',
      OR: [{ expiresAt: null }, { expiresAt: { gte: now } }],
    };

    // If userGroup provided, filter by recipients
    if (options?.userGroup) {
      where.AND = {
        OR: [
          { recipients: null },
          { recipients: 'all' },
          { recipients: options.userGroup },
        ],
      };
    }

    return prisma.announcement.findMany({
      where,
      orderBy: [{ pinned: 'desc' }, { priority: 'desc' }, { publishedAt: 'desc' }],
    });
  },

  /**
   * Get announcement by ID
   */
  async getById(id: string): Promise<Announcement | null> {
    return prisma.announcement.findUnique({
      where: { id },
    });
  },

  /**
   * Create a new announcement
   */
  async create(data: {
    title: string;
    content: string;
    priority?: Priority;
    expiresAt?: Date | null;
    recipients?: string;
    status?: AnnouncementStatus;
    pinned?: boolean;
    createdByName?: string;
  }): Promise<Announcement> {
    const announcement = await prisma.announcement.create({
      data: {
        title: data.title,
        content: data.content,
        priority: data.priority || 'NORMAL',
        expiresAt: data.expiresAt,
        publishedAt: new Date(),
        recipients: data.recipients || 'all',
        status: data.status || 'PUBLISHED',
        pinned: data.pinned || false,
        createdByName: data.createdByName,
      },
    });

    // Note: Email sending is handled by the API route to avoid client-side imports
    // The API will call sendAnnouncementEmails() after creation

    return announcement;
  },

  /**
   * Update an announcement
   */
  async update(
    id: string,
    data: {
      title?: string;
      content?: string;
      priority?: Priority;
      expiresAt?: Date | null;
    }
  ): Promise<Announcement> {
    return prisma.announcement.update({
      where: { id },
      data,
    });
  },

  /**
   * Delete an announcement
   */
  async delete(id: string): Promise<void> {
    await prisma.announcement.delete({
      where: { id },
    });
  },

  /**
   * Get recent announcements (last 7 days)
   */
  async getRecent(limit = 5): Promise<Announcement[]> {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    return prisma.announcement.findMany({
      where: {
        publishedAt: { gte: sevenDaysAgo },
        OR: [{ expiresAt: null }, { expiresAt: { gte: new Date() } }],
      },
      orderBy: [{ priority: 'desc' }, { publishedAt: 'desc' }],
      take: limit,
    });
  },

  /**
   * Get announcements by priority
   */
  async getByPriority(priority: Priority): Promise<Announcement[]> {
    const now = new Date();
    return prisma.announcement.findMany({
      where: {
        priority,
        OR: [{ expiresAt: null }, { expiresAt: { gte: now } }],
      },
      orderBy: { publishedAt: 'desc' },
    });
  },

  /**
   * Archive expired announcements (for cleanup)
   */
  async archiveExpired(): Promise<number> {
    const now = new Date();
    const result = await prisma.announcement.deleteMany({
      where: {
        expiresAt: {
          lt: now,
        },
      },
    });
    return result.count;
  },
};

export default announcementService;
