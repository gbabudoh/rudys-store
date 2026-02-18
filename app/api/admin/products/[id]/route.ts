import { NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';
import { verify } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface AdminJWTPayload {
  id: number;
  email: string;
  role: 'super_admin' | 'admin' | 'staff';
}

async function checkAuth(request: Request): Promise<AdminJWTPayload | null> {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.split(' ')[1];
  try {
    return verify(token, JWT_SECRET) as unknown as AdminJWTPayload;
  } catch {
    return null;
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await checkAuth(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const product = await queryOne('SELECT * FROM products WHERE id = ?', [id]);

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Parse JSON fields
    const parsedProduct = {
      ...product,
      images: typeof product.images === 'string' ? JSON.parse(product.images || '[]') : product.images || [],
      sizes: typeof product.sizes === 'string' ? JSON.parse(product.sizes || '[]') : product.sizes || [],
      eu_sizes: typeof product.eu_sizes === 'string' ? JSON.parse(product.eu_sizes || '[]') : product.eu_sizes || [],
      colors: typeof product.colors === 'string' ? JSON.parse(product.colors || '[]') : product.colors || [],
      features: typeof product.features === 'string' ? JSON.parse(product.features || '[]') : product.features || [],
      additional_info: typeof product.additional_info === 'string' ? JSON.parse(product.additional_info || '{}') : product.additional_info || {},
    };

    return NextResponse.json({ product: parsedProduct });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('API Error:', err);
    return NextResponse.json({ error: 'Failed to fetch product', details: err.message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await checkAuth(request);
  if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const {
      name,
      description,
      full_description,
      price,
      original_price,
      sku,
      category,
      subcategory,
      product_type,
      store_section,
      images,
      sizes,
      eu_sizes,
      colors,
      features,
      additional_info,
      gender,
      brand,
      stock,
      is_new,
      is_on_sale,
      is_featured,
      is_best_seller,
      discount,
      status,
    } = body;

    // Check if product exists
    const existing = await queryOne('SELECT id FROM products WHERE id = ?', [id]);
    if (!existing) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    await query(
      `UPDATE products SET
        name = ?, description = ?, full_description = ?, price = ?, original_price = ?,
        sku = ?, category = ?, subcategory = ?, product_type = ?, store_section = ?,
        images = ?, sizes = ?, eu_sizes = ?, colors = ?, features = ?, additional_info = ?,
        gender = ?, brand = ?, stock = ?, is_new = ?, is_on_sale = ?, is_featured = ?,
        is_best_seller = ?, discount = ?, status = ?
      WHERE id = ?`,
      [
        name,
        description || '',
        full_description || '',
        price,
        original_price || null,
        sku,
        category,
        subcategory || null,
        product_type || 'clothing',
        store_section || 'collections',
        JSON.stringify(images || []),
        JSON.stringify(sizes || []),
        JSON.stringify(eu_sizes || []),
        JSON.stringify(colors || []),
        JSON.stringify(features || []),
        JSON.stringify(additional_info || {}),
        gender || 'Unisex',
        brand || 'Rudy Store',
        stock || 0,
        is_new || false,
        is_on_sale || false,
        is_featured || false,
        is_best_seller || false,
        discount || 0,
        status || 'draft',
        id,
      ]
    );

    return NextResponse.json({ message: 'Product updated successfully' });
  } catch (error: unknown) {
    const err = error as { code?: string; message?: string };
    console.error('API Error:', err);
    if (err.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ error: 'A product with this SKU already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to update product', details: err.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await checkAuth(request);
  if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const existing = await queryOne('SELECT id FROM products WHERE id = ?', [id]);
    if (!existing) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    await query('DELETE FROM products WHERE id = ?', [id]);

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
