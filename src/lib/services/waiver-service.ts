import { prisma } from '@/lib/prisma';

export type WaiverStatus = 'pending' | 'received' | 'expired' | 'rejected';

export interface StudentWaiverStatus {
  id: string;
  studentName: string;
  waiverStatus: WaiverStatus;
  waiverDate?: Date;
  expiresDate?: Date;
  guardianId?: string;
  guardianName?: string | null;
  guardianEmail?: string | null;
}

function computeStatus(args: { signedAt: Date | null; expiresAt: Date | null }): WaiverStatus {
  const { signedAt, expiresAt } = args;
  const now = new Date();
  if (!signedAt) {
    // A record without signature is considered rejected by admin
    return 'rejected';
  }
  if (expiresAt && expiresAt.getTime() < now.getTime()) return 'expired';
  return 'received';
}

export const waiverService = {
  // Guardian: list the current user's students and their waiver status
  async getStatusesForGuardian(userId: string): Promise<StudentWaiverStatus[]> {
    const students = await prisma.student.findMany({
      where: { userId },
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        userId: true,
        waivers: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: { signedAt: true, expiresAt: true, createdAt: true },
        },
      },
    });

    return students.map((s) => {
      const latest = s.waivers[0] ?? null;
      if (!latest) {
        return { id: s.id, studentName: s.name, waiverStatus: 'pending' as const };
      }
      const status = computeStatus({ signedAt: latest.signedAt, expiresAt: latest.expiresAt });
      return {
        id: s.id,
        studentName: s.name,
        waiverStatus: status,
        waiverDate: latest.signedAt ?? undefined,
        expiresDate: latest.expiresAt ?? undefined,
      };
    });
  },

  // Admin: list all students with waiver status and guardian info
  async getAllStatuses(): Promise<StudentWaiverStatus[]> {
    const students = await prisma.student.findMany({
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        userId: true,
        user: { select: { name: true, email: true } },
        waivers: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: { signedAt: true, expiresAt: true, createdAt: true },
        },
      },
    });

    return students.map((s) => {
      const latest = s.waivers[0] ?? null;
      const base: StudentWaiverStatus = {
        id: s.id,
        studentName: s.name,
        guardianId: s.userId,
        guardianName: s.user?.name ?? null,
        guardianEmail: s.user?.email ?? null,
        waiverStatus: 'pending',
      };
      if (!latest) return base;
      const status = computeStatus({ signedAt: latest.signedAt, expiresAt: latest.expiresAt });
      return {
        ...base,
        waiverStatus: status,
        waiverDate: latest.signedAt ?? undefined,
        expiresDate: latest.expiresAt ?? undefined,
      };
    });
  },

  // Admin: set status for a student
  async setStatus(
    studentId: string,
    newStatus: 'pending' | 'received' | 'rejected'
  ): Promise<StudentWaiverStatus> {
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      select: { id: true, name: true, userId: true, user: { select: { name: true, email: true } } },
    });
    if (!student) throw new Error('Student not found');

    if (newStatus === 'pending') {
      // Remove latest waiver (or all) to indicate no waiver on file
      await prisma.waiver.deleteMany({ where: { studentId } });
      return { id: student.id, studentName: student.name, waiverStatus: 'pending' };
    }

    if (newStatus === 'received') {
      const now = new Date();
      const expires = new Date(now.getTime());
      expires.setFullYear(expires.getFullYear() + 1);
      const rec = await prisma.waiver.create({
        data: {
          studentId,
          userId: student.userId,
          signedAt: now,
          expiresAt: expires,
        },
      });
      return {
        id: student.id,
        studentName: student.name,
        waiverStatus: 'received',
        waiverDate: rec.signedAt ?? undefined,
        expiresDate: rec.expiresAt ?? undefined,
      };
    }

    // rejected
    const now = new Date();
    const rejected = await prisma.waiver.create({
      data: {
        studentId,
        userId: student.userId,
        signedAt: null,
        expiresAt: now,
      },
    });
    return {
      id: student.id,
      studentName: student.name,
      waiverStatus: 'rejected',
      waiverDate: rejected.signedAt ?? undefined,
      expiresDate: rejected.expiresAt ?? undefined,
    };
  },
};

export default waiverService;
