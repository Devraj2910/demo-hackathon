import { User } from "../domain/entities/user";

export interface UserRepository {
  /**
   * Find a user by email
   */
  findByEmail(email: string): Promise<User | null>;
  
  /**
   * Find a user by ID
   */
  findById(id: string): Promise<User | null>;
  
  /**
   * Save a user (create or update)
   */
  save(user: User): Promise<User>;
  
  /**
   * Check if an email already exists
   */
  existsByEmail(email: string): Promise<boolean>;
} 