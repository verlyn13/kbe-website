/**
 * Central export for all Supabase/Prisma services
 * These replace the Firebase services during migration
 */

// Also export Profile type for compatibility
export type { User as Profile } from '@prisma/client';
export { type AdminUser, adminService } from './admin-service';
export { type Announcement, announcementService, type Priority } from './announcement-service';
export { type CalendarEvent, calendarService } from './calendar-service';
export {
  profileService,
  type Role,
  type UserProfile,
  type UserProfileWithRelations,
} from './profile-service';
export {
  type Registration,
  type RegistrationStatus,
  type RegistrationWithDetails,
  registrationService,
} from './registration-service';
export { type WaiverStatus, type StudentWaiverStatus, waiverService } from './waiver-service';
