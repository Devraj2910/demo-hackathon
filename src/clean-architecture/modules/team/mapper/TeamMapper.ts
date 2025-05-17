import { Team, TeamProps } from '../domain/entities/Team';
import { GetAllTeamsResponseDto } from '../application/useCases/getAllTeams/GetAllTeamsResponseDto';

interface TeamPersistenceModel {
  id: number;
  name: string;
  description: string | null;
  created_at: Date;
  updated_at: Date;
}

export class TeamMapper {
  static toDomain(raw: TeamPersistenceModel): Team {
    return Team.create({
      id: raw.id,
      name: raw.name,
      description: raw.description || undefined,
      createdAt: raw.created_at,
      updatedAt: raw.updated_at
    });
  }

  static toPersistence(team: Team): TeamPersistenceModel {
    return {
      id: team.getId(),
      name: team.getName(),
      description: team.getDescription() || null,
      created_at: team.getCreatedAt(),
      updated_at: team.getUpdatedAt()
    };
  }

  static toDTO(team: Team): GetAllTeamsResponseDto {
    return {
      id: team.getId(),
      name: team.getName(),
      description: team.getDescription(),
      createdAt: team.getCreatedAt().toISOString(),
      updatedAt: team.getUpdatedAt().toISOString()
    };
  }

  static toDTOList(teams: Team[]): GetAllTeamsResponseDto[] {
    return teams.map(team => this.toDTO(team));
  }
} 