const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const mysql = require('mysql2/promise');

async function createHomepageSections() {
  let connection;
  
  try {
    // Create connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT || 3306,
    });

    console.log('Connected to database');

    // Read and execute migration SQL
    const sqlPath = path.join(__dirname, '..', 'database', 'migrations', 'add_homepage_sections.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    // Split SQL into individual statements
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    for (const statement of statements) {
      if (statement.trim()) {
        await connection.execute(statement);
        console.log('Executed:', statement.substring(0, 50) + '...');
      }
    }

    console.log('✅ Homepage sections table created successfully!');
    
    // Verify the sections were created
    const [sections] = await connection.execute('SELECT * FROM homepage_sections');
    console.log('\n📋 Created sections:');
    sections.forEach(section => {
      console.log(`  - ${section.section_key}: ${section.title}`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

createHomepageSections();

