/**
 * Enum Mappings for Prisma ↔ Legacy Code (LC) Conversions
 *
 * This file provides two-way mapping between Prisma enums (UPPERCASE)
 * and legacy application code values (mixed case).
 *
 * Key principle: Prisma schema uses UPPERCASE enums, application code
 * uses display-friendly formats for backward compatibility.
 */

import type { AnnouncementStatus, Priority, RegistrationStatus, Role } from '@prisma/client';

// Role Mappings (Prisma: UPPERCASE, LC: mixed case)
export const roleFromLC = (lcRole: string): Role => {
  const mapping: Record<string, Role> = {
    ADMIN: 'ADMIN',
    INSTRUCTOR: 'INSTRUCTOR',
    GUARDIAN: 'GUARDIAN',
    // Legacy aliases
    guardian: 'GUARDIAN',
    admin: 'ADMIN',
    instructor: 'INSTRUCTOR',
  };

  return mapping[lcRole] || 'GUARDIAN';
};

export const roleToLC = (prismaRole: Role): string => {
  const mapping: Record<Role, string> = {
    ADMIN: 'Admin',
    INSTRUCTOR: 'Instructor',
    GUARDIAN: 'Guardian',
  };

  return mapping[prismaRole];
};

// Priority Mappings (Prisma: UPPERCASE, LC: mixed case)
export const priorityFromLC = (lcPriority: string): Priority => {
  const mapping: Record<string, Priority> = {
    LOW: 'LOW',
    NORMAL: 'NORMAL',
    HIGH: 'HIGH',
    URGENT: 'URGENT',
    // Legacy aliases
    low: 'LOW',
    normal: 'NORMAL',
    medium: 'NORMAL',
    high: 'HIGH',
    urgent: 'URGENT',
  };

  return mapping[lcPriority] || 'NORMAL';
};

export const priorityToLC = (prismaPriority: Priority): string => {
  const mapping: Record<Priority, string> = {
    LOW: 'Low',
    NORMAL: 'Normal',
    HIGH: 'High',
    URGENT: 'Urgent',
  };

  return mapping[prismaPriority];
};

// Announcement Status Mappings (Prisma: UPPERCASE, LC: mixed case)
export const announcementStatusFromLC = (lcStatus: string): AnnouncementStatus => {
  const mapping: Record<string, AnnouncementStatus> = {
    DRAFT: 'DRAFT',
    PUBLISHED: 'PUBLISHED',
    ARCHIVED: 'ARCHIVED',
    // Legacy aliases
    draft: 'DRAFT',
    published: 'PUBLISHED',
    archived: 'ARCHIVED',
  };

  return mapping[lcStatus] || 'DRAFT';
};

export const announcementStatusToLC = (prismaStatus: AnnouncementStatus): string => {
  const mapping: Record<AnnouncementStatus, string> = {
    DRAFT: 'Draft',
    PUBLISHED: 'Published',
    ARCHIVED: 'Archived',
  };

  return mapping[prismaStatus];
};

// Registration Status Mappings (Prisma: UPPERCASE, LC: mixed case)
export const registrationStatusFromLC = (lcStatus: string): RegistrationStatus => {
  const mapping: Record<string, RegistrationStatus> = {
    PENDING: 'PENDING',
    CONFIRMED: 'CONFIRMED',
    WAITLIST: 'WAITLIST',
    CANCELLED: 'CANCELLED',
    // Legacy aliases
    pending: 'PENDING',
    confirmed: 'CONFIRMED',
    waitlisted: 'WAITLIST',
    cancelled: 'CANCELLED',
    // UI display aliases
    Pending: 'PENDING',
    Confirmed: 'CONFIRMED',
    Waitlisted: 'WAITLIST',
    Cancelled: 'CANCELLED',
  };

  return mapping[lcStatus] || 'PENDING';
};

export const registrationStatusToLC = (prismaStatus: RegistrationStatus): string => {
  const mapping: Record<RegistrationStatus, string> = {
    PENDING: 'Pending',
    CONFIRMED: 'Confirmed',
    WAITLIST: 'Waitlisted',
    CANCELLED: 'Cancelled',
  };

  return mapping[prismaStatus];
};

// Convenience functions for bulk conversion
export const mapRolesToLC = (roles: Role[]): string[] => {
  return roles.map(roleToLC);
};

export const mapRolesFromLC = (roles: string[]): Role[] => {
  return roles.map(roleFromLC);
};

export const mapStatusesToLC = (statuses: RegistrationStatus[]): string[] => {
  return statuses.map(registrationStatusToLC);
};

export const mapStatusesFromLC = (statuses: string[]): RegistrationStatus[] => {
  return statuses.map(registrationStatusFromLC);
};

// Type guards for validation
export const isValidRole = (value: string): value is Role => {
  return ['ADMIN', 'INSTRUCTOR', 'GUARDIAN'].includes(value);
};

export const isValidPriority = (value: string): value is Priority => {
  return ['LOW', 'NORMAL', 'HIGH', 'URGENT'].includes(value);
};

export const isValidAnnouncementStatus = (value: string): value is AnnouncementStatus => {
  return ['DRAFT', 'PUBLISHED', 'ARCHIVED'].includes(value);
};

export const isValidRegistrationStatus = (value: string): value is RegistrationStatus => {
  return ['PENDING', 'CONFIRMED', 'WAITLIST', 'CANCELLED'].includes(value);
};
