import { AnalyticsRepository, DashboardTimeRange } from '../../../repositories/AnalyticsRepository';
import { GetAnalyticsDashboardRequestDto } from './GetAnalyticsDashboardRequestDto';
import { GetAnalyticsDashboardResponseDto } from './GetAnalyticsDashboardResponseDto';

export class GetAnalyticsDashboard {
  constructor(private readonly analyticsRepository: AnalyticsRepository) {}

  async execute(requestDto: GetAnalyticsDashboardRequestDto): Promise<GetAnalyticsDashboardResponseDto> {
    // Parse dates from ISO strings
    const timeRange: DashboardTimeRange = {
      startDate: new Date(requestDto.startDate),
      endDate: new Date(requestDto.endDate)
    };

    // Get analytics data
    const dashboardData = await this.analyticsRepository.getDashboardAnalytics(timeRange);

    // Since our repository already returns data in the correct format,
    // we can directly map to the response DTO without any transformations
    return {
      topReceivers: dashboardData.topReceivers,
      topCreators: dashboardData.topCreators,
      teamAnalytics: dashboardData.teamAnalytics,
      cardVolume: dashboardData.cardVolume,
      activeUsers: dashboardData.activeUsers,
      monthlyAnalytics: dashboardData.monthlyAnalytics,
      titleAnalytics: dashboardData.titleAnalytics
    };
  }
} 