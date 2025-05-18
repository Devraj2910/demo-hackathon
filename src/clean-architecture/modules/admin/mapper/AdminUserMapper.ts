import { User } from '../../login/domain/entities/user';

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

export class AdminUserMapper {
  static toDomain(record: UserRecord): User {
    return User.create({
      id: record.id,
      email: record.email,
      passwordHash: record.password_hash,
      firstName: record.first_name || undefined,
      lastName: record.last_name || undefined,
      permission: record.permission,
      role: record.role || 'user',
      position: record.position || undefined,
      createdAt: record.created_at,
      updatedAt: record.updated_at
    });
  }

  static toDTO(user: User) {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      permission: user.permission,
      role: user.role,
      position: user.position,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }
} 