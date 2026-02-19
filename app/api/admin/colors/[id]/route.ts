import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
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

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await checkAuth(request);
  if (!user || user.role === 'staff') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const { name, hex_code } = await request.json();

  if (!name || !hex_code) {
    return NextResponse.json({ error: 'Name and Hex Code are required' }, { status: 400 });
  }

  try {
    await query(
      'UPDATE colors SET name = ?, hex_code = ? WHERE id = ?',
      [name, hex_code, id]
    );

    interface Color {
      id: number;
      name: string;
      hex_code: string;
    }
    // Fetch updated color
    const [updatedColor] = await query('SELECT * FROM colors WHERE id = ?', [id]) as Color[];
    
    return NextResponse.json({ color: updatedColor });
  } catch (error: unknown) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to update color' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await checkAuth(request);
  if (!user || user.role === 'staff') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    await query('DELETE FROM colors WHERE id = ?', [id]);
    return NextResponse.json({ message: 'Color deleted successfully' });
  } catch (error: unknown) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to delete color' }, { status: 500 });
  }
}
