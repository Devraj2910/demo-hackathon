import { Team } from '../../../team/domain/entities/Team';
import { User } from '../../../login/domain/entities/user';
import { AdminTeamRepository, TeamWithUsers } from '../../repositories/AdminTeamRepository';
import { AdminTeamMapper } from '../../mapper/AdminTeamMapper';
import { AdminUserMapper } from '../../mapper/AdminUserMapper';
import { DatabaseService } from '../../../../../services';

interface TeamRecord {
  id: number;
  name: string;
  description: string | null;
  created_at: Date;
  updated_at: Date;
}

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

export class AdminTeamRepositoryImpl implements AdminTeamRepository {
  private dbService: DatabaseService;
  
  constructor() {
    this.dbService = DatabaseService.getInstance();
  }

  async getTeamsWithEffectiveUsers(): Promise<TeamWithUsers[]> {
    // First, get all teams
    const teamsQuery = `
      SELECT * FROM teams
      ORDER BY name
    `;
    
    const teamsResult = await this.dbService.query<TeamRecord>(teamsQuery);
    const teams = teamsResult.map(row => AdminTeamMapper.toDomain(row));
    
    // Initialize result with teams and empty users arrays
    const result: TeamWithUsers[] = teams.map(team => ({
      team,
      users: []
    }));
    
    // Map teams by id for easy lookup
    const teamMap = new Map<number, TeamWithUsers>();
    for (const teamWithUsers of result) {
      teamMap.set(teamWithUsers.team.getId(), teamWithUsers);
    }
    
    // Get all users with current team assignments
    const usersQuery = `
      SELECT 
        u.*,
        uta.team_id
      FROM 
        users u
      JOIN 
        user_team_assignments uta ON u.id = uta.user_id
      WHERE 
        uta.effective_to IS NULL AND u.permission = 'approved'
      ORDER BY 
        u.first_name, u.last_name
    `;
    
    const usersResult = await this.dbService.query<UserRecord & { team_id: number }>(usersQuery);
    
    // Add users to their respective teams
    for (const userRow of usersResult) {
      const user = AdminUserMapper.toDomain(userRow);
      const teamId = userRow.team_id;
      
      const teamWithUsers = teamMap.get(teamId);
      if (teamWithUsers) {
        teamWithUsers.users.push(user);
      }
    }
    
    return result;
  }
} 