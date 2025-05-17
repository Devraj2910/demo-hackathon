import { 
  TopUserAnalytics, 
  TeamAnalytics, 
  CardVolumeAnalytics, 
  UserActivityAnalytics,
  MonthlyMetric,
  CombinedMonthlyMetric,
  TitleAnalytics
} from '../repositories/AnalyticsRepository';

interface TopUserRow {
  id: string;
  first_name: string | null;
  last_name: string | null;
  card_count: string; // PostgreSQL COUNT returns string
}

interface TeamAnalyticsRow {
  id: number;
  name: string;
  card_count: string; // PostgreSQL COUNT returns string
}

interface CardVolumeRow {
  total_cards: string; // PostgreSQL COUNT returns string
}

interface ActiveUsersRow {
  active_users: string; // PostgreSQL COUNT returns string
}

interface MonthlyMetricRow {
  month: string; // Format: "YYYY-MM"
  count: string; // PostgreSQL COUNT returns string
}

interface TitleAnalyticsRow {
  title: string;
  count: string; // PostgreSQL COUNT returns string
}

export class AnalyticsMapper {
  /**
   * Maps database rows to TopUserAnalytics objects
   */
  static toTopUserAnalyticsList(rows: TopUserRow[]): TopUserAnalytics[] {
    return rows.map(row => ({
      id: row.id,
      firstName: row.first_name,
      lastName: row.last_name,
      cardCount: parseInt(row.card_count, 10)
    }));
  }

  /**
   * Maps database rows to TeamAnalytics objects
   */
  static toTeamAnalyticsList(rows: TeamAnalyticsRow[]): TeamAnalytics[] {
    return rows.map(row => ({
      id: row.id,
      name: row.name,
      cardCount: parseInt(row.card_count, 10)
    }));
  }

  /**
   * Maps database row to CardVolumeAnalytics object
   */
  static toCardVolumeAnalytics(row: CardVolumeRow): CardVolumeAnalytics {
    return {
      total: parseInt(row.total_cards, 10)
    };
  }

  /**
   * Maps database row to UserActivityAnalytics object
   */
  static toUserActivityAnalytics(row: ActiveUsersRow): UserActivityAnalytics {
    return {
      activeUsers: parseInt(row.active_users, 10)
    };
  }

  /**
   * Maps database rows to TitleAnalytics objects
   */
  static toTitleAnalyticsList(rows: TitleAnalyticsRow[]): TitleAnalytics[] {
    return rows.map(row => ({
      title: row.title,
      count: parseInt(row.count, 10)
    }));
  }

  /**
   * Maps database rows to MonthlyMetric objects
   */
  static toMonthlyMetricList(rows: MonthlyMetricRow[]): MonthlyMetric[] {
    return rows.map(row => ({
      month: row.month,
      count: parseInt(row.count, 10)
    }));
  }
  
  /**
   * Combines cards created and active users metrics into a single array
   * with formatted month names
   */
  static toCombinedMonthlyMetrics(
    cardsCreated: MonthlyMetric[], 
    activeUsers: MonthlyMetric[]
  ): CombinedMonthlyMetric[] {
    // Create a map of all months to ensure we include all months even if no data
    const monthsMap: { [key: string]: CombinedMonthlyMetric } = {};
    
    // Initialize with all months from the past year
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    
    // Create entries for the last 12 months
    for (let i = 0; i < 12; i++) {
      // Calculate month index (0-11) going backward from current month
      const monthIndex = (currentMonth - i + 12) % 12;
      const year = currentYear - (currentMonth < i ? 1 : 0);
      
      // Create key in YYYY-MM format for matching with database results
      const key = `${year}-${String(monthIndex + 1).padStart(2, '0')}`;
      
      monthsMap[key] = {
        month: months[monthIndex],
        activeUsers: 0,
        cardsCreated: 0
      };
    }
    
    // Add cards created data
    cardsCreated.forEach(item => {
      const [year, month] = item.month.split('-');
      const monthIndex = parseInt(month, 10) - 1;
      const key = item.month;
      
      if (monthsMap[key]) {
        monthsMap[key].cardsCreated = item.count;
      }
    });
    
    // Add active users data
    activeUsers.forEach(item => {
      const key = item.month;
      
      if (monthsMap[key]) {
        monthsMap[key].activeUsers = item.count;
      }
    });
    
    // Convert map to array and sort by date (oldest to newest)
    return Object.values(monthsMap).reverse();
  }
} 