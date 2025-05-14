import { Health } from '../../../health/domain/entities/health';
import { HealthRepository } from '../../repositories/healthRepository';

export class HealthRepositoryImpl implements HealthRepository {
  async getHealth(): Promise<Health> {
    // In a real application, we might check database connectivity or other services here
    // For this demo, we'll just return a simple health status
    const startTime = process.uptime();
    
    return Health.create({
      status: 'OK',
      timestamp: new Date(),
      version: process.env.npm_package_version || '1.0.0',
      uptime: Math.floor(startTime)
    });
  }
} 