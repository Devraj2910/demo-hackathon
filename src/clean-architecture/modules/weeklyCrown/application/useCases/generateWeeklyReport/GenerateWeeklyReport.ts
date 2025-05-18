import { WeeklyReportRepository } from '../../../repositories/WeeklyReportRepository';
import { GenerateWeeklyReportRequestDto } from './GenerateWeeklyReportRequestDto';
import { GenerateWeeklyReportResponseDto } from './GenerateWeeklyReportResponseDto';
import { AnalyticsDashboardService } from '../../../infrastructure/services/AnalyticsDashboardService';
import { ReportGeneratorService } from '../../../infrastructure/services/ReportGeneratorService';
import { EmailService } from '../../../../../../services/email.service';
import { WeeklyReport } from '../../../domain/entities/WeeklyReport';
import { v4 as uuidv4 } from 'uuid';

export class GenerateWeeklyReport {
  constructor(
    private weeklyReportRepository: WeeklyReportRepository,
    private analyticsDashboardService: AnalyticsDashboardService,
    private reportGeneratorService: ReportGeneratorService,
    private emailService: EmailService
  ) {}

  async execute(request: GenerateWeeklyReportRequestDto): Promise<GenerateWeeklyReportResponseDto> {
    try {
      // Create a new report entry in the database
      const reportId = await this.createReportEntry(request);
      
      // Generate the report asynchronously
      const result = await this.generateAndSendReport(reportId, request);
      
      return result;
    } catch (error: any) {
      console.error('Failed to generate weekly report:', error);
      throw new Error(`Failed to generate weekly report: ${error.message || 'Unknown error'}`);
    }
  }

  // Create a new report entry in the database
  private async createReportEntry(request: GenerateWeeklyReportRequestDto): Promise<string> {
    // Generate a new reportId
    const reportId = uuidv4();
    
    // Create a WeeklyReport entity
    const report = WeeklyReport.create({
      id: reportId,
      startDate: new Date(request.startDate),
      endDate: new Date(request.endDate),
      createdAt: new Date(),
      reportData: {}, // Initialize with empty object instead of null
      sentTo: request.recipientEmail,
      status: 'pending'
    });
    
    // Save the report entity
    await this.weeklyReportRepository.save(report);
    
    return reportId;
  }

  // Generate and send the report
  private async generateAndSendReport(
    reportId: string, 
    request: GenerateWeeklyReportRequestDto
  ): Promise<GenerateWeeklyReportResponseDto> {
    try {
      // Fetch analytics data
      const analyticsData = await this.analyticsDashboardService.getDashboardData(
        request.startDate,
        request.endDate
      );
      
      // Generate PDF report
      let fileAttachment: Buffer;
      let filename: string;
      let contentType: string;
      let isHtmlFallback = false;
      
      try {
        // Try to generate PDF
        fileAttachment = await this.reportGeneratorService.generatePdfReport(
          analyticsData,
          request.startDate,
          request.endDate
        );
        filename = `weekly-report-${new Date().toISOString().split('T')[0]}.pdf`;
        contentType = 'application/pdf';
      } catch (pdfError) {
        console.error('PDF generation failed, using HTML fallback:', pdfError);
        
        // Fall back to HTML if PDF generation fails
        fileAttachment = Buffer.from(this.reportGeneratorService.generateHtmlReport(
          analyticsData,
          request.startDate,
          request.endDate
        ));
        filename = `weekly-report-${new Date().toISOString().split('T')[0]}.html`;
        contentType = 'text/html';
        isHtmlFallback = true;
      }
      
      // Generate email preview
      const emailHtml = this.reportGeneratorService.generateEmailPreview(
        analyticsData,
        request.startDate,
        request.endDate
      );
      
      // Add a note if we're using the HTML fallback
      const emailSubject = isHtmlFallback
        ? 'Weekly Recognition Report (HTML Version) - PDF Generation Failed'
        : 'Weekly Recognition Report';
      
      // Send email with attachment
      await this.emailService.sendEmail({
        to: request.recipientEmail,
        subject: emailSubject,
        html: emailHtml,
        attachments: [
          {
            filename,
            content: fileAttachment,
            contentType
          }
        ]
      });
      
      // Update report status to "sent"
      const report = await this.weeklyReportRepository.getById(reportId);
      if (report) {
        report.markAsSent();
        await this.weeklyReportRepository.save(report);
      }
      
      return {
        reportId,
        startDate: request.startDate,
        endDate: request.endDate,
        sentTo: request.recipientEmail,
        status: 'sent', // Use 'sent' instead of 'completed' to match the allowed status values
        message: 'Weekly report generated and sent successfully'
      };
    } catch (error: any) {
      // Update report status to "failed"
      const report = await this.weeklyReportRepository.getById(reportId);
      if (report) {
        report.markAsFailed(error.message || 'Unknown error');
        await this.weeklyReportRepository.save(report);
      }
      
      return {
        reportId,
        startDate: request.startDate,
        endDate: request.endDate,
        sentTo: request.recipientEmail,
        status: 'failed',
        message: error.message || 'Unknown error'
      };
    }
  }
} 