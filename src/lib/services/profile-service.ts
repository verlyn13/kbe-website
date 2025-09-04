import type { Prisma, Role, User } from '@prisma/client';
import { prisma } from '@/lib/prisma';

export type { User as UserProfile, Role };

// Extended type with relations
export type UserProfileWithRelations = Prisma.UserGetPayload<{
  include: {
    students: true;
    registrations: true;
    waivers: true;
  };
}>;

export const profileService = {
  /**
   * Get all user profiles
   */
  async getAll(): Promise<User[]> {
    return prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });
  },
  /**
   * Get user profile by ID (with fallback to email lookup for migration)
   */
  async getById(id: string): Promise<User | null> {
    // First try to find by ID
    const userById = await prisma.user.findUnique({
      where: { id },
    });
    
    if (userById) {
      return userById;
    }

    // If not found, this might be a Supabase user ID that needs sync
    // Return null to trigger upsert logic in calling code
    return null;
  },

  /**
   * Get user profile by email
   */
  async getByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  },

  /**
   * Get user profile with all relations
   */
  async getWithRelations(id: string): Promise<UserProfileWithRelations | null> {
    return prisma.user.findUnique({
      where: { id },
      include: {
        students: true,
        registrations: true,
        waivers: true,
      },
    });
  },

  /**
   * Create a new user profile
   */
  async create(data: {
    id?: string; // Optional, for syncing with Supabase Auth
    email: string;
    name?: string;
    phone?: string;
    role?: Role;
  }): Promise<User> {
    return prisma.user.create({
      data: {
        id: data.id,
        email: data.email,
        name: data.name,
        phone: data.phone,
        role: data.role || 'GUARDIAN',
      },
    });
  },

  /**
   * Update user profile
   */
  async update(
    id: string,
    data: {
      name?: string;
      phone?: string;
      role?: Role;
    }
  ): Promise<User> {
    return prisma.user.update({
      where: { id },
      data,
    });
  },

  /**
   * Update or create user profile (upsert)
   */
  async upsert(data: {
    id: string;
    email: string;
    name?: string;
    phone?: string;
    role?: Role;
  }): Promise<User> {
    return prisma.user.upsert({
      where: { id: data.id },
      update: {
        name: data.name,
        phone: data.phone,
        role: data.role,
      },
      create: {
        id: data.id,
        email: data.email,
        name: data.name,
        phone: data.phone,
        role: data.role || 'GUARDIAN',
      },
    });
  },

  /**
   * Check if profile is complete
   */
  async isProfileComplete(id: string): Promise<boolean> {
    const user = await this.getById(id);
    if (!user) return false;
    return !!(user.name && user.phone);
  },

  /**
   * Get all users with a specific role
   */
  async getByRole(role: Role): Promise<User[]> {
    return prisma.user.findMany({
      where: { role },
      orderBy: { createdAt: 'desc' },
    });
  },

  /**
   * Get all admins
   */
  async getAdmins(): Promise<User[]> {
    return prisma.user.findMany({
      where: {
        role: { in: ['ADMIN', 'INSTRUCTOR'] },
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  /**
   * Make user an admin
   */
  async makeAdmin(id: string): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: { role: 'ADMIN' },
    });
  },

  /**
   * Remove admin role
   */
  async removeAdmin(id: string): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: { role: 'GUARDIAN' },
    });
  },

  /**
   * Delete user profile (cascade deletes related data)
   */
  async delete(id: string): Promise<void> {
    // First delete related data that doesn't cascade automatically
    await prisma.registration.deleteMany({ where: { userId: id } });
    await prisma.waiver.deleteMany({ where: { userId: id } });
    await prisma.student.deleteMany({ where: { userId: id } });

    // Then delete the user
    await prisma.user.delete({ where: { id } });
  },

  /**
   * Search users by name or email
   */
  async search(query: string): Promise<User[]> {
    return prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
        ],
      },
      orderBy: { name: 'asc' },
    });
  },

  /**
   * Get user stats
   */
  async getStats() {
    const [total, guardians, admins, instructors] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'GUARDIAN' } }),
      prisma.user.count({ where: { role: 'ADMIN' } }),
      prisma.user.count({ where: { role: 'INSTRUCTOR' } }),
    ]);

    return {
      total,
      guardians,
      admins,
      instructors,
    };
  },

  /**
   * Sync with Supabase Auth user (with migration support)
   */
  async syncWithAuth(authUser: {
    id: string;
    email: string;
    user_metadata?: {
      name?: string;
      full_name?: string;
      display_name?: string;
      guardian_name?: string;
      phone?: string;
    };
  }): Promise<User> {
    const metadata = authUser.user_metadata || {};
    const name =
      metadata.guardian_name || metadata.display_name || metadata.full_name || metadata.name;

    // First check if there's an existing user by email that needs to be migrated
    const existingByEmail = await this.getByEmail(authUser.email);
    
    if (existingByEmail && existingByEmail.id !== authUser.id) {
      // Delete the old record and create a new one with the Supabase user ID
      // but preserve the existing data (including role)
      await prisma.user.delete({ where: { id: existingByEmail.id } });
      
      return prisma.user.create({
        data: {
          id: authUser.id,
          email: authUser.email,
          name: name || existingByEmail.name,
          phone: metadata.phone || existingByEmail.phone,
          role: existingByEmail.role, // Preserve existing role (like ADMIN)
        },
      });
    }

    return this.upsert({
      id: authUser.id,
      email: authUser.email,
      name: name,
      phone: metadata.phone,
      role: existingByEmail?.role || 'GUARDIAN', // Preserve existing role
    });
  },
};

export default profileService;
