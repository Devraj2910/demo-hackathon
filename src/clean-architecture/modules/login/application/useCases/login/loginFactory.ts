import { JwtAuthService } from "../../../infrastructure/services/jwtAuthService";
import { PostgresUserRepository } from "../../../infrastructure/repositories/postgresUserRepository";
import { Login } from "./login";

export class LoginFactory {
  static create() {
    const userRepository = new PostgresUserRepository();
    const authService = new JwtAuthService();
    const useCase = new Login(userRepository, authService);

    return { useCase };
  }
} 