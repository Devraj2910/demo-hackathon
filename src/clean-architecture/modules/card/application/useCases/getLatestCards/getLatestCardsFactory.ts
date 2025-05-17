import { PostgresCardRepository } from "../../../infrastructure/repositories/postgresCardRepository";
import { GetLatestCards } from "./getLatestCards";

export class GetLatestCardsFactory {
  static create() {
    const cardRepository = new PostgresCardRepository();
    const useCase = new GetLatestCards(cardRepository);

    return { useCase };
  }
} 