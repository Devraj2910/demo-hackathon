import { Request, Response, NextFunction } from 'express';
import { GetHealthFactory } from '../../application/useCases/getHealth/getHealthFactory';

export class HealthController {
  static async getHealth(req: Request, res: Response, next: NextFunction) {
    try {
      const { useCase } = GetHealthFactory.create();
      
      const result = await useCase.execute({});
      
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
} 