import Joi from 'joi';

// Validation schema for search users endpoint
export const searchUsers = Joi.object({
  searchText: Joi.string().required().min(1).max(100)
    .messages({
      'string.empty': 'Search text cannot be empty',
      'string.min': 'Search text must be at least 1 character long',
      'string.max': 'Search text cannot exceed 100 characters',
      'any.required': 'Search text is required'
    })
}); 