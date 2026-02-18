import { NextRequest, NextResponse } from 'next/server';
import { query, queryMany } from '@/lib/db';
import { verifyAdminAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAdminAuth(request);
    if (!authResult.success) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const parentId = searchParams.get('parent_id');

    let sql = `
      SELECT sc.*, c.name as parent_category_name 
      FROM sub_categories sc
      LEFT JOIN categories c ON sc.parent_category_id = c.id
    `;
    const params: (string | number)[] = [];

    if (parentId) {
      sql += ` WHERE sc.parent_category_id = ?`;
      params.push(parentId);
    }
    
    sql += ` ORDER BY sc.display_order ASC, sc.name ASC`;

    const subCategories = await queryMany(sql, params);
    return NextResponse.json({ subCategories });
  } catch (error) {
    console.error('Error fetching sub-categories:', error);
    return NextResponse.json({ error: 'Failed to fetch sub-categories' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await verifyAdminAuth(request);
    if (!authResult.success) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, parent_category_id, description, is_active, display_order } = await request.json();

    if (!name || !parent_category_id) {
      return NextResponse.json({ error: 'Name and Parent Category are required' }, { status: 400 });
    }

    // Generate slug
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

    // Check if slug exists for this parent
    const existing = await queryMany(
      'SELECT id FROM sub_categories WHERE slug = ? AND parent_category_id = ?', 
      [slug, parent_category_id]
    );
    
    if (existing.length > 0) {
      return NextResponse.json({ error: 'Sub-category with this name already exists in this category' }, { status: 400 });
    }

    const result = await query(
      'INSERT INTO sub_categories (name, slug, parent_category_id, description, is_active, display_order) VALUES (?, ?, ?, ?, ?, ?)',
      [name, slug, parent_category_id, description || null, is_active ?? true, display_order || 0]
    );

    const newSubCategory = {
      id: result.insertId,
      name,
      slug,
      parent_category_id,
      description,
      is_active: is_active ?? true,
      display_order: display_order || 0,
    };

    return NextResponse.json({ subCategory: newSubCategory });
  } catch (error) {
    console.error('Error creating sub-category:', error);
    return NextResponse.json({ error: 'Failed to create sub-category' }, { status: 500 });
  }
}
