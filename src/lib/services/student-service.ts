import type { Student } from '@prisma/client';
import { prisma } from '@/lib/prisma';

export type { Student };

export const studentService = {
  /**
   * Get all students for a user
   */
  async getByUserId(userId: string): Promise<Student[]> {
    return prisma.student.findMany({
      where: { userId },
      orderBy: { name: 'asc' },
    });
  },

  /**
   * Get a student by ID
   */
  async getById(id: string): Promise<Student | null> {
    return prisma.student.findUnique({
      where: { id },
    });
  },

  /**
   * Create a new student
   */
  async create(data: {
    name: string;
    userId: string;
  }): Promise<Student> {
    return prisma.student.create({
      data: {
        name: data.name,
        userId: data.userId,
      },
    });
  },

  /**
   * Update a student
   */
  async update(
    id: string,
    data: {
      name?: string;
    }
  ): Promise<Student> {
    return prisma.student.update({
      where: { id },
      data,
    });
  },

  /**
   * Delete a student
   */
  async delete(id: string): Promise<void> {
    // Delete related records first
    await prisma.registration.deleteMany({
      where: { studentId: id },
    });
    
    await prisma.waiver.deleteMany({
      where: { studentId: id },
    });

    // Then delete the student
    await prisma.student.delete({
      where: { id },
    });
  },

  /**
   * Get student with registrations
   */
  async getWithRegistrations(id: string) {
    return prisma.student.findUnique({
      where: { id },
      include: {
        registrations: {
          include: {
            program: true,
          },
        },
      },
    });
  },

  /**
   * Get student with waivers
   */
  async getWithWaivers(id: string) {
    return prisma.student.findUnique({
      where: { id },
      include: {
        waivers: true,
      },
    });
  },

  /**
   * Count students for a user
   */
  async countByUserId(userId: string): Promise<number> {
    return prisma.student.count({
      where: { userId },
    });
  },
};

export default studentService;