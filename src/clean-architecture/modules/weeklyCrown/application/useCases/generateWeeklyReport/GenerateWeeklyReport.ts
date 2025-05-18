import { WeeklyReportRepository } from '../../../repositories/WeeklyReportRepository';
import { GenerateWeeklyReportRequestDto } from './GenerateWeeklyReportRequestDto';
import { GenerateWeeklyReportResponseDto } from './GenerateWeeklyReportResponseDto';
import { AnalyticsDashboardService } from '../../../infrastructure/services/AnalyticsDashboardService';
import { ReportGeneratorService } from '../../../infrastructure/services/ReportGeneratorService';
import { EmailService } from '../../../../../../services/email.service';
import { WeeklyReport } from '../../../domain/entities/WeeklyReport';

export class GenerateWeeklyReport {
  constructor(
    private weeklyReportRepository: WeeklyReportRepository,
    private analyticsDashboardService: AnalyticsDashboardService,
    private reportGeneratorService: ReportGeneratorService,
    private emailService: EmailService
  ) {}

  async execute(request: GenerateWeeklyReportRequestDto): Promise<GenerateWeeklyReportResponseDto> {
    const { startDate, endDate, recipientEmail } = request;
    
    try {
      // Create a pending report entity
      const report = WeeklyReport.create({
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        createdAt: new Date(),
        reportData: {}, // Initialize with empty object instead of null
        sentTo: recipientEmail,
        status: 'pending'
      });
      
      // Save the initial pending state
      await this.weeklyReportRepository.save(report);
      
      // Fetch analytics data
      const dashboardData = await this.analyticsDashboardService.getDashboardData(
        startDate,
        endDate
      );
      
      // Update report with the data
      report.getReportData() !== dashboardData ? report['props'].reportData = dashboardData : null;
      
      // Format dates for email subject
      const formattedStartDate = new Date(startDate).toLocaleDateString();
      const formattedEndDate = new Date(endDate).toLocaleDateString();
      
      // Generate PDF report
      const pdfBuffer = await this.reportGeneratorService.generatePdfReport(
        dashboardData,
        startDate,
        endDate
      );
      
      // Generate email preview HTML
      const emailPreviewHtml = this.reportGeneratorService.generateEmailPreview(
        dashboardData,
        startDate,
        endDate
      );
      
      // Send email with PDF attachment
      await this.emailService.sendEmail({
        to: recipientEmail,
        subject: `Weekly Recognition Report: ${formattedStartDate} - ${formattedEndDate}`,
        html: emailPreviewHtml,
        attachments: [
          {
            filename: `Weekly_Recognition_Report_${formattedStartDate}_${formattedEndDate}.pdf`,
            content: pdfBuffer,
            contentType: 'application/pdf'
          }
        ]
      });
      
      // Update report status to sent
      report.markAsSent();
      
      // Save the final report state
      const savedReport = await this.weeklyReportRepository.save(report);
      
      // Return success response
      return {
        reportId: savedReport.getId(),
        startDate,
        endDate,
        sentTo: recipientEmail,
        status: 'sent',
        message: 'Weekly report generated and sent successfully'
      };
    } catch (error) {
      console.error('Error generating weekly report:', error);
      
      // Try to get the report entity (if it was created)
      const existingReport = await this.weeklyReportRepository.getLatest();
      
      if (existingReport) {
        // Mark as failed and save
        existingReport.markAsFailed((error as Error).message);
        await this.weeklyReportRepository.save(existingReport);
        
        return {
          reportId: existingReport.getId(),
          startDate,
          endDate,
          sentTo: recipientEmail,
          status: 'failed',
          message: `Failed to generate weekly report: ${(error as Error).message}`
        };
      }
      
      // If we couldn't get the report, throw the error
      throw error;
    }
  }
} 