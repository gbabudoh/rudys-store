import { NextRequest, NextResponse } from 'next/server';
import { query, queryMany } from '@/lib/db';
import { verifyAdminAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAdminAuth(request);
    if (!authResult.success) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const productTypes = await queryMany(`
      SELECT pt.*, sc.name as sub_category_name 
      FROM product_types pt 
      LEFT JOIN sub_categories sc ON pt.sub_category_id = sc.id 
      ORDER BY pt.display_order ASC, pt.name ASC
    `);
    return NextResponse.json({ productTypes });
  } catch (error) {
    console.error('Error fetching product types:', error);
    return NextResponse.json({ error: 'Failed to fetch product types' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await verifyAdminAuth(request);
    if (!authResult.success) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, description, is_active, display_order, sub_category_id } = await request.json();

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    // Generate slug
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

    // Check if slug exists
    const existing = await queryMany('SELECT id FROM product_types WHERE slug = ?', [slug]);
    if (existing.length > 0) {
      return NextResponse.json({ error: 'Product type with this name already exists' }, { status: 400 });
    }

    const result = await query(
      'INSERT INTO product_types (name, slug, description, is_active, display_order, sub_category_id) VALUES (?, ?, ?, ?, ?, ?)',
      [name, slug, description || null, is_active ?? true, display_order || 0, sub_category_id || null]
    );

    const newType = {
      id: result.insertId,
      name,
      slug,
      description,
      is_active: is_active ?? true,
      display_order: display_order || 0,
      sub_category_id: sub_category_id || null,
    };

    return NextResponse.json({ productType: newType });
  } catch (error) {
    console.error('Error creating product type:', error);
    return NextResponse.json({ error: 'Failed to create product type' }, { status: 500 });
  }
}
