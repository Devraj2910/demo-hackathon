import Joi from 'joi';

const analyticsValidation = {
  getDashboard: Joi.object({
    startDate: Joi.date().iso().required().messages({
      'date.base': 'startDate must be a valid date',
      'date.format': 'startDate must be in ISO format',
      'any.required': 'startDate is required'
    }),
    endDate: Joi.date().iso().required().messages({
      'date.base': 'endDate must be a valid date',
      'date.format': 'endDate must be in ISO format',
      'any.required': 'endDate is required'
    })
  })
};

export default analyticsValidation; 