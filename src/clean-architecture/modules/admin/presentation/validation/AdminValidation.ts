import Joi from 'joi';

// Add validation schemas as needed for future endpoints 

// Validation schema for processing user requests (approve/decline)
export const processUserRequestSchema = Joi.object({
  userId: Joi.string().uuid().required(),
  status: Joi.string().valid('approved', 'declined').required()
}); 