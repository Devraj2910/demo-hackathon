import { DeleteCard } from '../../../../application/useCases/deleteCard/deleteCard';
import { CardRepository } from '../../../../repositories/cardRepository';
import { DeleteCardRequestDto } from '../../../../application/useCases/deleteCard/deleteCardRequestDto';
import { Card } from '../../../../domain/entities/card';
import { CardNotFoundError, UnauthorizedDeleteError } from '../../../../domain/errors/cardErrors';

describe('DeleteCard Use Case', () => {
  let mockCardRepository: jest.Mocked<CardRepository>;
  let deleteCardUseCase: DeleteCard;
  let mockCard: Card;
  
  beforeEach(() => {
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
    deleteCardUseCase = new DeleteCard(mockCardRepository);
    
    // Create a mock card
    mockCard = {
      id: 'card-123',
      title: 'Test Card',
      content: 'This is a test card content',
      userId: 'user-123',
      createdFor: 'user-456',
      teamId: 'team-789',
      createdAt: new Date(),
      updatedAt: new Date()
    } as unknown as Card;
  });
  
  afterEach(() => {
    jest.resetAllMocks();
  });
  
  test('should delete card successfully as admin', async () => {
    // Arrange
    const deleteRequest: DeleteCardRequestDto = {
      id: 'card-123',
      userRole: 'admin'
    };
    
    mockCardRepository.findById.mockResolvedValue(mockCard);
    mockCardRepository.delete.mockResolvedValue(true);
    
    // Act
    const result = await deleteCardUseCase.execute(deleteRequest);
    
    // Assert
    expect(mockCardRepository.findById).toHaveBeenCalledWith('card-123');
    expect(mockCardRepository.delete).toHaveBeenCalledWith('card-123');
    expect(result).toEqual({
      success: true,
      message: 'Card deleted successfully'
    });
  });
  
  test('should throw UnauthorizedDeleteError when user is not admin', async () => {
    // Arrange
    const deleteRequest: DeleteCardRequestDto = {
      id: 'card-123',
      userRole: 'user'
    };
    
    // Act & Assert
    await expect(deleteCardUseCase.execute(deleteRequest))
      .rejects
      .toThrow(UnauthorizedDeleteError);
    
    expect(mockCardRepository.findById).not.toHaveBeenCalled();
    expect(mockCardRepository.delete).not.toHaveBeenCalled();
  });
  
  test('should throw CardNotFoundError when card does not exist', async () => {
    // Arrange
    const deleteRequest: DeleteCardRequestDto = {
      id: 'nonexistent-card',
      userRole: 'admin'
    };
    
    mockCardRepository.findById.mockResolvedValue(null);
    
    // Act & Assert
    await expect(deleteCardUseCase.execute(deleteRequest))
      .rejects
      .toThrow(CardNotFoundError);
    
    expect(mockCardRepository.findById).toHaveBeenCalledWith('nonexistent-card');
    expect(mockCardRepository.delete).not.toHaveBeenCalled();
  });
  
  test('should handle unsuccessful deletion', async () => {
    // Arrange
    const deleteRequest: DeleteCardRequestDto = {
      id: 'card-123',
      userRole: 'admin'
    };
    
    mockCardRepository.findById.mockResolvedValue(mockCard);
    mockCardRepository.delete.mockResolvedValue(false);
    
    // Act
    const result = await deleteCardUseCase.execute(deleteRequest);
    
    // Assert
    expect(mockCardRepository.findById).toHaveBeenCalledWith('card-123');
    expect(mockCardRepository.delete).toHaveBeenCalledWith('card-123');
    expect(result).toEqual({
      success: false,
      message: 'Failed to delete card'
    });
  });
  
  test('should propagate repository errors', async () => {
    // Arrange
    const deleteRequest: DeleteCardRequestDto = {
      id: 'card-123',
      userRole: 'admin'
    };
    
    const mockError = new Error('Database error');
    mockCardRepository.findById.mockResolvedValue(mockCard);
    mockCardRepository.delete.mockRejectedValue(mockError);
    
    // Act & Assert
    await expect(deleteCardUseCase.execute(deleteRequest))
      .rejects
      .toThrow(mockError);
    
    expect(mockCardRepository.findById).toHaveBeenCalledWith('card-123');
    expect(mockCardRepository.delete).toHaveBeenCalledWith('card-123');
  });
}); 