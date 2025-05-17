import { TeamAssignment } from "../domain/entities/TeamAssignment";

interface TeamAssignmentPersistenceModel {
  id: string;
  user_id: string;
  team_id: number;
  effective_from: Date;
  effective_to: Date | null;
  created_at: Date;
}

export class TeamAssignmentMapper {
  static toDomain(raw: TeamAssignmentPersistenceModel): TeamAssignment {
    return {
      id: raw.id,
      userId: raw.user_id,
      teamId: raw.team_id,
      effectiveFrom: raw.effective_from,
      effectiveTo: raw.effective_to
    };
  }

  static toPersistence(assignment: TeamAssignment): TeamAssignmentPersistenceModel {
    return {
      id: assignment.id,
      user_id: assignment.userId,
      team_id: assignment.teamId,
      effective_from: assignment.effectiveFrom,
      effective_to: assignment.effectiveTo,
      created_at: new Date()
    };
  }

  static toDTO(assignment: TeamAssignment): any {
    return {
      id: assignment.id,
      userId: assignment.userId,
      teamId: assignment.teamId,
      effectiveFrom: assignment.effectiveFrom.toISOString(),
      effectiveTo: assignment.effectiveTo ? assignment.effectiveTo.toISOString() : null
    };
  }

  static toDTOList(assignments: TeamAssignment[]): any[] {
    return assignments.map(assignment => this.toDTO(assignment));
  }
} 