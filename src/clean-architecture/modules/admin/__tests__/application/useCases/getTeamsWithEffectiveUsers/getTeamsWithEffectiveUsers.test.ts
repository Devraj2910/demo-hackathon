import { GetTeamsWithEffectiveUsers } from '../../../../application/useCases/getTeamsWithEffectiveUsers/GetTeamsWithEffectiveUsers';
import { AdminTeamRepository, TeamWithUsers } from '../../../../repositories/AdminTeamRepository';
import { Team } from '../../../../../team/domain/entities/Team';
import { User } from '../../../../../login/domain/entities/user';

describe('GetTeamsWithEffectiveUsers Use Case', () => {
  let mockAdminTeamRepository: jest.Mocked<AdminTeamRepository>;
  let getTeamsWithEffectiveUsersUseCase: GetTeamsWithEffectiveUsers;
  
  beforeEach(() => {
    // Create mock repository
    mockAdminTeamRepository = {
      getTeamsWithEffectiveUsers: jest.fn()
    } as unknown as jest.Mocked<AdminTeamRepository>;
    
    // Create use case with mock repository
    getTeamsWithEffectiveUsersUseCase = new GetTeamsWithEffectiveUsers(mockAdminTeamRepository);
    
    // Reset mocks
    jest.clearAllMocks();
  });
  
  test('should return teams with their effective users', async () => {
    // Arrange
    // Create mock Team instances
    const mockTeam1 = {
      getId: jest.fn().mockReturnValue(1),
      getName: jest.fn().mockReturnValue('Engineering'),
      getDescription: jest.fn().mockReturnValue('Engineering team'),
      getCreatedAt: jest.fn().mockReturnValue(new Date('2023-01-01')),
      getUpdatedAt: jest.fn().mockReturnValue(new Date('2023-01-01'))
    } as unknown as Team;
    
    const mockTeam2 = {
      getId: jest.fn().mockReturnValue(2),
      getName: jest.fn().mockReturnValue('Design'),
      getDescription: jest.fn().mockReturnValue('Design team'),
      getCreatedAt: jest.fn().mockReturnValue(new Date('2023-01-02')),
      getUpdatedAt: jest.fn().mockReturnValue(new Date('2023-01-02'))
    } as unknown as Team;
    
    // Create mock User instances
    const mockUser1Props = {
      id: 'user-1',
      email: 'user1@example.com',
      passwordHash: 'hash1',
      firstName: 'John',
      lastName: 'Doe',
      permission: 'approved',
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
      permission: 'approved',
      role: 'designer',
      position: 'UI/UX Designer',
      createdAt: new Date('2023-01-02'),
      updatedAt: new Date('2023-01-02')
    };
    
    const mockUser3Props = {
      id: 'user-3',
      email: 'user3@example.com',
      passwordHash: 'hash3',
      firstName: 'Bob',
      lastName: 'Johnson',
      permission: 'approved',
      role: 'product',
      position: 'Product Manager',
      createdAt: new Date('2023-01-03'),
      updatedAt: new Date('2023-01-03')
    };
    
    const mockUser1 = User.create(mockUser1Props);
    const mockUser2 = User.create(mockUser2Props);
    const mockUser3 = User.create(mockUser3Props);
    
    // Create properly typed TeamWithUsers objects
    const mockTeamsWithUsers: TeamWithUsers[] = [
      {
        team: mockTeam1,
        users: [mockUser1, mockUser3]
      },
      {
        team: mockTeam2,
        users: [mockUser2]
      }
    ];
    
    // Mock repository response
    mockAdminTeamRepository.getTeamsWithEffectiveUsers.mockResolvedValue(mockTeamsWithUsers);
    
    // Act
    const result = await getTeamsWithEffectiveUsersUseCase.execute();
    
    // Assert
    expect(mockAdminTeamRepository.getTeamsWithEffectiveUsers).toHaveBeenCalledTimes(1);
    
    expect(result).toEqual({
      teams: [
        {
          team: {
            id: 1,
            name: 'Engineering',
            description: 'Engineering team',
            createdAt: mockTeam1.getCreatedAt(),
            updatedAt: mockTeam1.getUpdatedAt()
          },
          users: [
            {
              id: 'user-1',
              email: 'user1@example.com',
              firstName: 'John',
              lastName: 'Doe',
              permission: 'approved',
              role: 'developer',
              position: 'Software Engineer',
              createdAt: mockUser1Props.createdAt,
              updatedAt: mockUser1Props.updatedAt
            },
            {
              id: 'user-3',
              email: 'user3@example.com',
              firstName: 'Bob',
              lastName: 'Johnson',
              permission: 'approved',
              role: 'product',
              position: 'Product Manager',
              createdAt: mockUser3Props.createdAt,
              updatedAt: mockUser3Props.updatedAt
            }
          ]
        },
        {
          team: {
            id: 2,
            name: 'Design',
            description: 'Design team',
            createdAt: mockTeam2.getCreatedAt(),
            updatedAt: mockTeam2.getUpdatedAt()
          },
          users: [
            {
              id: 'user-2',
              email: 'user2@example.com',
              firstName: 'Jane',
              lastName: 'Smith',
              permission: 'approved',
              role: 'designer',
              position: 'UI/UX Designer',
              createdAt: mockUser2Props.createdAt,
              updatedAt: mockUser2Props.updatedAt
            }
          ]
        }
      ]
    });
  });
  
  test('should handle empty teams list', async () => {
    // Mock repository to return empty array
    mockAdminTeamRepository.getTeamsWithEffectiveUsers.mockResolvedValue([]);
    
    // Act
    const result = await getTeamsWithEffectiveUsersUseCase.execute();
    
    // Assert
    expect(mockAdminTeamRepository.getTeamsWithEffectiveUsers).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ teams: [] });
  });
  
  test('should handle teams with no users', async () => {
    // Arrange
    const mockTeam = {
      getId: jest.fn().mockReturnValue(1),
      getName: jest.fn().mockReturnValue('Empty Team'),
      getDescription: jest.fn().mockReturnValue('Team with no users'),
      getCreatedAt: jest.fn().mockReturnValue(new Date('2023-01-01')),
      getUpdatedAt: jest.fn().mockReturnValue(new Date('2023-01-01'))
    } as unknown as Team;
    
    const mockTeamsWithUsers: TeamWithUsers[] = [
      {
        team: mockTeam,
        users: []
      }
    ];
    
    // Mock repository response
    mockAdminTeamRepository.getTeamsWithEffectiveUsers.mockResolvedValue(mockTeamsWithUsers);
    
    // Act
    const result = await getTeamsWithEffectiveUsersUseCase.execute();
    
    // Assert
    expect(mockAdminTeamRepository.getTeamsWithEffectiveUsers).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      teams: [
        {
          team: {
            id: 1,
            name: 'Empty Team',
            description: 'Team with no users',
            createdAt: mockTeam.getCreatedAt(),
            updatedAt: mockTeam.getUpdatedAt()
          },
          users: []
        }
      ]
    });
  });
}); 