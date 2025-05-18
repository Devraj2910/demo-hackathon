import { GetAnalyticsDashboard } from '../../../../application/useCases/getAnalyticsDashboard/GetAnalyticsDashboard';
import { 
  AnalyticsRepository, 
  DashboardTimeRange, 
  TopUserAnalytics,
  TeamAnalytics,
  CardVolumeAnalytics,
  UserActivityAnalytics,
  CombinedMonthlyMetric,
  TitleAnalytics,
  AnalyticsDashboard
} from '../../../../repositories/AnalyticsRepository';
import { GetAnalyticsDashboardRequestDto } from '../../../../application/useCases/getAnalyticsDashboard/GetAnalyticsDashboardRequestDto';

describe('GetAnalyticsDashboard Use Case', () => {
  let mockAnalyticsRepository: jest.Mocked<AnalyticsRepository>;
  let getAnalyticsDashboardUseCase: GetAnalyticsDashboard;
  
  beforeEach(() => {
    // Create mock repository
    mockAnalyticsRepository = {
      getDashboardAnalytics: jest.fn()
    } as unknown as jest.Mocked<AnalyticsRepository>;
    
    // Create use case with mock repository
    getAnalyticsDashboardUseCase = new GetAnalyticsDashboard(mockAnalyticsRepository);
    
    // Reset mocks
    jest.clearAllMocks();
  });
  
  test('should fetch analytics data for requested date range', async () => {
    // Arrange
    const startDate = '2023-01-01';
    const endDate = '2023-01-31';
    
    const mockDashboardData: AnalyticsDashboard = {
      topReceivers: [
        { id: 'user-1', firstName: 'User', lastName: 'One', cardCount: 10 },
        { id: 'user-2', firstName: 'User', lastName: 'Two', cardCount: 8 }
      ],
      topCreators: [
        { id: 'user-3', firstName: 'User', lastName: 'Three', cardCount: 15 },
        { id: 'user-4', firstName: 'User', lastName: 'Four', cardCount: 12 }
      ],
      teamAnalytics: [
        { id: 1, name: 'Team One', cardCount: 25 },
        { id: 2, name: 'Team Two', cardCount: 18 }
      ],
      cardVolume: {
        total: 43
      },
      activeUsers: {
        activeUsers: 20
      },
      monthlyAnalytics: [
        { month: 'Jan', activeUsers: 20, cardsCreated: 43 }
      ],
      titleAnalytics: [
        { title: 'Thank you', count: 20 },
        { title: 'Great job', count: 15 },
        { title: 'Well done', count: 8 }
      ]
    };
    
    mockAnalyticsRepository.getDashboardAnalytics.mockResolvedValue(mockDashboardData);
    
    const request: GetAnalyticsDashboardRequestDto = {
      startDate,
      endDate
    };
    
    // Act
    const result = await getAnalyticsDashboardUseCase.execute(request);
    
    // Assert
    expect(mockAnalyticsRepository.getDashboardAnalytics).toHaveBeenCalledTimes(1);
    expect(mockAnalyticsRepository.getDashboardAnalytics).toHaveBeenCalledWith(
      expect.objectContaining({
        startDate: expect.any(Date),
        endDate: expect.any(Date)
      })
    );
    
    // Verify the dates were properly converted
    const calledWithArg = mockAnalyticsRepository.getDashboardAnalytics.mock.calls[0][0];
    
    // Instead of checking exact ISO strings which can vary with timezones,
    // verify the date components
    const startDateObj = calledWithArg.startDate;
    expect(startDateObj.getFullYear()).toBe(2023);
    expect(startDateObj.getMonth()).toBe(0); // January is 0
    expect(startDateObj.getDate()).toBe(1);
    expect(startDateObj.getHours()).toBe(0);
    expect(startDateObj.getMinutes()).toBe(0);
    expect(startDateObj.getSeconds()).toBe(0);
    
    const endDateObj = calledWithArg.endDate;
    expect(endDateObj.getFullYear()).toBe(2023);
    expect(endDateObj.getMonth()).toBe(0); // January is 0
    expect(endDateObj.getDate()).toBe(31);
    expect(endDateObj.getHours()).toBe(23);
    expect(endDateObj.getMinutes()).toBe(59);
    expect(endDateObj.getSeconds()).toBe(59);
    
    // Verify the result matches the mocked data
    expect(result).toEqual(mockDashboardData);
  });
  
  test('should handle different date formats correctly', async () => {
    // Arrange
    // Using MM-DD-YYYY format
    const startDate = '02-15-2023';
    const endDate = '02-28-2023';
    
    mockAnalyticsRepository.getDashboardAnalytics.mockResolvedValue({
      topReceivers: [],
      topCreators: [],
      teamAnalytics: [],
      cardVolume: { total: 0 },
      activeUsers: { activeUsers: 0 },
      monthlyAnalytics: [],
      titleAnalytics: []
    });
    
    const request: GetAnalyticsDashboardRequestDto = {
      startDate,
      endDate
    };
    
    // Act
    await getAnalyticsDashboardUseCase.execute(request);
    
    // Assert
    const calledWithArg = mockAnalyticsRepository.getDashboardAnalytics.mock.calls[0][0];
    
    // For MM-DD-YYYY format, the Date constructor will handle it correctly
    // We just need to verify the hours are set appropriately
    expect(calledWithArg.startDate.getHours()).toBe(0);
    expect(calledWithArg.startDate.getMinutes()).toBe(0);
    expect(calledWithArg.startDate.getSeconds()).toBe(0);
    
    expect(calledWithArg.endDate.getHours()).toBe(23);
    expect(calledWithArg.endDate.getMinutes()).toBe(59);
    expect(calledWithArg.endDate.getSeconds()).toBe(59);
  });
  
  test('should handle repository errors properly', async () => {
    // Arrange
    const startDate = '2023-01-01';
    const endDate = '2023-01-31';
    
    const request: GetAnalyticsDashboardRequestDto = {
      startDate,
      endDate
    };
    
    const mockError = new Error('Database connection failed');
    mockAnalyticsRepository.getDashboardAnalytics.mockRejectedValue(mockError);
    
    // Act & Assert
    await expect(getAnalyticsDashboardUseCase.execute(request)).rejects.toThrow('Database connection failed');
    expect(mockAnalyticsRepository.getDashboardAnalytics).toHaveBeenCalledTimes(1);
  });
}); 