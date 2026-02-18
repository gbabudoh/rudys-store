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

  console.log('🔨 Starting migration: Add is_best_seller to products...');

  try {
    const connection = await mysql.createConnection(config);
    console.log('✅ Connected to database');

    const columnsToAdd = [
      { name: 'is_best_seller', type: 'BOOLEAN DEFAULT FALSE', after: 'is_featured' },
      { name: 'is_featured', type: 'BOOLEAN DEFAULT FALSE', after: 'is_on_sale' },
      { name: 'is_new', type: 'BOOLEAN DEFAULT FALSE', after: 'stock' },
      { name: 'is_on_sale', type: 'BOOLEAN DEFAULT FALSE', after: 'is_new' },
    ];

    for (const col of columnsToAdd) {
      try {
        console.log(`📝 Adding ${col.name} column...`);
        // Check if column exists first strictly or use catch
        // Using simple ADD COLUMN with catch for existence
        await connection.query(`
          ALTER TABLE products 
          ADD COLUMN ${col.name} ${col.type} AFTER ${col.after}
        `);
        console.log(`✅ ${col.name} added`);
      } catch (error) {
        const err = error as MySQLError;
        if (err.code === 'ER_DUP_FIELDNAME') {
          console.log(`ℹ️ ${col.name} already exists, skipping`);
        } else {
           // If 'after' column doesn't exist, try adding without AFTER or just handle it. 
           // If 'is_featured' is missing, adding 'is_best_seller' AFTER 'is_featured' will fail with ER_BAD_FIELD_ERROR
           if (err.code === 'ER_BAD_FIELD_ERROR') {
              console.log(`⚠️ Could not add ${col.name} (dependency column missing):`, err.message);
              // Fallback: Add without AFTER
              try {
                 await connection.query(`ALTER TABLE products ADD COLUMN ${col.name} ${col.type}`);
                 console.log(`✅ ${col.name} added (without position)`);
              } catch (retryErr) {
                 console.error(`❌ Failed to add ${col.name}:`, (retryErr as Error).message);
              }
           } else {
              throw err;
           }
        }
      }
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
