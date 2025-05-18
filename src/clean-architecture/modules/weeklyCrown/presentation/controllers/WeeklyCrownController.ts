import { Request, Response } from 'express';
import { GenerateWeeklyReportFactory } from '../../application/useCases/generateWeeklyReport/GenerateWeeklyReportFactory';
import { SchedulerService } from '../../infrastructure/services/SchedulerService';
import { getLastWeekDateRange } from '../../utils/dateUtils';
import { weeklyCrownConfig } from '../../config/env';

export class WeeklyCrownController {
  /**
   * Manually generate and send a weekly report
   */
  static async generateReport(req: Request, res: Response): Promise<void> {
    try {
      // Get recipient email from request or config
      const recipientEmail = req.body.recipientEmail || weeklyCrownConfig.recipientEmail;
      
      // Get date range from request or use last week if not provided
      let { startDate, endDate } = req.body;
      
      if (!startDate || !endDate) {
        const dateRange = getLastWeekDateRange();
        startDate = dateRange.startDate.toISOString();
        endDate = dateRange.endDate.toISOString();
      }
      
      // Generate and send the report
      const { useCase } = GenerateWeeklyReportFactory.create();
      const result = await useCase.execute({
        startDate,
        endDate,
        recipientEmail
      });
      
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Error generating weekly report:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to generate weekly report',
        error: (error as Error).message
      });
    }
  }
  
  /**
   * Start the weekly report scheduler
   */
  static startScheduler(req: Request, res: Response): void {
    try {
      // Get cron expression from request or config
      const cronExpression = req.body.cronExpression || weeklyCrownConfig.cronSchedule;
      
      const scheduler = SchedulerService.getInstance();
      scheduler.startScheduler(cronExpression);
      
      res.status(200).json({
        success: true,
        message: 'Weekly report scheduler started',
        cronExpression,
        nextRun: new Date(scheduler['cronJob']?.nextDates()[0]?.toJSDate() || Date.now())
      });
    } catch (error) {
      console.error('Error starting scheduler:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to start scheduler',
        error: (error as Error).message
      });
    }
  }
  
  /**
   * Stop the weekly report scheduler
   */
  static stopScheduler(req: Request, res: Response): void {
    try {
      const scheduler = SchedulerService.getInstance();
      scheduler.stopScheduler();
      
      res.status(200).json({
        success: true,
        message: 'Weekly report scheduler stopped'
      });
    } catch (error) {
      console.error('Error stopping scheduler:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to stop scheduler',
        error: (error as Error).message
      });
    }
  }
} 