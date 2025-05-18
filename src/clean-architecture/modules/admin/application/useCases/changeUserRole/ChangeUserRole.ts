import { AdminUserRepository } from '../../../repositories/AdminUserRepository';
import { ChangeUserRoleRequestDto } from './ChangeUserRoleRequestDto';
import { ChangeUserRoleResponseDto } from './ChangeUserRoleResponseDto';

export class ChangeUserRole {
  constructor(private userRepository: AdminUserRepository) {}

  async execute(request: ChangeUserRoleRequestDto): Promise<ChangeUserRoleResponseDto> {
    const { userId, newRole } = request;
    
    // Check if user exists first
    const existingUser = await this.userRepository.findById(userId);
    if (!existingUser) {
      throw new Error(`User with ID ${userId} not found or not approved`);
    }
    
    // If role is the same, no need to update
    if (existingUser.role === newRole) {
      return this.mapToResponseDto(existingUser);
    }
    
    // Update user role
    const updatedUser = await this.userRepository.changeUserRole(userId, newRole);
    
    // Map to response DTO
    return this.mapToResponseDto(updatedUser);
  }
  
  private mapToResponseDto(user: any): ChangeUserRoleResponseDto {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      position: user.position,
      updatedAt: user.updatedAt.toISOString()
    };
  }
} 