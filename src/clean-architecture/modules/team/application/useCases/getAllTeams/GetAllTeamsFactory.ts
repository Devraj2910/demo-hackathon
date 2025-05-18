import { GetAllTeams } from './GetAllTeams';
import { TeamRepositoryImpl } from '../../../infrastructure/repositories/TeamRepositoryImpl';
import { DatabaseService } from '../../../../../../services';

export class GetAllTeamsFactory {
  static create() {
    const database = DatabaseService.getInstance();
    const teamRepository = new TeamRepositoryImpl(database);
    const useCase = new GetAllTeams(teamRepository);
    
    return { useCase };
  }
} 