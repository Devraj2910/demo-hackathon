import { v4 as uuidv4 } from 'uuid';
import { UpdateUserTeamRequestDto } from './UpdateUserTeamRequestDto';
import { UpdateUserTeamResponseDto } from './UpdateUserTeamResponseDto';
import { TeamAssignmentRepository } from '../../../repositories/TeamAssignmentRepository';
import { TeamAssignment } from '../../../domain/entities/TeamAssignment';

export class UpdateUserTeam {
  constructor(private teamAssignmentRepository: TeamAssignmentRepository) {}

  async execute(request: UpdateUserTeamRequestDto): Promise<UpdateUserTeamResponseDto> {
    const { userId, teamId } = request;
    const now = new Date();

    // 1. Get current assignment to check if already assigned to same team
    const currentAssignments = await this.teamAssignmentRepository.getCurrentTeamAssignments(userId);
    
    // Check if user is already assigned to the requested team
    if (currentAssignments.length > 0 && currentAssignments[0].teamId === teamId) {
      return this.mapToResponseDto(currentAssignments[0], null);
    }
    
    // 2. Update all current assignments in one operation
    const updatedCount = await this.teamAssignmentRepository.updateCurrentAssignmentsForUser(userId, now);
    
    // Get the previous team ID if there was one
    const previousTeamId = (currentAssignments.length > 0) ? currentAssignments[0].teamId : null;

    // 3. Create a new team assignment for the user
    const newAssignment: TeamAssignment = {
      id: uuidv4(),
      userId,
      teamId,
      effectiveFrom: now,
      effectiveTo: null
    };

    const savedAssignment = await this.teamAssignmentRepository.assignUserToTeam(newAssignment);
    
    return this.mapToResponseDto(savedAssignment, previousTeamId);
  }

  private mapToResponseDto(assignment: TeamAssignment, previousTeamId: number | null): UpdateUserTeamResponseDto {
    return {
      id: assignment.id,
      userId: assignment.userId,
      teamId: assignment.teamId,
      effectiveFrom: assignment.effectiveFrom.toISOString(),
      effectiveTo: assignment.effectiveTo ? assignment.effectiveTo.toISOString() : null,
      previousTeamId
    };
  }
} 