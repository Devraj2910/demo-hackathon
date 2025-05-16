import { DatabaseError } from '../clean-architecture/shared/errors/appError';

/**
 * A utility class for handling database-related errors
 */
export class ErrorHandlingService {
  /**
   * Wraps a database operation in a try-catch block and handles database errors
   */
  static async handleDatabaseOperation<T>(operation: () => Promise<T>): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      // Extract error message
      const errorMessage = error instanceof Error ? error.message : 'Unknown database error';
      
      // Log the error
      console.error('[Database Error]', error);
      
      // Convert to our own error type
      throw new DatabaseError(errorMessage);
    }
  }

  /**
   * Parses and handles PostgreSQL error codes
   */
  static handlePostgresError(error: any): never {
    // PostgreSQL error codes: https://www.postgresql.org/docs/current/errcodes-appendix.html
    let errorMessage = 'Database operation failed';
    
    if (error.code) {
      switch (error.code) {
        case '23505': // unique_violation
          errorMessage = `Duplicate key value violates unique constraint: ${error.detail || ''}`;
          break;
        case '23503': // foreign_key_violation
          errorMessage = `Foreign key constraint violation: ${error.detail || ''}`;
          break;
        case '23502': // not_null_violation
          errorMessage = `Not null constraint violation: ${error.column || ''} cannot be null`;
          break;
        case '42P01': // undefined_table
          errorMessage = `Table does not exist: ${error.message || ''}`;
          break;
        case '42703': // undefined_column
          errorMessage = `Column does not exist: ${error.message || ''}`;
          break;
        case '08006': // connection_failure
        case '08001': // sqlclient_unable_to_establish_sqlconnection
          errorMessage = 'Database connection error';
          break;
        default:
          errorMessage = `Database error: ${error.message || ''}`;
      }
    }
    
    throw new DatabaseError(errorMessage);
  }
} 