import { GetPendingUsers } from '../../../../application/useCases/getPendingUsers/GetPendingUsers';
import { AdminUserRepository, UserWithTeam } from '../../../../repositories/AdminUserRepository';
import { TeamAssignment } from '../../../../../team/domain/entities/TeamAssignment';
import { User } from '../../../../../login/domain/entities/user';

describe('GetPendingUsers Use Case', () => {
  let mockAdminUserRepository: jest.Mocked<AdminUserRepository>;
  let getPendingUsersUseCase: GetPendingUsers;
  
  beforeEach(() => {
    // Create mock repository
    mockAdminUserRepository = {
      getPendingUsersWithTeam: jest.fn()
    } as unknown as jest.Mocked<AdminUserRepository>;
    
    // Create use case with mock repository
    getPendingUsersUseCase = new GetPendingUsers(mockAdminUserRepository);
    
    // Reset mocks
    jest.clearAllMocks();
  });
  
  test('should return pending users with team information', async () => {
    // Arrange
    const mockUser1Props = {
      id: 'user-1',
      email: 'user1@example.com',
      passwordHash: 'hash1',
      firstName: 'John',
      lastName: 'Doe',
      permission: 'user',
      role: 'developer',
      position: 'Software Engineer',
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01')
    };
    
    const mockUser2Props = {
      id: 'user-2',
      email: 'user2@example.com',
      passwordHash: 'hash2',
      firstName: 'Jane',
      lastName: 'Smith',
      permission: 'user',
      role: 'designer',
      position: 'UI/UX Designer',
      createdAt: new Date('2023-01-02'),
      updatedAt: new Date('2023-01-02')
    };
    
    // Create proper User instances
    const mockUser1 = User.create(mockUser1Props);
    const mockUser2 = User.create(mockUser2Props);
    
    const mockTeamAssignment: TeamAssignment = {
      id: '1',
      userId: 'user-1',
      teamId: 1,
      effectiveFrom: new Date('2023-01-01'),
      effectiveTo: null
    };
    
    // Create properly typed UserWithTeam objects
    const mockPendingUsersData: UserWithTeam[] = [
      { 
        user: mockUser1, 
        teamAssignment: mockTeamAssignment, 
        teamName: 'Engineering'
      },
      { 
        user: mockUser2, 
        teamAssignment: null
      }
    ];
    
    // Mock repository response
    mockAdminUserRepository.getPendingUsersWithTeam.mockResolvedValue(mockPendingUsersData);
    
    // Act
    const result = await getPendingUsersUseCase.execute();
    
    // Assert
    expect(mockAdminUserRepository.getPendingUsersWithTeam).toHaveBeenCalledTimes(1);
    
    expect(result).toEqual({
      users: [
        {
          id: 'user-1',
          email: 'user1@example.com',
          firstName: 'John',
          lastName: 'Doe',
          permission: 'user',
          role: 'developer',
          position: 'Software Engineer',
          createdAt: mockUser1Props.createdAt,
          updatedAt: mockUser1Props.updatedAt,
          teamAssignment: {
            id: '1',
            userId: 'user-1',
            teamId: 1,
            effectiveFrom: mockTeamAssignment.effectiveFrom,
            effectiveTo: null
          },
          teamName: 'Engineering'
        },
        {
          id: 'user-2',
          email: 'user2@example.com',
          firstName: 'Jane',
          lastName: 'Smith',
          permission: 'user',
          role: 'designer',
          position: 'UI/UX Designer',
          createdAt: mockUser2Props.createdAt,
          updatedAt: mockUser2Props.updatedAt,
          teamAssignment: null,
          teamName: undefined
        }
      ]
    });
  });
  
  test('should handle empty users list', async () => {
    // Mock repository to return empty array
    mockAdminUserRepository.getPendingUsersWithTeam.mockResolvedValue([]);
    
    // Act
    const result = await getPendingUsersUseCase.execute();
    
    // Assert
    expect(mockAdminUserRepository.getPendingUsersWithTeam).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ users: [] });
  });
}); 