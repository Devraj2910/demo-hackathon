import { GetTeamsWithEffectiveUsers } from './GetTeamsWithEffectiveUsers';
import { AdminTeamRepositoryImpl } from '../../../infrastructure/repositories/AdminTeamRepositoryImpl';

export class GetTeamsWithEffectiveUsersFactory {
  static create(): { useCase: GetTeamsWithEffectiveUsers } {
    const adminTeamRepository = new AdminTeamRepositoryImpl();
    const useCase = new GetTeamsWithEffectiveUsers(adminTeamRepository);
    
    return { useCase };
  }
} 