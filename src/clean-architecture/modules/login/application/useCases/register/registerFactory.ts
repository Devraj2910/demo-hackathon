import { JwtAuthService } from "../../../infrastructure/services/jwtAuthService";
import { PostgresUserRepository } from "../../../infrastructure/repositories/postgresUserRepository";
import { PostgresTeamAssignmentRepository } from "../../../infrastructure/repositories/postgresTeamAssignmentRepository";
import { Register } from "./register";

export class RegisterFactory {
  static create() {
    const userRepository = new PostgresUserRepository();
    const authService = new JwtAuthService();
    const teamAssignmentRepository = new PostgresTeamAssignmentRepository();
    const useCase = new Register(userRepository, authService, teamAssignmentRepository);

    return { useCase };
  }
} 