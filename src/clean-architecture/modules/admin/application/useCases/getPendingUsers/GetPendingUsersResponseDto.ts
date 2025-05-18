export interface UserDto {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  permission: string;
  role: string;
  position?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TeamAssignmentDto {
  id: string;
  userId: string;
  teamId: number;
  effectiveFrom: Date;
  effectiveTo: Date | null;
}

export interface UserWithTeamDto extends UserDto {
  teamAssignment: TeamAssignmentDto | null;
  teamName?: string;
}

export interface GetPendingUsersResponseDto {
  users: UserWithTeamDto[];
} 