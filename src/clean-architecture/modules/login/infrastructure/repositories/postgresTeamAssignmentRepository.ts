import { TeamAssignment, TeamAssignmentRepository } from "../../repositories/teamAssignmentRepository";
import { DatabaseService } from "../../../../../services/database.service";

interface TeamAssignmentRow {
  id: string;
  user_id: string;
  team_id: number;
  effective_from: Date;
  effective_to: Date | null;
  created_at: Date;
}

export class PostgresTeamAssignmentRepository implements TeamAssignmentRepository {
  private dbService: DatabaseService;

  constructor() {
    this.dbService = DatabaseService.getInstance();
  }

  async assignUserToTeam(assignment: TeamAssignment): Promise<TeamAssignment> {
    const query = `
      INSERT INTO user_team_assignments (
        id,
        user_id,
        team_id,
        effective_from,
        effective_to
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    
    const params = [
      assignment.id,
      assignment.userId,
      assignment.teamId,
      assignment.effectiveFrom,
      assignment.effectiveTo
    ];
    
    const rows = await this.dbService.query<TeamAssignmentRow>(query, params);
    return this.mapToTeamAssignment(rows[0]);
  }




  private mapToTeamAssignment(row: TeamAssignmentRow): TeamAssignment {
    return {
      id: row.id,
      userId: row.user_id,
      teamId: row.team_id,
      effectiveFrom: row.effective_from,
      effectiveTo: row.effective_to
    };
  }
} 