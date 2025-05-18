import { TeamRepository } from '../../../repositories/TeamRepository';
import { DeleteTeamRequestDto } from './DeleteTeamRequestDto';
import { DeleteTeamResponseDto } from './DeleteTeamResponseDto';

export class DeleteTeam {
  constructor(private teamRepository: TeamRepository) {}

  async execute(dto: DeleteTeamRequestDto): Promise<DeleteTeamResponseDto> {
    // First check if the team exists
    const team = await this.teamRepository.findById(dto.id);
    
    if (!team) {
      throw new Error(`Team with ID ${dto.id} not found`);
    }
    
    // Delete the team
    await this.teamRepository.delete(dto.id);
    
    return {
      success: true
    };
  }
} 