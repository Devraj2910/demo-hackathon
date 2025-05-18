import { AddCard } from '../../../../application/useCases/addCard/addCard';
import { CardRepository } from '../../../../repositories/cardRepository';
import { TeamAssignmentRepository } from '../../../../../login/repositories/teamAssignmentRepository';
import { UserRepository } from '../../../../../login/repositories/userRepository';
import { BaseCampAlert } from '../../../../../../../services/baseCampAlert';
import { AddCardRequestDto } from '../../../../application/useCases/addCard/addCardRequestDto';
import { Card } from '../../../../domain/entities/card';
import { CardValidationError } from '../../../../domain/errors/cardErrors';
import { User } from '../../../../../login/domain/entities/user';

// Mock the Card entity's static methods
jest.mock('../../../../domain/entities/card', () => {
  const mockValidate = jest.fn().mockReturnValue(true);
  
  return {
    Card: {
      create: jest.fn().mockImplementation((props) => ({
        ...props,
        validate: mockValidate,
        id: undefined // Initially undefined, will be set by repository
      }))
    }
  };
});

describe('AddCard Use Case', () => {
  let mockCardRepository: jest.Mocked<CardRepository>;
  let mockTeamAssignmentRepository: jest.Mocked<TeamAssignmentRepository>;
  let mockUserRepository: jest.Mocked<UserRepository>;
  let mockBasecampAlert: jest.Mocked<BaseCampAlert>;
  let addCardUseCase: AddCard;
  let mockDate: Date;
  let mockCreatorUser: User;
  let mockRecipientUser: User;
  
  beforeEach(() => {
    // Set a fixed date for consistent testing
    mockDate = new Date('2023-01-01T12:00:00Z');
    jest.spyOn(global, 'Date').mockImplementation(() => mockDate as any);
    
    // Create mock repositories and services
    mockCardRepository = {
      findById: jest.fn(),
      findByUser: jest.fn(),
      findByTeam: jest.fn(),
      findAll: jest.fn(),
      findAllWithUsers: jest.fn(),
      findByCreatedFor: jest.fn(),
      findLatest: jest.fn(),
      findLatestWithUsers: jest.fn(),
      save: jest.fn(),
      delete: jest.fn()
    } as unknown as jest.Mocked<CardRepository>;
    
    mockTeamAssignmentRepository = {
      assignUserToTeam: jest.fn(),
      getUserTeams: jest.fn(),
      removeUserFromTeam: jest.fn()
    } as unknown as jest.Mocked<TeamAssignmentRepository>;
    
    mockUserRepository = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      save: jest.fn(),
      existsByEmail: jest.fn()
    } as unknown as jest.Mocked<UserRepository>;
    
    mockBasecampAlert = {
      sendCardCreationAlert: jest.fn(),
      sendTestMessage: jest.fn()
    } as unknown as jest.Mocked<BaseCampAlert>;
    
    // Create use case with mocks
    addCardUseCase = new AddCard(
      mockCardRepository,
      mockTeamAssignmentRepository,
      mockUserRepository,
      mockBasecampAlert
    );
    
    // Reset the Card.create mock implementation for each test
    (Card.create as jest.Mock).mockImplementation((props) => ({
      ...props,
      validate: jest.fn().mockReturnValue(true),
      id: undefined
    }));
    
    // Create mock User objects for creator and recipient
    mockCreatorUser = {
      id: 'user-123',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      passwordHash: 'dummy-hash',
      role: 'user',
      createdAt: mockDate,
      updatedAt: mockDate,
      permission: 'approved'
    } as unknown as User;
    
    mockRecipientUser = {
      id: 'user-456',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      passwordHash: 'dummy-hash',
      role: 'user',
      createdAt: mockDate,
      updatedAt: mockDate,
      permission: 'approved'
    } as unknown as User;
  });
  
  afterEach(() => {
    jest.restoreAllMocks();
  });
  
  test('should create a card successfully', async () => {
    // Arrange
    const cardRequest: AddCardRequestDto = {
      title: 'Test Card',
      content: 'This is a test card content',
      userId: 'user-123',
      createdFor: 'user-456',
      teamId: 'team-789'
    };
    
    const mockSavedCard = {
      id: 'card-123',
      title: 'Test Card',
      content: 'This is a test card content',
      userId: 'user-123',
      createdFor: 'user-456',
      teamId: 'team-789',
      createdAt: mockDate,
      updatedAt: mockDate,
      validate: jest.fn().mockReturnValue(true)
    } as unknown as Card;
    
    mockCardRepository.save.mockResolvedValue(mockSavedCard);
    mockUserRepository.findById.mockImplementation((id: string) => {
      if (id === 'user-123') return Promise.resolve(mockCreatorUser);
      if (id === 'user-456') return Promise.resolve(mockRecipientUser);
      return Promise.resolve(null);
    });
    
    mockBasecampAlert.sendCardCreationAlert.mockResolvedValue(undefined);
    
    // Act
    const result = await addCardUseCase.execute(cardRequest);
    
    // Assert
    expect(Card.create).toHaveBeenCalledWith({
      title: 'Test Card',
      content: 'This is a test card content',
      userId: 'user-123',
      createdFor: 'user-456',
      teamId: 'team-789',
      createdAt: mockDate,
      updatedAt: mockDate
    });
    
    expect(mockCardRepository.save).toHaveBeenCalled();
    
    expect(mockUserRepository.findById).toHaveBeenCalledWith('user-123');
    expect(mockUserRepository.findById).toHaveBeenCalledWith('user-456');
    
    expect(mockBasecampAlert.sendCardCreationAlert).toHaveBeenCalledWith({
      cardId: 'card-123',
      title: 'Test Card',
      content: 'This is a test card content',
      createdBy: {
        firstName: 'John',
        lastName: 'Doe'
      },
      createdFor: {
        firstName: 'Jane',
        lastName: 'Smith'
      }
    });
    
    expect(result).toEqual({
      id: 'card-123',
      title: 'Test Card',
      content: 'This is a test card content',
      userId: 'user-123',
      createdFor: 'user-456',
      teamId: 'team-789',
      createdAt: mockDate.toISOString(),
      updatedAt: mockDate.toISOString()
    });
  });
  
  test('should throw CardValidationError when card validation fails', async () => {
    // Arrange
    const cardRequest: AddCardRequestDto = {
      title: '',  // Invalid title (assuming validation would fail for empty title)
      content: 'This is a test card content',
      userId: 'user-123',
      createdFor: 'user-456',
      teamId: 'team-789'
    };
    
    // Mock the validation to fail
    (Card.create as jest.Mock).mockImplementation(() => ({
      title: '',
      content: 'This is a test card content',
      userId: 'user-123',
      createdFor: 'user-456',
      teamId: 'team-789',
      createdAt: mockDate,
      updatedAt: mockDate,
      validate: jest.fn().mockReturnValue(false)
    }));
    
    // Act & Assert
    await expect(addCardUseCase.execute(cardRequest))
      .rejects
      .toThrow(CardValidationError);
    
    expect(Card.create).toHaveBeenCalled();
    expect(mockCardRepository.save).not.toHaveBeenCalled();
    expect(mockBasecampAlert.sendCardCreationAlert).not.toHaveBeenCalled();
  });
  
  test('should continue even if basecamp notification fails', async () => {
    // Arrange
    const cardRequest: AddCardRequestDto = {
      title: 'Test Card',
      content: 'This is a test card content',
      userId: 'user-123',
      createdFor: 'user-456',
      teamId: 'team-789'
    };
    
    const mockSavedCard = {
      id: 'card-123',
      title: 'Test Card',
      content: 'This is a test card content',
      userId: 'user-123',
      createdFor: 'user-456',
      teamId: 'team-789',
      createdAt: mockDate,
      updatedAt: mockDate,
      validate: jest.fn().mockReturnValue(true)
    } as unknown as Card;
    
    mockCardRepository.save.mockResolvedValue(mockSavedCard);
    mockUserRepository.findById.mockImplementation((id: string) => {
      if (id === 'user-123') return Promise.resolve(mockCreatorUser);
      if (id === 'user-456') return Promise.resolve(mockRecipientUser);
      return Promise.resolve(null);
    });
    
    // Mock Basecamp alert to throw error
    mockBasecampAlert.sendCardCreationAlert.mockRejectedValue(new Error('Basecamp API error'));
    
    // Spy on console.error
    jest.spyOn(console, 'error').mockImplementation(() => {});
    
    // Act
    const result = await addCardUseCase.execute(cardRequest);
    
    // Assert
    expect(mockCardRepository.save).toHaveBeenCalled();
    expect(mockBasecampAlert.sendCardCreationAlert).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalled();
    
    // Card should still be created successfully
    expect(result).toEqual({
      id: 'card-123',
      title: 'Test Card',
      content: 'This is a test card content',
      userId: 'user-123',
      createdFor: 'user-456',
      teamId: 'team-789',
      createdAt: mockDate.toISOString(),
      updatedAt: mockDate.toISOString()
    });
  });
  
  test('should handle missing user information when sending notification', async () => {
    // Arrange
    const cardRequest: AddCardRequestDto = {
      title: 'Test Card',
      content: 'This is a test card content',
      userId: 'user-123',
      createdFor: 'user-456',
      teamId: 'team-789'
    };
    
    const mockSavedCard = {
      id: 'card-123',
      title: 'Test Card',
      content: 'This is a test card content',
      userId: 'user-123',
      createdFor: 'user-456',
      teamId: 'team-789',
      createdAt: mockDate,
      updatedAt: mockDate,
      validate: jest.fn().mockReturnValue(true)
    } as unknown as Card;
    
    mockCardRepository.save.mockResolvedValue(mockSavedCard);
    
    // Mock user not found
    mockUserRepository.findById.mockResolvedValue(null);
    
    // Spy on console.error
    jest.spyOn(console, 'error').mockImplementation(() => {});
    
    // Act
    const result = await addCardUseCase.execute(cardRequest);
    
    // Assert
    expect(mockCardRepository.save).toHaveBeenCalled();
    expect(mockUserRepository.findById).toHaveBeenCalledTimes(2);
    expect(mockBasecampAlert.sendCardCreationAlert).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalled();
    
    // Card should still be created successfully
    expect(result).toEqual({
      id: 'card-123',
      title: 'Test Card',
      content: 'This is a test card content',
      userId: 'user-123',
      createdFor: 'user-456',
      teamId: 'team-789',
      createdAt: mockDate.toISOString(),
      updatedAt: mockDate.toISOString()
    });
  });
  
  test('should handle repository errors during card creation', async () => {
    // Arrange
    const cardRequest: AddCardRequestDto = {
      title: 'Test Card',
      content: 'This is a test card content',
      userId: 'user-123',
      createdFor: 'user-456',
      teamId: 'team-789'
    };
    
    const mockError = new Error('Database error');
    mockCardRepository.save.mockRejectedValue(mockError);
    
    // Act & Assert
    await expect(addCardUseCase.execute(cardRequest))
      .rejects
      .toThrow(mockError);
    
    expect(Card.create).toHaveBeenCalled();
    expect(mockCardRepository.save).toHaveBeenCalled();
    expect(mockBasecampAlert.sendCardCreationAlert).not.toHaveBeenCalled();
  });
}); 