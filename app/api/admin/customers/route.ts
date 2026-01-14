import { NextRequest, NextResponse } from 'next/server';
import { queryMany } from '@/lib/db';
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

// GET - List all customers
export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAdminAuth(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    // Interface for database query result
    interface CustomerRow {
      id: number;
      email: string;
      first_name: string | null;
      last_name: string | null;
      phone: string | null;
      city: string | null;
      state: string | null;
      country: string | null;
      created_at: Date;
      is_active: boolean;
      email_verified: boolean;
    }

    const users = await queryMany<CustomerRow>(
      `SELECT 
        id,
        email,
        first_name,
        last_name,
        phone,
        city,
        state,
        country,
        created_at,
        is_active,
        email_verified
      FROM users 
      ORDER BY created_at DESC`
    );

    const customers = users.map(user => ({
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      phone: user.phone,
      location: user.city && user.country ? `${user.city}, ${user.country}` : 'N/A',
      createdAt: user.created_at,
      isActive: user.is_active,
      emailVerified: user.email_verified
    }));

    return NextResponse.json({ success: true, customers });
  } catch (error) {
    console.error('Get customers error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
