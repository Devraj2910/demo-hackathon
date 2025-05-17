import { PostgresCardRepository } from "../../../infrastructure/repositories/postgresCardRepository";
import { DeleteCard } from "./deleteCard";

export class DeleteCardFactory {
  static create() {
    const cardRepository = new PostgresCardRepository();
    const useCase = new DeleteCard(cardRepository);

    return { useCase };
  }
} 