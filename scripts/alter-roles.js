const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '..', '.env.local') });

(async () => {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'rudy_store',
    port: parseInt(process.env.DB_PORT || '3306'),
  });

  await conn.execute(
    "ALTER TABLE admin_users MODIFY COLUMN role ENUM('super_admin', 'admin', 'staff', 'store_manager', 'sales_manager', 'customer_service', 'other') DEFAULT 'staff'"
  );

  console.log('Role ENUM updated successfully!');
  await conn.end();
})();
