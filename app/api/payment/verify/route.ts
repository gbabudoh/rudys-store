import { NextRequest, NextResponse } from 'next/server';
import { verifyTransaction } from '@/lib/paystack';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { reference } = body;

    // Validate required fields
    if (!reference) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Transaction reference is required' 
        },
        { status: 400 }
      );
    }

    const result = await verifyTransaction(reference);

    if (result.success) {
      return NextResponse.json(
        { 
          success: true, 
          data: result.data 
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { 
          success: false, 
          message: result.error,
          data: result.data 
        },
        { status: 400 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to verify payment',
        error: error.message 
      },
      { status: 500 }
    );
  }
}

