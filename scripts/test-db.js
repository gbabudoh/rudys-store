// Simple database connection test script
require('dotenv').config({ path: '.env.local' });
const mysql = require('mysql2/promise');

async function testConnection() {
  const config = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'rudy_store',
    port: parseInt(process.env.DB_PORT || '3306'),
  };

  console.log('🔍 Testing database connection...');
  console.log('📋 Configuration:');
  console.log(`   Host: ${config.host}`);
  console.log(`   Port: ${config.port}`);
  console.log(`   User: ${config.user}`);
  console.log(`   Database: ${config.database}`);
  console.log(`   Password: ${config.password ? '***' : '(not set)'}`);
  console.log('');

  try {
    const connection = await mysql.createConnection(config);
    console.log('✅ Database connection successful!');
    
    // Test a simple query
    const [rows] = await connection.execute('SELECT 1 as test');
    console.log('✅ Query test successful:', rows);
    
    // Check database version
    const [version] = await connection.execute('SELECT VERSION() as version');
    console.log('📊 MySQL Version:', version[0].version);
    
    // List tables if any
    const [tables] = await connection.execute('SHOW TABLES');
    console.log(`📋 Tables in database: ${tables.length}`);
    if (tables.length > 0) {
      console.log('   Tables:', tables.map(t => Object.values(t)[0]).join(', '));
    } else {
      console.log('   ⚠️  No tables found. Database is empty.');
    }
    
    await connection.end();
    console.log('');
    console.log('✨ Database connection test completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('');
    console.error('❌ Database connection failed!');
    console.error('Error:', error.message);
    console.error('');
    console.error('💡 Troubleshooting tips:');
    console.error('   1. Check if MySQL server is running');
    console.error('   2. Verify database credentials in .env.local');
    console.error('   3. Ensure database exists: CREATE DATABASE ' + config.database);
    console.error('   4. Check if user has proper permissions');
    console.error('   5. Verify firewall/network settings');
    process.exit(1);
  }
}

testConnection();

