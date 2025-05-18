import { CreateTeam } from './CreateTeam';
import { TeamRepositoryImpl } from '../../../infrastructure/repositories/TeamRepositoryImpl';
import { Database } from '../../../infrastructure/database/Database';
import { DatabaseService } from '../../../../../../services/database.service';

export class CreateTeamFactory {
  static create() {
    const database = DatabaseService.getInstance();
    const teamRepository = new TeamRepositoryImpl(database);
    const useCase = new CreateTeam(teamRepository);
    
    return { useCase };
  }
} 