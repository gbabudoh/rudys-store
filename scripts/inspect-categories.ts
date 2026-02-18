
import { createConnection } from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { RowDataPacket } from 'mysql2';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function inspectCategories() {
  const connection = await createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT || '3306'),
  });

  try {
    const [rows] = await connection.execute<RowDataPacket[]>('SELECT * FROM categories');
    fs.writeFileSync('category_dump.json', JSON.stringify(rows, null, 2));
    console.log('Dumped to category_dump.json');
  } catch (error) {
    console.error('Error fetching categories:', error);
  } finally {
    await connection.end();
  }
}

inspectCategories();
