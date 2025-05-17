export interface TopUserDto {
  id: string;
  firstName: string | null;
  lastName: string | null;
  cardCount: number;
}

export interface TeamAnalyticsDto {
  id: number;
  name: string;
  cardCount: number;
}

export interface CombinedMonthlyMetricDto {
  month: string; // Month name (e.g., "Jan")
  activeUsers: number;
  cardsCreated: number;
}

export interface TitleAnalyticsDto {
  title: string;
  count: number;
}

export interface GetAnalyticsDashboardResponseDto {
  topReceivers: TopUserDto[];
  topCreators: TopUserDto[];
  teamAnalytics: TeamAnalyticsDto[];
  cardVolume: {
    total: number;
  };
  activeUsers: {
    activeUsers: number;
  };
  monthlyAnalytics: CombinedMonthlyMetricDto[];
  titleAnalytics: TitleAnalyticsDto[];
} 