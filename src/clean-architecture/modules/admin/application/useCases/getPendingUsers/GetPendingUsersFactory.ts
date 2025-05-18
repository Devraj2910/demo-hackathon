import { Pool } from 'pg';
import { GetPendingUsers } from './GetPendingUsers';
import { AdminUserRepositoryImpl } from '../../../infrastructure/repositories/AdminUserRepositoryImpl';

export class GetPendingUsersFactory {
  static create(dbPool: Pool): { useCase: GetPendingUsers } {
    const adminUserRepository = new AdminUserRepositoryImpl(dbPool);
    const useCase = new GetPendingUsers(adminUserRepository);
    
    return { useCase };
  }
} 