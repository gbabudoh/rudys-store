import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyUserAuth } from '@/lib/auth';

// GET /api/customer/orders - Fetch user's orders
export async function GET(request: NextRequest) {
  try {
    const { success, user } = await verifyUserAuth(request);
    if (!success || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    // Build query with optional status filter
    let ordersQuery = `
      SELECT 
        o.id,
        o.order_number,
        o.status,
        o.payment_status,
        o.subtotal,
        o.tax,
        o.shipping_cost,
        o.discount,
        o.total,
        o.currency,
        o.created_at,
        o.shipped_at,
        o.delivered_at
      FROM orders o
      WHERE o.user_id = ?
    `;
    const queryParams: (number | string)[] = [user.id];

    if (status && status !== 'all') {
      ordersQuery += ' AND o.status = ?';
      queryParams.push(status);
    }

    ordersQuery += ' ORDER BY o.created_at DESC LIMIT ? OFFSET ?';
    queryParams.push(limit, offset);

    const orders = await query(ordersQuery, queryParams);

    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) as total FROM orders WHERE user_id = ?';
    const countParams: (number | string)[] = [user.id];
    if (status && status !== 'all') {
      countQuery += ' AND status = ?';
      countParams.push(status);
    }
    const countResult = await query(countQuery, countParams);
    const total = (countResult as { total: number }[])[0]?.total || 0;

    // Fetch order items for each order
    const ordersWithItems = await Promise.all(
      (orders as Record<string, unknown>[]).map(async (order) => {
        const items = await query(`
          SELECT 
            oi.id,
            oi.product_id,
            oi.product_name,
            oi.variant_info,
            oi.quantity,
            oi.unit_price,
            oi.total_price,
            p.slug as product_slug,
            COALESCE(pi.image_url, '/placeholder-image.svg') as product_image
          FROM order_items oi
          LEFT JOIN products p ON oi.product_id = p.id
          LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = 1
          WHERE oi.order_id = ?
        `, [order.id]);

        return {
          ...order,
          items
        };
      })
    );

    return NextResponse.json({
      orders: ordersWithItems,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
