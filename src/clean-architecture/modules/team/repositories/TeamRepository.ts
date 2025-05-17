import { Team } from '../domain/entities/Team';

export interface TeamRepository {
  findAll(): Promise<Team[]>;
  findById(id: number): Promise<Team | null>;
  create(team: Team): Promise<Team>;
  update(team: Team): Promise<Team>;
  delete(id: number): Promise<void>;
} 