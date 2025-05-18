import { Pool } from 'pg';
import { GetPendingUsers } from './GetPendingUsers';
import { AdminUserRepositoryImpl } from '../../../infrastructure/repositories/AdminUserRepositoryImpl';
import { DatabaseService } from '../../../../../../services';

export class GetPendingUsersFactory {
  static  create(): { useCase: GetPendingUsers } {
    const adminUserRepository = new AdminUserRepositoryImpl();
    const useCase = new GetPendingUsers(adminUserRepository);
    
    return { useCase };
  }
} 