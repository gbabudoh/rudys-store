import { NextResponse } from 'next/server';
import { query, queryMany } from '@/lib/db';
import { verify } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface AdminJWTPayload {
  id: number;
  email: string;
  role: string;
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

export async function GET(request: Request) {
  const user = await checkAuth(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const sizes = await queryMany('SELECT * FROM clothing_sizes ORDER BY display_order ASC, name ASC');
    return NextResponse.json({ sizes });
  } catch (error: unknown) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch clothing sizes' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const user = await checkAuth(request);
  if (!user || user.role === 'staff') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, display_order, is_active } = body;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const result = await query(
      'INSERT INTO clothing_sizes (name, display_order, is_active) VALUES (?, ?, ?)',
      [name, display_order || 0, is_active ?? true]
    );

    return NextResponse.json({ 
      message: 'Clothing size created successfully', 
      sizeId: (result as { insertId: number }).insertId 
    });
  } catch (error: unknown) {
    console.error('API Error:', error);
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ error: 'This size already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create clothing size' }, { status: 500 });
  }
}
