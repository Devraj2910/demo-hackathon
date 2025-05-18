import Joi from 'joi';

const teamValidation = {
  createTeam: Joi.object({
    name: Joi.string().min(2).max(100).required().messages({
      'string.empty': 'Team name is required',
      'string.min': 'Team name must be at least 2 characters long',
      'string.max': 'Team name cannot exceed 100 characters',
      'any.required': 'Team name is required'
    }),
    description: Joi.string().max(500).allow('', null).optional().messages({
      'string.max': 'Team description cannot exceed 500 characters'
    })
  })
};

export default teamValidation; 