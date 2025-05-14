import { Database } from '../domain/entities/database';

export interface DatabaseRepository {
  listDatabases(): Promise<Database[]>;
  executeQuery(query: string): Promise<any[]>;
} 