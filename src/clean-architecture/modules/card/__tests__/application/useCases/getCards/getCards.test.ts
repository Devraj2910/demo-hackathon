import { GetCards } from '../../../../application/useCases/getCards/getCards';
import { CardRepository } from '../../../../repositories/cardRepository';
import { GetCardsRequestDto } from '../../../../application/useCases/getCards/getCardsRequestDto';
import { Card } from '../../../../domain/entities/card';
import { UserMapper } from '../../../../mapper/UserMapper';
import { User } from '../../../../../login/domain/entities/user';
import { CardWithUsers, PaginatedCardWithUsers } from '../../../../repositories/cardRepository';

// Mock UserMapper
jest.mock('../../../../mapper/UserMapper', () => ({
  UserMapper: {
    toDetailsDto: jest.fn()
  }
}));

describe('GetCards Use Case', () => {
  let mockCardRepository: jest.Mocked<CardRepository>;
  let getCardsUseCase: GetCards;
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
    getCardsUseCase = new GetCards(mockCardRepository);
    
    // Reset UserMapper mock
    jest.clearAllMocks();
  });
  
  test('should return cards with proper pagination and mapping', async () => {
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
    
    // Create a properly typed mock paginated result with double casting
    const mockPaginatedResult: PaginatedCardWithUsers = {
      data: [
        { card: mockCard1, creator: mockCreator1, recipient: mockRecipient1 } as unknown as CardWithUsers,
        { card: mockCard2, creator: mockCreator2, recipient: mockRecipient2 } as unknown as CardWithUsers
      ],
      total: 2,
      page: 1,
      limit: 20,
      totalPages: 1
    };
    
    mockCardRepository.findAllWithUsers.mockResolvedValue(mockPaginatedResult);
    
    // Mock UserMapper.toDetailsDto based on the user
    (UserMapper.toDetailsDto as jest.Mock).mockImplementation((user) => {
      if (user?.id === 'user-1') return mockCreatorDto1;
      if (user?.id === 'user-2') return mockRecipientDto1;
      if (user?.id === 'user-3') return mockCreatorDto2;
      if (user?.id === 'user-4') return mockRecipientDto2;
      return null;
    });
    
    const request: GetCardsRequestDto = {
      teamId: 'team-1',
      page: 1,
      limit: 20
    };
    
    // Act
    const result = await getCardsUseCase.execute(request);
    
    // Assert
    expect(mockCardRepository.findAllWithUsers).toHaveBeenCalledWith({
      teamId: 'team-1',
      page: 1,
      limit: 20
    });
    
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
      ],
      total: 2,
      page: 1,
      limit: 20,
      totalPages: 1
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
    
    // Create a properly typed mock paginated result with double casting
    const mockPaginatedResult: PaginatedCardWithUsers = {
      data: [
        { card: mockCard, creator: null, recipient: mockRecipient } as unknown as CardWithUsers
      ],
      total: 1,
      page: 1,
      limit: 20,
      totalPages: 1
    };
    
    mockCardRepository.findAllWithUsers.mockResolvedValue(mockPaginatedResult);
    (UserMapper.toDetailsDto as jest.Mock).mockImplementation((user) => {
      if (user?.id === 'user-2') return mockRecipientDto;
      return null;
    });
    
    const request: GetCardsRequestDto = {
      teamId: 'team-1',
      page: 1,
      limit: 20
    };
    
    // Act
    const result = await getCardsUseCase.execute(request);
    
    // Assert
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
  
  test('should apply all filters correctly', async () => {
    // Arrange
    const fromDate = new Date('2023-01-01');
    const toDate = new Date('2023-01-31');
    
    mockCardRepository.findAllWithUsers.mockResolvedValue({
      data: [],
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0
    } as PaginatedCardWithUsers);
    
    const request: GetCardsRequestDto = {
      userId: 'user-1',
      createdFor: 'user-2',
      teamId: 'team-1',
      fromDate: '2023-01-01',
      toDate: '2023-01-31',
      page: 1,
      limit: 10,
      title: 'Test',
      searchText: 'search term'
    };
    
    // Act
    await getCardsUseCase.execute(request);
    
    // Assert
    expect(mockCardRepository.findAllWithUsers).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'user-1',
        createdFor: 'user-2',
        teamId: 'team-1',
        fromDate: expect.any(Date),
        toDate: expect.any(Date),
        page: 1,
        limit: 10,
        title: 'Test'
        // Note: searchText is in the DTO but not used in the filters
      })
    );
    
    // Verify dates were converted properly
    const calledWithArg = mockCardRepository.findAllWithUsers.mock.calls[0][0];
    if (calledWithArg) {
      expect(calledWithArg.fromDate?.toISOString().split('T')[0]).toBe('2023-01-01');
      expect(calledWithArg.toDate?.toISOString().split('T')[0]).toBe('2023-01-31');
    }
  });
  
  test('should use default pagination when not provided', async () => {
    // Arrange
    mockCardRepository.findAllWithUsers.mockResolvedValue({
      data: [],
      total: 0,
      page: 1,
      limit: 20,
      totalPages: 0
    } as PaginatedCardWithUsers);
    
    const request: GetCardsRequestDto = {
      teamId: 'team-1'
      // No page or limit provided
    };
    
    // Act
    await getCardsUseCase.execute(request);
    
    // Assert
    expect(mockCardRepository.findAllWithUsers).toHaveBeenCalledWith({
      teamId: 'team-1',
      page: 1,  // Default page
      limit: 20 // Default limit
    });
  });
}); 