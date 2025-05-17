import { JwtAuthService } from "../../../infrastructure/services/jwtAuthService";
import { PostgresUserRepository } from "../../../infrastructure/repositories/postgresUserRepository";
import { PostgresTeamAssignmentRepository } from "../../../infrastructure/repositories/postgresTeamAssignmentRepository";
import { Register } from "./register";
import { EmailService } from "../../../../../../services/email.service";

export class RegisterFactory {
  static create() {
    const userRepository = new PostgresUserRepository();
    const authService = new JwtAuthService();
    const teamAssignmentRepository = new PostgresTeamAssignmentRepository();
    const emailService = EmailService.getInstance();
    const useCase = new Register(userRepository, teamAssignmentRepository, emailService);

    return { useCase };
  }
} 