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

  async getUserTeamAssignments(userId: string): Promise<TeamAssignment[]> {
    const query = `
      SELECT * FROM user_team_assignments
      WHERE user_id = $1
      AND effective_to IS NULL
      ORDER BY effective_from DESC
    `;
    
    const rows = await this.dbService.query<TeamAssignmentRow>(query, [userId]);
    return rows.map(row => this.mapToTeamAssignment(row));
  }

  async removeUserFromTeam(userId: string, teamId: number): Promise<void> {
    const now = new Date();
    
    const query = `
      UPDATE user_team_assignments
      SET effective_to = $1
      WHERE user_id = $2 AND team_id = $3 AND effective_to IS NULL
    `;
    
    await this.dbService.query(query, [now, userId, teamId]);
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