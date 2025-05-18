import { AdminUserRepository } from '../../../repositories/AdminUserRepository';
import { GetPendingUsersResponseDto, UserDto, UserWithTeamDto } from './GetPendingUsersResponseDto';
import { AdminUserMapper } from '../../../mapper/AdminUserMapper';

export class GetPendingUsers {
  constructor(private adminUserRepository: AdminUserRepository) {}

  async execute(): Promise<GetPendingUsersResponseDto> {
    const pendingUsersWithTeam = await this.adminUserRepository.getPendingUsersWithTeam();
    
    const userDtos: UserWithTeamDto[] = pendingUsersWithTeam.map(({ user, teamAssignment, teamName }) => {
      const userDto: UserDto = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        permission: user.permission as string,
        role: user.role,
        position: user.position,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      };
      
      return {
        ...userDto,
        teamAssignment: teamAssignment ? {
          id: teamAssignment.id,
          userId: teamAssignment.userId,
          teamId: teamAssignment.teamId,
          effectiveFrom: teamAssignment.effectiveFrom,
          effectiveTo: teamAssignment.effectiveTo
        } : null,
        teamName: teamName
      };
    });
    
    return {
      users: userDtos
    };
  }
} 