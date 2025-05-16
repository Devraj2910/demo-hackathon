import { v4 as uuidv4 } from 'uuid';
import { EmailAlreadyExistsError } from "../../../domain/errors/authErrors";
import { User } from "../../../domain/entities/user";
import { AuthService } from "../../../domain/services/authService";
import { UserRepository } from "../../../repositories/userRepository";
import { RegisterRequestDto } from "./registerRequestDto";
import { RegisterResponseDto } from "./registerResponseDto";

export class Register {
  constructor(
    private userRepository: UserRepository,
    private authService: AuthService
  ) {}

  async execute(request: RegisterRequestDto): Promise<RegisterResponseDto> {
    const { email, password, firstName, lastName } = request;

    // Check if email already exists
    const emailExists = await this.userRepository.existsByEmail(email);
    if (emailExists) {
      throw new EmailAlreadyExistsError();
    }

    // Hash password
    const passwordHash = await this.authService.hashPassword(password);

    // Create user entity
    const now = new Date();
    const user = User.create({
      id: uuidv4(),
      email,
      passwordHash,
      firstName,
      lastName,
      createdAt: now,
      updatedAt: now
    });

    // Save user to database
    const savedUser = await this.userRepository.save(user);

    // Return user data
    return {
      id: savedUser.id,
      email: savedUser.email,
      firstName: savedUser.firstName,
      lastName: savedUser.lastName,
      createdAt: savedUser.createdAt
    };
  }
} 