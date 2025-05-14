import { Pool, PoolClient, QueryResult } from 'pg';
import { DatabaseRepository } from '../../repositories/databaseRepository';
import { Database } from '../../domain/entities/database';

interface DatabaseRow {
  name: string;
  owner: string;
  encoding: string;
  collate: string;
  ctype: string;
}

export class PostgresDatabaseRepository implements DatabaseRepository {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      host: 'aws-0-ap-south-1.pooler.supabase.com',
      port: 5432,
      database: 'postgres',
      user: 'postgres.ngrweymchhsmcuvdomhs',
      password: "Devraj@2910", // We'll still use environment variable for password
      ssl: {
        rejectUnauthorized: false // Required for Supabase
      },
      max: 20, // Maximum number of clients in the pool
      idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
      connectionTimeoutMillis: 2000, // How long to wait for a connection
    });
  }

  async getClient(): Promise<PoolClient> {
    return await this.pool.connect();
  }

  async listDatabases(): Promise<Database[]> {
    const client = await this.getClient();
    try {
      const result: QueryResult<DatabaseRow> = await client.query(`
        SELECT 
          datname AS name, 
          pg_get_userbyid(datdba) AS owner,
          pg_encoding_to_char(encoding) AS encoding,
          datcollate AS collate,
          datctype AS ctype
        FROM pg_database
        WHERE datistemplate = false
        ORDER BY datname;
      `);
      
      return result.rows.map((row: DatabaseRow) => Database.create({
        name: row.name,
        owner: row.owner,
        encoding: row.encoding,
        collate: row.collate,
        ctype: row.ctype
      }));
    } finally {
      client.release();
    }
  }

  async executeQuery(query: string): Promise<any[]> {
    const client = await this.getClient();
    try {
      const result = await client.query(query);
      return result.rows;
    } finally {
      client.release();
    }
  }
} 