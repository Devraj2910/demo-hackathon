export enum HttpStatusCode {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  INTERNAL_SERVER = 500,
}

export class AppError extends Error {
  public readonly name: string;
  public readonly httpCode: HttpStatusCode;
  public readonly isOperational: boolean;
  public readonly description: string;

  constructor(
    name: string,
    httpCode: HttpStatusCode,
    description: string,
    isOperational: boolean = true
  ) {
    super(description);
    Object.setPrototypeOf(this, new.target.prototype);

    this.name = name;
    this.httpCode = httpCode;
    this.isOperational = isOperational;
    this.description = description;

    Error.captureStackTrace(this);
  }
}

// 400 Bad Request - Invalid input
export class BadRequestError extends AppError {
  constructor(description: string = 'Bad request') {
    super('BAD_REQUEST', HttpStatusCode.BAD_REQUEST, description);
  }
}

// 401 Unauthorized - Authentication failure
export class UnauthorizedError extends AppError {
  constructor(description: string = 'Unauthorized access') {
    super('UNAUTHORIZED', HttpStatusCode.UNAUTHORIZED, description);
  }
}

// 403 Forbidden - Not allowed to access resource
export class ForbiddenError extends AppError {
  constructor(description: string = 'Access forbidden') {
    super('FORBIDDEN', HttpStatusCode.FORBIDDEN, description);
  }
}

// 404 Not Found - Resource not found
export class NotFoundError extends AppError {
  constructor(description: string = 'Resource not found') {
    super('NOT_FOUND', HttpStatusCode.NOT_FOUND, description);
  }
}

// 409 Conflict - Resource already exists
export class ConflictError extends AppError {
  constructor(description: string = 'Resource conflict') {
    super('CONFLICT', HttpStatusCode.CONFLICT, description);
  }
}

// 422 Unprocessable Entity - Validation errors
export class ValidationError extends AppError {
  constructor(description: string = 'Validation failed') {
    super('VALIDATION_ERROR', HttpStatusCode.UNPROCESSABLE_ENTITY, description);
  }
}

// 500 Internal Server Error
export class InternalServerError extends AppError {
  constructor(description: string = 'Internal server error') {
    super('INTERNAL_SERVER_ERROR', HttpStatusCode.INTERNAL_SERVER, description, false);
  }
}

// Database errors
export class DatabaseError extends AppError {
  constructor(description: string = 'Database error occurred') {
    super('DATABASE_ERROR', HttpStatusCode.INTERNAL_SERVER, description, false);
  }
}

// API errors
export class APIError extends AppError {
  constructor(description: string = 'External API error') {
    super('API_ERROR', HttpStatusCode.INTERNAL_SERVER, description, false);
  }
} 