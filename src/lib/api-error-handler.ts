/**
 * Unified API Error Handling Utilities
 *
 * Provides standardized error handling, logging, and Sentry integration for API routes.
 * October 2025 best practices.
 */

import { NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';
import { Prisma } from '@prisma/client';

/**
 * Standardized API error response format
 */
export interface ApiErrorResponse {
  error: string;
  code: string;
  details?: Record<string, any>;
  timestamp: string;
  requestId?: string;
}

/**
 * Error context for logging and tracking
 */
export interface ErrorContext {
  context: string; // e.g., 'STUDENT_CREATE', 'PROFILE_UPDATE'
  userId?: string;
  email?: string;
  requestPath?: string;
  requestMethod?: string;
  additionalData?: Record<string, any>;
}

/**
 * Error severity levels
 */
export type ErrorSeverity = 'error' | 'warning' | 'info';

/**
 * Logs an API error with context and sends to Sentry
 *
 * @param error - The error object
 * @param context - Error context for tracking
 * @param severity - Error severity level (default: 'error')
 */
export function logApiError(
  error: unknown,
  context: ErrorContext,
  severity: ErrorSeverity = 'error'
): void {
  const timestamp = new Date().toISOString();
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorStack = error instanceof Error ? error.stack : undefined;

  // Console logging with context
  const logPrefix = `[${timestamp}] [${context.context}]`;

  console.error(logPrefix, {
    error: errorMessage,
    stack: errorStack,
    userId: context.userId,
    email: context.email,
    path: context.requestPath,
    method: context.requestMethod,
    ...context.additionalData,
  });

  // Send to Sentry with tags and context
  if (process.env.NODE_ENV === 'production') {
    Sentry.captureException(error, {
      tags: {
        context: context.context,
        endpoint: context.requestPath || 'unknown',
        method: context.requestMethod || 'unknown',
      },
      user: context.userId
        ? {
            id: context.userId,
            email: context.email,
          }
        : undefined,
      extra: context.additionalData,
      level: severity,
    });
  }
}

/**
 * Maps common errors to HTTP status codes and user-friendly messages
 *
 * @param error - The error to map
 * @returns Status code and message
 */
export function getErrorResponse(error: unknown): {
  status: number;
  message: string;
  code: string;
} {
  // Prisma validation errors
  if (error instanceof Prisma.PrismaClientValidationError) {
    return {
      status: 400,
      message: 'Invalid data provided',
      code: 'VALIDATION_ERROR',
    };
  }

  // Prisma known request errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002': // Unique constraint violation
        return {
          status: 409,
          message: 'A record with this information already exists',
          code: 'DUPLICATE_ENTRY',
        };
      case 'P2025': // Record not found
        return {
          status: 404,
          message: 'Record not found',
          code: 'NOT_FOUND',
        };
      case 'P2003': // Foreign key constraint failed
        return {
          status: 400,
          message: 'Invalid reference to related data',
          code: 'INVALID_REFERENCE',
        };
      case 'P2014': // Required relation violation
        return {
          status: 400,
          message: 'Missing required related data',
          code: 'MISSING_RELATION',
        };
      default:
        return {
          status: 500,
          message: 'Database error occurred',
          code: 'DATABASE_ERROR',
        };
    }
  }

  // Prisma connection errors
  if (error instanceof Prisma.PrismaClientInitializationError) {
    return {
      status: 503,
      message: 'Database connection unavailable',
      code: 'DATABASE_UNAVAILABLE',
    };
  }

  // Network/timeout errors
  if (error instanceof Error) {
    if (error.message.includes('ECONNREFUSED') || error.message.includes('ECONNRESET')) {
      return {
        status: 503,
        message: 'Service temporarily unavailable',
        code: 'SERVICE_UNAVAILABLE',
      };
    }

    if (error.message.includes('timeout') || error.message.includes('ETIMEDOUT')) {
      return {
        status: 504,
        message: 'Request timeout',
        code: 'TIMEOUT',
      };
    }
  }

  // Default error
  return {
    status: 500,
    message: 'Internal server error',
    code: 'INTERNAL_ERROR',
  };
}

/**
 * Creates a standardized error response
 *
 * @param error - The error to format
 * @param context - Error context
 * @param includeDetails - Whether to include error details (development only)
 * @returns NextResponse with error
 */
