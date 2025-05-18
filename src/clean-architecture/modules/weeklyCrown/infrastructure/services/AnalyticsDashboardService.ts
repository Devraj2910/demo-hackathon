import axios from 'axios';
import { GetAnalyticsDashboardResponseDto } from '../../../analytics/application/useCases/getAnalyticsDashboard/GetAnalyticsDashboardResponseDto';

export class AnalyticsDashboardService {
  private static instance: AnalyticsDashboardService;
  private apiUrl: string;

  private constructor() {
    // Get API URL from environment or use default
    this.apiUrl = process.env.API_URL || 'http://localhost:3000/api';
  }

  public static getInstance(): AnalyticsDashboardService {
    if (!AnalyticsDashboardService.instance) {
      AnalyticsDashboardService.instance = new AnalyticsDashboardService();
    }
    return AnalyticsDashboardService.instance;
  }

  /**
   * Get analytics dashboard data for the specified date range
   * @param startDate Start date (ISO string)
   * @param endDate End date (ISO string)
   * @returns Dashboard data
   */
  public async getDashboardData(
    startDate: string,
    endDate: string
  ): Promise<GetAnalyticsDashboardResponseDto> {
    try {
      const response = await axios.get(`${this.apiUrl}/analytics/dashboard`, {
        params: {
          startDate,
          endDate
        }
      });

      if (response.data && response.data.success) {
        return response.data.data;
      } else {
        throw new Error('Failed to get analytics dashboard data');
      }
    } catch (error) {
      console.error('Error fetching analytics dashboard data:', error);
      throw error;
    }
  }
} 