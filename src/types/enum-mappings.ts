import type {
  AnnouncementStatus,
  Priority as PrismaPriority,
  Role as PrismaRole,
  RegistrationStatus,
} from '@prisma/client';

// Lowercase literals used by UI/APIs
export const PriorityLiterals = ['low', 'medium', 'high', 'urgent'] as const;
export type PriorityLC = (typeof PriorityLiterals)[number];

export const AnnouncementStatusLiterals = ['draft', 'published', 'archived'] as const;
export type AnnouncementStatusLC = (typeof AnnouncementStatusLiterals)[number];

export const RegistrationStatusLiterals = ['pending', 'active', 'waitlist', 'withdrawn'] as const;
export type RegistrationStatusLC = (typeof RegistrationStatusLiterals)[number];

export const RoleLiterals = ['admin', 'guardian', 'instructor'] as const;
export type RoleLC = (typeof RoleLiterals)[number];

// Priority mappings
export function mapPriorityLCToEnum(p: PriorityLC): PrismaPriority {
  switch (p) {
    case 'low':
      return 'LOW';
    case 'medium':
      return 'NORMAL';
    case 'high':
      return 'HIGH';
    case 'urgent':
      return 'URGENT';
  }
}

export function mapPriorityEnumToLC(p: PrismaPriority): PriorityLC {
  switch (p) {
    case 'LOW':
      return 'low';
    case 'NORMAL':
      return 'medium';
    case 'HIGH':
      return 'high';
    case 'URGENT':
      return 'urgent';
  }
}

// AnnouncementStatus mappings
export function mapAnnouncementStatusLCToEnum(s: AnnouncementStatusLC): AnnouncementStatus {
  switch (s) {
    case 'draft':
      return 'DRAFT';
    case 'published':
      return 'PUBLISHED';
    case 'archived':
      return 'ARCHIVED';
  }
}

export function mapAnnouncementStatusEnumToLC(s: AnnouncementStatus): AnnouncementStatusLC {
  switch (s) {
    case 'DRAFT':
      return 'draft';
    case 'PUBLISHED':
      return 'published';
    case 'ARCHIVED':
      return 'archived';
    default:
      return 'published'; // Default fallback
  }
}

// RegistrationStatus mappings
export function mapRegistrationStatusLCToEnum(s: RegistrationStatusLC): RegistrationStatus {
  switch (s) {
    case 'pending':
      return 'PENDING';
    case 'active':
      return 'CONFIRMED';
    case 'waitlist':
      return 'WAITLIST';
    case 'withdrawn':
      return 'CANCELLED';
  }
}

export function mapRegistrationStatusEnumToLC(s: RegistrationStatus): RegistrationStatusLC {
  switch (s) {
    case 'PENDING':
      return 'pending';
    case 'CONFIRMED':
      return 'active';
    case 'WAITLIST':
      return 'waitlist';
    case 'CANCELLED':
      return 'withdrawn';
  }
}

// Role mappings
export function mapRoleEnumToLC(r: PrismaRole): RoleLC {
  switch (r) {
    case 'ADMIN':
      return 'admin';
    case 'GUARDIAN':
      return 'guardian';
    case 'INSTRUCTOR':
      return 'instructor';
  }
}

export function mapRoleLCToEnum(r: RoleLC): PrismaRole {
  switch (r) {
    case 'admin':
      return 'ADMIN';
    case 'guardian':
      return 'GUARDIAN';
    case 'instructor':
      return 'INSTRUCTOR';
  }
}
