import Joi from 'joi';

// Add validation schemas as needed for future endpoints 

// Validation schema for processing user requests (approve/decline)
export const processUserRequestSchema = Joi.object({
  userId: Joi.string().uuid().required(),
  status: Joi.string().valid('approved', 'declined').required()
});

// Validation schema for changing a user's team
export const changeUserTeamSchema = Joi.object({
  userId: Joi.string().uuid().required(),
  teamId: Joi.number().integer().positive().required()
}); 