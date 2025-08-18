/**
 * Application-wide constants for maintaining consistency
 */

/**
 * Authentication constants
 */
export const AUTH = {
  REMEMBER_ME_DURATION_DAYS: 30,
  MIN_PASSWORD_LENGTH: 6,
  MAGIC_LINK_STORAGE_KEY: 'emailForSignIn',
} as const;

/**
 * Route paths
 */
export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  ADMIN: '/admin',
  ADMIN_CONTENT_GENERATOR: '/admin/content-generator',
  WEEKLY_CHALLENGES: '/dashboard/weekly-challenges',
  ANNOUNCEMENTS: '/dashboard/announcements',
} as const;

/**
 * UI constants
 */
export const UI = {
  ANIMATION_DURATION_MS: 200,
  SIDEBAR_BREAKPOINT: 768,
  TOAST_DURATION_MS: 5000,
  MAX_MOBILE_WIDTH: 768,
} as const;

/**
 * Mock data IDs and values
 */
export const MOCK_DATA = {
  INVOICE_ID: '#123',
  SCORE_PERCENTAGE: 92,
  UPCOMING_EVENT: 'Marine Ecology Field Trip',
  NEXT_SESSION_TIME: '2:00 PM',
  NEXT_SESSION_DAYS: 3,
} as const;

/**
 * Form validation messages
 */
export const VALIDATION_MESSAGES = {
  EMAIL_REQUIRED: 'Please enter a valid email.',
  PASSWORD_REQUIRED: 'Password is required for this sign-in method.',
  INVALID_EMAIL: 'Please enter a valid email address.',
  WEAK_PASSWORD: 'Password should be at least 6 characters.',
} as const;

/**
 * Error messages
 */
export const ERROR_MESSAGES = {
  DEFAULT: 'An unexpected error occurred',
  SIGN_IN_FAILED: 'Sign in failed',
  GOOGLE_SIGN_IN_FAILED: 'Google sign in failed',
  MAGIC_LINK_FAILED: 'Magic link failed',
  CONTENT_GENERATION_FAILED: 'Failed to generate content. Please try again.',
} as const;

/**
 * Success messages
 */
export const SUCCESS_MESSAGES = {
  MAGIC_LINK_SENT: 'Check your email',
  MAGIC_LINK_SENT_DESCRIPTION: (email: string) => `A sign-in link has been sent to ${email}.`,
} as const;

/**
 * Component display limits
 */
export const DISPLAY_LIMITS = {
  RECENT_ANNOUNCEMENTS: 3,
  RECENT_CHALLENGES: 5,
} as const;

/**
 * AI content generation constants
 */
export const AI_GENERATION = {
  PROGRAM_TYPE: 'program',
  CHALLENGE_TYPE: 'challenge',
  MAX_DESCRIPTION_LENGTH: 500,
} as const;
