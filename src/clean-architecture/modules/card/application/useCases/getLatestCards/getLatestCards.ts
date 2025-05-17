import { Card } from "../../../domain/entities/card";
import { CardRepository } from "../../../repositories/cardRepository";
import { GetLatestCardsRequestDto } from "./getLatestCardsRequestDto";
import { CardDto, GetLatestCardsResponseDto, UserDetailsDto } from "./getLatestCardsResponseDto";
import { UserMapper } from "../../../mapper/UserMapper";

export class GetLatestCards {
  constructor(private cardRepository: CardRepository) {}

  async execute(request: GetLatestCardsRequestDto): Promise<GetLatestCardsResponseDto> {
    const { limit = 10, teamId } = request;
    
    // Get latest cards with user details, filtered by team if specified
    const cardsWithUsers = await this.cardRepository.findLatestWithUsers(limit, teamId);
    
    // Map to DTOs
    const cardDtos: CardDto[] = cardsWithUsers.map(cardWithUsers => this.mapToDto(
      cardWithUsers.card,
      cardWithUsers.creator ? UserMapper.toDetailsDto(cardWithUsers.creator) : null,
      cardWithUsers.recipient ? UserMapper.toDetailsDto(cardWithUsers.recipient) : null
    ));
    
    // Return response
    return {
      cards: cardDtos
    };
  }

  private mapToDto(
    card: Card, 
    creator: UserDetailsDto | null, 
    recipient: UserDetailsDto | null
  ): CardDto {
    // Create empty user detail object for missing users
    const emptyUser: UserDetailsDto = {
      id: '',
      email: '',
      firstName: null,
      lastName: null,
      fullName: ''
    };

    return {
      id: card.id ? card.id.toString() : '',
      title: card.title,
      content: card.content,
      userId: card.userId,
      createdFor: card.createdFor,
      createdAt: card.createdAt.toISOString(),
      updatedAt: card.updatedAt.toISOString(),
      creator: creator || emptyUser,
      recipient: recipient || emptyUser
    };
  }
} 