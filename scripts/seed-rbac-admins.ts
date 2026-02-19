import mysql, { RowDataPacket } from 'mysql2/promise';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

interface AdminUser extends RowDataPacket {
  id: number;
}

async function seedRbacAdmins() {
  let connection: mysql.Connection | undefined;

  const superAdmins = [
    {
      email: 'storemanager@ruddysstore.com',
      password: 'storemanger2026', // Matching user-provided password with typo
      firstName: 'Store',
      lastName: 'Manager'
    },
    {
      email: 'admincontrol@ruddysstore.com',
      password: 'admincon2026',
      firstName: 'Admin',
      lastName: 'Control'
    }
  ];

  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'rudy_store',
      port: parseInt(process.env.DB_PORT || '3306'),
    });

    console.log('Connected to database');

    for (const admin of superAdmins) {
      console.log(`Checking admin: ${admin.email}`);
      const [existing] = await connection.execute<AdminUser[]>(
        'SELECT id FROM admin_users WHERE email = ?',
        [admin.email]
      );

      const passwordHash = await bcrypt.hash(admin.password, 10);

      if (existing.length > 0) {
        console.log(`Updating Super Admin privileges: ${admin.email}`);
        await connection.execute(
          'UPDATE admin_users SET password_hash = ?, role = ?, permissions = ?, is_active = TRUE WHERE email = ?',
          [
            passwordHash,
            'super_admin',
            JSON.stringify(['all']),
            admin.email
          ]
        );
      } else {
        console.log(`Creating new Super Admin: ${admin.email}`);
        await connection.execute(
          `INSERT INTO admin_users 
            (email, password_hash, first_name, last_name, role, permissions, is_active)
          VALUES (?, ?, ?, ?, ?, ?, TRUE)`,
          [
            admin.email,
            passwordHash,
            admin.firstName,
            admin.lastName,
            'super_admin',
            JSON.stringify(['all']),
          ]
        );
      }
    }

    console.log('\n✅ RBAC Admin Seeding complete!');
  } catch (error) {
    const err = error as Error;
    console.error('Error seeding admins:', err.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

seedRbacAdmins();
