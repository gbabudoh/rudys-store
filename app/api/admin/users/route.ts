import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';
import { hashPassword, getAdminById, hasPermission, canManageAdmin } from '@/lib/auth';
import { verifyToken } from '@/lib/auth';

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

// GET - List all admin users
export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAdminAuth(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const currentUser = auth.user!;

    // Only super admin and admin can view users
    if (currentUser.role !== 'super_admin' && currentUser.role !== 'admin') {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const users = await query(
      `SELECT 
        au.id,
        au.email,
        au.first_name,
        au.last_name,
        au.role,
        au.permissions,
        au.is_active,
        au.last_login,
        au.created_at,
        au.created_by,
        creator.email as created_by_email
      FROM admin_users au
      LEFT JOIN admin_users creator ON au.created_by = creator.id
      ORDER BY au.created_at DESC`
    ) as any[];

    const usersData = users.map(user => ({
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role,
      permissions: user.permissions || [],
      isActive: user.is_active,
      lastLogin: user.last_login,
      createdAt: user.created_at,
      createdBy: user.created_by_email || 'System',
    }));

    return NextResponse.json({ success: true, users: usersData });
  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create a new admin user
export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAdminAuth(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const currentUser = auth.user!;

    // Only super admin can create admins, admin can create staff
    if (currentUser.role !== 'super_admin' && currentUser.role !== 'admin') {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const { email, password, firstName, lastName, role, permissions } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Validate role
    const validRoles = ['super_admin', 'admin', 'staff'];
    if (role && !validRoles.includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await queryOne(
      'SELECT id FROM admin_users WHERE email = ?',
      [email]
    );

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Role restrictions
    const finalRole = role || 'staff';
    if (currentUser.role === 'admin' && finalRole !== 'staff') {
      return NextResponse.json(
        { error: 'You can only create staff users' },
        { status: 403 }
      );
    }

    // Only super admin can create super admin
    if (finalRole === 'super_admin' && currentUser.role !== 'super_admin') {
      return NextResponse.json(
        { error: 'Only super admin can create super admin users' },
        { status: 403 }
      );
    }

    const passwordHash = await hashPassword(password);
    const finalPermissions = permissions || [];

    const result: any = await query(
      `INSERT INTO admin_users 
        (email, password_hash, first_name, last_name, role, permissions, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        email,
        passwordHash,
        firstName || null,
        lastName || null,
        finalRole,
        JSON.stringify(finalPermissions),
        currentUser.id,
      ]
    );

    // MySQL2 execute returns [ResultSetHeader, FieldPacket[]]
    // We need to extract insertId from ResultSetHeader
    const insertId = (result as any).insertId || (result as any)[0]?.insertId;
    
    const newUser = await queryOne(
      'SELECT id, email, first_name, last_name, role, permissions, is_active, last_login, created_at FROM admin_users WHERE id = ?',
      [insertId]
    ) as any;

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.first_name,
        lastName: newUser.last_name,
        role: newUser.role,
        permissions: newUser.permissions || [],
        isActive: newUser.is_active,
        lastLogin: newUser.last_login,
        createdAt: newUser.created_at,
      },
    });
  } catch (error) {
    console.error('Create user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

