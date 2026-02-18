import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

// Define MySQL error interface
interface MySQLError extends Error {
  code?: string;
  errno?: number;
  sqlMessage?: string;
  sqlState?: string;
  index?: number;
  sql?: string;
}

async function migrate() {
  const config = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'rudy_store',
    port: parseInt(process.env.DB_PORT || '3306'),
    multipleStatements: true,
  };

  console.log('🔨 Starting migration: Change product_type to VARCHAR...');

  try {
    const connection = await mysql.createConnection(config);
    console.log('✅ Connected to database');

    try {
      // Modify column
      console.log('📝 Modifying product_type column...');
      await connection.query(`
        ALTER TABLE products 
        MODIFY COLUMN product_type VARCHAR(100) DEFAULT 'Shirt'
      `);
      console.log('✅ Column modified');
    } catch (error) {
      const err = error as MySQLError;
      console.error('❌ Error modifying column:', err.message);
      throw err;
    }

    await connection.end();
    console.log('');
    console.log('✨ Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    const err = error as Error;
    console.error('');
    console.error('❌ Migration failed!');
    console.error('Error:', err.message);
    process.exit(1);
  }
}

migrate();
