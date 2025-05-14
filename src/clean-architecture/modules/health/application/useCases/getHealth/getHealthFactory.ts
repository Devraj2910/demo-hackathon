import { HealthRepositoryImpl } from '../../../infrastructure/repositories/healthRepositoryImpl';
import { GetHealth } from './getHealth';

export class GetHealthFactory {
  static create() {
    const healthRepository = new HealthRepositoryImpl();
    const useCase = new GetHealth(healthRepository);
    
    return { useCase };
  }
} 