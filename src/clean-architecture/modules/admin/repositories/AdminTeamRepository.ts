import { Team } from '../../team/domain/entities/Team';
import { User } from '../../login/domain/entities/user';

export interface TeamWithUsers {
  team: Team;
  users: User[];
}

export interface AdminTeamRepository {
  /**
   * Get all teams with their effective users (users with null effective_to date)
   * @returns Promise containing array of teams with their active users
   */
  getTeamsWithEffectiveUsers(): Promise<TeamWithUsers[]>;
} 