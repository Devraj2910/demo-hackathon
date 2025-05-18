import { GenerateWeeklyReport } from './GenerateWeeklyReport';
import { WeeklyReportRepositoryImpl } from '../../../infrastructure/repositories/WeeklyReportRepositoryImpl';
import { AnalyticsDashboardService } from '../../../infrastructure/services/AnalyticsDashboardService';
import { ReportGeneratorService } from '../../../infrastructure/services/ReportGeneratorService';
import { EmailService } from '../../../../../../services/email.service';

export class GenerateWeeklyReportFactory {
  static create() {
    const weeklyReportRepository = new WeeklyReportRepositoryImpl();
    const analyticsDashboardService = AnalyticsDashboardService.getInstance();
    const reportGeneratorService = ReportGeneratorService.getInstance();
    const emailService = EmailService.getInstance();
    
    const useCase = new GenerateWeeklyReport(
      weeklyReportRepository,
      analyticsDashboardService,
      reportGeneratorService,
      emailService
    );
    
    return { useCase };
  }
} 