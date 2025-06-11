/**
 * Database Connection and Query Utilities
 * Production-ready PostgreSQL connection with connection pooling
 */

import { Pool, PoolClient, QueryResult } from 'pg';

interface DatabaseConfig {
  connectionString?: string;
  host?: string;
  port?: number;
  database?: string;
  user?: string;
  password?: string;
  ssl?: boolean | object;
  max?: number; // Maximum number of clients in the pool
  idleTimeoutMillis?: number;
  connectionTimeoutMillis?: number;
}

class DatabaseConnection {
  private pool: Pool | null = null;
  private isConnected = false;

  constructor() {
    this.initializePool();
  }

  private initializePool(): void {
    const config: DatabaseConfig = {
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      max: 20, // Maximum number of clients in the pool
      idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
      connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
    };

    // Fallback to individual connection parameters if DATABASE_URL is not available
    if (!config.connectionString) {
      config.host = process.env.DB_HOST;
      config.port = parseInt(process.env.DB_PORT || '5432');
      config.database = process.env.DB_NAME;
      config.user = process.env.DB_USER;
      config.password = process.env.DB_PASSWORD;
    }

    this.pool = new Pool(config);

    // Handle pool errors
    this.pool.on('error', (err) => {
      console.error('🔥 Unexpected error on idle database client:', err);
      this.isConnected = false;
    });

    // Handle pool connection
    this.pool.on('connect', () => {
      console.log('📊 Database client connected');
      this.isConnected = true;
    });

    // Handle pool removal
    this.pool.on('remove', () => {
      console.log('📊 Database client removed');
    });
  }

  /**
   * Test database connection
   */
  async testConnection(): Promise<boolean> {
    try {
      if (!this.pool) {
        throw new Error('Database pool not initialized');
      }

      const client = await this.pool.connect();
      const result = await client.query('SELECT NOW() as current_time, version() as pg_version');
      
      console.log('✅ Database connection successful!');
      console.log('🕒 Server time:', result.rows[0].current_time);
      console.log('🐘 PostgreSQL version:', result.rows[0].pg_version.split(',')[0]);
      
      client.release();
      this.isConnected = true;
      return true;
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      this.isConnected = false;
      return false;
    }
  }

  /**
   * Execute a query with parameters
   */
  async query<T = any>(text: string, params?: any[]): Promise<QueryResult<T>> {
    if (!this.pool) {
      throw new Error('Database pool not initialized');
    }

    const start = Date.now();
    
    try {
      const result = await this.pool.query<T>(text, params);
      const duration = Date.now() - start;
      
      console.log('📊 Query executed:', {
        duration: `${duration}ms`,
        rows: result.rowCount,
        command: result.command
      });
      
      return result;
    } catch (error) {
      const duration = Date.now() - start;
      console.error('💥 Query failed:', {
        duration: `${duration}ms`,
        error: error.message,
        query: text.substring(0, 100) + (text.length > 100 ? '...' : '')
      });
      throw error;
    }
  }

  /**
   * Execute queries within a transaction
   */
  async transaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
    if (!this.pool) {
      throw new Error('Database pool not initialized');
    }

    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');
      console.log('🔄 Transaction started');
      
      const result = await callback(client);
      
      await client.query('COMMIT');
      console.log('✅ Transaction committed');
      
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('🔄 Transaction rolled back:', error.message);
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Set user context for Row Level Security
   */
  async setUserContext(userId: string): Promise<void> {
    if (!this.pool) {
      throw new Error('Database pool not initialized');
    }

    await this.query("SELECT set_config('app.current_user_id', $1, true)", [userId]);
  }

  /**
   * Get connection status
   */
  getStatus() {
    return {
      isConnected: this.isConnected,
      totalCount: this.pool?.totalCount || 0,
      idleCount: this.pool?.idleCount || 0,
      waitingCount: this.pool?.waitingCount || 0
    };
  }

  /**
   * Close all connections
   */
  async close(): Promise<void> {
    if (this.pool) {
      await this.pool.end();
      console.log('📊 Database pool closed');
      this.isConnected = false;
    }
  }

  /**
   * Execute raw SQL file (for migrations, schema updates)
   */
  async executeSQLFile(sqlContent: string): Promise<void> {
    if (!this.pool) {
      throw new Error('Database pool not initialized');
    }

    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Split SQL file into individual statements
      const statements = sqlContent
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

      for (const statement of statements) {
        if (statement.trim()) {
          await client.query(statement);
        }
      }
      
      await client.query('COMMIT');
      console.log('✅ SQL file executed successfully');
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('💥 SQL file execution failed:', error);
      throw error;
    } finally {
      client.release();
    }
  }
}

// Create singleton instance
const db = new DatabaseConnection();

// Export database utilities
export default db;

// Export types for use in other files
export type { DatabaseConfig, QueryResult };
export { Pool, PoolClient };

// Health check function for API routes
export const healthCheck = async () => {
  try {
    const isHealthy = await db.testConnection();
    const status = db.getStatus();
    
    return {
      healthy: isHealthy,
      database: 'postgresql',
      status: status,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      healthy: false,
      database: 'postgresql',
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
};

// Graceful shutdown handler
process.on('SIGINT', async () => {
  console.log('🛑 Received SIGINT, closing database connections...');
  await db.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('🛑 Received SIGTERM, closing database connections...');
  await db.close();
  process.exit(0);
});