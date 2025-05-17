import { UpdateUserTeam } from './UpdateUserTeam';
import { TeamAssignmentRepositoryImpl } from '../../../infrastructure/repositories/TeamAssignmentRepositoryImpl';
import { Database } from '../../../infrastructure/database/Database';

export class UpdateUserTeamFactory {
  static create() {
    const database = Database.getInstance();
    const teamAssignmentRepository = new TeamAssignmentRepositoryImpl(database);
    const useCase = new UpdateUserTeam(teamAssignmentRepository);
    
    return { useCase };
  }
} 