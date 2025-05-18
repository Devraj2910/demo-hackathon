import { ChangeUserRole } from './ChangeUserRole';
import { AdminUserRepositoryImpl } from '../../../infrastructure/repositories/AdminUserRepositoryImpl';

export class ChangeUserRoleFactory {
  static create() {
    const userRepository = new AdminUserRepositoryImpl();
    const useCase = new ChangeUserRole(userRepository);
    
    return { useCase };
  }
} 