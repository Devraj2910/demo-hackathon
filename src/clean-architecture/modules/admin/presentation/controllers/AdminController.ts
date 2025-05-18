import { Request, Response } from 'express';
import { Pool } from 'pg';
import { GetPendingUsersFactory } from '../../application/useCases/getPendingUsers/GetPendingUsersFactory';

export class AdminController {
  private dbPool: Pool;
  
  constructor(dbPool: Pool) {
    this.dbPool = dbPool;
  }
  
  /**
   * Get all users with pending permissions
   */
  async getPendingUsers(req: Request, res: Response): Promise<void> {
    try {
      const { useCase } = GetPendingUsersFactory.create(this.dbPool);
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
} 