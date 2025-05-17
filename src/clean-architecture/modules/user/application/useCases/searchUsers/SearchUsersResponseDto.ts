export interface UserDto {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  fullName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SearchUsersResponseDto {
  users: UserDto[];
} 