import { GetAllTeams } from './GetAllTeams';
import { TeamRepositoryImpl } from '../../../infrastructure/repositories/TeamRepositoryImpl';
import { Database } from '../../../infrastructure/database/Database';

export class GetAllTeamsFactory {
  static create() {
    const database = Database.getInstance();
    const teamRepository = new TeamRepositoryImpl(database);
    const useCase = new GetAllTeams(teamRepository);
    
    return { useCase };
  }
} 