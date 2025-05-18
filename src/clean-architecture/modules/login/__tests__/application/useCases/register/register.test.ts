import { Register } from '../../../../application/useCases/register/register';
import { UserRepository } from '../../../../repositories/userRepository';
import { TeamAssignmentRepository } from '../../../../repositories/teamAssignmentRepository';
import { EmailService } from '../../../../../../../services/email.service';
import { RegisterRequestDto } from '../../../../application/useCases/register/registerRequestDto';
import { User } from '../../../../domain/entities/user';
import { BadRequestError } from '../../../../../../shared/errors/appError';

// Mock bcrypt for password hashing
jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashed-password')
}));

// Mock uuid to have predictable values
jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('mocked-uuid')
}));

describe('Register Use Case', () => {
  let mockUserRepository: jest.Mocked<UserRepository>;
  let mockTeamAssignmentRepository: jest.Mocked<TeamAssignmentRepository>;
  let mockEmailService: jest.Mocked<EmailService>;
  let registerUseCase: Register;
  let mockDate: Date;
  
  beforeEach(() => {
    // Mock the Date constructor
    mockDate = new Date('2023-01-01T00:00:00Z');
    jest.spyOn(global, 'Date').mockImplementation(() => mockDate as any);
    
    // Create mocks
    mockUserRepository = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      save: jest.fn(),
      existsByEmail: jest.fn()
    } as jest.Mocked<UserRepository>;
    
    mockTeamAssignmentRepository = {
      assignUserToTeam: jest.fn(),
      getUserTeams: jest.fn(),
      removeUserFromTeam: jest.fn()
    } as jest.Mocked<TeamAssignmentRepository>;
    
    mockEmailService = {
      sendAccessGrantEmail: jest.fn().mockResolvedValue(undefined)
    } as unknown as jest.Mocked<EmailService>;
    
    // Create use case with mocks
    registerUseCase = new Register(
      mockUserRepository, 
      mockTeamAssignmentRepository, 
      mockEmailService
    );
  });
  
  afterEach(() => {
    jest.restoreAllMocks();
  });
  
  test('should register a new user successfully with team assignment', async () => {
    // Arrange
    const registerRequest: RegisterRequestDto = {
      email: 'newuser@example.com',
      password: 'password123',
      firstName: 'New',
      lastName: 'User',
      position: 'Developer',
      teamId: 1
    };
    
    mockUserRepository.existsByEmail.mockResolvedValue(false);
    
    const savedUser = User.create({
      id: 'mocked-uuid',
      email: 'newuser@example.com',
      passwordHash: 'hashed-password',
      firstName: 'New',
      lastName: 'User',
      role: 'user',
      position: 'Developer',
      createdAt: mockDate,
      updatedAt: mockDate,
      permission: 'pending'
    });
    
    mockUserRepository.save.mockResolvedValue(savedUser);
    
    // Act
    const result = await registerUseCase.execute(registerRequest);
    
    // Assert
    expect(mockUserRepository.existsByEmail).toHaveBeenCalledWith('newuser@example.com');
    expect(mockUserRepository.save).toHaveBeenCalled();
    expect(mockTeamAssignmentRepository.assignUserToTeam).toHaveBeenCalledWith({
      id: 'mocked-uuid',
      userId: 'mocked-uuid',
      teamId: 1,
      effectiveFrom: mockDate,
      effectiveTo: null
    });
    expect(mockEmailService.sendAccessGrantEmail).toHaveBeenCalled();
    
    expect(result).toEqual({
      id: 'mocked-uuid',
      email: 'newuser@example.com',
      firstName: 'New',
      lastName: 'User',
      role: 'user',
      position: 'Developer',
      createdAt: mockDate,
      message: 'Registration successful. Your account is pending approval.'
    });
  });
  
  test('should register a new user successfully without team assignment', async () => {
    // Arrange
    const registerRequest: RegisterRequestDto = {
      email: 'newuser@example.com',
      password: 'password123',
      firstName: 'New',
      lastName: 'User',
      position: 'Developer'
      // No teamId provided
    };
    
    mockUserRepository.existsByEmail.mockResolvedValue(false);
    
    const savedUser = User.create({
      id: 'mocked-uuid',
      email: 'newuser@example.com',
      passwordHash: 'hashed-password',
      firstName: 'New',
      lastName: 'User',
      role: 'user',
      position: 'Developer',
      createdAt: mockDate,
      updatedAt: mockDate,
      permission: 'pending'
    });
    
    mockUserRepository.save.mockResolvedValue(savedUser);
    
    // Act
    const result = await registerUseCase.execute(registerRequest);
    
    // Assert
    expect(mockUserRepository.existsByEmail).toHaveBeenCalledWith('newuser@example.com');
    expect(mockUserRepository.save).toHaveBeenCalled();
    expect(mockTeamAssignmentRepository.assignUserToTeam).not.toHaveBeenCalled();
    expect(mockEmailService.sendAccessGrantEmail).toHaveBeenCalled();
    
    expect(result).toEqual({
      id: 'mocked-uuid',
      email: 'newuser@example.com',
      firstName: 'New',
      lastName: 'User',
      role: 'user',
      position: 'Developer',
      createdAt: mockDate,
      message: 'Registration successful. Your account is pending approval.'
    });
  });
  
  test('should throw BadRequestError when email already exists', async () => {
    // Arrange
    const registerRequest: RegisterRequestDto = {
      email: 'existing@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User'
    };
    
    mockUserRepository.existsByEmail.mockResolvedValue(true);
    
    // Act & Assert
    await expect(registerUseCase.execute(registerRequest))
      .rejects
      .toThrow(BadRequestError);
    
    expect(mockUserRepository.existsByEmail).toHaveBeenCalledWith('existing@example.com');
    expect(mockUserRepository.save).not.toHaveBeenCalled();
    expect(mockTeamAssignmentRepository.assignUserToTeam).not.toHaveBeenCalled();
    expect(mockEmailService.sendAccessGrantEmail).not.toHaveBeenCalled();
  });
  
  test('should register user with custom role when provided', async () => {
    // Arrange
    const registerRequest: RegisterRequestDto = {
      email: 'admin@example.com',
      password: 'password123',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin'
    };
    
    mockUserRepository.existsByEmail.mockResolvedValue(false);
    
    const savedUser = User.create({
      id: 'mocked-uuid',
      email: 'admin@example.com',
      passwordHash: 'hashed-password',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      createdAt: mockDate,
      updatedAt: mockDate,
      permission: 'pending'
    });
    
    mockUserRepository.save.mockResolvedValue(savedUser);
    
    // Act
    const result = await registerUseCase.execute(registerRequest);
    
    // Assert
    expect(mockUserRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        role: 'admin'
      })
    );
    
    expect(result.role).toBe('admin');
  });
  
  test('should continue registration process if email sending fails', async () => {
    // Arrange
    const registerRequest: RegisterRequestDto = {
      email: 'newuser@example.com',
      password: 'password123',
      firstName: 'New',
      lastName: 'User'
    };
    
    mockUserRepository.existsByEmail.mockResolvedValue(false);
    
    const savedUser = User.create({
      id: 'mocked-uuid',
      email: 'newuser@example.com',
      passwordHash: 'hashed-password',
      firstName: 'New',
      lastName: 'User',
      role: 'user',
      createdAt: mockDate,
      updatedAt: mockDate,
      permission: 'pending'
    });
    
    mockUserRepository.save.mockResolvedValue(savedUser);
    
    // Mock email service to throw an error
    mockEmailService.sendAccessGrantEmail.mockRejectedValue(new Error('Email sending failed'));
    
    // Spy on console.error
    jest.spyOn(console, 'error').mockImplementation(() => {});
    
    // Act
    const result = await registerUseCase.execute(registerRequest);
    
    // Assert
    expect(mockUserRepository.save).toHaveBeenCalled();
    expect(mockEmailService.sendAccessGrantEmail).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalled();
    
    // Registration should still complete successfully
    expect(result).toBeDefined();
    expect(result.id).toBe('mocked-uuid');
  });
}); 