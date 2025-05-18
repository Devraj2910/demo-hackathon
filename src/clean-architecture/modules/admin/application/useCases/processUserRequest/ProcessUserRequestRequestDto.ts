export interface ProcessUserRequestRequestDto {
  userId: string;
  status: 'approved' | 'declined';
} 