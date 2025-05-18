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
  
  /**
   * Update a user's role
   * @param userId The ID of the user to update
   * @param newRole The new role to assign to the user
   * @returns Promise containing the updated User entity
   */
  changeUserRole(userId: string, newRole: string): Promise<User>;
  
  /**
   * Find a user by ID
   * @param userId The ID of the user to find
   * @returns Promise containing the User entity if found, or null
   */
  findById(userId: string): Promise<User | null>;
} 