import { v4 as uuidv4 } from 'uuid';
import { User } from "../../../domain/entities/user";
import { UserRepository } from "../../../repositories/userRepository";
import { RegisterRequestDto } from "./registerRequestDto";
import { RegisterResponseDto } from "./registerResponseDto";
import { TeamAssignmentRepository } from '../../../repositories/teamAssignmentRepository';
import { EmailService } from '../../../../../../services/email.service';
import { BadRequestError } from '../../../../../shared/errors/appError';
import * as bcrypt from 'bcrypt';

export class Register {
  constructor(
    private userRepository: UserRepository,
    private teamAssignmentRepository: TeamAssignmentRepository,
    private emailService: EmailService
  ) {}

  async execute(request: RegisterRequestDto): Promise<RegisterResponseDto> {
    try {
      const { email, password, firstName, lastName, role, position, teamId } = request;

      // Check if email already exists
      const emailExists = await this.userRepository.existsByEmail(email);
      if (emailExists) {
        throw new BadRequestError('Email already in use');
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, 10);

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
        updatedAt: now,
        permission: 'pending'
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

      // Send email notification to admin for access approval
      await this.notifyAdminToGrantPermission(user);

      // Return user data
      return {
        id: savedUser.id,
        email: savedUser.email,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        role: savedUser.role,
        position: savedUser.position,
        createdAt: savedUser.createdAt,
        message: 'Registration successful. Your account is pending approval.'
      };
    } catch (error) {
      if (error instanceof BadRequestError) {
        throw error;
      }
      throw new Error(`Registration failed: ${(error as Error).message}`);
    }
  }

  private async notifyAdminToGrantPermission(user: User): Promise<void> {
    try {
      const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
     const a =  await this.emailService.sendAccessGrantEmail(
        "devraj4943@gmail.com",
        `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        user.id,
        baseUrl
      );
      return
    } catch (error) {
      console.error('Failed to send access grant email:', error);
      // Don't throw error here to prevent registration from failing if email fails
    }
  }
} 