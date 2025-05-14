import { Health } from '../domain/entities/health';

export interface HealthRepository {
  getHealth(): Promise<Health>;
} 