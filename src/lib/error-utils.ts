/**
 * Utility functions for consistent error handling across the application
 */

/**
 * Type guard to check if an error is a Firebase Auth error
 * @param error - The error to check
 * @returns True if the error is a Firebase Auth error
 */
export function isFirebaseError(error: unknown): error is { code: string; message: string } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error &&
    typeof (error as any).code === 'string' &&
    typeof (error as any).message === 'string'
  );
}

/**
 * Type guard to check if an error is a standard Error instance
 * @param error - The error to check
 * @returns True if the error is an Error instance
 */
export function isError(error: unknown): error is Error {
  return error instanceof Error;
}

/**
 * Safely extracts an error message from an unknown error type
 * @param error - The error to extract a message from
 * @param defaultMessage - The default message if extraction fails
 * @returns A user-friendly error message
 */
export function getErrorMessage(error: unknown, defaultMessage = 'An unexpected error occurred'): string {
  if (isFirebaseError(error)) {
    // Handle specific Firebase error codes
    switch (error.code) {
      case 'auth/invalid-email':
        return 'Invalid email address';
      case 'auth/user-disabled':
        return 'This account has been disabled';
      case 'auth/user-not-found':
        return 'No account found with this email';
      case 'auth/wrong-password':
        return 'Incorrect password';
      case 'auth/email-already-in-use':
        return 'An account already exists with this email';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters';
      case 'auth/invalid-action-code':
        return 'Invalid or expired magic link';
      case 'auth/popup-closed-by-user':
        return 'Sign-in popup was closed';
      default:
        return error.message;
    }
  }
  
  if (isError(error)) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  return defaultMessage;
}

/**
 * Logs an error with appropriate context
 * @param context - Context about where the error occurred
 * @param error - The error to log
 */
export function logError(context: string, error: unknown): void {
  if (process.env.NODE_ENV === 'development') {
    console.error(`[${context}]`, error);
  }
  
  // In production, you would send to a logging service
  // Example: sendToErrorTracking(context, error);
}