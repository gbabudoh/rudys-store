import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import mysql, { RowDataPacket } from 'mysql2/promise';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

interface CountResult extends RowDataPacket {
  count: number;
}

async function checkTables() {
  let connection: mysql.Connection | undefined;
  
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: parseInt(process.env.DB_PORT || '3306'),
    });

    console.log('✅ Connected to database');

    // Check if banners table exists
    const [bannersTable] = await connection.execute<CountResult[]>(
      `SELECT COUNT(*) as count FROM information_schema.tables 
       WHERE table_schema = ? AND table_name = 'banners'`,
      [process.env.DB_NAME]
    );

    if (bannersTable[0].count === 0) {
      console.log('❌ banners table does NOT exist');
      console.log('   Run: npx tsx scripts/create-schema.ts');
    } else {
      console.log('✅ banners table exists');
      const [bannerCount] = await connection.execute<CountResult[]>('SELECT COUNT(*) as count FROM banners');
      console.log(`   Contains ${bannerCount[0].count} records`);
    }

    // Check if homepage_sections table exists
    const [sectionsTable] = await connection.execute<CountResult[]>(
      `SELECT COUNT(*) as count FROM information_schema.tables 
       WHERE table_schema = ? AND table_name = 'homepage_sections'`,
      [process.env.DB_NAME]
    );

    if (sectionsTable[0].count === 0) {
      console.log('❌ homepage_sections table does NOT exist');
      console.log('   Run: npx tsx scripts/create-homepage-sections.ts');
    } else {
      console.log('✅ homepage_sections table exists');
      const [sectionCount] = await connection.execute<CountResult[]>('SELECT COUNT(*) as count FROM homepage_sections');
      console.log(`   Contains ${sectionCount[0].count} records`);
    }

    // Check admin_users table
    const [adminTable] = await connection.execute<CountResult[]>(
      `SELECT COUNT(*) as count FROM information_schema.tables 
       WHERE table_schema = ? AND table_name = 'admin_users'`,
      [process.env.DB_NAME]
    );

    if (adminTable[0].count === 0) {
      console.log('❌ admin_users table does NOT exist');
    } else {
      console.log('✅ admin_users table exists');
    }

  } catch (error) {
    const err = error as { message: string, code?: string };
    console.error('❌ Error:', err.message);
    if (err.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('   Check your database credentials in .env.local');
    } else if (err.code === 'ER_BAD_DB_ERROR') {
      console.error('   Database does not exist. Create it first.');
    }
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

checkTables();
