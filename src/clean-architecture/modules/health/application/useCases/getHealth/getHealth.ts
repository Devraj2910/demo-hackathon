import { HealthRepository } from '../../../repositories/healthRepository';
import { GetHealthRequestDto } from './getHealthRequestDto';
import { GetHealthResponseDto } from './getHealthResponseDto';

export class GetHealth {
  constructor(private healthRepository: HealthRepository) {}

  async execute(_dto: GetHealthRequestDto): Promise<GetHealthResponseDto> {
    const health = await this.healthRepository.getHealth();

    return {
      status: health.getStatus(),
      timestamp: health.getTimestamp().toISOString(),
      version: health.getVersion(),
      uptime: health.getUptime()
    };
  }
} 