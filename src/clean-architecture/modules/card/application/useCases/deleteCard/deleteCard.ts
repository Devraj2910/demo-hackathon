import { CardNotFoundError, UnauthorizedDeleteError } from "../../../domain/errors/cardErrors";
import { CardRepository } from "../../../repositories/cardRepository";
import { DeleteCardRequestDto } from "./deleteCardRequestDto";
import { DeleteCardResponseDto } from "./deleteCardResponseDto";

export class DeleteCard {
  constructor(private cardRepository: CardRepository) {}

  async execute(request: DeleteCardRequestDto): Promise<DeleteCardResponseDto> {
    const { id, userRole } = request;

    // Check if user is admin
    if (userRole !== 'admin') {
      throw new UnauthorizedDeleteError();
    }

    // Check if card exists
    const card = await this.cardRepository.findById(id);
    if (!card) {
      throw new CardNotFoundError(id);
    }

    // Delete card
    const deleted = await this.cardRepository.delete(id);

    // Return response
    return {
      success: deleted,
      message: deleted ? 'Card deleted successfully' : 'Failed to delete card'
    };
  }
} 