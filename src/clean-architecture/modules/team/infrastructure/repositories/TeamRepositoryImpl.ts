import { TeamRepository } from '../../repositories/TeamRepository';
import { Team } from '../../domain/entities/Team';
import { Database } from '../database/Database';
import { TeamMapper } from '../../mapper/TeamMapper';

export class TeamRepositoryImpl implements TeamRepository {
  constructor(private db: Database) {}

  async findAll(): Promise<Team[]> {
    const result = await this.db.query('SELECT * FROM teams ORDER BY id');
    return result.map(TeamMapper.toDomain);
  }

  async findById(id: number): Promise<Team | null> {
    const result = await this.db.query('SELECT * FROM teams WHERE id = $1', [id]);
    return result.length ? TeamMapper.toDomain(result[0]) : null;
  }

  async create(team: Team): Promise<Team> {
    const data = TeamMapper.toPersistence(team);
    const result = await this.db.query(
      'INSERT INTO teams (name, description) VALUES ($1, $2) RETURNING *',
      [data.name, data.description]
    );
    return TeamMapper.toDomain(result[0]);
  }

  async update(team: Team): Promise<Team> {
    const data = TeamMapper.toPersistence(team);
    const result = await this.db.query(
      'UPDATE teams SET name = $1, description = $2 WHERE id = $3 RETURNING *',
      [data.name, data.description, data.id]
    );
    return TeamMapper.toDomain(result[0]);
  }

  async delete(id: number): Promise<void> {
    await this.db.query('DELETE FROM teams WHERE id = $1', [id]);
  }
} 