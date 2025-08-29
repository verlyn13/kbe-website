import { type Announcement, type Priority, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export type { Announcement, Priority };

export const announcementService = {
  /**
   * Get all active announcements
   */
  async getAll(): Promise<Announcement[]> {
    const now = new Date();
    return prisma.announcement.findMany({
      where: {
        status: 'PUBLISHED',
        OR: [{ expiresAt: null }, { expiresAt: { gte: now } }],
      },
      orderBy: [{ priority: 'desc' }, { publishedAt: 'desc' }],
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
  }): Promise<Announcement> {
    return prisma.announcement.create({
      data: {
        title: data.title,
        content: data.content,
        priority: data.priority || 'NORMAL',
        expiresAt: data.expiresAt,
        publishedAt: new Date(),
      },
    });
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
