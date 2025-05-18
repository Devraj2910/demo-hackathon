import { AdminUserRepository } from '../../../repositories/AdminUserRepository';
import { GetPendingUsersResponseDto, UserDto } from './GetPendingUsersResponseDto';
import { AdminUserMapper } from '../../../mapper/AdminUserMapper';

export class GetPendingUsers {
  constructor(private adminUserRepository: AdminUserRepository) {}

  async execute(): Promise<GetPendingUsersResponseDto> {
    const pendingUsers = await this.adminUserRepository.getPendingUsers();
    
    const userDtos: UserDto[] = pendingUsers.map(user => ({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      permission: user.permission as string, // Ensure it's not undefined
      role: user.role,
      position: user.position,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }));
    
    return {
      users: userDtos
    };
  }
} 