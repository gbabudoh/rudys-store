import { NextResponse } from 'next/server';
import { queryOne, transaction } from '@/lib/db';
import { hashPassword, generateToken, type User } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, firstName, lastName, phone } = body;

    // Validation
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Check if user exists
    const existingUser = await queryOne(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    let userId: number;
    
    await transaction(async (connection) => {
        const [result] = await connection.execute(
            `INSERT INTO users (email, password_hash, first_name, last_name, phone)
             VALUES (?, ?, ?, ?, ?)`,
            [email, hashedPassword, firstName, lastName, phone || null]
        );
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        userId = (result as any).insertId;
    });

    // Get created user
    const user = await queryOne<User>(
      'SELECT id, email, first_name, last_name, phone, address, city, state, zip_code, country, email_verified, is_active, created_at FROM users WHERE id = ?',
      [userId!]
    );

    if (!user) {
         throw new Error('User creation failed');
    }

    // Generate token
    const token = generateToken(user);

    return NextResponse.json({
      user,
      token,
      message: 'Registration successful'
    });

  } catch (error) {
    console.error('Registration error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Registration failed', details: errorMessage },
      { status: 500 }
    );
  }
}
