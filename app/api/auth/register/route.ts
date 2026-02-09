import { NextResponse } from 'next/server';
import { queryOne, transaction } from '@/lib/db';
import { hashPassword, generateToken, type User } from '@/lib/auth';
import { sendEmail } from '@/lib/email';

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

    // Send Welcome Email
    try {
      await sendEmail({
        to: email,
        subject: "Welcome to Ruddy's Store!",
        from: 'info',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; rounded: 8px;">
            <h2 style="color: #cfa224;">Welcome, ${firstName}!</h2>
            <p>Thank you for registering directly on our site. We're excited to have you as part of our community.</p>
            <p>You can now log in to track your orders and enjoy a personalized shopping experience.</p>
            <div style="margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/login" style="background-color: #cfa224; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Login to Your Account</a>
            </div>
            <p>If you have any questions, feel free to reply to this email.</p>
            <p>Best regards,<br>The Ruddy's Store Team</p>
          </div>
        `
      });
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Don't fail registration if email fails
    }

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
