import {
  type Prisma,
  PrismaClient,
  type Registration,
  type RegistrationStatus,
} from '@prisma/client';

const prisma = new PrismaClient();

export type { Registration, RegistrationStatus };

// Extended type with relations
export type RegistrationWithDetails = Prisma.RegistrationGetPayload<{
  include: {
    user: true;
    student: true;
    program: true;
  };
}>;

export const registrationService = {
  /**
   * Get registration statistics
   */
  async getStats(programId?: string) {
    const where = programId ? { programId } : {};

    const [pending, confirmed, waitlist, total] = await Promise.all([
      prisma.registration.count({ where: { ...where, status: 'PENDING' } }),
      prisma.registration.count({ where: { ...where, status: 'CONFIRMED' } }),
      prisma.registration.count({ where: { ...where, status: 'WAITLIST' } }),
      prisma.registration.count({ where }),
    ]);

    return {
      pending,
      confirmed,
      waitlist,
      total,
      active: confirmed,
      totalStudents: total,
    };
  },

  /**
   * Get all registrations with optional filtering
   */
  async getAll(options?: {
    programId?: string;
    status?: RegistrationStatus;
    userId?: string;
  }): Promise<RegistrationWithDetails[]> {
    const where: Prisma.RegistrationWhereInput = {};

    if (options?.programId) where.programId = options.programId;
    if (options?.status) where.status = options.status;
    if (options?.userId) where.userId = options.userId;

    return prisma.registration.findMany({
      where,
      include: {
        user: true,
        student: true,
        program: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  /**
   * Get registration by ID
   */
  async getById(id: string): Promise<RegistrationWithDetails | null> {
    return prisma.registration.findUnique({
      where: { id },
      include: {
        user: true,
        student: true,
        program: true,
      },
    });
  },

  /**
   * Create a new registration
   */
  async create(data: {
    userId: string;
    studentId: string;
    programId: string;
    status?: RegistrationStatus;
  }): Promise<Registration> {
    return prisma.registration.create({
      data: {
        userId: data.userId,
        studentId: data.studentId,
        programId: data.programId,
        status: data.status || 'PENDING',
      },
    });
  },

  /**
   * Update registration status
   */
  async updateStatus(id: string, status: RegistrationStatus): Promise<Registration> {
    return prisma.registration.update({
      where: { id },
      data: { status },
    });
  },

  /**
   * Update registration
   */
  async update(
    id: string,
    data: Partial<{
      status: RegistrationStatus;
      programId: string;
    }>
  ): Promise<Registration> {
    return prisma.registration.update({
      where: { id },
      data,
    });
  },

  /**
   * Delete a registration
   */
  async delete(id: string): Promise<void> {
    await prisma.registration.delete({
      where: { id },
    });
  },

  /**
   * Approve a registration
   */
  async approve(id: string): Promise<Registration> {
    return this.updateStatus(id, 'CONFIRMED');
  },

  /**
   * Move to waitlist
   */
  async moveToWaitlist(id: string): Promise<Registration> {
    return this.updateStatus(id, 'WAITLIST');
  },

  /**
   * Cancel a registration
   */
  async cancel(id: string): Promise<Registration> {
    return this.updateStatus(id, 'CANCELLED');
  },

  /**
   * Get registrations by user
   */
  async getByUser(userId: string): Promise<RegistrationWithDetails[]> {
    return prisma.registration.findMany({
      where: { userId },
      include: {
        user: true,
        student: true,
        program: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  /**
   * Get registrations by student
   */
  async getByStudent(studentId: string): Promise<RegistrationWithDetails[]> {
    return prisma.registration.findMany({
      where: { studentId },
      include: {
        user: true,
        student: true,
        program: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  /**
   * Check if student is registered for a program
   */
  async isRegistered(studentId: string, programId: string): Promise<boolean> {
    const count = await prisma.registration.count({
      where: {
        studentId,
        programId,
        status: { in: ['PENDING', 'CONFIRMED', 'WAITLIST'] },
      },
    });
    return count > 0;
  },

  /**
   * Get waitlist position
   */
  async getWaitlistPosition(registrationId: string): Promise<number | null> {
    const registration = await this.getById(registrationId);
    if (!registration || registration.status !== 'WAITLIST') {
      return null;
    }

    const earlier = await prisma.registration.count({
      where: {
        programId: registration.programId,
        status: 'WAITLIST',
        createdAt: { lt: registration.createdAt },
      },
    });

    return earlier + 1;
  },

  /**
   * Process waitlist when spot opens up
   */
  async processWaitlist(programId: string): Promise<Registration | null> {
    const nextInLine = await prisma.registration.findFirst({
      where: {
        programId,
        status: 'WAITLIST',
      },
      orderBy: { createdAt: 'asc' },
    });

    if (nextInLine) {
      return this.updateStatus(nextInLine.id, 'CONFIRMED');
    }

    return null;
  },
};

export default registrationService;

