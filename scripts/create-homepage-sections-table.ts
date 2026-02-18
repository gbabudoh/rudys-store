import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

async function createHomepageSectionsTable() {
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

    // Create homepage_sections table
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS homepage_sections (
        id INT AUTO_INCREMENT PRIMARY KEY,
        section_key VARCHAR(100) UNIQUE NOT NULL,
        title VARCHAR(255) NOT NULL,
        subtitle VARCHAR(500),
        description TEXT,
        image_url VARCHAR(500),
        link_url VARCHAR(500),
        product_count INT DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        display_order INT DEFAULT 0,
        gradient_color VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_section_key (section_key),
        INDEX idx_active (is_active),
        INDEX idx_order (display_order)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;

    await connection.execute(createTableQuery);
    console.log('✓ Homepage sections table created successfully');

    // Insert default sections
    const sections = [
      {
        section_key: 'ruddy_collections',
        title: 'Ruddys Store',
        subtitle: 'Premium Fashion for Everyone',
        description: 'Discover our curated collection of premium fashion items',
        image_url: 'https://images.unsplash.com/photo-1445205170230-053b83016050',
        link_url: '/store',
        product_count: 0,
        is_active: true,
        display_order: 1,
        gradient_color: 'from-blue-500 to-purple-600'
      },
      {
        section_key: 'ruddy_luxury',
        title: 'Ruddy Luxury',
        subtitle: 'Exclusive Luxury Items',
        description: 'Experience luxury with our exclusive collection',
        image_url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d',
        link_url: '/luxury',
        product_count: 0,
        is_active: true,
        display_order: 2,
        gradient_color: 'from-purple-600 to-pink-600'
      },
      {
        section_key: 'slide_and_sole',
        title: 'Slide & Sole',
        subtitle: 'Comfort Meets Style',
        description: 'Premium Crocs and comfortable footwear',
        image_url: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86',
        link_url: '/crocs',
        product_count: 0,
        is_active: true,
        display_order: 3,
        gradient_color: 'from-green-500 to-teal-600'
      }
    ];

    const insertQuery = `
      INSERT INTO homepage_sections (
        section_key, title, subtitle, description, image_url, link_url,
        product_count, is_active, display_order, gradient_color
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    for (const section of sections) {
      await connection.execute(insertQuery, [
        section.section_key,
        section.title,
        section.subtitle,
        section.description,
        section.image_url,
        section.link_url,
        section.product_count,
        section.is_active,
        section.display_order,
        section.gradient_color
      ]);
    }

    console.log('✓ Default homepage sections added successfully');
    console.log('\nHomepage sections table setup complete!');

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

createHomepageSectionsTable();
