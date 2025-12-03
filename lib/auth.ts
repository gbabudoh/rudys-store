import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import { queryOne } from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export interface AdminUser {
  id: number;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: 'super_admin' | 'admin' | 'staff';
  permissions: string[] | null;
  is_active: boolean;
  last_login: Date | null;
}

export interface AdminUserWithPassword extends AdminUser {
  password_hash: string;
}

export interface TokenPayload {
  id: number;
  email: string;
  role: string;
}

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Generate a JWT token for an admin user
 */
export function generateToken(user: AdminUser): string {
  const payload: TokenPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * Verify and decode a JWT token
 */
export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
}

/**
 * Authenticate an admin user by email and password
 */
export async function authenticateAdmin(email: string, password: string): Promise<AdminUser | null> {
  try {
    const user = await queryOne<AdminUserWithPassword>(
      'SELECT * FROM admin_users WHERE email = ? AND is_active = TRUE',
      [email]
    );

    if (!user) {
      return null;
    }

    const isValidPassword = await verifyPassword(password, user.password_hash);
    if (!isValidPassword) {
      return null;
    }

    // Update last login
    await queryOne(
      'UPDATE admin_users SET last_login = NOW() WHERE id = ?',
      [user.id]
    );

    // Return user without password
    const { password_hash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}

/**
 * Get admin user by ID
 */
export async function getAdminById(id: number): Promise<AdminUser | null> {
  try {
    const user = await queryOne<AdminUser>(
      'SELECT id, email, first_name, last_name, role, permissions, is_active, last_login FROM admin_users WHERE id = ?',
      [id]
    );
    return user;
  } catch (error) {
    console.error('Get admin error:', error);
    return null;
  }
}

/**
 * Get admin user by email
 */
export async function getAdminByEmail(email: string): Promise<AdminUser | null> {
  try {
    const user = await queryOne<AdminUser>(
      'SELECT id, email, first_name, last_name, role, permissions, is_active, last_login FROM admin_users WHERE email = ?',
      [email]
    );
    return user;
  } catch (error) {
    console.error('Get admin by email error:', error);
    return null;
  }
}

/**
 * Check if user has a specific permission
 */
export function hasPermission(user: AdminUser, permission: string): boolean {
  if (user.role === 'super_admin') {
    return true; // Super admin has all permissions
  }

  if (!user.permissions || !Array.isArray(user.permissions)) {
    return false;
  }

  // Check if user has 'all' permission
  if (user.permissions.includes('all')) {
    return true;
  }

  // Check for specific permission
  return user.permissions.includes(permission);
}

/**
 * Check if user can perform an action on another admin
 */
export function canManageAdmin(currentUser: AdminUser, targetUser: AdminUser): boolean {
  // Super admin can manage anyone
  if (currentUser.role === 'super_admin') {
    return true;
  }

  // Admins can only manage staff, not other admins or super admins
  if (currentUser.role === 'admin' && targetUser.role === 'staff') {
    return true;
  }

  return false;
}

/**
 * Verify admin authentication from request headers
 * Returns the admin user if authenticated, null otherwise
 */
export async function verifyAdminAuth(request: NextRequest | Request): Promise<{ success: boolean; user?: AdminUser }> {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { success: false };
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const payload = verifyToken(token);

    if (!payload) {
      return { success: false };
    }

    // Get user from database to ensure they still exist and are active
    const user = await getAdminById(payload.id);

    if (!user || !user.is_active) {
      return { success: false };
    }

    return { success: true, user };
  } catch (error) {
    console.error('Auth verification error:', error);
    return { success: false };
  }
}

