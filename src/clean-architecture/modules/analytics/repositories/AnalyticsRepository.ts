export interface DashboardTimeRange {
  startDate: Date;
  endDate: Date;
}

export interface TopUserAnalytics {
  id: string;
  firstName: string | null;
  lastName: string | null;
  cardCount: number;
}

export interface TeamAnalytics {
  id: number;
  name: string;
  cardCount: number;
}

export interface CardVolumeAnalytics {
  total: number;
}

export interface UserActivityAnalytics {
  activeUsers: number;
}

export interface TitleAnalytics {
  title: string;
  count: number;
}

export interface MonthlyMetric {
  month: string; // Format: "YYYY-MM"
  count: number;
}

export interface CombinedMonthlyMetric {
  month: string; // Month name (e.g., "Jan")
  activeUsers: number;
  cardsCreated: number;
}

export interface MonthlyAnalytics {
  cardsCreated: MonthlyMetric[];
  activeUsers: MonthlyMetric[];
}

export interface AnalyticsDashboard {
  topReceivers: TopUserAnalytics[];
  topCreators: TopUserAnalytics[];
  teamAnalytics: TeamAnalytics[];
  cardVolume: CardVolumeAnalytics;
  activeUsers: UserActivityAnalytics;
  monthlyAnalytics: CombinedMonthlyMetric[];
  titleAnalytics: TitleAnalytics[];
}

export interface AnalyticsRepository {
  /**
   * Get comprehensive analytics dashboard data for the specified time period
   * @param timeRange The time range to analyze
   * @returns Promise containing all analytics metrics
   */
  getDashboardAnalytics(timeRange: DashboardTimeRange): Promise<AnalyticsDashboard>;
} 