import { InvalidCredentialsError, UserNotApprovedError, UserNotFoundError } from "../../../domain/errors/authErrors";
import { AuthService } from "../../../domain/services/authService";
import { UserRepository } from "../../../repositories/userRepository";
import { LoginRequestDto } from "./loginRequestDto";
import { LoginResponseDto } from "./loginResponseDto";

export class Login {
  constructor(
    private userRepository: UserRepository,
    private authService: AuthService
  ) {}

  async execute(request: LoginRequestDto): Promise<LoginResponseDto> {
    const { email, password } = request;

    // Find user by email
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new UserNotFoundError();
    }

    if (user.permission !== 'approved') {
      throw new UserNotApprovedError();
    }

    // Verify password
    const isPasswordValid = await this.authService.comparePasswords(
      password,
      user.passwordHash
    );

    if (!isPasswordValid) {
      throw new InvalidCredentialsError();
    }

    // Generate token
    const { token, expiresIn } = this.authService.generateToken(user);

    // Return user data with token
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      position: user.position,
      token,
      expiresIn
    };
  }
} 