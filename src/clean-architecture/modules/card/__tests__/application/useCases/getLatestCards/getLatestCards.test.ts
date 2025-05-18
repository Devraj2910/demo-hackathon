import { GetLatestCards } from '../../../../application/useCases/getLatestCards/getLatestCards';
import { CardRepository } from '../../../../repositories/cardRepository';
import { GetLatestCardsRequestDto } from '../../../../application/useCases/getLatestCards/getLatestCardsRequestDto';
import { Card } from '../../../../domain/entities/card';
import { UserMapper } from '../../../../mapper/UserMapper';
import { User } from '../../../../../login/domain/entities/user';
import { CardWithUsers } from '../../../../repositories/cardRepository';

// Mock UserMapper
jest.mock('../../../../mapper/UserMapper', () => ({
  UserMapper: {
    toDetailsDto: jest.fn()
  }
}));

describe('GetLatestCards Use Case', () => {
  let mockCardRepository: jest.Mocked<CardRepository>;
  let getLatestCardsUseCase: GetLatestCards;
  let mockDate: Date;
  
  beforeEach(() => {
    mockDate = new Date('2023-01-01T12:00:00Z');
    
    // Create mock repository
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
    
    // Create use case with mock repository
    getLatestCardsUseCase = new GetLatestCards(mockCardRepository);
    
    // Reset UserMapper mock
    jest.clearAllMocks();
  });
  
  test('should return latest cards with proper mapping', async () => {
    // Arrange
    const mockCard1 = { 
      id: 'card-1', 
      title: 'Card 1', 
      content: 'Content 1',
      userId: 'user-1',
      createdFor: 'user-2',
      teamId: 'team-1',
      createdAt: mockDate,
      updatedAt: mockDate
    } as unknown as Card;
    
    const mockCard2 = { 
      id: 'card-2', 
      title: 'Card 2', 
      content: 'Content 2',
      userId: 'user-3',
      createdFor: 'user-4',
      teamId: 'team-1',
      createdAt: mockDate,
      updatedAt: mockDate
    } as unknown as Card;
    
    // Create proper mocks that satisfy the User type requirements
    const mockCreator1 = {
      id: 'user-1',
      email: 'creator1@example.com',
      firstName: 'Creator',
      lastName: 'One'
    } as unknown as User;
    
    const mockRecipient1 = {
      id: 'user-2',
      email: 'recipient1@example.com',
      firstName: 'Recipient',
      lastName: 'One'
    } as unknown as User;
    
    const mockCreator2 = {
      id: 'user-3',
      email: 'creator2@example.com',
      firstName: 'Creator',
      lastName: 'Two'
    } as unknown as User;
    
    const mockRecipient2 = {
      id: 'user-4',
      email: 'recipient2@example.com',
      firstName: 'Recipient',
      lastName: 'Two'
    } as unknown as User;
    
    const mockCreatorDto1 = {
      id: 'user-1',
      email: 'creator1@example.com',
      firstName: 'Creator',
      lastName: 'One',
      fullName: 'Creator One'
    };
    
    const mockRecipientDto1 = {
      id: 'user-2',
      email: 'recipient1@example.com',
      firstName: 'Recipient',
      lastName: 'One',
      fullName: 'Recipient One'
    };
    
    const mockCreatorDto2 = {
      id: 'user-3',
      email: 'creator2@example.com',
      firstName: 'Creator',
      lastName: 'Two',
      fullName: 'Creator Two'
    };
    
    const mockRecipientDto2 = {
      id: 'user-4',
      email: 'recipient2@example.com',
      firstName: 'Recipient',
      lastName: 'Two',
      fullName: 'Recipient Two'
    };
    
    // Create a properly typed result array
    const mockLatestCardsResult = [
      { card: mockCard1, creator: mockCreator1, recipient: mockRecipient1 } as unknown as CardWithUsers,
      { card: mockCard2, creator: mockCreator2, recipient: mockRecipient2 } as unknown as CardWithUsers
    ];
    
    mockCardRepository.findLatestWithUsers.mockResolvedValue(mockLatestCardsResult);
    
    // Mock UserMapper.toDetailsDto based on the user
    (UserMapper.toDetailsDto as jest.Mock).mockImplementation((user) => {
      if (user?.id === 'user-1') return mockCreatorDto1;
      if (user?.id === 'user-2') return mockRecipientDto1;
      if (user?.id === 'user-3') return mockCreatorDto2;
      if (user?.id === 'user-4') return mockRecipientDto2;
      return null;
    });
    
    const request: GetLatestCardsRequestDto = {
      limit: 10,
      teamId: 'team-1'
    };
    
    // Act
    const result = await getLatestCardsUseCase.execute(request);
    
    // Assert
    expect(mockCardRepository.findLatestWithUsers).toHaveBeenCalledWith(10, 'team-1');
    
    expect(UserMapper.toDetailsDto).toHaveBeenCalledTimes(4);
    expect(UserMapper.toDetailsDto).toHaveBeenCalledWith(mockCreator1);
    expect(UserMapper.toDetailsDto).toHaveBeenCalledWith(mockRecipient1);
    expect(UserMapper.toDetailsDto).toHaveBeenCalledWith(mockCreator2);
    expect(UserMapper.toDetailsDto).toHaveBeenCalledWith(mockRecipient2);
    
    expect(result).toEqual({
      cards: [
        {
          id: 'card-1',
          title: 'Card 1',
          content: 'Content 1',
          userId: 'user-1',
          createdFor: 'user-2',
          createdAt: mockDate.toISOString(),
          updatedAt: mockDate.toISOString(),
          creator: mockCreatorDto1,
          recipient: mockRecipientDto1
        },
        {
          id: 'card-2',
          title: 'Card 2',
          content: 'Content 2',
          userId: 'user-3',
          createdFor: 'user-4',
          createdAt: mockDate.toISOString(),
          updatedAt: mockDate.toISOString(),
          creator: mockCreatorDto2,
          recipient: mockRecipientDto2
        }
      ]
    });
  });
  
  test('should handle missing creator or recipient', async () => {
    // Arrange
    const mockCard = { 
      id: 'card-1', 
      title: 'Card 1', 
      content: 'Content 1',
      userId: 'user-1',
      createdFor: 'user-2',
      teamId: 'team-1',
      createdAt: mockDate,
      updatedAt: mockDate
    } as unknown as Card;
    
    const mockRecipient = {
      id: 'user-2',
      email: 'recipient@example.com',
      firstName: 'Recipient',
      lastName: 'User'
    } as unknown as User;
    
    const mockRecipientDto = {
      id: 'user-2',
      email: 'recipient@example.com',
      firstName: 'Recipient',
      lastName: 'User',
      fullName: 'Recipient User'
    };
    
    // Create a properly typed result array with null creator
    const mockLatestCardsResult = [
      { card: mockCard, creator: null, recipient: mockRecipient } as unknown as CardWithUsers
    ];
    
    mockCardRepository.findLatestWithUsers.mockResolvedValue(mockLatestCardsResult);
    (UserMapper.toDetailsDto as jest.Mock).mockImplementation((user) => {
      if (user?.id === 'user-2') return mockRecipientDto;
      return null;
    });
    
    const request: GetLatestCardsRequestDto = {
      limit: 5
      // No teamId provided
    };
    
    // Act
    const result = await getLatestCardsUseCase.execute(request);
    
    // Assert
    expect(mockCardRepository.findLatestWithUsers).toHaveBeenCalledWith(5, undefined);
    expect(UserMapper.toDetailsDto).toHaveBeenCalledTimes(1);
    expect(UserMapper.toDetailsDto).toHaveBeenCalledWith(mockRecipient);
    
    // Should create an empty user for the missing creator
    expect(result.cards[0].creator).toEqual({
      id: '',
      email: '',
      firstName: null,
      lastName: null,
      fullName: ''
    });
    
    expect(result.cards[0].recipient).toEqual(mockRecipientDto);
  });
  
  test('should use default limit when not provided', async () => {
    // Arrange
    mockCardRepository.findLatestWithUsers.mockResolvedValue([]);
    
    const request: GetLatestCardsRequestDto = {
      // No limit or teamId provided
    };
    
    // Act
    await getLatestCardsUseCase.execute(request);
    
    // Assert
    expect(mockCardRepository.findLatestWithUsers).toHaveBeenCalledWith(10, undefined); // Default limit
  });
}); 