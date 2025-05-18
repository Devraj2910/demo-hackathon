import { AdminTeamAssignmentRepository } from '../../repositories/AdminTeamAssignmentRepository';
import { TeamAssignment } from '../../../team/domain/entities/TeamAssignment';
import { AdminTeamAssignmentMapper } from '../../mapper/AdminTeamAssignmentMapper';
import { DatabaseService } from '../../../../../services';
import { v4 as uuidv4 } from 'uuid';

interface TeamAssignmentRecord {
  id: string;
  user_id: string;
  team_id: number;
  effective_from: Date;
  effective_to: Date | null;
  created_at: Date;
}

export class AdminTeamAssignmentRepositoryImpl implements AdminTeamAssignmentRepository {
  private dbService: DatabaseService;
  
  constructor() {
    this.dbService = DatabaseService.getInstance();
  }

  async getCurrentTeamAssignment(userId: string): Promise<TeamAssignment | null> {
    const query = `
      SELECT * FROM user_team_assignments
      WHERE user_id = $1
      AND effective_to IS NULL
      LIMIT 1
    `;
    
    const result = await this.dbService.query<TeamAssignmentRecord>(query, [userId]);
    
    if (result.length === 0) {
      return null;
    }
    
    return AdminTeamAssignmentMapper.toDomain(result[0]);
  }

  async changeUserTeam(userId: string, teamId: number): Promise<TeamAssignment> {
    // Use a transaction to ensure data consistency
    return this.dbService.transaction(async (client) => {
      const now = new Date();
      
      // 1. Update effective_to of current assignments (if any)
      const updateQuery = `
        UPDATE user_team_assignments
        SET effective_to = $1
        WHERE user_id = $2
        AND effective_to IS NULL
        RETURNING *
      `;
      
      await client.query(updateQuery, [now, userId]);
      
      // 2. Create a new assignment
      const newAssignmentId = uuidv4();
      
      const insertQuery = `
        INSERT INTO user_team_assignments (
          id, user_id, team_id, effective_from, effective_to
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `;
      
      const params = [
        newAssignmentId,
        userId,
        teamId,
        now,
        null
      ];
      
      const result = await client.query(insertQuery, params);
      
      if (result.rows.length === 0) {
        throw new Error('Failed to create new team assignment');
      }
      
      return AdminTeamAssignmentMapper.toDomain(result.rows[0]);
    });
  }
} 