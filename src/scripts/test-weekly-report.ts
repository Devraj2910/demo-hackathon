import { SchedulerService } from '../clean-architecture/modules/weeklyCrown/infrastructure/services/SchedulerService';
import { getLastWeekDateRange } from '../clean-architecture/modules/weeklyCrown/utils/dateUtils';
import { GenerateWeeklyReportFactory } from '../clean-architecture/modules/weeklyCrown/application/useCases/generateWeeklyReport/GenerateWeeklyReportFactory';
import { ReportGeneratorService } from '../clean-architecture/modules/weeklyCrown/infrastructure/services/ReportGeneratorService';
import { AnalyticsDashboardService } from '../clean-architecture/modules/weeklyCrown/infrastructure/services/AnalyticsDashboardService';
import { weeklyCrownConfig } from '../clean-architecture/modules/weeklyCrown/config/env';
import * as fs from 'fs/promises';
import * as path from 'path';

/**
 * Test script for the WeeklyCrown module
 * 
 * This script can be run with:
 * npm run test:weekly-report
 * 
 * You can set environment variables before running:
 * WEEKLY_REPORT_CRON="0 9 * * 1-5" WEEKLY_REPORT_RECIPIENT="your.email@example.com" npm run test:weekly-report
 */
async function testWeeklyReport() {
  try {
    console.log('🧪 Testing WeeklyCrown module...');
    
    // Display current configuration
    console.log('📋 Current configuration:');
    console.log(`- WEEKLY_REPORT_CRON: ${weeklyCrownConfig.cronSchedule}`);
    console.log(`- WEEKLY_REPORT_RECIPIENT: ${weeklyCrownConfig.recipientEmail}`);
    console.log(`- WEEKLY_REPORT_TIMEZONE: ${weeklyCrownConfig.timezone}`);
    
    // Get last week's date range
    const { startDate, endDate } = getLastWeekDateRange();
    console.log('📅 Date range:', {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    });
    
    // Option 1: Test manual report generation
    console.log('\n🚀 Testing manual report generation...');
    const { useCase } = GenerateWeeklyReportFactory.create();
    
    const result = await useCase.execute({
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      recipientEmail: weeklyCrownConfig.recipientEmail // Use configured recipient
    });
    
    console.log('✅ Report generated successfully:', result);
    
    // Option 2: Test PDF generation directly (for debugging)
    console.log('\n📄 Testing PDF generation directly...');
    
    // Get analytics data
    const analyticsService = AnalyticsDashboardService.getInstance();
    const dashboardData = await analyticsService.getDashboardData(
      startDate.toISOString(),
      endDate.toISOString()
    );
    
    // Generate PDF
    const reportService = ReportGeneratorService.getInstance();
    const pdfBuffer = await reportService.generatePdfReport(
      dashboardData,
      startDate.toISOString(),
      endDate.toISOString()
    );
    
    // Save PDF to a file for manual inspection
    const outputDir = path.join(__dirname, '../../test-output');
    await fs.mkdir(outputDir, { recursive: true });
    
    const pdfPath = path.join(outputDir, `weekly-report-${Date.now()}.pdf`);
    await fs.writeFile(pdfPath, pdfBuffer);
    
    console.log(`✅ PDF saved to: ${pdfPath}`);
    
    // Option 3: Test the scheduler
    console.log('\n⏰ Testing scheduler...');
    const scheduler = SchedulerService.getInstance();
    
    // Run the scheduler with a test cron that executes in 5 seconds
    const testCron = new Date();
    testCron.setSeconds(testCron.getSeconds() + 5);
    
    const testCronExpression = `${testCron.getSeconds()} ${testCron.getMinutes()} ${testCron.getHours()} * * *`;
    console.log(`🕙 Setting up test cron to run at: ${testCron.toLocaleTimeString()}`);
    console.log(`📋 Cron expression: ${testCronExpression}`);
    
    scheduler.startScheduler(testCronExpression);
    
    // Wait for the scheduled job to run (10 seconds should be enough)
    console.log('⏳ Waiting for scheduled job to run...');
    
    // Clean up after 10 seconds
    setTimeout(() => {
      scheduler.stopScheduler();
      console.log('🧹 Scheduler stopped');
      console.log('🏁 Test complete!');
      process.exit(0);
    }, 10000);
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

// Run the test
testWeeklyReport(); 