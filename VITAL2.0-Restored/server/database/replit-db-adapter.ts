// Replit Database adapter for production use
// This simulates the Replit Database interface using our current PostgreSQL setup

interface ReplitDB {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
  delete(key: string): Promise<void>;
  list(prefix?: string): Promise<string[]>;
}

// In-memory implementation for development (when Replit DB not available)
class MemoryReplitDB implements ReplitDB {
  private data = new Map<string, string>();

  async get(key: string): Promise<string | null> {
    return this.data.get(key) || null;
  }

  async set(key: string, value: string): Promise<void> {
    this.data.set(key, value);
  }

  async delete(key: string): Promise<void> {
    this.data.delete(key);
  }

  async list(prefix?: string): Promise<string[]> {
    const keys = Array.from(this.data.keys());
    if (prefix) {
      return keys.filter(key => key.startsWith(prefix));
    }
    return keys;
  }
}

// PostgreSQL-backed implementation (for compatibility with current setup)
class PostgreSQLReplitDB implements ReplitDB {
  private tableName = 'replit_kv_store';

  constructor() {
    this.initializeTable();
  }

  private async initializeTable() {
    try {
      // This would use our existing db connection
      const { pool } = await import('../db');
      await pool.query(`
        CREATE TABLE IF NOT EXISTS ${this.tableName} (
          key VARCHAR(255) PRIMARY KEY,
          value TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
    } catch (error) {
      console.error('Failed to initialize Replit KV table:', error);
    }
  }

  async get(key: string): Promise<string | null> {
    try {
      const { pool } = await import('../db');
      const result = await pool.query(
        `SELECT value FROM ${this.tableName} WHERE key = $1`,
        [key]
      );
      return result.rows[0]?.value || null;
    } catch (error) {
      console.error('Error getting key from DB:', error);
      return null;
    }
  }

  async set(key: string, value: string): Promise<void> {
    try {
      const { pool } = await import('../db');
      await pool.query(
        `INSERT INTO ${this.tableName} (key, value, updated_at) 
         VALUES ($1, $2, CURRENT_TIMESTAMP)
         ON CONFLICT (key) 
         DO UPDATE SET value = $2, updated_at = CURRENT_TIMESTAMP`,
        [key, value]
      );
    } catch (error) {
      console.error('Error setting key in DB:', error);
    }
  }

  async delete(key: string): Promise<void> {
    try {
      const { pool } = await import('../db');
      await pool.query(`DELETE FROM ${this.tableName} WHERE key = $1`, [key]);
    } catch (error) {
      console.error('Error deleting key from DB:', error);
    }
  }

  async list(prefix?: string): Promise<string[]> {
    try {
      const { pool } = await import('../db');
      let query = `SELECT key FROM ${this.tableName}`;
      let params: string[] = [];

      if (prefix) {
        query += ' WHERE key LIKE $1';
        params = [prefix + '%'];
      }

      const result = await pool.query(query, params);
      return result.rows.map((row: any) => row.key as string);
    } catch (error) {
      console.error('Error listing keys from DB:', error);
      return [];
    }
  }
}

// Factory function to create appropriate DB instance
export function createReplitDB(): ReplitDB {
  // Check if we're in Replit environment with native Database
  if (process.env.REPLIT_DB_URL) {
    // Would use native Replit Database here
    // return new NativeReplitDB();
  }
  
  // For development, use PostgreSQL-backed implementation
  if (process.env.DATABASE_URL) {
    return new PostgreSQLReplitDB();
  }
  
  // Fallback to in-memory for testing
  console.warn('Using in-memory Replit DB - data will not persist');
  return new MemoryReplitDB();
}

export type { ReplitDB };