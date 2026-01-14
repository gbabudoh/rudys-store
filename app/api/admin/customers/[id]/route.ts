import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken, getAdminById } from '@/lib/auth';

// Middleware to verify admin authentication
async function verifyAdminAuth(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { error: 'Unauthorized', status: 401, user: null };
  }

  const token = authHeader.substring(7);
  const payload = verifyToken(token);

  if (!payload) {
    return { error: 'Invalid or expired token', status: 401, user: null };
  }

  const user = await getAdminById(payload.id);

  if (!user || !user.is_active) {
    return { error: 'User not found or inactive', status: 401, user: null };
  }

  return { error: null, status: 200, user };
}

// PATCH - Update customer status (restrict/activate)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const auth = await verifyAdminAuth(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { isActive } = await request.json();

    if (typeof isActive !== 'boolean') {
      return NextResponse.json(
        { error: 'isActive status is required' },
        { status: 400 }
      );
    }

    await query(
      'UPDATE users SET is_active = ? WHERE id = ?',
      [isActive, id]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update customer error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete customer account
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const auth = await verifyAdminAuth(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    // Optional: Restrict deletion to super_admin or admin?
    // For now allowing all authenticated admin staff to delete as per request "admin dashboard"
    
    await query('DELETE FROM users WHERE id = ?', [id]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete customer error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
