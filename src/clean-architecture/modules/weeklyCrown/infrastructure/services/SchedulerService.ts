import { CronJob } from 'cron';
import { GenerateWeeklyReportFactory } from '../../application/useCases/generateWeeklyReport/GenerateWeeklyReportFactory';
import { getLastWeekDateRange } from '../../utils/dateUtils';
import { weeklyCrownConfig } from '../../config/env';

export class SchedulerService {
  private static instance: SchedulerService;
  private cronJob: CronJob | null = null;

  private constructor() {}

  public static getInstance(): SchedulerService {
    if (!SchedulerService.instance) {
      SchedulerService.instance = new SchedulerService();
    }
    return SchedulerService.instance;
  }

  /**
   * Start the scheduler that runs the weekly report generation
   * Reads schedule from environment variables via config
   * By default, it runs every Monday at 7:00 AM UTC
   */
  public startScheduler(cronExpression?: string): void {
    if (this.cronJob) {
      this.stopScheduler();
    }

    // Use provided cronExpression or get from config
    const cronSchedule = cronExpression || weeklyCrownConfig.cronSchedule;

    console.log(`Starting WeeklyCrown scheduler with cron: ${cronSchedule}`);
    
    this.cronJob = new CronJob(
      cronSchedule, 
      this.runWeeklyReport.bind(this), 
      null, 
      true, 
      weeklyCrownConfig.timezone
    );

    console.log('Scheduler started. Next run:', this.cronJob.nextDates()[0]?.toJSDate());
  }

  /**
   * Stop the scheduler
   */
  public stopScheduler(): void {
    if (this.cronJob) {
      this.cronJob.stop();
      this.cronJob = null;
      console.log('WeeklyCrown scheduler stopped');
    }
  }

  /**
   * Run the weekly report generation manually
   */
  public async runWeeklyReport(): Promise<void> {
    try {
      console.log('Running weekly report generation...');
      
      // Get last week's date range
      const { startDate, endDate } = getLastWeekDateRange();
      
      // Generate the report using the use case
      const { useCase } = GenerateWeeklyReportFactory.create();
      const result = await useCase.execute({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        recipientEmail: weeklyCrownConfig.recipientEmail
      });
      
      console.log('Weekly report generated and sent successfully', {
        id: result.reportId,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        status: 'success'
      });
    } catch (error) {
      console.error('Error running weekly report:', error);
    }
  }
} 