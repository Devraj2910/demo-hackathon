import { WeeklyReport } from '../domain/entities/WeeklyReport';

export interface WeeklyReportRepository {
  /**
   * Save a weekly report
   * @param report The report to save
   * @returns The saved report
   */
  save(report: WeeklyReport): Promise<WeeklyReport>;
  
  /**
   * Get all weekly reports
   * @returns Array of weekly reports
   */
  getAll(): Promise<WeeklyReport[]>;
  
  /**
   * Get a weekly report by ID
   * @param id The report ID
   * @returns The report if found, or null
   */
  getById(id: string): Promise<WeeklyReport | null>;
  
  /**
   * Get the latest weekly report
   * @returns The latest report if exists, or null
   */
  getLatest(): Promise<WeeklyReport | null>;
} 