import { UserRepository } from "../../repositories/userRepository";
import { User, UserProps } from "../../domain/entities/user";
import { DatabaseService } from "../../../../../services/database.service";

interface UserRow {
  id: string;
  email: string;
  password_hash: string;
  first_name: string | null;
  last_name: string | null;
  created_at: Date;
  updated_at: Date;
}

export class PostgresUserRepository implements UserRepository {
  private dbService: DatabaseService;

  constructor() {
    this.dbService = DatabaseService.getInstance();
  }

  async findByEmail(email: string): Promise<User | null> {
    const query = `
      SELECT * FROM users 
      WHERE email = $1
      LIMIT 1
    `;
    
    const rows = await this.dbService.query<UserRow>(query, [email]);
    
    if (rows.length === 0) {
      return null;
    }
    
    return this.mapToUser(rows[0]);
  }

  async findById(id: string): Promise<User | null> {
    const query = `
      SELECT * FROM users 
      WHERE id = $1
      LIMIT 1
    `;
    
    const rows = await this.dbService.query<UserRow>(query, [id]);
    
    if (rows.length === 0) {
      return null;
    }
    
    return this.mapToUser(rows[0]);
  }

  async save(user: User): Promise<User> {
    // Check if user already exists
    const existingUser = await this.findById(user.id);
    
    if (existingUser) {
      // Update existing user
      const query = `
        UPDATE users
        SET email = $1, 
            password_hash = $2, 
            first_name = $3, 
            last_name = $4,
            updated_at = $5
        WHERE id = $6
        RETURNING *
      `;
      
      const params = [
        user.email,
        user.passwordHash,
        user.firstName || null,
        user.lastName || null,
        user.updatedAt,
        user.id
      ];
      
      const rows = await this.dbService.query<UserRow>(query, params);
      return this.mapToUser(rows[0]);
    } else {
      // Insert new user
      const query = `
        INSERT INTO users (
          id, 
          email, 
          password_hash, 
          first_name, 
          last_name, 
          created_at, 
          updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `;
      
      const params = [
        user.id,
        user.email,
        user.passwordHash,
        user.firstName || null,
        user.lastName || null,
        user.createdAt,
        user.updatedAt
      ];
      
      const rows = await this.dbService.query<UserRow>(query, params);
      return this.mapToUser(rows[0]);
    }
  }

  async existsByEmail(email: string): Promise<boolean> {
    const query = `
      SELECT EXISTS(
        SELECT 1 FROM users WHERE email = $1
      ) as exists
    `;
    
    const result = await this.dbService.query<{ exists: boolean }>(query, [email]);
    return result[0].exists;
  }

  private mapToUser(row: UserRow): User {
    const userProps: UserProps = {
      id: row.id,
      email: row.email,
      passwordHash: row.password_hash,
      firstName: row.first_name || undefined,
      lastName: row.last_name || undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
    
    return User.create(userProps);
  }
} 