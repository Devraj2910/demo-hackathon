import { GetAllTeams } from '../../../../application/useCases/getAllTeams/GetAllTeams';
import { TeamRepository } from '../../../../repositories/TeamRepository';
import { TeamMapper } from '../../../../mapper/TeamMapper';
import { GetAllTeamsResponseDto } from '../../../../application/useCases/getAllTeams/GetAllTeamsResponseDto';
import { Team } from '../../../../domain/entities/Team';

// Mock the TeamMapper to isolate the test
jest.mock('../../../../mapper/TeamMapper', () => ({
  TeamMapper: {
    toDTOList: jest.fn()
  }
}));

describe('GetAllTeams Use Case', () => {
  let mockTeamRepository: jest.Mocked<TeamRepository>;
  let getAllTeamsUseCase: GetAllTeams;
  let mockTeams: Team[];
  let mockTeamDTOs: GetAllTeamsResponseDto[];
  
  beforeEach(() => {
    // Create mock repository
    mockTeamRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    } as jest.Mocked<TeamRepository>;
    
    // Create use case with mock repository
    getAllTeamsUseCase = new GetAllTeams(mockTeamRepository);
    
    // Create mock teams using the Team.create factory method
    const team1 = Team.create({
      id: 1,
      name: 'Team 1',
      description: 'Description 1',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    const team2 = Team.create({
      id: 2,
      name: 'Team 2',
      description: 'Description 2',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    mockTeams = [team1, team2];
    
    mockTeamDTOs = [
      {
        id: 1,
        name: 'Team 1',
        description: 'Description 1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 2,
        name: 'Team 2',
        description: 'Description 2',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    
    // Reset and configure mocks
    jest.clearAllMocks();
    (TeamMapper.toDTOList as jest.Mock).mockReturnValue(mockTeamDTOs);
  });
  
  test('should return all teams successfully', async () => {
    // Arrange
    mockTeamRepository.findAll.mockResolvedValue(mockTeams);
    
    // Act
    const result = await getAllTeamsUseCase.execute();
    
    // Assert
    expect(mockTeamRepository.findAll).toHaveBeenCalledTimes(1);
    expect(TeamMapper.toDTOList).toHaveBeenCalledWith(mockTeams);
    expect(result).toEqual(mockTeamDTOs);
  });
  
  test('should return empty array when no teams exist', async () => {
    // Arrange
    const emptyTeams: Team[] = [];
    const emptyDTOs: GetAllTeamsResponseDto[] = [];
    
    mockTeamRepository.findAll.mockResolvedValue(emptyTeams);
    (TeamMapper.toDTOList as jest.Mock).mockReturnValue(emptyDTOs);
    
    // Act
    const result = await getAllTeamsUseCase.execute();
    
    // Assert
    expect(mockTeamRepository.findAll).toHaveBeenCalledTimes(1);
    expect(TeamMapper.toDTOList).toHaveBeenCalledWith(emptyTeams);
    expect(result).toEqual(emptyDTOs);
    expect(result.length).toBe(0);
  });
  
  test('should handle repository errors and propagate them', async () => {
    // Arrange
    const testError = new Error('Database connection failed');
    mockTeamRepository.findAll.mockRejectedValue(testError);
    
    // Act & Assert
    await expect(getAllTeamsUseCase.execute()).rejects.toThrow(testError);
    expect(mockTeamRepository.findAll).toHaveBeenCalledTimes(1);
    expect(TeamMapper.toDTOList).not.toHaveBeenCalled();
  });
}); 