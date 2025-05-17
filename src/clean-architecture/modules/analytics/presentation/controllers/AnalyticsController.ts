import { Request, Response, NextFunction } from 'express';
import { GetAnalyticsDashboardFactory } from '../../application/useCases/getAnalyticsDashboard/GetAnalyticsDashboardFactory';

export class AnalyticsController {
  static async getDashboard(req: Request, res: Response, next: NextFunction) {
    try {
      // Extract query parameters (validation is handled by middleware)
      const startDate = req.query.startDate as string;
      const endDate = req.query.endDate as string;
      
      // Create and execute use case
      const { useCase } = await GetAnalyticsDashboardFactory.create(req);
      
      const result = await useCase.execute({
        startDate,
        endDate
      });
      
      // Return successful response
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
} 