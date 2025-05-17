import { Pool, PoolClient } from 'pg';
import dotenv from 'dotenv';
import { ErrorHandlingService } from './errorHandling.service';

// Load environment variables
dotenv.config();

/**
 * PostgreSQL Database Service
 * Handles database connection and provides query methods
 */
export class DatabaseService {
  private static instance: DatabaseService;
  private pool: Pool;

  private constructor() {
    const sslEnabled = process.env.SSL_ENABLED === 'true';
    
    const poolConfig: any = {
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: parseInt(process.env.DB_PORT || '5432'),
      max: 20, // Maximum number of clients
      connectionTimeoutMillis: 50000, // How long to wait before timing out when connecting a new client
    };

    // Add SSL configuration if enabled
    if (sslEnabled) {
      const sslMode = process.env.SSL_MODE || 'require';
      
      switch (sslMode) {
        case 'disable':
          // No SSL
          break;
        case 'allow':
        case 'prefer':
        case 'require':
          // Simple SSL configuration
          poolConfig.ssl = {
            rejectUnauthorized: false
          };
          break;
        case 'verify-ca':
        case 'verify-full':
          // More secure SSL configuration
          poolConfig.ssl = {
            rejectUnauthorized: true,
            // Add CA certificate if provided
            ca: process.env.SSL_CA ? process.env.SSL_CA : undefined,
            // Add client certificate if provided
            cert: process.env.SSL_CERT ? process.env.SSL_CERT : undefined,
            // Add client key if provided
            key: process.env.SSL_KEY ? process.env.SSL_KEY : undefined,
          };
          break;
        default:
          // Default to require
          poolConfig.ssl = {
            rejectUnauthorized: false
          };
      }
      
      console.log(`SSL mode: ${sslMode}`);
    }

    this.pool = new Pool(poolConfig);

    // Log pool errors
    this.pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err);
    });
  }

  /**
   * Get singleton instance of DatabaseService
   */
  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  /**
   * Test database connection
   * @returns true if connection successful, false otherwise
   */
  public async testConnection(): Promise<boolean> {
    try {
      // Execute a simple query to check connection
      const result = await this.pool.query('SELECT NOW() as now');
      console.log('✅ Database connection successful:', result.rows[0].now);
      return true;
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      return false;
    }
  }

  /**
   * Get the database pool instance
   * Used by repositories that need direct access to the pool
   * @returns The database pool
   */
  public getPool(): Pool {
    return this.pool;
  }

  /**
   * Execute a query with parameters
   */
  public async query<T>(text: string, params?: any[]): Promise<T[]> {
    return ErrorHandlingService.handleDatabaseOperation(async () => {
      const start = Date.now();
      try {
        const result = await this.pool.query(text, params);
        const duration = Date.now() - start;
        console.log('Executed query', { text, duration, rows: result.rowCount });
        return result.rows as T[];
      } catch (error) {
        console.error('Error executing query', { text, error });
        // Convert to our custom error handling
        return ErrorHandlingService.handlePostgresError(error);
      }
    });
  }

  /**
   * Get a client from the pool
   * Used for transactions that need multiple queries
   */
  public async getClient(): Promise<PoolClient> {
    return ErrorHandlingService.handleDatabaseOperation(async () => {
      const client = await this.pool.connect();
      return client;
    });
  }

  /**
   * Execute a transaction with multiple queries
   */
  public async transaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
    return ErrorHandlingService.handleDatabaseOperation(async () => {
      const client = await this.getClient();
      
      try {
        await client.query('BEGIN');
        const result = await callback(client);
        await client.query('COMMIT');
        return result;
      } catch (error) {
        await client.query('ROLLBACK');
        if (error instanceof Error) {
          throw error;
        }
        throw new Error(String(error));
      } finally {
        client.release();
      }
    });
  }

  /**
   * Close pool connections
   */
  public async disconnect(): Promise<void> {
    await this.pool.end();
  }
} 