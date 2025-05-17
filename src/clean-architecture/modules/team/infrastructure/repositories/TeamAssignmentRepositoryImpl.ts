import { TeamAssignment } from "../../domain/entities/TeamAssignment";
import { TeamAssignmentMapper } from "../../mapper/TeamAssignmentMapper";
import { TeamAssignmentRepository } from "../../repositories/TeamAssignmentRepository";
import { Database } from "../database/Database";

interface TeamAssignmentRow {
  id: string;
  user_id: string;
  team_id: number;
  effective_from: Date;
  effective_to: Date | null;
  created_at: Date;
}

export class TeamAssignmentRepositoryImpl implements TeamAssignmentRepository {
  constructor(private db: Database) {}

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
    
    const rows = await this.db.query(query, params);
    return TeamAssignmentMapper.toDomain(rows[0]);
  }

  async getAllTeamAssignments(userId: string): Promise<TeamAssignment[]> {
    const query = `
      SELECT * FROM user_team_assignments
      WHERE user_id = $1
      ORDER BY effective_from DESC
    `;
    
    const rows = await this.db.query(query, [userId]);
    return rows.map((row: any) => TeamAssignmentMapper.toDomain(row));
  }

  async getCurrentTeamAssignments(userId: string): Promise<TeamAssignment[]> {
    const query = `
      SELECT * FROM user_team_assignments
      WHERE user_id = $1 AND effective_to IS NULL
      ORDER BY effective_from DESC
    `;
    
    const rows = await this.db.query(query, [userId]);
    return rows.map((row: any) => TeamAssignmentMapper.toDomain(row));
  }

  async updateEffectiveToDate(assignmentId: string, effectiveToDate: Date): Promise<void> {
    const query = `
      UPDATE user_team_assignments
      SET effective_to = $1
      WHERE id = $2
    `;
    
    await this.db.query(query, [effectiveToDate, assignmentId]);
  }

  async updateCurrentAssignmentsForUser(userId: string, effectiveToDate: Date): Promise<number> {
    const query = `
      UPDATE user_team_assignments
      SET effective_to = $1
      WHERE user_id = $2 AND effective_to IS NULL
      RETURNING *
    `;
    
    const rows = await this.db.query(query, [effectiveToDate, userId]);
    return rows.length; // Return the number of rows updated
  }

  async getTeamAssignmentsByTeam(teamId: number): Promise<TeamAssignment[]> {
    const query = `
      SELECT * FROM user_team_assignments
      WHERE team_id = $1
      ORDER BY effective_from DESC
    `;
    
    const rows = await this.db.query(query, [teamId]);
    return rows.map((row: any) => TeamAssignmentMapper.toDomain(row));
  }
} 