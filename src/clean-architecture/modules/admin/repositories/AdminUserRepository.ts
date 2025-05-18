import { User } from '../../login/domain/entities/user';

export interface AdminUserRepository {
  /**
   * Get all users with pending permissions status
   * @returns Promise containing an array of User entities with pending permissions
   */
  getPendingUsers(): Promise<User[]>;
} 