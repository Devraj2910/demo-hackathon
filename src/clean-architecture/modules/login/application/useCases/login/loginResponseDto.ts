export interface LoginResponseDto {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
  position?: string;
  token: string;
  expiresIn: number;
} 