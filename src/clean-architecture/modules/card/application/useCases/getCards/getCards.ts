import { Card } from "../../../domain/entities/card";
import { CardRepository } from "../../../repositories/cardRepository";
import { GetCardsRequestDto } from "./getCardsRequestDto";
import { CardDto, GetCardsResponseDto } from "./getCardsResponseDto";

export class GetCards {
  constructor(private cardRepository: CardRepository) {}

  async execute(request: GetCardsRequestDto): Promise<GetCardsResponseDto> {
    const { 
      userId, 
      createdFor, 
      teamId, 
      fromDate, 
      toDate,
      page = 1,
      limit = 20
    } = request;

    // Prepare filters
    const filters: any = {};
    
    if (userId) filters.userId = userId;
    if (createdFor) filters.createdFor = createdFor;
    if (teamId) filters.teamId = teamId;
    if (fromDate) filters.fromDate = new Date(fromDate);
    if (toDate) filters.toDate = new Date(toDate);

    // Get cards with filters
    const cards = await this.cardRepository.findAll(filters);
    
    // Map to DTOs
    const cardDtos: CardDto[] = cards.map(card => this.mapToDto(card));
    
    // Return paginated response
    return {
      cards: cardDtos,
      total: cards.length,
      page,
      limit
    };
  }

  private mapToDto(card: Card): CardDto {
    return {
      id: card.id ? card.id.toString() : '',
      title: card.title,
      content: card.content,
      userId: card.userId,
      createdFor: card.createdFor,
      createdAt: card.createdAt.toISOString(),
      updatedAt: card.updatedAt.toISOString()
    };
  }
} 