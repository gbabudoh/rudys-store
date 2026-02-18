import dotenv from 'dotenv';
import path from 'path';
import mysql from 'mysql2/promise';
import fs from 'fs';

// Load environment variables from .env.local
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

async function clearCatalog() {
  console.log('🚀 Starting full catalog and data cleanup...');

  let connection;
  try {
    // Connect directly
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || '127.0.0.1',
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: parseInt(process.env.DB_PORT || '3306'),
    });

    console.log('✅ Database connected.');

    // 1. Truncate database tables with foreign key checks disabled
    console.log('--- Cleaning Database ---');
    
    await connection.execute('SET FOREIGN_KEY_CHECKS = 0');
    console.log('🔗 Foreign key checks disabled.');

    const tables = [
      'banners', 
      'categories', 
      'homepage_sections', 
      'order_items', 
      'order_tracking', 
      'orders', 
      'products', 
      'reviews', 
      'wishlist'
    ];
    
    for (const table of tables) {
      try {
        await connection.execute(`TRUNCATE TABLE ${table}`);
        console.log(`✅ Table '${table}' truncated.`);
      } catch (err: unknown) {
        const error = err as { code?: string; message?: string };
        if (error.code === 'ER_NO_SUCH_TABLE') {
          console.log(`ℹ️ Table '${table}' does not exist, skipping.`);
        } else {
          console.error(`❌ Error truncating table '${table}':`, error.message);
        }
      }
    }

    await connection.execute('SET FOREIGN_KEY_CHECKS = 1');
    console.log('🔗 Foreign key checks re-enabled.');

    // 2. Clear public/uploads directory
    console.log('\n--- Cleaning File System ---');
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    
    if (fs.existsSync(uploadsDir)) {
      const files = fs.readdirSync(uploadsDir);
      let deletedCount = 0;
      for (const file of files) {
        if (file === '.gitkeep') continue;
        
        const filePath = path.join(uploadsDir, file);
        try {
          if (fs.statSync(filePath).isFile()) {
            fs.unlinkSync(filePath);
            deletedCount++;
          }
        } catch (err: unknown) {
          const error = err as { message?: string };
          console.error(`❌ Error deleting file ${file}:`, error.message);
        }
      }
      console.log(`✅ ${deletedCount} files deleted from public/uploads.`);
    } else {
      console.log('ℹ️ public/uploads directory does not exist, skipping.');
    }

    console.log('\n✨ Full cleanup complete! All catalog data, orders, and mock images have been removed.');
  } catch (error: unknown) {
    const err = error as { message?: string };
    console.error('\n💥 Critical error during cleanup:', err.message);
  } finally {
    if (connection) await connection.end();
    process.exit(0);
  }
}

clearCatalog();
