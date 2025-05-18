import { Pool } from 'pg';
import { 
  AnalyticsRepository, 
  AnalyticsDashboard, 
  DashboardTimeRange, 
  TopUserAnalytics,
  TeamAnalytics,
  CardVolumeAnalytics,
  UserActivityAnalytics,
  MonthlyAnalytics,
  CombinedMonthlyMetric,
  TitleAnalytics
} from '../../repositories/AnalyticsRepository';
import { AnalyticsMapper } from '../../mapper/AnalyticsMapper';

export class PostgresAnalyticsRepository implements AnalyticsRepository {
  constructor(private readonly pool: Pool) {}

  async getDashboardAnalytics(timeRange: DashboardTimeRange): Promise<AnalyticsDashboard> {
    const { startDate, endDate } = timeRange;
    
    // Get all analytics data in parallel for better performance
    const [
      topReceivers,
      topCreators,
      teamAnalytics,
      cardVolume,
      activeUsers,
      monthlyAnalytics,
      titleAnalytics
    ] = await Promise.all([
      this.getTopReceivers(startDate, endDate),
      this.getTopCreators(startDate, endDate),
      this.getTeamCardCount(startDate, endDate),
      this.getTotalCards(startDate, endDate),
      this.getActiveUsers(startDate, endDate),
      this.getCombinedMonthlyAnalytics(),
      this.getTitleAnalytics(startDate, endDate)
    ]);

    return {
      topReceivers,
      topCreators,
      teamAnalytics,
      cardVolume,
      activeUsers,
      monthlyAnalytics,
      titleAnalytics
    };
  }

  private async getTopReceivers(startDate: Date, endDate: Date): Promise<TopUserAnalytics[]> {
    const query = `
      SELECT u.id, u.first_name, u.last_name, COUNT(*) as card_count
      FROM cards c
      JOIN users u ON c.created_for = u.id 
      WHERE c.created_at BETWEEN $1 AND $2 AND u.permission = 'approved'
      GROUP BY u.id, u.first_name, u.last_name
      ORDER BY card_count DESC
      LIMIT 5
    `;

    const result = await this.pool.query(query, [startDate, endDate]);
    return AnalyticsMapper.toTopUserAnalyticsList(result.rows);
  }

  private async getTopCreators(startDate: Date, endDate: Date): Promise<TopUserAnalytics[]> {
    const query = `
      SELECT u.id, u.first_name, u.last_name, COUNT(*) as card_count
      FROM cards c
      JOIN users u ON c.user_id = u.id
      WHERE c.created_at BETWEEN $1 AND $2 AND u.permission = 'approved'
      GROUP BY u.id, u.first_name, u.last_name
      ORDER BY card_count DESC
      LIMIT 5
    `;

    const result = await this.pool.query(query, [startDate, endDate]);
    return AnalyticsMapper.toTopUserAnalyticsList(result.rows);
  }

  private async getTeamCardCount(startDate: Date, endDate: Date): Promise<TeamAnalytics[]> {
    const query = `
     SELECT
       t.id, 
       t.name,
       COUNT(*) as card_count
      FROM cards c
      JOIN teams t ON 
          c.team_id = t.id 
      WHERE c.created_at BETWEEN $1 AND $2
      GROUP BY t.id, t.name
      ORDER BY card_count DESC;
    `;

    const result = await this.pool.query(query, [startDate, endDate]);
    return AnalyticsMapper.toTeamAnalyticsList(result.rows);
  }

  private async getTitleAnalytics(startDate: Date, endDate: Date): Promise<TitleAnalytics[]> {
    const query = `
      SELECT 
        title,
        COUNT(*) as count
      FROM cards
      WHERE created_at BETWEEN $1 AND $2
      GROUP BY title
      ORDER BY count DESC
      LIMIT 10
    `;

    const result = await this.pool.query(query, [startDate, endDate]);
    return AnalyticsMapper.toTitleAnalyticsList(result.rows);
  }

  private async getTotalCards(startDate: Date, endDate: Date): Promise<CardVolumeAnalytics> {
    const query = `
      SELECT COUNT(*) as total_cards
      FROM cards
      WHERE created_at BETWEEN $1 AND $2
    `;

    const result = await this.pool.query(query, [startDate, endDate]);
    return AnalyticsMapper.toCardVolumeAnalytics(result.rows[0]);
  }

  private async getActiveUsers(startDate: Date, endDate: Date): Promise<UserActivityAnalytics> {
    const query = `
      SELECT COUNT(DISTINCT user_id) as active_users
      FROM cards
      WHERE created_at BETWEEN $1 AND $2
    `;

    const result = await this.pool.query(query, [startDate, endDate]);
    return AnalyticsMapper.toUserActivityAnalytics(result.rows[0]);
  }

  private async getCombinedMonthlyAnalytics(): Promise<CombinedMonthlyMetric[]> {
    const [monthlyCards, monthlyUsers] = await Promise.all([
      this.getMonthlyCardsCreated(),
      this.getMonthlyActiveUsers()
    ]);

    return AnalyticsMapper.toCombinedMonthlyMetrics(monthlyCards, monthlyUsers);
  }

  private async getMonthlyCardsCreated() {
    // Get cards created per month for the last year
    const query = `
      SELECT 
        TO_CHAR(DATE_TRUNC('month', created_at), 'YYYY-MM') as month,
        COUNT(*) as count
      FROM cards
      WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '11 months')
      GROUP BY DATE_TRUNC('month', created_at)
      ORDER BY DATE_TRUNC('month', created_at) ASC
    `;

    const result = await this.pool.query(query);
    return AnalyticsMapper.toMonthlyMetricList(result.rows);
  }

  private async getMonthlyActiveUsers() {
    // Get unique users who created cards per month for the last year
    const query = `
      SELECT 
        TO_CHAR(DATE_TRUNC('month', created_at), 'YYYY-MM') as month,
        COUNT(DISTINCT user_id) as count
      FROM cards
      WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '11 months')
      GROUP BY DATE_TRUNC('month', created_at)
      ORDER BY DATE_TRUNC('month', created_at) ASC
    `;

    const result = await this.pool.query(query);
    return AnalyticsMapper.toMonthlyMetricList(result.rows);
  }
} 