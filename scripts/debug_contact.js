
/* eslint-disable @typescript-eslint/no-require-imports */
const mysql = require('mysql2/promise');
const nodemailer = require('nodemailer');
require('dotenv').config({ path: '.env.local' });

async function testConnection() {
  console.log('--- Testing Database Connection ---');
  const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT || '3306'),
  };
  console.log('Config:', { ...dbConfig, password: '***' });

  try {
    const connection = await mysql.createConnection(dbConfig);
    console.log('✅ Database connected successfully');
    
    const [rows] = await connection.execute('SHOW TABLES LIKE "contact_messages"');
    if (rows.length > 0) {
      console.log('✅ Table "contact_messages" exists');
    } else {
      console.log('❌ Table "contact_messages" does NOT exist');
    }
    
    await connection.end();
  } catch (error) {
    console.error('❌ Database connection/query failed:', error.message);
  }

  console.log('\n--- Testing Email Configuration ---');
  const emailConfig = {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  };
  console.log('Config:', { ...emailConfig, auth: { ...emailConfig.auth, pass: '***' } });

  const transporter = nodemailer.createTransport(emailConfig);

  try {
    await transporter.verify();
    console.log('✅ SMTP server is ready to take our messages');
  } catch (error) {
    console.error('❌ SMTP verification failed:', error.message);
    
    if (emailConfig.secure && emailConfig.port === 587) {
      console.log('💡 TIP: Port 587 usually requires secure: false (STARTTLS). Trying with secure: false...');
      const altTransporter = nodemailer.createTransport({ ...emailConfig, secure: false });
      try {
        await altTransporter.verify();
        console.log('✅ SUCCESS with secure: false!');
      } catch (altError) {
         console.error('❌ Still failed with secure: false:', altError.message);
      }
    }
  }
}

testConnection();
