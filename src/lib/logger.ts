/**
 * Logger utility for consistent logging across the application.
 * In production, this could be replaced with a proper logging service.
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  /**
   * Logs a message with the specified level
   * @param level - The log level
   * @param message - The message to log
   * @param context - Additional context data
   */
  private log(level: LogLevel, message: string, context?: Record<string, unknown>): void {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context
    };

    // In development, use console methods
    if (this.isDevelopment) {
      const logMethod = level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log';
      console[logMethod](`[${entry.timestamp}] ${level.toUpperCase()}: ${message}`, context || '');
    }

    // In production, you would send to a logging service
    // Example: sendToLoggingService(entry);
  }

  /**
   * Logs a debug message (only in development)
   */
  debug(message: string, context?: Record<string, unknown>): void {
    if (this.isDevelopment) {
      this.log('debug', message, context);
    }
  }

  /**
   * Logs an info message
   */
  info(message: string, context?: Record<string, unknown>): void {
    this.log('info', message, context);
  }

  /**
   * Logs a warning message
   */
  warn(message: string, context?: Record<string, unknown>): void {
    this.log('warn', message, context);
  }

  /**
   * Logs an error message
   */
  error(message: string, error?: Error | unknown, context?: Record<string, unknown>): void {
    const errorContext = {
      ...context,
      ...(error instanceof Error ? {
        errorMessage: error.message,
        errorStack: error.stack,
        errorName: error.name
      } : {
        error: String(error)
      })
    };
    
    this.log('error', message, errorContext);
  }
}

// Export singleton instance
export const logger = new Logger();