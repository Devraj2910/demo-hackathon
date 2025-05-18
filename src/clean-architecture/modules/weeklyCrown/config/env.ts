import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Weekly Crown module configuration
export const weeklyCrownConfig = {
  /**
   * Cron expression for scheduling weekly reports
   * Default: Every Monday at 7:00 AM UTC
   * Format: Minute Hour Day Month DayOfWeek
   * Examples:
   * - '0 7 * * 1'     = Every Monday at 7:00 AM
   * - '0 9 * * 1-5'   = Every weekday at 9:00 AM
   * - '0 12 1 * *'    = First day of every month at 12:00 PM
   */
  cronSchedule: process.env.WEEKLY_REPORT_CRON || '0 7 * * 1',
  
  /**
   * Email recipient for weekly reports
   * Default: devraj.rajput@avestatechnologies.com
   */
  recipientEmail: process.env.WEEKLY_REPORT_RECIPIENT || 'devraj.rajput@avestatechnologies.com',
  
  /**
   * Time zone for the cron schedule
   * Default: UTC
   */
  timezone: process.env.WEEKLY_REPORT_TIMEZONE || 'UTC'
}; 