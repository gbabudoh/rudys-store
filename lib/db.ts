import mysql from 'mysql2/promise';

// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'rudy_store',
  port: parseInt(process.env.DB_PORT || '3306'),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test database connection
export async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}

// Execute a query
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function query(sql: string, params?: any[]) {
  try {
    const [results] = await pool.execute(sql, params);
    // For INSERT/UPDATE/DELETE, mysql2 returns ResultSetHeader
    // For SELECT, it returns RowDataPacket[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return results as any;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

// Get a single row
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function queryOne<T = any>(sql: string, params?: any[]): Promise<T | null> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const results = await query(sql, params) as any[];
  return (results[0] as T) || null;
}

// Get multiple rows
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function queryMany<T = any>(sql: string, params?: any[]): Promise<T[]> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return await query(sql, params) as T[];
}

// Execute a transaction
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function transaction(callback: (connection: mysql.PoolConnection) => Promise<any>) {
  const connection = await pool.getConnection();
  await connection.beginTransaction();
  
  try {
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

// Close the pool (useful for cleanup)
export async function closePool() {
  await pool.end();
}

export default pool;

