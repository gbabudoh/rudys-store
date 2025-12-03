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
export async function query(sql: string, params?: any[]) {
  try {
    const [results] = await pool.execute(sql, params);
    // For INSERT/UPDATE/DELETE, mysql2 returns ResultSetHeader
    // For SELECT, it returns RowDataPacket[]
    return results as any;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

// Get a single row
export async function queryOne(sql: string, params?: any[]) {
  const results = await query(sql, params) as any[];
  return results[0] || null;
}

// Get multiple rows
export async function queryMany(sql: string, params?: any[]) {
  return await query(sql, params) as any[];
}

// Execute a transaction
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

