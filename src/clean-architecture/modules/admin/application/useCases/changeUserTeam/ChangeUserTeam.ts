import { AdminTeamAssignmentRepository } from '../../../repositories/AdminTeamAssignmentRepository';
import { ChangeUserTeamRequestDto } from './ChangeUserTeamRequestDto';
import { ChangeUserTeamResponseDto, TeamAssignmentDto } from './ChangeUserTeamResponseDto';
import { AdminTeamAssignmentMapper } from '../../../mapper/AdminTeamAssignmentMapper';
import { AdminTeamRepository } from '../../../repositories/AdminTeamRepository';

export class ChangeUserTeam {
  constructor(
    private adminTeamAssignmentRepository: AdminTeamAssignmentRepository,
    private adminTeamRepository: AdminTeamRepository
  ) {}

  async execute(request: ChangeUserTeamRequestDto): Promise<ChangeUserTeamResponseDto> {
    const { userId, teamId } = request;
    
    // Validate if the team exists
    const teams = await this.adminTeamRepository.getTeamsWithEffectiveUsers();
    const teamExists = teams.some(team => team.team.getId() === Number(teamId));
    
    if (!teamExists) {
      throw new Error(`Team with ID ${teamId} does not exist`);
    }
    
    // Get current team assignment if any
    const currentAssignment = await this.adminTeamAssignmentRepository.getCurrentTeamAssignment(userId);
    
    // Change the team
    const newAssignment = await this.adminTeamAssignmentRepository.changeUserTeam(userId, teamId);
    
    // Create DTOs for response
    const previousAssignmentDto = currentAssignment 
      ? AdminTeamAssignmentMapper.toDTO(currentAssignment)
      : null;
    
    const newAssignmentDto = AdminTeamAssignmentMapper.toDTO(newAssignment);
    
    return {
      previousAssignment: previousAssignmentDto,
      newAssignment: newAssignmentDto,
      message: currentAssignment
        ? `User has been moved from team ${currentAssignment.teamId} to team ${teamId}`
        : `User has been assigned to team ${teamId}`
    };
  }
} 