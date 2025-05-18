import { Request, Response, NextFunction } from 'express';
import { GetAllTeamsFactory } from '../../application/useCases/getAllTeams/GetAllTeamsFactory';
import { UpdateUserTeamFactory } from '../../application/useCases/updateUserTeam/UpdateUserTeamFactory';
import { CreateTeamFactory } from '../../application/useCases/createTeam/CreateTeamFactory';

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

  static async updateUserTeam(req: Request, res: Response, next: NextFunction) {
    try {
      const { useCase } = UpdateUserTeamFactory.create();
      
      const result = await useCase.execute({
        userId: req.body.userId,
        teamId: req.body.teamId
      });
      
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
  
  static async createTeam(req: Request, res: Response, next: NextFunction) {
    try {
      const { useCase } = CreateTeamFactory.create();
      
      const result = await useCase.execute({
        name: req.body.name,
        description: req.body.description
      });
      
      res.status(201).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
} 