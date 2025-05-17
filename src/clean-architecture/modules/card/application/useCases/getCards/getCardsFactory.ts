import { PostgresCardRepository } from "../../../infrastructure/repositories/postgresCardRepository";
import { GetCards } from "./getCards";

export class GetCardsFactory {
  static create() {
    const cardRepository = new PostgresCardRepository();
    const useCase = new GetCards(cardRepository);

    return { useCase };
  }
} 