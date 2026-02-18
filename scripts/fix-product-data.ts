
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

async function fixData() {
  const config = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'rudy_store',
    port: parseInt(process.env.DB_PORT || '3306'),
  };

  try {
    const connection = await mysql.createConnection(config);
    console.log('✅ Connected to database');

    // Update categories where category is '1' to 'Clothing'
    const [result1] = await connection.execute<mysql.ResultSetHeader>(
      "UPDATE products SET category = 'Clothing' WHERE category = '1'"
    );
    console.log(`Updated ${result1.affectedRows} products with category '1' to 'Clothing'`);

    // Update subcategories where subcategory is '10' to 'Dress'
    const [result2] = await connection.execute<mysql.ResultSetHeader>(
      "UPDATE products SET subcategory = 'Dress' WHERE subcategory = '10'"
    );
    console.log(`Updated ${result2.affectedRows} products with subcategory '10' to 'Dress'`);

    await connection.end();
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

fixData();
