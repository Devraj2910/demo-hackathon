export interface TeamAssignment {
  id: string;
  userId: string;
  teamId: number;
  effectiveFrom: Date;
  effectiveTo: Date | null;
} 