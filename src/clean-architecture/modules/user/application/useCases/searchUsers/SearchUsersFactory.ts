import { SearchUsers } from './SearchUsers';
import { DatabaseService } from '../../../../../../services/database.service';
import { UserRepositoryImpl } from '../../../infrastructure/repositories/UserRepositoryImpl';

export class SearchUsersFactory {
  /**
   * Creates and configures a SearchUsers use case with all dependencies
   * @param dbPool Database pool connection
   * @returns The configured SearchUsers use case
   */
  static create(): SearchUsers {
    const dbPool = DatabaseService.getInstance().getPool();
    const userRepository = new UserRepositoryImpl(dbPool);
    return new SearchUsers(userRepository);
  }
} 