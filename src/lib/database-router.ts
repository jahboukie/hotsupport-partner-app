/**
 * Intelligent Database Router for SupportPartner
 * Routes data between Supabase (non-PHI) and AWS RDS (sensitive partner data)
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Pool, PoolClient } from 'pg';

// Types for data classification
type DataSensitivity = 'non-phi' | 'sensitive-partner';

interface DatabaseRouter {
  supabase: SupabaseClient;
  awsPool: Pool | null;
  isAWSConnected: boolean;
}

interface QueryResult<T = any> {
  data: T[];
  error?: string;
  count?: number;
}

// Data classification mapping
const DATA_CLASSIFICATION: Record<string, DataSensitivity> = {
  // Non-PHI data (goes to Supabase)
  'user_profiles': 'non-phi',
  'app_registrations': 'non-phi',
  'user_sessions': 'non-phi',
  'subscription_plans': 'non-phi',
  'user_subscriptions': 'non-phi',
  'usage_tracking': 'non-phi',
  'notification_preferences': 'non-phi',
  'scheduled_notifications': 'non-phi',
  'emergency_contacts': 'non-phi',
  
  // Sensitive partner data (goes to AWS RDS)
  'partner_connections': 'sensitive-partner',
  'ecosystem_sync': 'sensitive-partner',
  'support_actions': 'sensitive-partner',
  'progress_metrics': 'sensitive-partner',
  'daily_checkins': 'sensitive-partner',
  'mama_grace_conversations': 'sensitive-partner',
  'ai_insights': 'sensitive-partner',
  'crisis_situations': 'sensitive-partner',
  'audit_logs': 'sensitive-partner',
  'security_events': 'sensitive-partner'
};

class DatabaseRouterService implements DatabaseRouter {
  public supabase: SupabaseClient;
  public awsPool: Pool | null = null;
  public isAWSConnected: boolean = false;

  constructor() {
    // Initialize Supabase connection
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase configuration missing');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
    this.initializeAWSConnection();
  }

  /**
   * Initialize AWS RDS connection (fallback gracefully if not available)
   */
  private initializeAWSConnection(): void {
    try {
      const awsConfig = {
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000,
      };

      // Fallback to individual parameters
      if (!awsConfig.connectionString) {
        awsConfig.host = process.env.DB_HOST;
        awsConfig.port = parseInt(process.env.DB_PORT || '5432');
        awsConfig.database = process.env.DB_NAME;
        awsConfig.user = process.env.DB_USER;
        awsConfig.password = process.env.DB_PASSWORD;
        delete awsConfig.connectionString;
      }

      if (awsConfig.connectionString || awsConfig.host) {
        this.awsPool = new Pool(awsConfig);
        this.isAWSConnected = true;
        console.log('✅ AWS RDS connection initialized');
      } else {
        console.log('⚠️ AWS RDS configuration not found - using Supabase only');
      }
    } catch (error) {
      console.warn('⚠️ AWS RDS connection failed - falling back to Supabase:', error.message);
      this.isAWSConnected = false;
    }
  }

  /**
   * Classify data sensitivity based on table name
   */
  private classifyData(tableName: string): DataSensitivity {
    return DATA_CLASSIFICATION[tableName] || 'non-phi';
  }

  /**
   * Get appropriate database connection based on data sensitivity
   */
  private getDatabase(tableName: string): 'supabase' | 'aws' {
    const sensitivity = this.classifyData(tableName);
    
    if (sensitivity === 'sensitive-partner' && this.isAWSConnected) {
      return 'aws';
    }
    
    return 'supabase';
  }

  /**
   * Insert data with intelligent routing
   */
  async insert<T = any>(tableName: string, data: any, options?: { returning?: string[] }): Promise<QueryResult<T>> {
    const database = this.getDatabase(tableName);
    
    try {
      if (database === 'aws' && this.awsPool) {
        return await this.insertAWS(tableName, data, options);
      } else {
        return await this.insertSupabase(tableName, data, options);
      }
    } catch (error) {
      console.error(`Error inserting into ${tableName}:`, error);
      return { data: [], error: error.message };
    }
  }

  /**
   * Select data with intelligent routing
   */
  async select<T = any>(
    tableName: string, 
    options?: {
      columns?: string[];
      where?: Record<string, any>;
      orderBy?: { column: string; ascending?: boolean };
      limit?: number;
      offset?: number;
    }
  ): Promise<QueryResult<T>> {
    const database = this.getDatabase(tableName);
    
    try {
      if (database === 'aws' && this.awsPool) {
        return await this.selectAWS(tableName, options);
      } else {
        return await this.selectSupabase(tableName, options);
      }
    } catch (error) {
      console.error(`Error selecting from ${tableName}:`, error);
      return { data: [], error: error.message };
    }
  }

  /**
   * Update data with intelligent routing
   */
  async update<T = any>(
    tableName: string, 
    data: any, 
    where: Record<string, any>,
    options?: { returning?: string[] }
  ): Promise<QueryResult<T>> {
    const database = this.getDatabase(tableName);
    
    try {
      if (database === 'aws' && this.awsPool) {
        return await this.updateAWS(tableName, data, where, options);
      } else {
        return await this.updateSupabase(tableName, data, where, options);
      }
    } catch (error) {
      console.error(`Error updating ${tableName}:`, error);
      return { data: [], error: error.message };
    }
  }

  /**
   * Delete data with intelligent routing
   */
  async delete<T = any>(tableName: string, where: Record<string, any>): Promise<QueryResult<T>> {
    const database = this.getDatabase(tableName);
    
    try {
      if (database === 'aws' && this.awsPool) {
        return await this.deleteAWS(tableName, where);
      } else {
        return await this.deleteSupabase(tableName, where);
      }
    } catch (error) {
      console.error(`Error deleting from ${tableName}:`, error);
      return { data: [], error: error.message };
    }
  }

  // Supabase operations
  private async insertSupabase<T>(tableName: string, data: any, options?: { returning?: string[] }): Promise<QueryResult<T>> {
    const query = this.supabase.from(tableName).insert(data);
    
    if (options?.returning) {
      query.select(options.returning.join(', '));
    }
    
    const { data: result, error } = await query;
    
    return {
      data: result || [],
      error: error?.message,
      count: result?.length
    };
  }

  private async selectSupabase<T>(tableName: string, options?: any): Promise<QueryResult<T>> {
    let query = this.supabase.from(tableName).select(options?.columns?.join(', ') || '*');
    
    if (options?.where) {
      Object.entries(options.where).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
    }
    
    if (options?.orderBy) {
      query = query.order(options.orderBy.column, { ascending: options.orderBy.ascending ?? true });
    }
    
    if (options?.limit) {
      query = query.limit(options.limit);
    }
    
    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 100) - 1);
    }
    
    const { data, error, count } = await query;
    
    return {
      data: data || [],
      error: error?.message,
      count: count || data?.length
    };
  }

  private async updateSupabase<T>(tableName: string, data: any, where: Record<string, any>, options?: { returning?: string[] }): Promise<QueryResult<T>> {
    let query = this.supabase.from(tableName).update(data);
    
    Object.entries(where).forEach(([key, value]) => {
      query = query.eq(key, value);
    });
    
    if (options?.returning) {
      query = query.select(options.returning.join(', '));
    }
    
    const { data: result, error } = await query;
    
    return {
      data: result || [],
      error: error?.message,
      count: result?.length
    };
  }

  private async deleteSupabase<T>(tableName: string, where: Record<string, any>): Promise<QueryResult<T>> {
    let query = this.supabase.from(tableName).delete();
    
    Object.entries(where).forEach(([key, value]) => {
      query = query.eq(key, value);
    });
    
    const { data, error } = await query;
    
    return {
      data: data || [],
      error: error?.message,
      count: data?.length
    };
  }

  // AWS RDS operations
  private async insertAWS<T>(tableName: string, data: any, options?: { returning?: string[] }): Promise<QueryResult<T>> {
    if (!this.awsPool) throw new Error('AWS connection not available');
    
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
    
    const returning = options?.returning ? `RETURNING ${options.returning.join(', ')}` : '';
    const query = `INSERT INTO ${tableName} (${keys.join(', ')}) VALUES (${placeholders}) ${returning}`;
    
    const result = await this.awsPool.query(query, values);
    
    return {
      data: result.rows,
      count: result.rowCount
    };
  }

  private async selectAWS<T>(tableName: string, options?: any): Promise<QueryResult<T>> {
    if (!this.awsPool) throw new Error('AWS connection not available');
    
    const columns = options?.columns?.join(', ') || '*';
    let query = `SELECT ${columns} FROM ${tableName}`;
    const params: any[] = [];
    let paramIndex = 1;
    
    if (options?.where) {
      const conditions = Object.entries(options.where).map(([key, value]) => {
        params.push(value);
        return `${key} = $${paramIndex++}`;
      });
      query += ` WHERE ${conditions.join(' AND ')}`;
    }
    
    if (options?.orderBy) {
      query += ` ORDER BY ${options.orderBy.column} ${options.orderBy.ascending === false ? 'DESC' : 'ASC'}`;
    }
    
    if (options?.limit) {
      query += ` LIMIT ${options.limit}`;
    }
    
    if (options?.offset) {
      query += ` OFFSET ${options.offset}`;
    }
    
    const result = await this.awsPool.query(query, params);
    
    return {
      data: result.rows,
      count: result.rowCount
    };
  }

  private async updateAWS<T>(tableName: string, data: any, where: Record<string, any>, options?: { returning?: string[] }): Promise<QueryResult<T>> {
    if (!this.awsPool) throw new Error('AWS connection not available');
    
    const updateKeys = Object.keys(data);
    const updateValues = Object.values(data);
    const whereKeys = Object.keys(where);
    const whereValues = Object.values(where);
    
    const setClause = updateKeys.map((key, i) => `${key} = $${i + 1}`).join(', ');
    const whereClause = whereKeys.map((key, i) => `${key} = $${updateKeys.length + i + 1}`).join(' AND ');
    
    const returning = options?.returning ? `RETURNING ${options.returning.join(', ')}` : '';
    const query = `UPDATE ${tableName} SET ${setClause} WHERE ${whereClause} ${returning}`;
    
    const result = await this.awsPool.query(query, [...updateValues, ...whereValues]);
    
    return {
      data: result.rows,
      count: result.rowCount
    };
  }

  private async deleteAWS<T>(tableName: string, where: Record<string, any>): Promise<QueryResult<T>> {
    if (!this.awsPool) throw new Error('AWS connection not available');
    
    const keys = Object.keys(where);
    const values = Object.values(where);
    const conditions = keys.map((key, i) => `${key} = $${i + 1}`).join(' AND ');
    
    const query = `DELETE FROM ${tableName} WHERE ${conditions}`;
    const result = await this.awsPool.query(query, values);
    
    return {
      data: result.rows,
      count: result.rowCount
    };
  }

  /**
   * Execute raw SQL (AWS only - for migrations and complex queries)
   */
  async executeSQL(sql: string, params?: any[]): Promise<QueryResult> {
    if (!this.awsPool) {
      throw new Error('AWS connection required for raw SQL execution');
    }
    
    try {
      const result = await this.awsPool.query(sql, params);
      return {
        data: result.rows,
        count: result.rowCount
      };
    } catch (error) {
      console.error('Error executing SQL:', error);
      return { data: [], error: error.message };
    }
  }

  /**
   * Health check for both databases
   */
  async healthCheck(): Promise<{ supabase: boolean; aws: boolean; routing: Record<string, string> }> {
    const health = {
      supabase: false,
      aws: false,
      routing: DATA_CLASSIFICATION
    };
    
    // Test Supabase
    try {
      const { error } = await this.supabase.from('user_profiles').select('id').limit(1);
      health.supabase = !error;
    } catch (error) {
      console.error('Supabase health check failed:', error);
    }
    
    // Test AWS
    if (this.awsPool) {
      try {
        await this.awsPool.query('SELECT 1');
        health.aws = true;
      } catch (error) {
        console.error('AWS health check failed:', error);
      }
    }
    
    return health;
  }

  /**
   * Close all connections
   */
  async close(): Promise<void> {
    if (this.awsPool) {
      await this.awsPool.end();
      console.log('📊 AWS pool closed');
    }
    console.log('📊 Database router closed');
  }
}

// Export singleton instance
export const databaseRouter = new DatabaseRouterService();

// Export types
export type { QueryResult, DataSensitivity };

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('🛑 Closing database connections...');
  await databaseRouter.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('🛑 Closing database connections...');
  await databaseRouter.close();
  process.exit(0);
});