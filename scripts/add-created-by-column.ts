import mysql, { RowDataPacket } from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

interface ColumnInfo extends RowDataPacket {
  COLUMN_NAME: string;
}

async function addCreatedByColumn() {
  let connection: mysql.Connection | undefined;

  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'rudy_store',
      port: parseInt(process.env.DB_PORT || '3306'),
    });

    console.log('Connected to database');

    // Check if column exists
    const [columns] = await connection.execute<ColumnInfo[]>(
      `SELECT COLUMN_NAME 
       FROM INFORMATION_SCHEMA.COLUMNS 
       WHERE TABLE_SCHEMA = ? 
       AND TABLE_NAME = 'admin_users' 
       AND COLUMN_NAME = 'created_by'`,
      [process.env.DB_NAME || 'rudy_store']
    );

    if (columns.length === 0) {
      console.log('Adding created_by column...');
      await connection.execute(
        `ALTER TABLE admin_users 
         ADD COLUMN created_by INT NULL,
         ADD FOREIGN KEY (created_by) REFERENCES admin_users(id) ON DELETE SET NULL,
         ADD INDEX idx_created_by (created_by)`
      );
      console.log('✅ created_by column added successfully!');
    } else {
      console.log('✅ created_by column already exists');
    }
  } catch (error) {
    const err = error as Error;
    console.error('Error adding column:', err.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

addCreatedByColumn();
