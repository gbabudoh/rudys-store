import { NextRequest, NextResponse } from 'next/server';
import { initializeTransaction } from '@/lib/paystack';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, amount, reference, metadata } = body;

    // Validate required fields
    if (!email || !amount) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Email and amount are required' 
        },
        { status: 400 }
      );
    }

    // Validate amount
    if (amount <= 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Amount must be greater than 0' 
        },
        { status: 400 }
      );
    }

    const result = await initializeTransaction(email, amount, reference, metadata);

    if (result.success) {
      return NextResponse.json(
        { 
          success: true, 
          data: result 
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { 
          success: false, 
          message: result.error 
        },
        { status: 400 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to initialize payment',
        error: error.message 
      },
      { status: 500 }
    );
  }
}

