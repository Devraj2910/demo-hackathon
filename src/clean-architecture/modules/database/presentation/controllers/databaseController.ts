import { Request, Response, NextFunction } from 'express';
import { ListDatabasesFactory } from '../../application/useCases/listDatabases/listDatabasesFactory';
import { PostgresDatabaseRepository } from '../../infrastructure/repositories/postgresDatabaseRepository';

export class DatabaseController {
  static async listDatabases(req: Request, res: Response, next: NextFunction) {
    try {
      const { useCase } = ListDatabasesFactory.create();
      const result = await useCase.execute();
      
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  static async executeQuery(req: Request, res: Response, next: NextFunction) {
    try {
      const { query } = req.body;
      
      if (!query) {
        return res.status(400).json({
          success: false,
          error: 'Query is required'
        });
      }

      const repository = new PostgresDatabaseRepository();
      const result = await repository.executeQuery(query);
      
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
} 