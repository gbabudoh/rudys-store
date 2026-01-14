import { NextResponse } from 'next/server';
import { authenticateUser, generateToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const user = await authenticateUser(email, password);

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    if (!user.is_active) {
       return NextResponse.json(
        { error: 'Account is deactivated' },
        { status: 403 }
      ); 
    }

    const token = generateToken(user);

    return NextResponse.json({
      user,
      token,
      message: 'Login successful'
    });

  } catch (error) {
    console.error('Login error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Login failed', details: errorMessage },
      { status: 500 }
    );
  }
}
