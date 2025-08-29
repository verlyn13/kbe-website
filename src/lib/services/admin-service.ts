import { PrismaClient, type Role, type User } from '@prisma/client';

const prisma = new PrismaClient();

export type AdminUser = User & {
  permissions?: string[];
};

export const adminService = {
  /**
   * Get all admin users
   */
  async getAll(): Promise<AdminUser[]> {
    const admins = await prisma.user.findMany({
      where: {
        role: { in: ['ADMIN', 'INSTRUCTOR'] },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Add permissions based on role
    return admins.map((admin) => ({
      ...admin,
      permissions: this.getPermissionsByRole(admin.role),
    }));
  },

  /**
   * Get admin by ID
   */
  async getById(id: string): Promise<AdminUser | null> {
    const admin = await prisma.user.findFirst({
      where: {
        id,
        role: { in: ['ADMIN', 'INSTRUCTOR'] },
      },
    });

    if (!admin) return null;

    return {
      ...admin,
      permissions: this.getPermissionsByRole(admin.role),
    };
  },

  /**
   * Check if user is admin
   */
  async isAdmin(userId: string): Promise<boolean> {
    const count = await prisma.user.count({
      where: {
        id: userId,
        role: { in: ['ADMIN', 'INSTRUCTOR'] },
      },
    });
    return count > 0;
  },

  /**
   * Make user an admin
   */
  async makeAdmin(userId: string, role: 'ADMIN' | 'INSTRUCTOR' = 'ADMIN'): Promise<AdminUser> {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { role },
    });

    return {
      ...user,
      permissions: this.getPermissionsByRole(role),
    };
  },

  /**
   * Remove admin privileges
   */
  async removeAdmin(userId: string): Promise<User> {
    return prisma.user.update({
      where: { id: userId },
      data: { role: 'GUARDIAN' },
    });
  },

  /**
   * Get permissions based on role
   */
  getPermissionsByRole(role: Role): string[] {
    switch (role) {
      case 'ADMIN':
        return [
          'users.read',
          'users.write',
          'users.delete',
          'registrations.read',
          'registrations.write',
          'registrations.delete',
          'programs.read',
          'programs.write',
          'programs.delete',
          'announcements.read',
          'announcements.write',
          'announcements.delete',
          'reports.read',
          'reports.generate',
          'settings.read',
          'settings.write',
        ];
      case 'INSTRUCTOR':
        return [
          'users.read',
          'registrations.read',
          'registrations.write',
          'programs.read',
          'announcements.read',
          'announcements.write',
          'reports.read',
        ];
      default:
        return [];
    }
  },

  /**
   * Check if user has specific permission
   */
  async hasPermission(userId: string, permission: string): Promise<boolean> {
    const admin = await this.getById(userId);
    if (!admin) return false;
    return admin.permissions?.includes(permission) || false;
  },

  /**
   * Get admin activity stats
   */
  async getStats() {
    const [totalAdmins, totalInstructors] = await Promise.all([
      prisma.user.count({ where: { role: 'ADMIN' } }),
      prisma.user.count({ where: { role: 'INSTRUCTOR' } }),
    ]);

    return {
      totalAdmins,
      totalInstructors,
      total: totalAdmins + totalInstructors,
    };
  },

  /**
   * Log admin action (for audit trail)
   */
  async logAction(adminId: string, action: string, details?: any) {
    // This would ideally write to an audit log table
    // For now, just console log
    console.log('[Admin Action]', {
      adminId,
      action,
      details,
      timestamp: new Date().toISOString(),
    });
  },
};

export default adminService;
