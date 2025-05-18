import { ProcessUserRequest } from './ProcessUserRequest';
import { AdminUserRepositoryImpl } from '../../../infrastructure/repositories/AdminUserRepositoryImpl';

export class ProcessUserRequestFactory {
  static create(): { useCase: ProcessUserRequest } {
    const adminUserRepository = new AdminUserRepositoryImpl();
    const useCase = new ProcessUserRequest(adminUserRepository);
    
    return { useCase };
  }
} 