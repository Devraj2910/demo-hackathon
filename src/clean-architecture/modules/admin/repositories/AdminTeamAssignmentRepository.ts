import { TeamAssignment } from '../../team/domain/entities/TeamAssignment';

export interface AdminTeamAssignmentRepository {
  /**
   * Change a user's team assignment
   * This will:
   * 1. Update the effective_to date of the current assignment (if any)
   * 2. Create a new assignment with the new team
   * 
   * @param userId The ID of the user
   * @param teamId The ID of the new team
   * @returns Promise containing the new team assignment
   */
  changeUserTeam(userId: string, teamId: number): Promise<TeamAssignment>;
  
  /**
   * Get the current team assignment for a user
   * 
   * @param userId The ID of the user
   * @returns Promise containing the current team assignment (or null if none)
   */
  getCurrentTeamAssignment(userId: string): Promise<TeamAssignment | null>;
} 