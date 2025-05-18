import { DeleteTeam } from '../application/useCases/deleteTeam/DeleteTeam';
import { TeamRepository } from '../repositories/TeamRepository';
import { Team } from '../domain/entities/Team';

describe('DeleteTeam', () => {
  let mockTeamRepository: jest.Mocked<TeamRepository>;
  let deleteTeam: DeleteTeam;
  
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
    deleteTeam = new DeleteTeam(mockTeamRepository);
  });
  
  it('should delete a team successfully when it exists', async () => {
    // Arrange
    const teamId = 1;
    
    const mockTeam = Team.create({
      id: teamId,
      name: 'Engineering Team',
      description: 'Team responsible for development',
      createdAt: new Date('2023-01-01T00:00:00.000Z'),
      updatedAt: new Date('2023-01-01T00:00:00.000Z')
    });
    
    // Mock repository methods
    mockTeamRepository.findById.mockResolvedValue(mockTeam);
    mockTeamRepository.delete.mockResolvedValue();
    
    // Act
    const result = await deleteTeam.execute({ id: teamId });
    
    // Assert
    expect(mockTeamRepository.findById).toHaveBeenCalledWith(teamId);
    expect(mockTeamRepository.delete).toHaveBeenCalledWith(teamId);
    expect(result).toEqual({ success: true });
  });
  
  it('should throw an error when team does not exist', async () => {
    // Arrange
    const teamId = 999;
    
    // Mock repository methods
    mockTeamRepository.findById.mockResolvedValue(null);
    
    // Act & Assert
    await expect(deleteTeam.execute({ id: teamId }))
      .rejects
      .toThrow(`Team with ID ${teamId} not found`);
    
    expect(mockTeamRepository.findById).toHaveBeenCalledWith(teamId);
    expect(mockTeamRepository.delete).not.toHaveBeenCalled();
  });
}); 