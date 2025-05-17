import { PostgresCardRepository } from "../../../infrastructure/repositories/postgresCardRepository";
import { PostgresTeamAssignmentRepository } from "../../../../login/infrastructure/repositories/postgresTeamAssignmentRepository";
import { PostgresUserRepository } from "../../../../login/infrastructure/repositories/postgresUserRepository";
import { BaseCampAlert } from "../../../../../../services/baseCampAlert";
import { AddCard } from "./addCard";

export class AddCardFactory {
  static create() {
    const cardRepository = new PostgresCardRepository();
    const teamAssignmentRepository = new PostgresTeamAssignmentRepository();
    const userRepository = new PostgresUserRepository();
    const basecampAlert = BaseCampAlert.getInstance();
    const useCase = new AddCard(
      cardRepository, 
      teamAssignmentRepository,
      userRepository,
      basecampAlert
    );

    return { useCase };
  }
} 