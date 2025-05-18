import { ChangeUserTeam } from './ChangeUserTeam';
import { AdminTeamAssignmentRepositoryImpl } from '../../../infrastructure/repositories/AdminTeamAssignmentRepositoryImpl';
import { AdminTeamRepositoryImpl } from '../../../infrastructure/repositories/AdminTeamRepositoryImpl';

export class ChangeUserTeamFactory {
  static create(): { useCase: ChangeUserTeam } {
    const adminTeamAssignmentRepository = new AdminTeamAssignmentRepositoryImpl();
    const adminTeamRepository = new AdminTeamRepositoryImpl();
    const useCase = new ChangeUserTeam(adminTeamAssignmentRepository, adminTeamRepository);
    
    return { useCase };
  }
} 