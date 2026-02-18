import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderNumber = searchParams.get('orderNumber');
    const email = searchParams.get('email');

    if (!orderNumber || !email) {
      return NextResponse.json({ error: 'Order number and email are required' }, { status: 400 });
    }

    // Fetch order details
    const order = await queryOne(`
      SELECT 
        id, order_number, status, payment_status, 
        subtotal, total, currency,
        shipping_address, shipping_city, shipping_state,
        created_at, shipped_at, delivered_at
      FROM orders 
      WHERE order_number = ? AND email = ?
    `, [orderNumber, email]);

    if (!order) {
      return NextResponse.json({ error: 'Order not found or email mismatch' }, { status: 404 });
    }

    // Fetch order items
    const items = await query(`
      SELECT 
        oi.product_id, oi.product_name, oi.variant_info, 
        oi.quantity, oi.unit_price, oi.total_price,
        p.slug as product_slug,
        COALESCE(pi.image_url, '/placeholder-image.svg') as product_image
      FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.id
      LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = 1
      WHERE oi.order_id = ?
    `, [order.id]);

    return NextResponse.json({
      order: {
        ...order,
        items
      }
    });
  } catch (error) {
    console.error('Track Order API Error:', error);
    return NextResponse.json({ error: 'Failed to track order' }, { status: 500 });
  }
}
