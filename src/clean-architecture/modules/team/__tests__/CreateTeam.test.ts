import { CreateTeam } from '../application/useCases/createTeam/CreateTeam';
import { TeamRepository } from '../repositories/TeamRepository';
import { Team } from '../domain/entities/Team';

describe('CreateTeam', () => {
  let mockTeamRepository: jest.Mocked<TeamRepository>;
  let createTeam: CreateTeam;
  
  beforeEach(() => {
    // Create mock repository
    mockTeamRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<TeamRepository>;
    
    // Create the use case with the mock repository
    createTeam = new CreateTeam(mockTeamRepository);
  });
  
  it('should create a team successfully', async () => {
    // Arrange
    const requestDto = {
      name: 'Engineering Team',
      description: 'Team responsible for development'
    };
    
    const mockTeam = Team.create({
      id: 1,
      name: requestDto.name,
      description: requestDto.description,
      createdAt: new Date('2023-01-01T00:00:00.000Z'),
      updatedAt: new Date('2023-01-01T00:00:00.000Z')
    });
    
    // Mock the create method to return a team with ID
    mockTeamRepository.create.mockResolvedValue(mockTeam);
    
    // Act
    const result = await createTeam.execute(requestDto);
    
    // Assert
    expect(mockTeamRepository.create).toHaveBeenCalled();
    expect(result).toEqual({
      id: 1,
      name: requestDto.name,
      description: requestDto.description,
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z'
    });
  });
  
  it('should create a team without a description', async () => {
    // Arrange
    const requestDto = {
      name: 'Marketing Team'
    };
    
    const mockTeam = Team.create({
      id: 2,
      name: requestDto.name,
      createdAt: new Date('2023-01-01T00:00:00.000Z'),
      updatedAt: new Date('2023-01-01T00:00:00.000Z')
    });
    
    // Mock the create method to return a team with ID
    mockTeamRepository.create.mockResolvedValue(mockTeam);
    
    // Act
    const result = await createTeam.execute(requestDto);
    
    // Assert
    expect(mockTeamRepository.create).toHaveBeenCalled();
    expect(result).toEqual({
      id: 2,
      name: requestDto.name,
      description: undefined,
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z'
    });
  });
}); 