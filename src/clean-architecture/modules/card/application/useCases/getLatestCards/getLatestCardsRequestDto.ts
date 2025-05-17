export interface GetLatestCardsRequestDto {
  limit?: number; // default will be 10
  teamId?: string; // filter by team id
} 