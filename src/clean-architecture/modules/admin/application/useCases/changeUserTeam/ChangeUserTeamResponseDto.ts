export interface TeamAssignmentDto {
  id: string;
  userId: string;
  teamId: number;
  effectiveFrom: Date;
  effectiveTo: Date | null;
}

export interface ChangeUserTeamResponseDto {
  previousAssignment: TeamAssignmentDto | null;
  newAssignment: TeamAssignmentDto;
  message: string;
} 