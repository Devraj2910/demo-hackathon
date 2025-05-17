import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';

type ValidationSource = 'body' | 'query' | 'params';

/**
 * Creates a middleware that validates request data against a Joi schema
 * @param schema The Joi validation schema
 * @param source The request property to validate (body, query, or params)
 * @returns Express middleware function
 */
export const validate = (schema: Schema, source: ValidationSource = 'body') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const data = req[source];
    
    const { error, value } = schema.validate(data, {
      abortEarly: false,
      stripUnknown: true,
      errors: {
        wrap: {
          label: false
        }
      }
    });

    if (error) {
      const details = error.details.map(detail => ({
        message: detail.message,
        path: detail.path
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: details
      });
    }

    // Replace request data with validated data
    req[source] = value;
    return next();
  };
}; 