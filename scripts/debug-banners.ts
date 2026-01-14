import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

async function debugBanners() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: parseInt(process.env.DB_PORT || '3306'),
    });

    console.log('Connected to database');

    const [rows] = await connection.execute('SELECT * FROM banners');
    console.log('Banners in DB:', rows);

    const [sections] = await connection.execute('SHOW TABLES LIKE "banners"');
    console.log('Table existence check:', sections);

  } catch (error) {
    console.error('Error querying banners:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

debugBanners();
