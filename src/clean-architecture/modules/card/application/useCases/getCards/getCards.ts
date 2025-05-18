import { Card } from "../../../domain/entities/card";
import { CardRepository } from "../../../repositories/cardRepository";
import { GetCardsRequestDto } from "./getCardsRequestDto";
import { CardDto, GetCardsResponseDto, UserDetailsDto } from "./getCardsResponseDto";
import { UserMapper } from "../../../mapper/UserMapper";

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
      limit = 20,
      title,
      searchText
    } = request;

    // Prepare filters
    const filters: any = {};
    
    if (userId) filters.userId = userId;
    if (createdFor) filters.createdFor = createdFor;
    if (teamId) filters.teamId = teamId;
    if (fromDate) filters.fromDate = new Date(fromDate);
    if (toDate) filters.toDate = new Date(toDate);
    if (title) filters.title = title;
    if (searchText) filters.searchText = searchText;
    
    // Add pagination
    filters.page = page;
    filters.limit = limit;

    // Get cards with filters and pagination including user details
    const paginatedResult = await this.cardRepository.findAllWithUsers(filters);
    
    // Map to DTOs
    const cardDtos: CardDto[] = paginatedResult.data.map(cardWithUsers => this.mapToDto(
      cardWithUsers.card,
      cardWithUsers.creator ? UserMapper.toDetailsDto(cardWithUsers.creator) : null,
      cardWithUsers.recipient ? UserMapper.toDetailsDto(cardWithUsers.recipient) : null
    ));
    
    // Return paginated response
    return {
      cards: cardDtos,
      total: paginatedResult.total,
      page: paginatedResult.page,
      limit: paginatedResult.limit,
      totalPages: paginatedResult.totalPages
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