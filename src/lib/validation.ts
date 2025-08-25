/**
 * Input validation and sanitization utilities for enhanced security
 */

import { z } from 'zod';

/**
 * Email validation schema with comprehensive rules
 */
export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Please enter a valid email address')
  .max(255, 'Email is too long')
  .transform((email) => email.toLowerCase().trim());

/**
 * Password validation schema with security requirements
 */
export const passwordSchema = z
  .string()
  .min(6, 'Password must be at least 6 characters')
  .max(100, 'Password is too long')
  .regex(/^[\x20-\x7E]+$/, 'Password contains invalid characters');

/**
 * Strong password validation with additional requirements
 */
export const strongPasswordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(100, 'Password is too long')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    'Password must contain uppercase, lowercase, number and special character'
  );

/**
 * Sanitizes a string input by removing potentially harmful characters
 * @param input - The string to sanitize
 * @returns Sanitized string
 */
export function sanitizeString(input: string): string {
  return (
    input
      .trim()
      .replace(/[<>]/g, '') // Remove potential HTML tags
      // biome-ignore lint/suspicious/noControlCharactersInRegex: Intentionally removing control characters
      .replace(/[\x00-\x1F\x7F]/g, '')
  ); // Remove control characters
}

/**
 * Validates and sanitizes a display name
 */
export const displayNameSchema = z
  .string()
  .min(1, 'Name is required')
  .max(50, 'Name is too long')
  .regex(/^[a-zA-Z0-9\s\-']+$/, 'Name contains invalid characters')
  .transform(sanitizeString);

/**
 * Validates a URL
 */
export const urlSchema = z.string().url('Please enter a valid URL').max(2048, 'URL is too long');

/**
 * Validates a positive integer
 */
export const positiveIntegerSchema = z
  .number()
  .int('Must be a whole number')
  .positive('Must be a positive number');

/**
 * Validates a grade percentage (0-100)
 */
export const gradePercentageSchema = z
  .number()
  .min(0, 'Grade cannot be less than 0')
  .max(100, 'Grade cannot be more than 100');

/**
 * Validates a text area input with reasonable limits
 */
export const textAreaSchema = z.string().max(5000, 'Text is too long').transform(sanitizeString);

/**
 * Creates a required field schema with custom error message
 * @param fieldName - The name of the field for error messages
 * @returns Zod schema for required string field
 */
export function requiredString(fieldName: string) {
  return z.string().min(1, `${fieldName} is required`);
}

/**
 * Validates an array has at least one item
 * @param schema - The schema for array items
 * @param errorMessage - Custom error message
 * @returns Zod schema for non-empty array
 */
export function nonEmptyArray<T>(
  schema: z.ZodType<T>,
  errorMessage = 'At least one item is required'
) {
  return z.array(schema).min(1, errorMessage);
}

/**
 * Common form schemas used across the application
 */
export const commonSchemas = {
  email: emailSchema,
  password: passwordSchema,
  displayName: displayNameSchema,
  url: urlSchema,
  textArea: textAreaSchema,
} as const;
