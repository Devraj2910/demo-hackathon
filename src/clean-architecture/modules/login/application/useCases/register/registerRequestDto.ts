export interface RegisterRequestDto {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  position?: string;
  teamId?: number;
} 