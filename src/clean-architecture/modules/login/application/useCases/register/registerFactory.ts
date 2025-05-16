import { JwtAuthService } from "../../../infrastructure/services/jwtAuthService";
import { PostgresUserRepository } from "../../../infrastructure/repositories/postgresUserRepository";
import { Register } from "./register";

export class RegisterFactory {
  static create() {
    const userRepository = new PostgresUserRepository();
    const authService = new JwtAuthService();
    const useCase = new Register(userRepository, authService);

    return { useCase };
  }
} 