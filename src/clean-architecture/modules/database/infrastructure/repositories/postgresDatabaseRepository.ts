import { PoolClient, QueryResult } from 'pg';
import { DatabaseRepository } from '../../repositories/databaseRepository';
import { Database } from '../../domain/entities/database';
import { DatabaseService } from '../../../../../services/database.service';

interface DatabaseRow {
  name: string;
  owner: string;
  encoding: string;
  collate: string;
  ctype: string;
}

export class PostgresDatabaseRepository implements DatabaseRepository {
  private dbService: DatabaseService;

  constructor() {
    this.dbService = DatabaseService.getInstance();
  }

  async getClient(): Promise<PoolClient> {
    return await this.dbService.getClient();
  }

  async listDatabases(): Promise<Database[]> {
    try {
      const query = `
        SELECT 
          datname AS name, 
          pg_get_userbyid(datdba) AS owner,
          pg_encoding_to_char(encoding) AS encoding,
          datcollate AS collate,
          datctype AS ctype
        FROM pg_database
        WHERE datistemplate = false
        ORDER BY datname;
      `;
      
      const rows = await this.dbService.query<DatabaseRow>(query);
      
      return rows.map((row: DatabaseRow) => Database.create({
        name: row.name,
        owner: row.owner,
        encoding: row.encoding,
        collate: row.collate,
        ctype: row.ctype
      }));
    } catch (error) {
      console.error('Error listing databases:', error);
      throw error;
    }
  }

  async executeQuery(query: string): Promise<any[]> {
    return await this.dbService.query(query);
  }
} 