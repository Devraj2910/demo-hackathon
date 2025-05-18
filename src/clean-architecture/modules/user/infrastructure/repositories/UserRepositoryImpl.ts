import { Pool, QueryResult } from 'pg';
import { User, UserProps } from '../../../user/domain/entities/User';
import { UserRepository } from '../../repositories/UserRepository';

interface UserRecord {
  id: string;
  email: string;
  password_hash: string;
  first_name: string | null;
  last_name: string | null;
  created_at: Date;
  updated_at: Date;
}

export class UserRepositoryImpl implements UserRepository {
  constructor(private dbPool: Pool) {}

  /**
   * Maps a database record to a User entity
   * @param record The database record
   * @returns The User entity
   */
  private toDomain(record: UserRecord): User {
    return User.create({
      id: record.id,
      email: record.email,
      passwordHash: record.password_hash,
      firstName: record.first_name,
      lastName: record.last_name,
      createdAt: record.created_at,
      updatedAt: record.updated_at
    });
  }

  /**
   * Searches for users based on the provided search text
   * @param searchText The text to search for in email, first_name, and last_name fields
   * @returns An array of matching User entities
   */
  async searchUsers(searchText: string): Promise<User[]> {
    const query = `
      SELECT * FROM users 
      WHERE 
        email ILIKE $1 OR 
        first_name ILIKE $1 OR 
        last_name ILIKE $1 AND permission = "approved"
      ORDER BY first_name, last_name
    `;
    
    const result: QueryResult<UserRecord> = await this.dbPool.query(query, [`%${searchText}%`]);
    
    return result.rows.map(row => this.toDomain(row));
  }

  /**
   * Finds a user by their ID
   * @param id The user ID
   * @returns The User entity if found, or null
   */
  async findById(id: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE id = $1 AND permission = "approved"';
    const result: QueryResult<UserRecord> = await this.dbPool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return this.toDomain(result.rows[0]);
  }

} 