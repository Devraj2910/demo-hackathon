import { ChangeUserTeam } from '../../../../application/useCases/changeUserTeam/ChangeUserTeam';
import { AdminTeamAssignmentRepository } from '../../../../repositories/AdminTeamAssignmentRepository';
import { AdminTeamRepository } from '../../../../repositories/AdminTeamRepository';
import { ChangeUserTeamRequestDto } from '../../../../application/useCases/changeUserTeam/ChangeUserTeamRequestDto';
import { TeamAssignment } from '../../../../../team/domain/entities/TeamAssignment';
import { Team } from '../../../../../team/domain/entities/Team';
import { User } from '../../../../../login/domain/entities/user';

describe('ChangeUserTeam Use Case', () => {
  let mockAdminTeamAssignmentRepository: jest.Mocked<AdminTeamAssignmentRepository>;
  let mockAdminTeamRepository: jest.Mocked<AdminTeamRepository>;
  let changeUserTeamUseCase: ChangeUserTeam;
  
  beforeEach(() => {
    // Create mock repositories
    mockAdminTeamAssignmentRepository = {
      getCurrentTeamAssignment: jest.fn(),
      changeUserTeam: jest.fn()
    } as unknown as jest.Mocked<AdminTeamAssignmentRepository>;
    
    mockAdminTeamRepository = {
      getTeamsWithEffectiveUsers: jest.fn()
    } as unknown as jest.Mocked<AdminTeamRepository>;
    
    // Create use case with mock repositories
    changeUserTeamUseCase = new ChangeUserTeam(
      mockAdminTeamAssignmentRepository,
      mockAdminTeamRepository
    );
    
    // Reset mocks
    jest.clearAllMocks();
  });
  
  test('should move user from one team to another', async () => {
    // Arrange
    const userId = 'user-1';
    const oldTeamId = 1;
    const newTeamId = 2;
    
    const teamMock = {
      getId: jest.fn().mockReturnValue(newTeamId)
    } as unknown as Team;
    
    const oldAssignment = {
      id: '1',
      userId,
      teamId: oldTeamId,
      effectiveFrom: new Date('2023-01-01'),
      effectiveTo: null
    } as TeamAssignment;
    
    const newAssignment = {
      id: '2',
      userId,
      teamId: newTeamId,
      effectiveFrom: new Date('2023-02-01'),
      effectiveTo: null
    } as TeamAssignment;
    
    // Mock repository responses
    mockAdminTeamRepository.getTeamsWithEffectiveUsers.mockResolvedValue([
      { team: teamMock, users: [] }
    ]);
    
    mockAdminTeamAssignmentRepository.getCurrentTeamAssignment.mockResolvedValue(oldAssignment);
    mockAdminTeamAssignmentRepository.changeUserTeam.mockResolvedValue(newAssignment);
    
    const request: ChangeUserTeamRequestDto = {
      userId,
      teamId: newTeamId
    };
    
    // Act
    const result = await changeUserTeamUseCase.execute(request);
    
    // Assert
    expect(mockAdminTeamRepository.getTeamsWithEffectiveUsers).toHaveBeenCalledTimes(1);
    expect(mockAdminTeamAssignmentRepository.getCurrentTeamAssignment).toHaveBeenCalledWith(userId);
    expect(mockAdminTeamAssignmentRepository.changeUserTeam).toHaveBeenCalledWith(userId, newTeamId);
    
    expect(result).toEqual({
      previousAssignment: expect.objectContaining({
        userId,
        teamId: oldTeamId
      }),
      newAssignment: expect.objectContaining({
        userId,
        teamId: newTeamId
      }),
      message: `User has been moved from team ${oldTeamId} to team ${newTeamId}`
    });
  });
  
  test('should assign user to a team for the first time', async () => {
    // Arrange
    const userId = 'user-1';
    const teamId = 2;
    
    const teamMock = {
      getId: jest.fn().mockReturnValue(teamId)
    } as unknown as Team;
    
    const newAssignment = {
      id: '1',
      userId,
      teamId,
      effectiveFrom: new Date('2023-01-01'),
      effectiveTo: null
    } as TeamAssignment;
    
    // Mock repository responses
    mockAdminTeamRepository.getTeamsWithEffectiveUsers.mockResolvedValue([
      { team: teamMock, users: [] }
    ]);
    
    mockAdminTeamAssignmentRepository.getCurrentTeamAssignment.mockResolvedValue(null);
    mockAdminTeamAssignmentRepository.changeUserTeam.mockResolvedValue(newAssignment);
    
    const request: ChangeUserTeamRequestDto = {
      userId,
      teamId
    };
    
    // Act
    const result = await changeUserTeamUseCase.execute(request);
    
    // Assert
    expect(mockAdminTeamRepository.getTeamsWithEffectiveUsers).toHaveBeenCalledTimes(1);
    expect(mockAdminTeamAssignmentRepository.getCurrentTeamAssignment).toHaveBeenCalledWith(userId);
    expect(mockAdminTeamAssignmentRepository.changeUserTeam).toHaveBeenCalledWith(userId, teamId);
    
    expect(result).toEqual({
      previousAssignment: null,
      newAssignment: expect.objectContaining({
        userId,
        teamId
      }),
      message: `User has been assigned to team ${teamId}`
    });
  });
  
  test('should throw error when team does not exist', async () => {
    // Arrange
    const userId = 'user-1';
    const teamId = 999; // Non-existent team ID
    
    const existingTeamMock = {
      getId: jest.fn().mockReturnValue(1) // Different ID than requested
    } as unknown as Team;
    
    // Mock repository responses
    mockAdminTeamRepository.getTeamsWithEffectiveUsers.mockResolvedValue([
      { team: existingTeamMock, users: [] }
    ]);
    
    const request: ChangeUserTeamRequestDto = {
      userId,
      teamId
    };
    
    // Act & Assert
    await expect(changeUserTeamUseCase.execute(request))
      .rejects
      .toThrow(`Team with ID ${teamId} does not exist`);
    
    expect(mockAdminTeamRepository.getTeamsWithEffectiveUsers).toHaveBeenCalledTimes(1);
    expect(mockAdminTeamAssignmentRepository.changeUserTeam).not.toHaveBeenCalled();
  });
}); 