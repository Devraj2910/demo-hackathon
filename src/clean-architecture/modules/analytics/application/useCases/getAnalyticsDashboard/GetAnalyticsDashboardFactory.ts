import { Request } from 'express';
import { Pool } from 'pg';
import { GetAnalyticsDashboard } from './GetAnalyticsDashboard';
import { PostgresAnalyticsRepository } from '../../../infrastructure/repositories/PostgresAnalyticsRepository';
import { DatabaseService } from '../../../../../../services/database.service';

export class GetAnalyticsDashboardFactory {
  static async create(req: Request) {
    const pool: Pool = DatabaseService.getInstance().getPool();
    const analyticsRepository = new PostgresAnalyticsRepository(pool);
    const useCase = new GetAnalyticsDashboard(analyticsRepository);

    return { useCase };
  }
} 