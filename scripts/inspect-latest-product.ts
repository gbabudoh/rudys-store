
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

async function inspect() {
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

    const [rows] = await connection.query<mysql.RowDataPacket[]>('SELECT * FROM products ORDER BY id DESC LIMIT 5');
    
    console.log('📦 Last 5 Products:');
    rows.forEach((p) => {
      console.log(`Product ID: ${p.id}`);
      console.log(`- Name: ${p.name}`);
      console.log(`- Price: ${p.price}`);
      console.log(`- Category: ${p.category} (Type: ${typeof p.category})`);
      console.log(`- Subcategory: ${p.subcategory} (Type: ${typeof p.subcategory})`);
      console.log(`- Type: ${p.product_type}`);
      console.log(`- Store Section: ${p.store_section}`);
      console.log(`- Status: ${p.status}`);
      console.log('---');
    });

    await connection.end();
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

inspect();
