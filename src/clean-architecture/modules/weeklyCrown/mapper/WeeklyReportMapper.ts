import { WeeklyReport, WeeklyReportProps } from '../domain/entities/WeeklyReport';

interface WeeklyReportPersistenceModel {
  id: string;
  start_date: Date;
  end_date: Date;
  created_at: Date;
  report_data: any;
  sent_to: string;
  status: string;
  error_message?: string;
}

export class WeeklyReportMapper {
  /**
   * Maps a database record to domain entity
   */
  static toDomain(raw: WeeklyReportPersistenceModel): WeeklyReport {
    return WeeklyReport.create({
      id: raw.id,
      startDate: raw.start_date,
      endDate: raw.end_date,
      createdAt: raw.created_at,
      reportData: raw.report_data,
      sentTo: raw.sent_to,
      status: raw.status as 'pending' | 'sent' | 'failed',
      errorMessage: raw.error_message
    });
  }

  /**
   * Maps a domain entity to database record
   */
  static toPersistence(entity: WeeklyReport): WeeklyReportPersistenceModel {
    return {
      id: entity.getId(),
      start_date: entity.getStartDate(),
      end_date: entity.getEndDate(),
      created_at: entity.getCreatedAt(),
      report_data: entity.getReportData(),
      sent_to: entity.getSentTo(),
      status: entity.getStatus(),
      error_message: entity.getErrorMessage()
    };
  }

  /**
   * Maps a domain entity to a response DTO
   */
  static toResponseDto(entity: WeeklyReport) {
    return {
      id: entity.getId(),
      startDate: entity.getStartDate().toISOString(),
      endDate: entity.getEndDate().toISOString(),
      createdAt: entity.getCreatedAt().toISOString(),
      sentTo: entity.getSentTo(),
      status: entity.getStatus()
    };
  }
} 