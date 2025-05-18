import { AdminUserRepository } from '../../../repositories/AdminUserRepository';
import { ProcessUserRequestRequestDto } from './ProcessUserRequestRequestDto';
import { ProcessUserRequestResponseDto, UserDto } from './ProcessUserRequestResponseDto';
import { AdminUserMapper } from '../../../mapper/AdminUserMapper';

export class ProcessUserRequest {
  constructor(private adminUserRepository: AdminUserRepository) {}

  async execute(request: ProcessUserRequestRequestDto): Promise<ProcessUserRequestResponseDto> {
    const { userId, status } = request;
    
    // Update the user's permission status
    const updatedUser = await this.adminUserRepository.updateUserPermissionStatus(userId, status);
    
    // Map to DTO
    const userDto: UserDto = {
      id: updatedUser.id,
      email: updatedUser.email,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      permission: updatedUser.permission,
      role: updatedUser.role,
      position: updatedUser.position,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt
    };
    
    // Create appropriate message
    const message = status === 'approved' 
      ? 'User request has been approved successfully' 
      : 'User request has been declined';
    
    return {
      user: userDto,
      message
    };
  }
} 