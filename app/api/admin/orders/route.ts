import { NextResponse } from 'next/server';
import { queryMany } from '@/lib/db';

export async function GET() {
  try {
    const orders = await queryMany(`
      SELECT 
        o.id, 
        o.order_number, 
        o.first_name, 
        o.last_name, 
        o.email, 
        o.status, 
        o.total, 
        o.created_at as date,
        o.shipping_address,
        o.payment_method,
        COALESCE(SUM(oi.quantity), 0) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `);
    
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching admin orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
