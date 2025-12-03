import { NextRequest, NextResponse } from 'next/server';
import { testCloudinaryConnection } from '@/lib/cloudinary';

export async function GET(request: NextRequest) {
  try {
    const isConnected = await testCloudinaryConnection();
    
    if (isConnected) {
      return NextResponse.json({
        success: true,
        message: 'Cloudinary connection successful',
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: 'Cloudinary connection failed. Please check your environment variables.',
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Cloudinary test error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error testing Cloudinary connection',
        details: error.message,
      },
      { status: 500 }
    );
  }
}

