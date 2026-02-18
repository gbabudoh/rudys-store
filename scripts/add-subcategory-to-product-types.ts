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

  console.log('🔨 Starting migration: Add sub_category_id to product_types...');

  try {
    const connection = await mysql.createConnection(config);
    console.log('✅ Connected to database');

    try {
      // Add column
      console.log('📝 Adding sub_category_id column...');
      await connection.query(`
        ALTER TABLE product_types 
        ADD COLUMN sub_category_id INT NULL AFTER description
      `);
      console.log('✅ Column added');
    } catch (error) {
      const err = error as MySQLError;
      if (err.code === 'ER_DUP_FIELDNAME') {
        console.log('ℹ️ Column already exists, skipping');
      } else {
        throw err;
      }
    }

    try {
      // Add foreign key
      console.log('📝 Adding foreign key constraint...');
      await connection.query(`
        ALTER TABLE product_types 
        ADD CONSTRAINT fk_product_types_sub_category 
        FOREIGN KEY (sub_category_id) REFERENCES sub_categories(id) ON DELETE SET NULL
      `);
      console.log('✅ Foreign key added');
    } catch (error) {
      const err = error as MySQLError;
      if (err.code === 'ER_DUP_KEYNAME') {
        console.log('ℹ️ Foreign key already exists, skipping');
      } else {
        // Ignore if constraint name conflict
        console.log('⚠️ Error adding foreign key (might already exist):', err.message);
      }
    }

    try {
      // Add index
      console.log('📝 Adding index...');
      await connection.query(`
        CREATE INDEX idx_sub_category ON product_types(sub_category_id)
      `);
      console.log('✅ Index added');
    } catch (error) {
       const err = error as MySQLError;
       if (err.code === 'ER_DUP_KEYNAME') {
        console.log('ℹ️ Index already exists, skipping');
      } else {
        console.log('⚠️ Error adding index (might already exist):', err.message);
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
