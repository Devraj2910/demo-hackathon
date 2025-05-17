import { Request, Response } from 'express';
import { SearchUsersFactory } from '../../application/useCases/searchUsers/SearchUsersFactory';
import { Pool } from 'pg';

export class UserController {
  constructor() {}  

  /**
   * Search users based on the provided search text
   * @param req Express request object
   * @param res Express response object
   */
  static async searchUsers(req: Request, res: Response): Promise<void> {
    try {
      const { searchText } = req.query as { searchText: string };
      
      // Create and execute the search users use case
      const searchUsers = SearchUsersFactory.create();
      const result = await searchUsers.execute({ searchText });
      
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Error searching users:', error);
      res.status(500).json({
        success: false,
        message: 'An error occurred while searching users',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }
} 