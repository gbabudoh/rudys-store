
import { createConnection } from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { RowDataPacket } from 'mysql2';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function inspectSubCategories() {
  const connection = await createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT || '3306'),
  });

  try {
    const [rows] = await connection.execute<RowDataPacket[]>('SELECT * FROM sub_categories');
    console.log(JSON.stringify(rows, null, 2));
  } catch (error) {
    console.error('Error fetching subcategories:', error);
  } finally {
    await connection.end();
  }
}

inspectSubCategories();
