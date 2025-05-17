import { Request, Response, NextFunction } from 'express';
import { GetCardsFactory } from '../../application/useCases/getCards/getCardsFactory';
import { GetLatestCardsFactory } from '../../application/useCases/getLatestCards/getLatestCardsFactory';
import { AddCardFactory } from '../../application/useCases/addCard/addCardFactory';
import { DeleteCardFactory } from '../../application/useCases/deleteCard/deleteCardFactory';
import { CardNotFoundError, CardValidationError, UnauthorizedDeleteError } from '../../domain/errors/cardErrors';
import { asyncHandler } from '../../../../shared/errors';
import { 
  BadRequestError, 
  NotFoundError, 
  ForbiddenError 
} from '../../../../shared/errors/appError';

export class CardController {
  static getCards = asyncHandler(async (req: Request, res: Response) => {
    const { useCase } = GetCardsFactory.create();
    
    const result = await useCase.execute({
      userId: req.query.userId as string,
      createdFor: req.query.createdFor as string,
      teamId: req.query.teamId as string,
      fromDate: req.query.fromDate as string,
      toDate: req.query.toDate as string,
      page: req.query.page ? parseInt(req.query.page as string) : undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined
    });
    
    res.status(200).json({
      success: true,
      data: result
    });
  });
  
  static getLatestCards = asyncHandler(async (req: Request, res: Response) => {
    const { useCase } = GetLatestCardsFactory.create();
    
    const result = await useCase.execute({
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined
    });
    
    res.status(200).json({
      success: true,
      data: result
    });
  });
  
  static addCard = asyncHandler(async (req: Request, res: Response) => {
    const { useCase } = AddCardFactory.create();
    
    try {
      // Get the authenticated user from the request
      if (!req.user || !req.user.userId) {
        throw new BadRequestError('User not authenticated');
      }
      
      const result = await useCase.execute({
        title: req.body.title,
        content: req.body.content,
        createdFor: req.body.createdFor,
        userId: req.user.userId
      });
      
      res.status(201).json({
        success: true,
        data: result
      });
    } catch (error) {
      if (error instanceof CardValidationError) {
        throw new BadRequestError(error.message);
      }
      throw error;
    }
  });
  
  static deleteCard = asyncHandler(async (req: Request, res: Response) => {
    const { useCase } = DeleteCardFactory.create();
    
    try {
      // Get the authenticated user's role from the request
      if (!req.user || !req.user.role) {
        throw new BadRequestError('User not authenticated');
      }
      
      const result = await useCase.execute({
        id: req.params.id,
        userRole: req.user.role
      });
      
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      if (error instanceof CardNotFoundError) {
        throw new NotFoundError(error.message);
      }
      if (error instanceof UnauthorizedDeleteError) {
        throw new ForbiddenError(error.message);
      }
      throw error;
    }
  });
} 