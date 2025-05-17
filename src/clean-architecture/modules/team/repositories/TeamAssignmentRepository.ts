import { TeamAssignment } from "../domain/entities/TeamAssignment";

export interface TeamAssignmentRepository {
  /**
   * Assign a user to a team
   */
  assignUserToTeam(assignment: TeamAssignment): Promise<TeamAssignment>;
  
  /**
   * Get all team assignments for a user
   */
  getAllTeamAssignments(userId: string): Promise<TeamAssignment[]>;
  
  /**
   * Get current team assignments for a user (where effective_to is null)
   */
  getCurrentTeamAssignments(userId: string): Promise<TeamAssignment[]>;
  
  /**
   * Update the effective_to date of a team assignment
   */
  updateEffectiveToDate(assignmentId: string, effectiveToDate: Date): Promise<void>;
  
  /**
   * Update effective_to date for all current assignments of a user
   */
  updateCurrentAssignmentsForUser(userId: string, effectiveToDate: Date): Promise<number>;
  
  /**
   * Get team assignments by team
   */
  getTeamAssignmentsByTeam(teamId: number): Promise<TeamAssignment[]>;
} 