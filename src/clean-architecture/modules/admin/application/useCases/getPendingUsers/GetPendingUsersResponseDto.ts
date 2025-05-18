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

export interface GetPendingUsersResponseDto {
  users: UserDto[];
} 