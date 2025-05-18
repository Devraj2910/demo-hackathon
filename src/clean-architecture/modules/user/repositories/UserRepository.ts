import { User } from '../domain/entities/User';

export interface UserRepository {
  /**
   * Searches for users based on the provided search text
   * The search is performed on email, first name, and last name fields
   * @param searchText The text to search for
   * @returns Promise containing an array of matching User entities
   */
  searchUsers(searchText: string): Promise<User[]>;
  
  /**
   * Finds a user by their ID
   * @param id The user ID
   * @returns Promise containing the user if found, or null
   */
  findById(id: string): Promise<User | null>;
  
  /**
   * Finds a user by their email
   * @param email The user email
   * @returns Promise containing the user if found, or null
   */
} 