import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import mysql, { RowDataPacket } from 'mysql2/promise';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

async function test() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: parseInt(process.env.DB_PORT || '3306'),
    });

    console.log('✅ Connected to database:', process.env.DB_NAME);
    
    const [results] = await connection.execute<RowDataPacket[]>('SELECT COUNT(*) as count FROM banners');
    console.log('✅ Banners count:', results[0].count);
  } catch (e) {
    const err = e as Error;
    console.error('❌ Error:', err.message);
  } finally {
    if (connection) await connection.end();
  }
}

test();
