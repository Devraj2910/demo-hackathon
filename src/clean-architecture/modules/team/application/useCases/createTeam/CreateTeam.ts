import { Team } from '../../../domain/entities/Team';
import { TeamRepository } from '../../../repositories/TeamRepository';
import { CreateTeamRequestDto } from './CreateTeamRequestDto';
import { CreateTeamResponseDto } from './CreateTeamResponseDto';
import { TeamMapper } from '../../../mapper/TeamMapper';

export class CreateTeam {
  constructor(private teamRepository: TeamRepository) {}

  async execute(dto: CreateTeamRequestDto): Promise<CreateTeamResponseDto> {
    // Create a new Team entity with default values for ID and dates
    // The actual ID will be assigned by the database
    const team = Team.create({
      id: 0, // Placeholder, will be assigned by DB
      name: dto.name,
      description: dto.description,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Save the team to the database
    const savedTeam = await this.teamRepository.create(team);
    
    // Transform domain entity to DTO using the mapper
    return TeamMapper.toCreateTeamDTO(savedTeam);
  }
} 