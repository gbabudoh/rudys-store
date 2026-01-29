import { initializeBucket } from '@/lib/minio-client';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await initializeBucket();
    return NextResponse.json({ 
      success: true,
      message: 'Storage initialized successfully' 
    });
  } catch (error) {
    console.error('Initialization error:', error);
    return NextResponse.json(
      { success: false, error: 'Initialization failed' },
      { status: 500 }
    );
  }
}
