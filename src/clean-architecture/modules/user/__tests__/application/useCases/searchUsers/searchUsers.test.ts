import { SearchUsers } from '../../../../application/useCases/searchUsers/SearchUsers';
import { UserRepository } from '../../../../repositories/UserRepository';
import { SearchUsersRequestDto } from '../../../../application/useCases/searchUsers/SearchUsersRequestDto';
import { SearchUsersResponseDto, UserDto } from '../../../../application/useCases/searchUsers/SearchUsersResponseDto';
import { User } from '../../../../domain/entities/User';
import { SearchUsersResponseMapper } from '../../../../application/useCases/searchUsers/SearchUsersResponseMapper';

// Mock the SearchUsersResponseMapper to isolate the test
jest.mock('../../../../application/useCases/searchUsers/SearchUsersResponseMapper', () => ({
  SearchUsersResponseMapper: {
    mapToDto: jest.fn()
  }
}));

describe('SearchUsers Use Case', () => {
  let mockUserRepository: jest.Mocked<UserRepository>;
  let searchUsersUseCase: SearchUsers;
  let mockUsers: User[];
  let mockUserDtos: UserDto[];
  const now = new Date();
  
  beforeEach(() => {
    // Create mock repository
    mockUserRepository = {
      searchUsers: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      save: jest.fn()
    } as jest.Mocked<UserRepository>;
    
    // Create use case with mock repository
    searchUsersUseCase = new SearchUsers(mockUserRepository);
    
    // Create mock users properly using User.create
    mockUsers = [
      User.create({
        id: '1',
        email: 'user1@example.com',
        firstName: 'John',
        lastName: 'Doe',
        passwordHash: 'hashed-password',
        createdAt: now,
        updatedAt: now
      }),
      User.create({
        id: '2',
        email: 'user2@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        passwordHash: 'hashed-password',
        createdAt: now,
        updatedAt: now
      })
    ];
    
    // Create mock user DTOs with correct properties
    mockUserDtos = [
      {
        id: '1',
        email: 'user1@example.com',
        firstName: 'John',
        lastName: 'Doe',
        fullName: 'John Doe',
        createdAt: now,
        updatedAt: now
      },
      {
        id: '2',
        email: 'user2@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        fullName: 'Jane Smith',
        createdAt: now,
        updatedAt: now
      }
    ];
    
    // Reset mocks
    jest.clearAllMocks();
    
    // Configure the mapper mock to return different DTOs based on which user is passed
    // Note: Map function passes (element, index, array) to the callback
    (SearchUsersResponseMapper.mapToDto as jest.Mock).mockImplementation((user) => {
      if (user.getId && user.getId() === '1') {
        return mockUserDtos[0];
      } else if (user.getId && user.getId() === '2') {
        return mockUserDtos[1];
      }
      return null;
    });
  });
  
  test('should return matching users successfully', async () => {
    // Arrange
    const searchRequest: SearchUsersRequestDto = { searchText: 'john' };
    mockUserRepository.searchUsers.mockResolvedValue([mockUsers[0]]);
    
    // Act
    const result = await searchUsersUseCase.execute(searchRequest);
    
    // Assert
    expect(mockUserRepository.searchUsers).toHaveBeenCalledTimes(1);
    expect(mockUserRepository.searchUsers).toHaveBeenCalledWith('john');
    
    // Don't check exact parameters since map() passes (element, index, array)
    expect(SearchUsersResponseMapper.mapToDto).toHaveBeenCalled();
    expect(result).toEqual({ users: [mockUserDtos[0]] });
  });
  
  test('should return multiple matching users', async () => {
    // Arrange
    const searchRequest: SearchUsersRequestDto = { searchText: 'user' };
    mockUserRepository.searchUsers.mockResolvedValue(mockUsers);
    
    // Act
    const result = await searchUsersUseCase.execute(searchRequest);
    
    // Assert
    expect(mockUserRepository.searchUsers).toHaveBeenCalledTimes(1);
    expect(mockUserRepository.searchUsers).toHaveBeenCalledWith('user');
    expect(SearchUsersResponseMapper.mapToDto).toHaveBeenCalledTimes(2);
    expect(result).toEqual({ users: mockUserDtos });
  });
  
  test('should return empty array when no users match search criteria', async () => {
    // Arrange
    const searchRequest: SearchUsersRequestDto = { searchText: 'nonexistent' };
    mockUserRepository.searchUsers.mockResolvedValue([]);
    
    // Act
    const result = await searchUsersUseCase.execute(searchRequest);
    
    // Assert
    expect(mockUserRepository.searchUsers).toHaveBeenCalledTimes(1);
    expect(mockUserRepository.searchUsers).toHaveBeenCalledWith('nonexistent');
    expect(SearchUsersResponseMapper.mapToDto).not.toHaveBeenCalled();
    expect(result).toEqual({ users: [] });
    expect(result.users.length).toBe(0);
  });
  
  test('should handle repository errors and propagate them', async () => {
    // Arrange
    const searchRequest: SearchUsersRequestDto = { searchText: 'error' };
    const testError = new Error('Database connection failed');
    mockUserRepository.searchUsers.mockRejectedValue(testError);
    
    // Act & Assert
    await expect(searchUsersUseCase.execute(searchRequest)).rejects.toThrow(testError);
    expect(mockUserRepository.searchUsers).toHaveBeenCalledTimes(1);
    expect(SearchUsersResponseMapper.mapToDto).not.toHaveBeenCalled();
  });
  
  test('should handle empty search text', async () => {
    // Arrange
    const searchRequest: SearchUsersRequestDto = { searchText: '' };
    mockUserRepository.searchUsers.mockResolvedValue(mockUsers);
    
    // Act
    const result = await searchUsersUseCase.execute(searchRequest);
    
    // Assert
    expect(mockUserRepository.searchUsers).toHaveBeenCalledTimes(1);
    expect(mockUserRepository.searchUsers).toHaveBeenCalledWith('');
    expect(result.users.length).toBe(2);
  });
}); 