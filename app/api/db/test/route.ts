import { NextResponse } from 'next/server';
import { testConnection } from '@/lib/db';

export async function GET() {
  try {
    const isConnected = await testConnection();
    
    if (isConnected) {
      return NextResponse.json(
        { 
          success: true, 
          message: 'Database connection successful' 
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Database connection failed' 
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { 
        success: false, 
        message: 'Database connection error',
        error: error.message 
      },
      { status: 500 }
    );
  }
}

