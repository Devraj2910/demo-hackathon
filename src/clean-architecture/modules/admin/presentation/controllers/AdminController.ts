import { Request, Response } from 'express';
import { Pool } from 'pg';
import { GetPendingUsersFactory } from '../../application/useCases/getPendingUsers/GetPendingUsersFactory';
import { ProcessUserRequestFactory } from '../../application/useCases/processUserRequest/ProcessUserRequestFactory';
import { GetTeamsWithEffectiveUsersFactory } from '../../application/useCases/getTeamsWithEffectiveUsers/GetTeamsWithEffectiveUsersFactory';
import { ChangeUserTeamFactory } from '../../application/useCases/changeUserTeam/ChangeUserTeamFactory';
import { ChangeUserRoleFactory } from '../../application/useCases/changeUserRole/ChangeUserRoleFactory';

export class AdminController {

  /**
   * Get all users with pending permissions
   */
  static async getPendingUsers(req: Request, res: Response): Promise<void> {
    try {
      const { useCase } =  GetPendingUsersFactory.create();
      const result = await useCase.execute();
      
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Error getting pending users:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get pending users',
        error: (error as Error).message
      });
    }
  }

  /**
   * Process a user request (approve or decline)
   */
  static async processUserRequest(req: Request, res: Response): Promise<void> {
    try {
      const { userId, status } = req.body;
      
      const { useCase } = ProcessUserRequestFactory.create();
      const result = await useCase.execute({ userId, status });
      
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Error processing user request:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to process user request',
        error: (error as Error).message
      });
    }
  }

  /**
   * Get all teams with their effective users
   */
  static async getTeamsWithEffectiveUsers(req: Request, res: Response): Promise<void> {
    try {
      const { useCase } = GetTeamsWithEffectiveUsersFactory.create();
      const result = await useCase.execute();
      
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Error getting teams with effective users:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get teams with effective users',
        error: (error as Error).message
      });
    }
  }

  /**
   * Change a user's team
   */
  static async changeUserTeam(req: Request, res: Response): Promise<void> {
    try {
      const { userId, teamId } = req.body;
      
      const { useCase } = ChangeUserTeamFactory.create();
      const result = await useCase.execute({ userId, teamId });
      
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Error changing user team:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to change user team',
        error: (error as Error).message
      });
    }
  }
  
  /**
   * Change a user's role
   */
  static async changeUserRole(req: Request, res: Response): Promise<void> {
    try {
      const { userId, newRole } = req.body;
      
      const { useCase } = ChangeUserRoleFactory.create();
      const result = await useCase.execute({ userId, newRole });
      
      res.status(200).json({
        success: true,
        data: result,
        message: `User role changed successfully to ${newRole}`
      });
    } catch (error) {
      console.error('Error changing user role:', error);
      
      // Handle "not found" errors with a 404 status
      if ((error as Error).message.includes('not found')) {
        return res.status(404).json({
          success: false,
          message: 'Failed to change user role',
          error: (error as Error).message
        });
      }
      
      // Handle validation errors with a 400 status
      if ((error as Error).message.includes('Invalid role')) {
        return res.status(400).json({
          success: false,
          message: 'Failed to change user role',
          error: (error as Error).message
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Failed to change user role',
        error: (error as Error).message
      });
    }
  }
} 