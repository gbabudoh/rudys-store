import { NextResponse } from 'next/server';
import { query, queryMany } from '@/lib/db';
import { verify } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface AdminJWTPayload {
  id: number;
  email: string;
  role: 'super_admin' | 'admin' | 'staff' | 'store_manager' | 'sales_manager' | 'customer_service' | 'other';
}

async function checkAuth(request: Request): Promise<AdminJWTPayload | null> {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.split(' ')[1];
  try {
    return verify(token, JWT_SECRET) as unknown as AdminJWTPayload;
  } catch {
    return null;
  }
}

async function ensureTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS colors (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(50) NOT NULL UNIQUE,
      hex_code VARCHAR(10) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);
}

export async function GET(request: Request) {
  const user = await checkAuth(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await ensureTable();
    const colors = await queryMany('SELECT * FROM colors ORDER BY name ASC');
    return NextResponse.json({ colors });
  } catch (error: unknown) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch colors' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const user = await checkAuth(request);
  if (!user || user.role === 'staff') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await ensureTable();
    const body = await request.json();
    const { name, hex_code } = body;

    if (!name || !hex_code) {
      return NextResponse.json({ error: 'Name and hex code are required' }, { status: 400 });
    }

    const result = await query(
      'INSERT INTO colors (name, hex_code) VALUES (?, ?)',
      [name, hex_code]
    );

    return NextResponse.json({ 
      message: 'Color created successfully', 
      colorId: (result as { insertId: number }).insertId 
    });
  } catch (error: unknown) {
    console.error('API Error:', error);
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ error: 'A color with this name already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create color' }, { status: 500 });
  }
}
