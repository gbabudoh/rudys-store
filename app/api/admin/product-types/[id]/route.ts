import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';
import { verifyAdminAuth } from '@/lib/auth';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await verifyAdminAuth(request);
    if (!authResult.success) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { name, description, is_active, display_order, sub_category_id } = await request.json();

    const existing = await queryOne('SELECT * FROM product_types WHERE id = ?', [id]);
    if (!existing) {
      return NextResponse.json({ error: 'Product type not found' }, { status: 404 });
    }

    let slug = existing.slug;
    if (name && name !== existing.name) {
      slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      // Check collision
      const collision = await queryOne('SELECT id FROM product_types WHERE slug = ? AND id != ?', [slug, id]);
      if (collision) {
        return NextResponse.json({ error: 'Product type with this name already exists' }, { status: 400 });
      }
    }

    await query(
      `UPDATE product_types SET 
        name = ?, 
        slug = ?, 
        description = ?, 
        is_active = ?, 
        display_order = ?,
        sub_category_id = ?
       WHERE id = ?`,
      [
        name || existing.name,
        slug,
        description !== undefined ? description : existing.description,
        is_active !== undefined ? is_active : existing.is_active,
        display_order !== undefined ? display_order : existing.display_order,
        sub_category_id !== undefined ? sub_category_id : existing.sub_category_id,
        id
      ]
    );

    const updated = await queryOne('SELECT * FROM product_types WHERE id = ?', [id]);

    return NextResponse.json({ productType: updated });
  } catch (error) {
    console.error('Error updating product type:', error);
    return NextResponse.json({ error: 'Failed to update product type' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await verifyAdminAuth(request);
    if (!authResult.success) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    await query('DELETE FROM product_types WHERE id = ?', [id]);

    return NextResponse.json({ success: true, message: 'Product type deleted' });
  } catch (error) {
    console.error('Error deleting product type:', error);
    return NextResponse.json({ error: 'Failed to delete product type' }, { status: 500 });
  }
}
