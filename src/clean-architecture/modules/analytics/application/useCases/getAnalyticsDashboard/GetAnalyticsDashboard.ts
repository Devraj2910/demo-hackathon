import { AnalyticsRepository, DashboardTimeRange } from '../../../repositories/AnalyticsRepository';
import { GetAnalyticsDashboardRequestDto } from './GetAnalyticsDashboardRequestDto';
import { GetAnalyticsDashboardResponseDto } from './GetAnalyticsDashboardResponseDto';

export class GetAnalyticsDashboard {
  constructor(private readonly analyticsRepository: AnalyticsRepository) {}

  async execute(requestDto: GetAnalyticsDashboardRequestDto): Promise<GetAnalyticsDashboardResponseDto> {
    // Parse dates from ISO strings and set proper time ranges
    const timeRange: DashboardTimeRange = this.getTimeRange(requestDto);

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

  private getTimeRange(requestDto: GetAnalyticsDashboardRequestDto) {
    const startDate = new Date(requestDto.startDate);
    startDate.setHours(0, 0, 0, 0); // Set to beginning of day (00:00:00)

    const endDate = new Date(requestDto.endDate);
    endDate.setHours(23, 59, 59, 999); // Set to end of day (23:59:59.999)

    const timeRange: DashboardTimeRange = {
      startDate,
      endDate
    };
    return timeRange;
  }
} 