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

export interface TeamDto {
  id: number;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TeamWithUsersDto {
  team: TeamDto;
  users: UserDto[];
}

export interface GetTeamsWithEffectiveUsersResponseDto {
  teams: TeamWithUsersDto[];
} 