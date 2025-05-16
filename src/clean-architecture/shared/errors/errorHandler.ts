import { Request, Response, NextFunction } from 'express';
import { AppError, HttpStatusCode } from './appError';

interface ErrorResponse {
  success: boolean;
  error: {
    message: string;
    code?: string;
    details?: string[] | Record<string, string[]>;
  };
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Log the error for debugging
  console.error(`[Error] ${new Date().toISOString()}:`, err);
  
  // Prepare default error response
  const errorResponse: ErrorResponse = {
    success: false,
    error: {
      message: 'Something went wrong'
    }
  };

  // Handle specific error types
  if (err instanceof AppError) {
    // This is our custom application error
    errorResponse.error.message = err.description;
    errorResponse.error.code = err.name;
    
    // Send the appropriate status code
    res.status(err.httpCode);
  } else if (err.name === 'ValidationError') {
    // Handle Joi validation errors
    errorResponse.error.message = 'Validation failed';
    errorResponse.error.code = 'VALIDATION_ERROR';
    
    // Attempt to extract validation details if available
    if (err instanceof Error && 'details' in err) {
      const details = (err as any).details;
      if (Array.isArray(details)) {
        errorResponse.error.details = details.map((detail: any) => detail.message);
      }
    }
    
    res.status(HttpStatusCode.UNPROCESSABLE_ENTITY);
  } else if (err.name === 'SyntaxError') {
    // Handle JSON parsing errors
    errorResponse.error.message = 'Invalid JSON format';
    errorResponse.error.code = 'SYNTAX_ERROR';
    res.status(HttpStatusCode.BAD_REQUEST);
  } else if (err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError') {
    // Handle JWT errors
    errorResponse.error.message = 'Authentication failed';
    errorResponse.error.code = 'AUTH_ERROR';
    res.status(HttpStatusCode.UNAUTHORIZED);
  } else if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    // Handle database validation errors
    errorResponse.error.message = 'Database validation failed';
    errorResponse.error.code = 'DB_VALIDATION_ERROR';
    res.status(HttpStatusCode.BAD_REQUEST);
  } else {
    // Default to internal server error for unhandled cases
    errorResponse.error.message = 'Internal server error';
    res.status(HttpStatusCode.INTERNAL_SERVER);
    
    // In production, don't expose the actual error message for security reasons
    if (process.env.NODE_ENV === 'development') {
      errorResponse.error.details = [err.message];
      if (err.stack) {
        console.error(err.stack);
      }
    }
  }

  // Send the error response
  res.json(errorResponse);
};

// Express async handler to catch async errors
export const asyncHandler = (fn: Function) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// 404 handler for routes not found
export const notFoundHandler = (req: Request, res: Response, next: NextFunction): void => {
  const error = new AppError(
    'NOT_FOUND',
    HttpStatusCode.NOT_FOUND,
    `Route not found: ${req.method} ${req.originalUrl}`
  );
  next(error);
}; 