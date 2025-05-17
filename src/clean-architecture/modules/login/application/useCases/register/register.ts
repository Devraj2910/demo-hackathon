import { v4 as uuidv4 } from 'uuid';
import { EmailAlreadyExistsError } from "../../../domain/errors/authErrors";
import { User } from "../../../domain/entities/user";
import { AuthService } from "../../../domain/services/authService";
import { UserRepository } from "../../../repositories/userRepository";
import { RegisterRequestDto } from "./registerRequestDto";
import { RegisterResponseDto } from "./registerResponseDto";
import { TeamAssignmentRepository } from '../../../repositories/teamAssignmentRepository';

export class Register {
  constructor(
    private userRepository: UserRepository,
    private authService: AuthService,
    private teamAssignmentRepository?: TeamAssignmentRepository
  ) {}

  async execute(request: RegisterRequestDto): Promise<RegisterResponseDto> {
    const { email, password, firstName, lastName, role, position, teamId } = request;

    // Check if email already exists
    const emailExists = await this.userRepository.existsByEmail(email);
    if (emailExists) {
      throw new EmailAlreadyExistsError();
    }

    // Hash password
    const passwordHash = await this.authService.hashPassword(password);

    // Create user entity
    const now = new Date();
    const userId = uuidv4();
    const user = User.create({
      id: userId,
      email,
      passwordHash,
      firstName,
      lastName,
      role: role || 'user', // Default role is 'user' if not specified
      position,
      createdAt: now,
      updatedAt: now
    });

    // Save user to database
    const savedUser = await this.userRepository.save(user);

    // If teamId is provided and the repository is available, assign the user to the team
    if (teamId && this.teamAssignmentRepository) {
      await this.teamAssignmentRepository.assignUserToTeam({
        id: uuidv4(),
        userId: savedUser.id,
        teamId: teamId,
        effectiveFrom: now,
        effectiveTo: null
      });
    }

    // Return user data
    return {
      id: savedUser.id,
      email: savedUser.email,
      firstName: savedUser.firstName,
      lastName: savedUser.lastName,
      role: savedUser.role,
      position: savedUser.position,
      createdAt: savedUser.createdAt
    };
  }
} 