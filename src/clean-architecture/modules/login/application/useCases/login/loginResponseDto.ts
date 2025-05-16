export interface LoginResponseDto {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  token: string;
  expiresIn: number;
} 