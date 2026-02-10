import { NextResponse } from 'next/server';
import { queryMany } from '@/lib/db';

export async function GET() {
  try {
    const orders = await queryMany(`
      SELECT id, order_number, first_name, last_name, email, status, total, created_at
      FROM orders
      ORDER BY created_at DESC
    `);
    
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching admin orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
