export interface GetCardsRequestDto {
  userId?: string;
  createdFor?: string;
  teamId?: string;
  fromDate?: string; // ISO date string format
  toDate?: string; // ISO date string format
  page?: number;
  limit?: number;
  title?: string;
} 