export interface RegisterResponseDto {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
  position?: string;
  createdAt: Date;
} 