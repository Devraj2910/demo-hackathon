import { ChangeUserRole } from '../../../../application/useCases/changeUserRole/ChangeUserRole';
import { AdminUserRepository } from '../../../../repositories/AdminUserRepository';
import { User } from '../../../../../login/domain/entities/user';

describe('ChangeUserRole', () => {
  let mockUserRepository: jest.Mocked<AdminUserRepository>;
  let changeUserRole: ChangeUserRole;

  beforeEach(() => {
    // Create a mock repository
    mockUserRepository = {
      findById: jest.fn(),
      changeUserRole: jest.fn(),
      getPendingUsers: jest.fn(),
      getPendingUsersWithTeam: jest.fn(),
      updateUserPermissionStatus: jest.fn()
    } as unknown as jest.Mocked<AdminUserRepository>;

    // Create the use case with the mock repository
    changeUserRole = new ChangeUserRole(mockUserRepository);
  });

  it('should change a user role successfully', async () => {
    // Arrange
    const userId = '12345678-1234-1234-1234-123456789012';
    const newRole = 'admin';
    
    // Create a mock user with the old role
    const existingUser = User.create({
      id: userId,
      email: 'user@example.com',
      passwordHash: 'hashed_password',
      firstName: 'John',
      lastName: 'Doe',
      role: 'user',
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01')
    });
    
    // Create a mock user with the updated role
    const updatedUser = User.create({
      id: userId,
      email: 'user@example.com',
      passwordHash: 'hashed_password',
      firstName: 'John',
      lastName: 'Doe',
      role: newRole,
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-02')
    });
    
    // Setup the repository mock responses
    mockUserRepository.findById.mockResolvedValue(existingUser);
    mockUserRepository.changeUserRole.mockResolvedValue(updatedUser);
    
    // Act
    const result = await changeUserRole.execute({ userId, newRole });
    
    // Assert
    expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
    expect(mockUserRepository.changeUserRole).toHaveBeenCalledWith(userId, newRole);
    expect(result.id).toBe(userId);
    expect(result.role).toBe(newRole);
    expect(result.email).toBe('user@example.com');
    expect(result.firstName).toBe('John');
    expect(result.lastName).toBe('Doe');
  });

  it('should throw an error if user does not exist', async () => {
    // Arrange
    const userId = '12345678-1234-1234-1234-123456789012';
    const newRole = 'admin';
    
    // Setup the repository mock to return null (user not found)
    mockUserRepository.findById.mockResolvedValue(null);
    
    // Act & Assert
    await expect(changeUserRole.execute({ userId, newRole }))
      .rejects
      .toThrow(`User with ID ${userId} not found or not approved`);
    
    expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
    expect(mockUserRepository.changeUserRole).not.toHaveBeenCalled();
  });

  it('should not update if the role is the same', async () => {
    // Arrange
    const userId = '12345678-1234-1234-1234-123456789012';
    const existingRole = 'admin';
    
    // Create a mock user with the role that's already set
    const existingUser = User.create({
      id: userId,
      email: 'user@example.com',
      passwordHash: 'hashed_password',
      firstName: 'John',
      lastName: 'Doe',
      role: existingRole,
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01')
    });
    
    // Setup the repository mock responses
    mockUserRepository.findById.mockResolvedValue(existingUser);
    
    // Act
    const result = await changeUserRole.execute({ userId, newRole: existingRole });
    
    // Assert
    expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
    expect(mockUserRepository.changeUserRole).not.toHaveBeenCalled();
    expect(result.id).toBe(userId);
    expect(result.role).toBe(existingRole);
  });
}); 