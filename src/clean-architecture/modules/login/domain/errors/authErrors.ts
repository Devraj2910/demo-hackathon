export class AuthenticationError extends Error {
  constructor(message: string = 'Authentication failed') {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export class InvalidCredentialsError extends AuthenticationError {
  constructor(message: string = 'Invalid email or password') {
    super(message);
    this.name = 'InvalidCredentialsError';
  }
}

export class UserNotFoundError extends AuthenticationError {
  constructor(message: string = 'User not found') {
    super(message);
    this.name = 'UserNotFoundError';
  }
}

export class EmailAlreadyExistsError extends Error {
  constructor(message: string = 'Email already exists') {
    super(message);
    this.name = 'EmailAlreadyExistsError';
  }
}

export class TokenVerificationError extends Error {
  constructor(message: string = 'Failed to verify token') {
    super(message);
    this.name = 'TokenVerificationError';
  }
} 