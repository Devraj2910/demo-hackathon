import { TeamAssignment } from '../../team/domain/entities/TeamAssignment';

interface TeamAssignmentRecord {
  id: string;
  user_id: string;
  team_id: number;
  effective_from: Date;
  effective_to: Date | null;
  created_at: Date;
}

export class AdminTeamAssignmentMapper {
  static toDomain(record: TeamAssignmentRecord): TeamAssignment {
    return {
      id: record.id,
      userId: record.user_id,
      teamId: record.team_id,
      effectiveFrom: record.effective_from,
      effectiveTo: record.effective_to
    };
  }

  static toDTO(assignment: TeamAssignment) {
    return {
      id: assignment.id,
      userId: assignment.userId,
      teamId: assignment.teamId,
      effectiveFrom: assignment.effectiveFrom,
      effectiveTo: assignment.effectiveTo
    };
  }
} 