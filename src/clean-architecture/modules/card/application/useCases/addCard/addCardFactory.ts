import { PostgresCardRepository } from "../../../infrastructure/repositories/postgresCardRepository";
import { AddCard } from "./addCard";

export class AddCardFactory {
  static create() {
    const cardRepository = new PostgresCardRepository();
    const useCase = new AddCard(cardRepository);

    return { useCase };
  }
} 