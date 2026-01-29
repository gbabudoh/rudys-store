import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface DecodedToken {
  userId: number;
  email: string;
}

function getUserFromToken(request: NextRequest): DecodedToken | null {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
    return decoded;
  } catch {
    return null;
  }
}

// GET /api/customer/history - Fetch complete purchase history
export async function GET(request: NextRequest) {
  try {
    const user = getUserFromToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const dateFilter = searchParams.get('period') || 'all';
    const searchQuery = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    // Date filter logic
    let dateCondition = '';
    if (dateFilter === '30days') {
      dateCondition = 'AND o.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)';
    } else if (dateFilter === '90days') {
      dateCondition = 'AND o.created_at >= DATE_SUB(NOW(), INTERVAL 90 DAY)';
    } else if (dateFilter === '6months') {
      dateCondition = 'AND o.created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)';
    } else if (dateFilter === '1year') {
      dateCondition = 'AND o.created_at >= DATE_SUB(NOW(), INTERVAL 1 YEAR)';
    }

    // Search condition
    let searchCondition = '';
    const queryParams: (number | string)[] = [user.userId];
    if (searchQuery) {
      searchCondition = 'AND (o.order_number LIKE ? OR oi.product_name LIKE ?)';
      queryParams.push(`%${searchQuery}%`, `%${searchQuery}%`);
    }

    // Get all purchased items with order info
    const historyQuery = `
      SELECT DISTINCT
        oi.id as item_id,
        oi.product_id,
        oi.product_name,
        oi.variant_info,
        oi.quantity,
        oi.unit_price,
        oi.total_price,
        o.id as order_id,
        o.order_number,
        o.status as order_status,
        o.created_at as purchase_date,
        p.slug as product_slug,
        COALESCE(pi.image_url, '/placeholder.png') as product_image,
        p.price as current_price,
        p.status as product_status
      FROM order_items oi
      INNER JOIN orders o ON oi.order_id = o.id
      LEFT JOIN products p ON oi.product_id = p.id
      LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = 1
      WHERE o.user_id = ? 
        AND o.payment_status = 'paid'
        ${dateCondition}
        ${searchCondition}
      ORDER BY o.created_at DESC
      LIMIT ? OFFSET ?
    `;
    
    queryParams.push(limit, offset);
    const history = await query(historyQuery, queryParams);

    // Get total count
    const countQuery = `
      SELECT COUNT(DISTINCT oi.id) as total
      FROM order_items oi
      INNER JOIN orders o ON oi.order_id = o.id
      WHERE o.user_id = ? 
        AND o.payment_status = 'paid'
        ${dateCondition}
        ${searchCondition ? 'AND (o.order_number LIKE ? OR oi.product_name LIKE ?)' : ''}
    `;
    const countParams: (number | string)[] = [user.userId];
    if (searchQuery) {
      countParams.push(`%${searchQuery}%`, `%${searchQuery}%`);
    }
    const countResult = await query(countQuery, countParams);
    const total = (countResult as { total: number }[])[0]?.total || 0;

    // Calculate total spent
    const totalSpentQuery = `
      SELECT SUM(o.total) as total_spent, COUNT(DISTINCT o.id) as order_count
      FROM orders o
      WHERE o.user_id = ? AND o.payment_status = 'paid'
    `;
    const spentResult = await query(totalSpentQuery, [user.userId]);
    const stats = (spentResult as { total_spent: number; order_count: number }[])[0];

    return NextResponse.json({
      history,
      stats: {
        totalSpent: stats?.total_spent || 0,
        orderCount: stats?.order_count || 0
      },
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching purchase history:', error);
    return NextResponse.json({ error: 'Failed to fetch purchase history' }, { status: 500 });
  }
}
