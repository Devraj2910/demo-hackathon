import { Card } from "../../../domain/entities/card";
import { CardRepository } from "../../../repositories/cardRepository";
import { GetLatestCardsRequestDto } from "./getLatestCardsRequestDto";
import { CardDto, GetLatestCardsResponseDto } from "./getLatestCardsResponseDto";

export class GetLatestCards {
  constructor(private cardRepository: CardRepository) {}

  async execute(request: GetLatestCardsRequestDto): Promise<GetLatestCardsResponseDto> {
    const { limit = 10 } = request;
    
    // Get latest cards
    const cards = await this.cardRepository.findLatest(limit);
    
    // Map to DTOs
    const cardDtos: CardDto[] = cards.map(card => this.mapToDto(card));
    
    // Return response
    return {
      cards: cardDtos
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