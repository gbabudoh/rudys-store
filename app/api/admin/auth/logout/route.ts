import { NextResponse } from 'next/server';

export async function POST() {
  // Since we're using JWT tokens, logout is handled client-side
  // by removing the token from storage
  // This endpoint exists for consistency and potential future server-side token blacklisting
  return NextResponse.json({
    success: true,
    message: 'Logged out successfully',
  });
}

