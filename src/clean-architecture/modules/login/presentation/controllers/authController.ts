import { Request, Response, NextFunction } from 'express';
import { LoginFactory } from '../../application/useCases/login/loginFactory';
import { RegisterFactory } from '../../application/useCases/register/registerFactory';
import { AuthenticationError, EmailAlreadyExistsError } from '../../domain/errors/authErrors';
import { asyncHandler } from '../../../../shared/errors';
import { 
  BadRequestError, 
  UnauthorizedError, 
  ConflictError,
  ForbiddenError
} from '../../../../shared/errors/appError';
import { EmailService } from '../../../../../services/email.service';
import { DatabaseService } from '../../../../../services/database.service';
import { PostgresUserRepository } from '../../infrastructure/repositories/postgresUserRepository';

export class AuthController {
  static login = asyncHandler(async (req: Request, res: Response) => {
    const { useCase } = LoginFactory.create();
    
    try {
      const result = await useCase.execute({
        email: req.body.email,
        password: req.body.password
      });
      
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      if (error instanceof AuthenticationError) {
        throw new UnauthorizedError(error.message);
      }
      throw error;
    }
  });
  
  static register = asyncHandler(async (req: Request, res: Response) => {
    const { useCase } = RegisterFactory.create();
    
    try {
      const result = await useCase.execute({
        email: req.body.email,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        role: req.body.role,
        position: req.body.position,
        teamId: req.body.teamId
      });
      
      res.status(201).json({
        success: true,
        data: result
      });
    } catch (error) {
      if (error instanceof EmailAlreadyExistsError) {
        throw new ConflictError(error.message);
      }
      throw error;
    }
  });

 
} 