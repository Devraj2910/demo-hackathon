import { Request, Response, NextFunction } from 'express';
import { GetAllTeamsFactory } from '../../application/useCases/getAllTeams/GetAllTeamsFactory';

export class TeamController {
  static async getAllTeams(req: Request, res: Response, next: NextFunction) {
    try {
      const { useCase } = GetAllTeamsFactory.create();
      const teams = await useCase.execute();
      
      res.status(200).json({
        success: true,
        data: teams
      });
    } catch (error) {
      next(error);
    }
  }
} 