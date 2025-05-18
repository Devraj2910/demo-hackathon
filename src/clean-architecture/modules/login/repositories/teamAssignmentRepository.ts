export interface TeamAssignment {
  id: string;
  userId: string;
  teamId: number;
  effectiveFrom: Date;
  effectiveTo: Date | null;
}

export interface TeamAssignmentRepository {
  /**
   * Assign a user to a team
   */
  assignUserToTeam(assignment: TeamAssignment): Promise<TeamAssignment>;
  
  /**
   * Get all team assignments for a user
   */
  
  /**
   * Remove a user from a team
   */
} 