import Joi from 'joi';

export const addCardSchema = Joi.object({
  title: Joi.string().required().min(3).max(255).messages({
    'string.empty': 'Title is required',
    'string.min': 'Title must be at least 3 characters long',
    'string.max': 'Title must be at most 255 characters long',
    'any.required': 'Title is required'
  }),
  content: Joi.string().required().messages({
    'string.empty': 'Content is required',
    'any.required': 'Content is required'
  }),
  createdFor: Joi.string().required().messages({
    'string.empty': 'Created for user ID is required',
    'any.required': 'Created for user ID is required'
  })
});

export const getCardsSchema = Joi.object({
  userId: Joi.string().allow('', null),
  createdFor: Joi.string().allow('', null),
  teamId: Joi.string().allow('', null),
  fromDate: Joi.string().allow('', null),
  toDate: Joi.string().allow('', null),
  page: Joi.number().integer().min(1).default(1).messages({
    'number.base': 'Page must be a number',
    'number.integer': 'Page must be an integer',
    'number.min': 'Page must be at least 1'
  }),
  limit: Joi.number().integer().min(1).max(100).default(20).messages({
    'number.base': 'Limit must be a number',
    'number.integer': 'Limit must be an integer',
    'number.min': 'Limit must be at least 1',
    'number.max': 'Limit must be at most 100'
  }),
  title: Joi.string(),
  searchText: Joi.string()
});

export const getLatestCardsSchema = Joi.object({
  limit: Joi.number().integer().min(1).max(50).default(10).messages({
    'number.base': 'Limit must be a number',
    'number.integer': 'Limit must be an integer',
    'number.min': 'Limit must be at least 1',
    'number.max': 'Limit must be at most 50'
  }),
  teamId: Joi.string().allow('', null)
});

export const deleteCardSchema = Joi.object({
  id: Joi.string().required().messages({
    'string.empty': 'Card ID is required',
    'any.required': 'Card ID is required'
  })
}); 