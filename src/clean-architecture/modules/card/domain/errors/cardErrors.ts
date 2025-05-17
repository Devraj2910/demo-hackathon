export class CardNotFoundError extends Error {
  constructor(id?: string) {
    super(id ? `Card with id ${id} not found` : 'Card not found');
    this.name = 'CardNotFoundError';
  }
}

export class AccessDeniedError extends Error {
  constructor(message: string = 'Access denied') {
    super(message);
    this.name = 'AccessDeniedError';
  }
}

export class UnauthorizedDeleteError extends Error {
  constructor(message: string = 'Only administrators can delete cards') {
    super(message);
    this.name = 'UnauthorizedDeleteError';
  }
}

export class CardValidationError extends Error {
  constructor(message: string = 'Card validation failed') {
    super(message);
    this.name = 'CardValidationError';
  }
} 