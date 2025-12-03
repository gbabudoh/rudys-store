require('dotenv').config({ path: '.env.local' });
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function createSuperAdmin() {
  let connection;

  try {
    // Create connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'rudy_store',
      port: parseInt(process.env.DB_PORT || '3306'),
    });

    console.log('Connected to database');

    // Check if super admin already exists
    const [existing] = await connection.execute(
      'SELECT id FROM admin_users WHERE email = ?',
      ['admin@rudystore.com']
    );

    if (existing.length > 0) {
      console.log('Super admin already exists. Updating password...');
      
      const password = process.env.SUPER_ADMIN_PASSWORD || 'admin123';
      const passwordHash = await bcrypt.hash(password, 10);

      await connection.execute(
        'UPDATE admin_users SET password_hash = ?, role = ?, permissions = ?, is_active = TRUE WHERE email = ?',
        [
          passwordHash,
          'super_admin',
          JSON.stringify(['all']),
          'admin@rudystore.com'
        ]
      );

      console.log('Super admin password updated successfully!');
      console.log('Email: admin@rudystore.com');
      console.log('Password:', password);
    } else {
      // Create super admin
      const email = process.env.SUPER_ADMIN_EMAIL || 'admin@rudystore.com';
      const password = process.env.SUPER_ADMIN_PASSWORD || 'admin123';
      const firstName = process.env.SUPER_ADMIN_FIRST_NAME || 'Super';
      const lastName = process.env.SUPER_ADMIN_LAST_NAME || 'Admin';

      const passwordHash = await bcrypt.hash(password, 10);

      await connection.execute(
        `INSERT INTO admin_users 
          (email, password_hash, first_name, last_name, role, permissions, is_active)
        VALUES (?, ?, ?, ?, ?, ?, TRUE)`,
        [
          email,
          passwordHash,
          firstName,
          lastName,
          'super_admin',
          JSON.stringify(['all']),
        ]
      );

      console.log('Super admin created successfully!');
      console.log('Email:', email);
      console.log('Password:', password);
      console.log('Name:', `${firstName} ${lastName}`);
    }

    // Also create a basic admin for testing
    const [existingAdmin] = await connection.execute(
      'SELECT id FROM admin_users WHERE email = ?',
      ['staff@rudystore.com']
    );

    if (existingAdmin.length === 0) {
      const adminPassword = process.env.BASIC_ADMIN_PASSWORD || 'staff123';
      const adminPasswordHash = await bcrypt.hash(adminPassword, 10);

      // Get super admin ID for created_by
      const [superAdmin] = await connection.execute(
        'SELECT id FROM admin_users WHERE email = ?',
        ['admin@rudystore.com']
      );

      await connection.execute(
        `INSERT INTO admin_users 
          (email, password_hash, first_name, last_name, role, permissions, is_active, created_by)
        VALUES (?, ?, ?, ?, ?, ?, TRUE, ?)`,
        [
          'staff@rudystore.com',
          adminPasswordHash,
          'Store',
          'Staff',
          'admin',
          JSON.stringify(['collections', 'luxury', 'crocs', 'orders']),
          superAdmin[0].id,
        ]
      );

      console.log('\nBasic admin created successfully!');
      console.log('Email: staff@rudystore.com');
      console.log('Password:', adminPassword);
    }

    console.log('\n✅ Setup complete!');
  } catch (error) {
    console.error('Error creating super admin:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

createSuperAdmin();

