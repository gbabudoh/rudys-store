import mysql, { RowDataPacket } from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

async function createSchema() {
  const config = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'rudy_store',
    port: parseInt(process.env.DB_PORT || '3306'),
    multipleStatements: true, // Allow multiple SQL statements
  };

  console.log('🔨 Creating database schema...');
  console.log(`📋 Database: ${config.database}`);
  console.log('');

  try {
    // Read SQL file
    const sqlFile = path.join(__dirname, '..', 'database', 'schema.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');

    // Create connection
    const connection = await mysql.createConnection(config);
    console.log('✅ Connected to database');

    // Execute SQL
    console.log('📝 Executing schema creation...');
    await connection.query(sql);
    
    console.log('✅ Schema created successfully!');
    console.log('');

    // Verify tables were created
    const [tables] = await connection.execute<RowDataPacket[]>('SHOW TABLES');
    console.log(`📋 Created ${tables.length} tables:`);
    tables.forEach((table, index) => {
      const tableName = Object.values(table)[0];
      console.log(`   ${index + 1}. ${tableName}`);
    });

    await connection.end();
    console.log('');
    console.log('✨ Database schema setup completed!');
    process.exit(0);
  } catch (error) {
    const err = error as Error;
    console.error('');
    console.error('❌ Schema creation failed!');
    console.error('Error:', err.message);
    console.error('');
    process.exit(1);
  }
}

createSchema();
