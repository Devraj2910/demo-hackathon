export interface UpdateUserTeamResponseDto {
  id: string;
  userId: string;
  teamId: number;
  effectiveFrom: string;
  effectiveTo: string | null;
  previousTeamId?: number | null;
} 