export function createErrorResponse(
  error: unknown,
  context: ErrorContext,
  includeDetails = false
): NextResponse<ApiErrorResponse> {
  const { status, message, code } = getErrorResponse(error);

  const errorResponse: ApiErrorResponse = {
    error: message,
    code,
    timestamp: new Date().toISOString(),
  };

  // Include details in development only
  if (includeDetails && process.env.NODE_ENV === 'development') {
    errorResponse.details = {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      context: context.context,
    };
  }

  return NextResponse.json(errorResponse, { status });
}

/**
 * Wrapper for API route handlers with automatic error handling
 *
 * Usage:
 * ```typescript
 * export const GET = withErrorHandling(
 *   'STUDENTS_GET',
 *   async (req) => {
 *     const students = await studentService.getAll();
 *     return NextResponse.json(students);
 *   }
 * );
 * ```
 *
 * @param context - Error context string
 * @param handler - The API route handler
 * @returns Wrapped handler with error handling
 */
export function withErrorHandling<T extends (...args: any[]) => Promise<NextResponse>>(
  context: string,
  handler: T
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await handler(...args);
    } catch (error) {
      // Log error with context
      logApiError(error, {
        context,
        requestPath: args[0]?.url, // NextRequest URL
        requestMethod: args[0]?.method,
      });

      // Return standardized error response
      return createErrorResponse(error, { context });
    }
  }) as T;
}

/**
 * Batch operation handler with Promise.allSettled
 *
 * Processes multiple promises and tracks successes/failures separately.
 * Reports failures to Sentry without failing the entire operation.
 *
 * @param operations - Array of promises to execute
 * @param context - Error context for logging
 * @returns Object with successful and failed results
 */
export async function batchOperation<T>(
  operations: Promise<T>[],
  context: ErrorContext
): Promise<{
  succeeded: T[];
  failed: Array<{ error: unknown; index: number }>;
  total: number;
}> {
  const results = await Promise.allSettled(operations);

  const succeeded: T[] = [];
  const failed: Array<{ error: unknown; index: number }> = [];

  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      succeeded.push(result.value);
    } else {
      failed.push({
        error: result.reason,
        index,
      });

      // Log each failure
      logApiError(result.reason, {
        ...context,
        additionalData: {
          operationIndex: index,
          totalOperations: operations.length,
        },
      }, 'warning');
    }
  });

  // Send summary to Sentry if there were failures
  if (failed.length > 0 && process.env.NODE_ENV === 'production') {
    Sentry.captureMessage(
      `Batch operation: ${failed.length} of ${operations.length} operations failed`,
      {
        level: 'warning',
        tags: {
          context: context.context,
        },
        extra: {
          successCount: succeeded.length,
          failureCount: failed.length,
          totalCount: operations.length,
          failureRate: (failed.length / operations.length) * 100,
        },
      }
    );
  }

  return {
    succeeded,
    failed,
    total: operations.length,
  };
}

/**
 * Retry wrapper for transient failures
 *
 * @param fn - Function to retry
 * @param context - Error context
 * @param maxRetries - Maximum number of retries (default: 3)
 * @param delayMs - Delay between retries in milliseconds (default: 1000)
 * @returns Result of successful execution
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  context: ErrorContext,
  maxRetries = 3,
  delayMs = 1000
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Check if error is retriable
      const { code } = getErrorResponse(error);
      const isRetriable = [
        'SERVICE_UNAVAILABLE',
        'TIMEOUT',
        'DATABASE_UNAVAILABLE',
      ].includes(code);

      if (!isRetriable || attempt === maxRetries) {
        // Not retriable or final attempt - throw
        throw error;
      }

      // Log retry attempt
      console.warn(`[${context.context}] Retry attempt ${attempt}/${maxRetries}`, {
        error: error instanceof Error ? error.message : String(error),
        nextRetryIn: `${delayMs}ms`,
      });

      // Wait before retry with exponential backoff
      await new Promise(resolve => setTimeout(resolve, delayMs * attempt));
    }
  }

  throw lastError;
}

/**
 * Validates request body against a schema
 *
 * @param body - Request body to validate
 * @param requiredFields - Array of required field names
 * @returns Validation result
 */
export function validateRequestBody(
  body: unknown,
  requiredFields: string[]
): { valid: boolean; missing?: string[] } {
  if (!body || typeof body !== 'object') {
    return { valid: false };
  }

  const missing = requiredFields.filter(field => !(field in body));

  if (missing.length > 0) {
    return { valid: false, missing };
  }

  return { valid: true };
}
