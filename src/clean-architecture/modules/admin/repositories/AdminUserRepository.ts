import { User } from '../../login/domain/entities/user';
import { TeamAssignment } from '../../team/domain/entities/TeamAssignment';

export interface UserWithTeam {
  user: User;
  teamAssignment: TeamAssignment | null;
  teamName?: string;
}

export interface AdminUserRepository {
  /**
   * Get all users with pending permissions status
   * @returns Promise containing an array of User entities with pending permissions
   */
  getPendingUsers(): Promise<User[]>;

  /**
   * Get all users with pending permissions status including their team assignments
   * @returns Promise containing an array of users with their team details
   */
  getPendingUsersWithTeam(): Promise<UserWithTeam[]>;

  /**
   * Update a user's permission status (approve or decline)
   * @param userId The ID of the user to update
   * @param status The new permission status ('approved' or 'declined')
   * @returns Promise containing the updated User entity
   */
  updateUserPermissionStatus(userId: string, status: string): Promise<User>;
} 