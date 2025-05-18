export interface GenerateWeeklyReportRequestDto {
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  recipientEmail: string;
} 