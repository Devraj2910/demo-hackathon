import { DeleteTeam } from './DeleteTeam';
import { TeamRepositoryImpl } from '../../../infrastructure/repositories/TeamRepositoryImpl';
import { DatabaseService } from '../../../../../../services/database.service';

export class DeleteTeamFactory {
  static create() {
    const database = DatabaseService.getInstance();
    const teamRepository = new TeamRepositoryImpl(database);
    const useCase = new DeleteTeam(teamRepository);
    
    return { useCase };
  }
} 