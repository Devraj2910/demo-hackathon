import {  Pool, PoolClient } from 'pg';
import { User } from '../../../login/domain/entities/user';
import { AdminUserRepository, UserWithTeam } from '../../repositories/AdminUserRepository';
import { AdminUserMapper } from '../../mapper/AdminUserMapper';
import { DatabaseService } from '../../../../../services';
import { Database } from '../../../team/infrastructure/database/Database';
import { TeamAssignment } from '../../../team/domain/entities/TeamAssignment';

interface UserRecord {
  id: string;
  email: string;
  password_hash: string;
  first_name: string | null;
  last_name: string | null;
  permission: string;
  role: string;
  position: string | null;
  created_at: Date;
  updated_at: Date;
}

interface UserWithTeamRecord extends UserRecord {
  team_assignment_id?: string;
  team_id?: number;
  effective_from?: Date;
  effective_to?: Date;
  team_name?: string;
}

export class AdminUserRepositoryImpl implements AdminUserRepository {
  private dbService: DatabaseService;
  constructor() {
    this.dbService = DatabaseService.getInstance();
  }

  async getPendingUsers(): Promise<User[]> {
    const query = `
      SELECT * FROM users 
      WHERE permission = 'pending'
      ORDER BY created_at DESC
    `;
    
    const result = await this.dbService.query<UserRecord>(query);
    return result.map(row => AdminUserMapper.toDomain(row));
  }

  async getPendingUsersWithTeam(): Promise<UserWithTeam[]> {
    const query = `
      SELECT 
        u.*,
        uta.id as team_assignment_id,
        uta.team_id,
        uta.effective_from,
        uta.effective_to,
        t.name as team_name
      FROM 
        users u
      LEFT JOIN 
        user_team_assignments uta ON u.id = uta.user_id AND uta.effective_to IS NULL
      LEFT JOIN
        teams t ON uta.team_id = t.id
      WHERE 
        u.permission = 'pending'
      ORDER BY 
        u.created_at DESC
    `;
    
    const result = await this.dbService.query<UserWithTeamRecord>(query);
    
    return result.map(row => {
      const user = AdminUserMapper.toDomain(row);
      
      // Create team assignment if it exists
      let teamAssignment: TeamAssignment | null = null;
      if (row.team_assignment_id) {
        teamAssignment = {
          id: row.team_assignment_id,
          userId: row.id,
          teamId: row.team_id!,
          effectiveFrom: row.effective_from!,
          effectiveTo: row.effective_to || null
        };
      }
      
      return {
        user,
        teamAssignment,
        teamName: row.team_name
      };
    });
  }

  async updateUserPermissionStatus(userId: string, status: string): Promise<User> {
    // Validate status
    if (status !== 'approved' && status !== 'declined') {
      throw new Error('Invalid status. Must be either "approved" or "declined"');
    }
    
    const query = `
      UPDATE users
      SET permission = $1,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `;
    
    const result = await this.dbService.query<UserRecord>(query, [status, userId]);
    
    if (result.length === 0) {
      throw new Error(`User with ID ${userId} not found`);
    }
    
    return AdminUserMapper.toDomain(result[0]);
  }
} 