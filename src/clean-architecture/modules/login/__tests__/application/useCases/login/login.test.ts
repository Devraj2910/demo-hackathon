import { Login } from '../../../../application/useCases/login/login';
import { UserRepository } from '../../../../repositories/userRepository';
import { AuthService } from '../../../../domain/services/authService';
import { User } from '../../../../domain/entities/user';
import { 
  InvalidCredentialsError, 
  UserNotApprovedError, 
  UserNotFoundError 
} from '../../../../domain/errors/authErrors';
import { LoginRequestDto } from '../../../../application/useCases/login/loginRequestDto';

describe('Login Use Case', () => {
  let mockUserRepository: jest.Mocked<UserRepository>;
  let mockAuthService: jest.Mocked<AuthService>;
  let loginUseCase: Login;
  let mockUser: User;
  
  beforeEach(() => {
    // Create mocks
    mockUserRepository = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      save: jest.fn(),
      existsByEmail: jest.fn()
    } as jest.Mocked<UserRepository>;
    
    mockAuthService = {
      hashPassword: jest.fn(),
      comparePasswords: jest.fn(),
      generateToken: jest.fn(),
      verifyToken: jest.fn()
    } as jest.Mocked<AuthService>;
    
    // Mock user
    mockUser = User.create({
      id: 'user-123',
      email: 'test@example.com',
      passwordHash: 'hashed-password',
      firstName: 'Test',
      lastName: 'User',
      role: 'user',
      position: 'Developer',
      createdAt: new Date(),
      updatedAt: new Date(),
      permission: 'approved'
    });
    
    // Create use case with mocks
    loginUseCase = new Login(mockUserRepository, mockAuthService);
  });
  
  test('should login successfully with valid credentials', async () => {
    // Arrange
    const loginRequest: LoginRequestDto = {
      email: 'test@example.com',
      password: 'password123'
    };
    
    mockUserRepository.findByEmail.mockResolvedValue(mockUser);
    mockAuthService.comparePasswords.mockResolvedValue(true);
    mockAuthService.generateToken.mockReturnValue({
      token: 'jwt-token',
      expiresIn: 3600
    });
    
    // Act
    const result = await loginUseCase.execute(loginRequest);
    
    // Assert
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
    expect(mockAuthService.comparePasswords).toHaveBeenCalledWith('password123', 'hashed-password');
    expect(mockAuthService.generateToken).toHaveBeenCalledWith(mockUser);
    
    expect(result).toEqual({
      id: 'user-123',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      role: 'user',
      position: 'Developer',
      token: 'jwt-token',
      expiresIn: 3600
    });
  });
  
  test('should throw UserNotFoundError when user is not found', async () => {
    // Arrange
    const loginRequest: LoginRequestDto = {
      email: 'nonexistent@example.com',
      password: 'password123'
    };
    
    mockUserRepository.findByEmail.mockResolvedValue(null);
    
    // Act & Assert
    await expect(loginUseCase.execute(loginRequest))
      .rejects
      .toThrow(UserNotFoundError);
      
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('nonexistent@example.com');
    expect(mockAuthService.comparePasswords).not.toHaveBeenCalled();
    expect(mockAuthService.generateToken).not.toHaveBeenCalled();
  });
  
  test('should throw UserNotApprovedError when user is not approved', async () => {
    // Arrange
    const unapprovedUser = User.create({
      ...mockUser['props'],
      permission: 'pending'
    });
    
    const loginRequest: LoginRequestDto = {
      email: 'test@example.com',
      password: 'password123'
    };
    
    mockUserRepository.findByEmail.mockResolvedValue(unapprovedUser);
    
    // Act & Assert
    await expect(loginUseCase.execute(loginRequest))
      .rejects
      .toThrow(UserNotApprovedError);
      
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
    expect(mockAuthService.comparePasswords).not.toHaveBeenCalled();
    expect(mockAuthService.generateToken).not.toHaveBeenCalled();
  });
  
  test('should throw InvalidCredentialsError when password is incorrect', async () => {
    // Arrange
    const loginRequest: LoginRequestDto = {
      email: 'test@example.com',
      password: 'wrong-password'
    };
    
    mockUserRepository.findByEmail.mockResolvedValue(mockUser);
    mockAuthService.comparePasswords.mockResolvedValue(false);
    
    // Act & Assert
    await expect(loginUseCase.execute(loginRequest))
      .rejects
      .toThrow(InvalidCredentialsError);
      
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
    expect(mockAuthService.comparePasswords).toHaveBeenCalledWith('wrong-password', 'hashed-password');
    expect(mockAuthService.generateToken).not.toHaveBeenCalled();
  });
}); 