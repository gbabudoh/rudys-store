import { NextRequest, NextResponse } from 'next/server';
import { queryOne } from '@/lib/db';
import { hashPassword, getAdminById, canManageAdmin, verifyToken, AdminUser } from '@/lib/auth';

interface AdminUserWithCreator extends AdminUser {
  created_at: string;
  created_by: number | null;
  created_by_email: string | null;
}

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

// GET - Get a specific admin user
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const auth = await verifyAdminAuth(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const currentUser = auth.user!;
    const userId = parseInt(id);

    if (isNaN(userId)) {
      return NextResponse.json(
        { error: 'Invalid user ID' },
        { status: 400 }
      );
    }

    // Users can view their own profile, or super admin/admin can view others
    if (currentUser.id !== userId && currentUser.role !== 'super_admin' && currentUser.role !== 'admin') {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const user = await queryOne<AdminUserWithCreator>(
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
      WHERE au.id = ?`,
      [userId]
    );

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
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
      },
    });
  } catch (error: unknown) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update an admin user
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const auth = await verifyAdminAuth(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const currentUser = auth.user!;
    const userId = parseInt(id);

    if (isNaN(userId)) {
      return NextResponse.json(
        { error: 'Invalid user ID' },
        { status: 400 }
      );
    }

    const targetUser = await getAdminById(userId);
    if (!targetUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if current user can manage target user
    if (!canManageAdmin(currentUser, targetUser) && currentUser.id !== userId) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const { email, password, firstName, lastName, role, permissions, isActive } = await request.json();

    // Build update query dynamically
    const updates: string[] = [];
    const values: (string | number | boolean | null | undefined)[] = [];

    if (email !== undefined) {
      // Check if email is already taken by another user
      const existingUser = await queryOne(
        'SELECT id FROM admin_users WHERE email = ? AND id != ?',
        [email, userId]
      );
      if (existingUser) {
        return NextResponse.json(
          { error: 'Email already in use' },
          { status: 400 }
        );
      }
      updates.push('email = ?');
      values.push(email);
    }

    if (password !== undefined && password !== '') {
      const passwordHash = await hashPassword(password);
      updates.push('password_hash = ?');
      values.push(passwordHash);
    }

    if (firstName !== undefined) {
      updates.push('first_name = ?');
      values.push(firstName || null);
    }

    if (lastName !== undefined) {
      updates.push('last_name = ?');
      values.push(lastName || null);
    }

    if (role !== undefined) {
      // Only super admin can change roles
      if (currentUser.role !== 'super_admin') {
        return NextResponse.json(
          { error: 'Only super admin can change roles' },
          { status: 403 }
        );
      }

      // Prevent changing own role
      if (currentUser.id === userId) {
        return NextResponse.json(
          { error: 'You cannot change your own role' },
          { status: 403 }
        );
      }

      const validRoles = ['super_admin', 'admin', 'staff'];
      if (!validRoles.includes(role)) {
        return NextResponse.json(
          { error: 'Invalid role' },
          { status: 400 }
        );
      }

      updates.push('role = ?');
      values.push(role);
    }

    if (permissions !== undefined) {
      // Only super admin can change permissions
      if (currentUser.role !== 'super_admin') {
        return NextResponse.json(
          { error: 'Only super admin can change permissions' },
          { status: 403 }
        );
      }

      updates.push('permissions = ?');
      values.push(JSON.stringify(permissions));
    }

    if (isActive !== undefined) {
      // Only super admin can deactivate users
      if (currentUser.role !== 'super_admin') {
        return NextResponse.json(
          { error: 'Only super admin can change user status' },
          { status: 403 }
        );
      }

      // Prevent deactivating own account
      if (currentUser.id === userId && !isActive) {
        return NextResponse.json(
          { error: 'You cannot deactivate your own account' },
          { status: 403 }
        );
      }

      updates.push('is_active = ?');
      values.push(isActive);
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      );
    }

    updates.push('updated_at = NOW()');
    values.push(userId);

    await queryOne(
      `UPDATE admin_users SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    const updatedUser = await queryOne<AdminUser & { created_at: string }>(
      'SELECT id, email, first_name, last_name, role, permissions, is_active, last_login, created_at FROM admin_users WHERE id = ?',
      [userId]
    );

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'Failed to fetch updated user' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        firstName: updatedUser.first_name,
        lastName: updatedUser.last_name,
        role: updatedUser.role,
        permissions: updatedUser.permissions || [],
        isActive: updatedUser.is_active,
        lastLogin: updatedUser.last_login,
        createdAt: updatedUser.created_at,
      },
    });
  } catch (error: unknown) {
    console.error('Update user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete an admin user
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

    const currentUser = auth.user!;
    const userId = parseInt(id);

    if (isNaN(userId)) {
      return NextResponse.json(
        { error: 'Invalid user ID' },
        { status: 400 }
      );
    }

    // Only super admin can delete users
    if (currentUser.role !== 'super_admin') {
      return NextResponse.json(
        { error: 'Only super admin can delete users' },
        { status: 403 }
      );
    }

    // Prevent deleting own account
    if (currentUser.id === userId) {
      return NextResponse.json(
        { error: 'You cannot delete your own account' },
        { status: 403 }
      );
    }

    const targetUser = await getAdminById(userId);
    if (!targetUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Soft delete by setting is_active to false instead of actually deleting
    await queryOne(
      'UPDATE admin_users SET is_active = FALSE, updated_at = NOW() WHERE id = ?',
      [userId]
    );

    return NextResponse.json({
      success: true,
      message: 'User deactivated successfully',
    });
  } catch (error: unknown) {
    console.error('Delete user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

