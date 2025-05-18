import Joi from 'joi';

// Define valid roles
const validRoles = ['user', 'admin', 'tech-lead'];

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

// Validation schema for changing a user's role
export const changeUserRoleSchema = Joi.object({
  userId: Joi.string().uuid().required(),
  newRole: Joi.string().valid(...validRoles).required().messages({
    'any.only': `Role must be one of: ${validRoles.join(', ')}`
  })
}); 