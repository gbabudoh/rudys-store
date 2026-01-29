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

// GET /api/customer/reorder - Get items available for reorder
export async function GET(request: NextRequest) {
  try {
    const user = getUserFromToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get unique products the user has ordered (that are still available)
    const reorderItems = await query(`
      SELECT DISTINCT
        p.id as product_id,
        p.name as product_name,
        p.slug,
        p.price as current_price,
        p.stock_quantity,
        p.status as product_status,
        COALESCE(pi.image_url, '/placeholder.png') as product_image,
        MAX(o.created_at) as last_ordered,
        SUM(oi.quantity) as total_ordered
      FROM order_items oi
      INNER JOIN orders o ON oi.order_id = o.id
      INNER JOIN products p ON oi.product_id = p.id
      LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = 1
      WHERE o.user_id = ?
        AND o.payment_status = 'paid'
        AND p.status = 'active'
        AND p.stock_quantity > 0
      GROUP BY p.id, p.name, p.slug, p.price, p.stock_quantity, p.status, pi.image_url
      ORDER BY last_ordered DESC
      LIMIT 50
    `, [user.userId]);

    return NextResponse.json({ items: reorderItems });
  } catch (error) {
    console.error('Error fetching reorder items:', error);
    return NextResponse.json({ error: 'Failed to fetch reorder items' }, { status: 500 });
  }
}

// POST /api/customer/reorder - Add item(s) to cart
export async function POST(request: NextRequest) {
  try {
    const user = getUserFromToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { productId, quantity = 1 } = await request.json();

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    // Check if product exists and is available
    const productResult = await query(`
      SELECT id, name, price, stock_quantity, status
      FROM products
      WHERE id = ? AND status = 'active'
    `, [productId]);

    const products = productResult as { id: number; name: string; price: number; stock_quantity: number; status: string }[];
    if (products.length === 0) {
      return NextResponse.json({ error: 'Product not found or unavailable' }, { status: 404 });
    }

    const product = products[0];
    if (product.stock_quantity < quantity) {
      return NextResponse.json({ 
        error: 'Not enough stock', 
        availableStock: product.stock_quantity 
      }, { status: 400 });
    }

    // Check if item already in cart
    const existingCart = await query(`
      SELECT id, quantity FROM cart
      WHERE user_id = ? AND product_id = ?
    `, [user.userId, productId]);

    const existing = existingCart as { id: number; quantity: number }[];
    
    if (existing.length > 0) {
      // Update quantity
      const newQuantity = existing[0].quantity + quantity;
      if (newQuantity > product.stock_quantity) {
        return NextResponse.json({ 
          error: 'Cannot add more - would exceed available stock',
          currentInCart: existing[0].quantity,
          availableStock: product.stock_quantity
        }, { status: 400 });
      }

      await query(`
        UPDATE cart SET quantity = ?, updated_at = NOW()
        WHERE id = ?
      `, [newQuantity, existing[0].id]);
    } else {
      // Add new cart item
      await query(`
        INSERT INTO cart (user_id, product_id, quantity, created_at, updated_at)
        VALUES (?, ?, ?, NOW(), NOW())
      `, [user.userId, productId, quantity]);
    }

    return NextResponse.json({ 
      success: true, 
      message: `${product.name} added to cart`,
      quantity
    });
  } catch (error) {
    console.error('Error adding to cart:', error);
    return NextResponse.json({ error: 'Failed to add item to cart' }, { status: 500 });
  }
}
