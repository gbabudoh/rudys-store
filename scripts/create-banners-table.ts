import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

async function createBannersTable() {
  let connection;
  
  try {
    // Create connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: parseInt(process.env.DB_PORT || '3306'),
    });

    console.log('Connected to database');

    // Create banners table
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS banners (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        subtitle VARCHAR(500),
        image_url VARCHAR(500) NOT NULL,
        link_url VARCHAR(500),
        button_text VARCHAR(50),
        is_active BOOLEAN DEFAULT TRUE,
        display_order INT DEFAULT 0,
        start_date TIMESTAMP NULL,
        end_date TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_active (is_active),
        INDEX idx_order (display_order)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;

    await connection.execute(createTableQuery);
    console.log('✓ Banners table created successfully');

    // Insert sample banner
    const insertQuery = `
      INSERT INTO banners (title, subtitle, image_url, link_url, button_text, is_active, display_order)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    await connection.execute(insertQuery, [
      'Welcome to Rudy Store',
      'Discover our latest collection of premium fashion and luxury items',
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8',
      '/collections',
      'Shop Now',
      true,
      1
    ]);

    console.log('✓ Sample banner added successfully');
    console.log('\nBanners table setup complete!');

  } catch (error) {
    const err = error as Error;
    console.error('Error:', err.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

createBannersTable();
