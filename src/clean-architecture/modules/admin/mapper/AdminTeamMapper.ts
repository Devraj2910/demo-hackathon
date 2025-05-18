import { Team } from '../../team/domain/entities/Team';

interface TeamRecord {
  id: number;
  name: string;
  description: string | null;
  created_at: Date;
  updated_at: Date;
}

export class AdminTeamMapper {
  static toDomain(record: TeamRecord): Team {
    return Team.create({
      id: record.id,
      name: record.name,
      description: record.description || undefined,
      createdAt: record.created_at,
      updatedAt: record.updated_at
    });
  }

  static toDTO(team: Team) {
    return {
      id: team.getId(),
      name: team.getName(),
      description: team.getDescription(),
      createdAt: team.getCreatedAt(),
      updatedAt: team.getUpdatedAt()
    };
  }
} 