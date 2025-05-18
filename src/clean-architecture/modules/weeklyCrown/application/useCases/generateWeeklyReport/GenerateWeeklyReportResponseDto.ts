export interface GenerateWeeklyReportResponseDto {
  reportId: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  sentTo: string;
  status: 'pending' | 'sent' | 'failed';
  message: string;
} 