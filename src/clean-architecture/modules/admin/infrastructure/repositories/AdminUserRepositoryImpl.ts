import { Pool } from 'pg';
import { User } from '../../../login/domain/entities/user';
import { AdminUserRepository } from '../../repositories/AdminUserRepository';
import { AdminUserMapper } from '../../mapper/AdminUserMapper';

interface UserRecord {
  id: string;
  email: string;
  password_hash: string;
  first_name: string | null;
  last_name: string | null;
  permission: string;
  role: string;
  position: string | null;
  created_at: Date;
  updated_at: Date;
}

export class AdminUserRepositoryImpl implements AdminUserRepository {
  constructor(private dbPool: Pool) {}

  async getPendingUsers(): Promise<User[]> {
    const query = `
      SELECT * FROM users 
      WHERE permission = 'pending'
      ORDER BY created_at DESC
    `;
    
    const result = await this.dbPool.query<UserRecord>(query);
    return result.rows.map(row => AdminUserMapper.toDomain(row));
  }
} 