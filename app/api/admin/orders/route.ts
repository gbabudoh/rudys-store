import { NextRequest, NextResponse } from 'next/server';
import { queryMany } from '@/lib/db';
import { verify } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

function checkAuth(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.split(' ')[1];
  try {
    return verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const user = checkAuth(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const orders = await queryMany(`
      SELECT
        o.id,
        o.order_number,
        o.first_name,
        o.last_name,
        o.email,
        o.phone,
        o.status,
        o.payment_status,
        o.total,
        o.created_at AS date,
        o.shipping_address,
        o.shipping_city,
        o.shipping_state,
        o.payment_method,
        o.payment_reference,
        COALESCE(SUM(oi.quantity), 0) AS items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      GROUP BY
        o.id, o.order_number, o.first_name, o.last_name, o.email, o.phone,
        o.status, o.payment_status, o.total, o.created_at,
        o.shipping_address, o.shipping_city, o.shipping_state,
        o.payment_method, o.payment_reference
      ORDER BY o.created_at DESC
    `);

    // Fix for BigInt serialization issue
    const serializedOrders = orders.map((order: Record<string, unknown>) => ({
      ...order,
      items: typeof order.items === 'bigint' ? Number(order.items) : order.items
    }));

    return NextResponse.json(serializedOrders);
  } catch (error) {
    console.error('Error fetching admin orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
