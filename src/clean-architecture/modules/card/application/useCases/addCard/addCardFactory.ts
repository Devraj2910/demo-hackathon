import { PostgresCardRepository } from "../../../infrastructure/repositories/postgresCardRepository";
import { PostgresTeamAssignmentRepository } from "../../../../login/infrastructure/repositories/postgresTeamAssignmentRepository";
import { AddCard } from "./addCard";

export class AddCardFactory {
  static create() {
    const cardRepository = new PostgresCardRepository();
    const teamAssignmentRepository = new PostgresTeamAssignmentRepository();
    const useCase = new AddCard(cardRepository, teamAssignmentRepository);

    return { useCase };
  }
} 