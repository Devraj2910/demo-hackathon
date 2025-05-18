import { ProcessUserRequest } from '../../../../application/useCases/processUserRequest/ProcessUserRequest';
import { AdminUserRepository } from '../../../../repositories/AdminUserRepository';
import { ProcessUserRequestRequestDto } from '../../../../application/useCases/processUserRequest/ProcessUserRequestRequestDto';
import { User } from '../../../../../login/domain/entities/user';

describe('ProcessUserRequest Use Case', () => {
  let mockAdminUserRepository: jest.Mocked<AdminUserRepository>;
  let processUserRequestUseCase: ProcessUserRequest;
  
  beforeEach(() => {
    // Create mock repository
    mockAdminUserRepository = {
      updateUserPermissionStatus: jest.fn()
    } as unknown as jest.Mocked<AdminUserRepository>;
    
    // Create use case with mock repository
    processUserRequestUseCase = new ProcessUserRequest(mockAdminUserRepository);
    
    // Reset mocks
    jest.clearAllMocks();
  });
  
  test('should approve a user request', async () => {
    // Arrange
    const userId = 'user-1';
    const status = 'approved';
    
    const userProps = {
      id: userId,
      email: 'user1@example.com',
      passwordHash: 'hash1',
      firstName: 'John',
      lastName: 'Doe',
      permission: status,
      role: 'developer',
      position: 'Software Engineer',
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01')
    };
    
    // Create a User instance with updated permission
    const updatedUser = User.create(userProps);
    
    // Mock repository response
    mockAdminUserRepository.updateUserPermissionStatus.mockResolvedValue(updatedUser);
    
    const request: ProcessUserRequestRequestDto = {
      userId,
      status
    };
    
    // Act
    const result = await processUserRequestUseCase.execute(request);
    
    // Assert
    expect(mockAdminUserRepository.updateUserPermissionStatus).toHaveBeenCalledTimes(1);
    expect(mockAdminUserRepository.updateUserPermissionStatus).toHaveBeenCalledWith(userId, status);
    
    expect(result).toEqual({
      user: {
        id: userId,
        email: 'user1@example.com',
        firstName: 'John',
        lastName: 'Doe',
        permission: status,
        role: 'developer',
        position: 'Software Engineer',
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt
      },
      message: 'User request has been approved successfully'
    });
  });
  
  test('should decline a user request', async () => {
    // Arrange
    const userId = 'user-2';
    const status = 'declined';
    
    const userProps = {
      id: userId,
      email: 'user2@example.com',
      passwordHash: 'hash2',
      firstName: 'Jane',
      lastName: 'Smith',
      permission: status,
      role: 'designer',
      position: 'UI/UX Designer',
      createdAt: new Date('2023-01-02'),
      updatedAt: new Date('2023-01-02')
    };
    
    // Create a User instance with updated permission
    const updatedUser = User.create(userProps);
    
    // Mock repository response
    mockAdminUserRepository.updateUserPermissionStatus.mockResolvedValue(updatedUser);
    
    const request: ProcessUserRequestRequestDto = {
      userId,
      status
    };
    
    // Act
    const result = await processUserRequestUseCase.execute(request);
    
    // Assert
    expect(mockAdminUserRepository.updateUserPermissionStatus).toHaveBeenCalledTimes(1);
    expect(mockAdminUserRepository.updateUserPermissionStatus).toHaveBeenCalledWith(userId, status);
    
    expect(result).toEqual({
      user: {
        id: userId,
        email: 'user2@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        permission: status,
        role: 'designer',
        position: 'UI/UX Designer',
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt
      },
      message: 'User request has been declined'
    });
  });
  
  test('should handle error if user not found', async () => {
    // Arrange
    const userId = 'non-existent-user';
    const status = 'approved';
    
    // Mock repository to throw an error
    const error = new Error('User not found');
    mockAdminUserRepository.updateUserPermissionStatus.mockRejectedValue(error);
    
    const request: ProcessUserRequestRequestDto = {
      userId,
      status
    };
    
    // Act & Assert
    await expect(processUserRequestUseCase.execute(request))
      .rejects
      .toThrow('User not found');
      
    expect(mockAdminUserRepository.updateUserPermissionStatus).toHaveBeenCalledTimes(1);
    expect(mockAdminUserRepository.updateUserPermissionStatus).toHaveBeenCalledWith(userId, status);
  });
}); 