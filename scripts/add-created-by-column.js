require('dotenv').config({ path: '.env.local' });
const mysql = require('mysql2/promise');

async function addCreatedByColumn() {
  let connection;

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
    const [columns] = await connection.execute(
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
    console.error('Error adding column:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

addCreatedByColumn();

