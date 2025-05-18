import { AdminTeamRepository } from '../../../repositories/AdminTeamRepository';
import { GetTeamsWithEffectiveUsersResponseDto, TeamWithUsersDto, UserDto } from './GetTeamsWithEffectiveUsersResponseDto';
import { AdminTeamMapper } from '../../../mapper/AdminTeamMapper';
import { AdminUserMapper } from '../../../mapper/AdminUserMapper';

export class GetTeamsWithEffectiveUsers {
  constructor(private adminTeamRepository: AdminTeamRepository) {}

  async execute(): Promise<GetTeamsWithEffectiveUsersResponseDto> {
    const teamsWithUsers = await this.adminTeamRepository.getTeamsWithEffectiveUsers();
    
    const teamsWithUsersDtos: TeamWithUsersDto[] = teamsWithUsers.map(({ team, users }) => {
      // Map team to DTO
      const teamDto = AdminTeamMapper.toDTO(team);
      
      // Map users to DTOs
      const userDtos: UserDto[] = users.map(user => ({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        permission: user.permission as string,
        role: user.role,
        position: user.position,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }));
      
      return {
        team: teamDto,
        users: userDtos
      };
    });
    
    return {
      teams: teamsWithUsersDtos
    };
  }
} 