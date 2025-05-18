import { WeeklyReport } from '../../domain/entities/WeeklyReport';
import { WeeklyReportRepository } from '../../repositories/WeeklyReportRepository';
import { DatabaseService } from '../../../../../services/database.service';
import { WeeklyReportMapper } from '../../mapper/WeeklyReportMapper';

interface WeeklyReportRecord {
  id: string;
  start_date: Date;
  end_date: Date;
  created_at: Date;
  report_data: any;
  sent_to: string;
  status: string;
  error_message?: string;
}

export class WeeklyReportRepositoryImpl implements WeeklyReportRepository {
  private dbService: DatabaseService;

  constructor() {
    this.dbService = DatabaseService.getInstance();
  }

  async save(report: WeeklyReport): Promise<WeeklyReport> {
    const data = WeeklyReportMapper.toPersistence(report);
    
    // Check if report already exists
    const existingReport = await this.getById(report.getId());
    
    if (existingReport) {
      // Update existing report
      const query = `
        UPDATE weekly_reports
        SET start_date = $1,
            end_date = $2,
            report_data = $3,
            sent_to = $4,
            status = $5,
            error_message = $6
        WHERE id = $7
        RETURNING *
      `;
      
      const params = [
        data.start_date,
        data.end_date,
        data.report_data,
        data.sent_to,
        data.status,
        data.error_message,
        data.id
      ];
      
      const result = await this.dbService.query<WeeklyReportRecord>(query, params);
      
      if (result.length === 0) {
        throw new Error(`Failed to update weekly report with ID ${data.id}`);
      }
      
      return WeeklyReportMapper.toDomain(result[0]);
    } else {
      // Insert new report
      const query = `
        INSERT INTO weekly_reports (
          id, 
          start_date, 
          end_date, 
          created_at, 
          report_data, 
          sent_to, 
          status, 
          error_message
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
      `;
      
      const params = [
        data.id,
        data.start_date,
        data.end_date,
        data.created_at,
        data.report_data,
        data.sent_to,
        data.status,
        data.error_message
      ];
      
      try {
        // Ensure the table exists first (this is a convenience for development)
        await this.ensureTableExists();
        
        const result = await this.dbService.query<WeeklyReportRecord>(query, params);
        
        if (result.length === 0) {
          throw new Error('Failed to insert weekly report');
        }
        
        return WeeklyReportMapper.toDomain(result[0]);
      } catch (error) {
        console.error('Error saving weekly report:', error);
        throw error;
      }
    }
  }

  async getAll(): Promise<WeeklyReport[]> {
    const query = `
      SELECT * FROM weekly_reports
      ORDER BY created_at DESC
    `;
    
    try {
      await this.ensureTableExists();
      const result = await this.dbService.query<WeeklyReportRecord>(query);
      return result.map(record => WeeklyReportMapper.toDomain(record));
    } catch (error) {
      console.error('Error getting all weekly reports:', error);
      return [];
    }
  }

  async getById(id: string): Promise<WeeklyReport | null> {
    const query = `
      SELECT * FROM weekly_reports
      WHERE id = $1
    `;
    
    try {
      await this.ensureTableExists();
      const result = await this.dbService.query<WeeklyReportRecord>(query, [id]);
      
      if (result.length === 0) {
        return null;
      }
      
      return WeeklyReportMapper.toDomain(result[0]);
    } catch (error) {
      console.error(`Error getting weekly report by ID ${id}:`, error);
      return null;
    }
  }

  async getLatest(): Promise<WeeklyReport | null> {
    const query = `
      SELECT * FROM weekly_reports
      ORDER BY created_at DESC
      LIMIT 1
    `;
    
    try {
      await this.ensureTableExists();
      const result = await this.dbService.query<WeeklyReportRecord>(query);
      
      if (result.length === 0) {
        return null;
      }
      
      return WeeklyReportMapper.toDomain(result[0]);
    } catch (error) {
      console.error('Error getting latest weekly report:', error);
      return null;
    }
  }

  private async ensureTableExists(): Promise<void> {
    const query = `
      CREATE TABLE IF NOT EXISTS weekly_reports (
        id TEXT PRIMARY KEY,
        start_date TIMESTAMP NOT NULL,
        end_date TIMESTAMP NOT NULL,
        created_at TIMESTAMP NOT NULL,
        report_data JSONB NOT NULL,
        sent_to TEXT NOT NULL,
        status TEXT NOT NULL,
        error_message TEXT
      )
    `;
    
    try {
      await this.dbService.query(query);
    } catch (error) {
      console.error('Error ensuring weekly_reports table exists:', error);
      throw error;
    }
  }
} 