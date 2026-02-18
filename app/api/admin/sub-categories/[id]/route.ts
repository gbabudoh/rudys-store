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
    const { name, parent_category_id, description, is_active, display_order } = await request.json();

    const existing = await queryOne('SELECT * FROM sub_categories WHERE id = ?', [id]);
    if (!existing) {
      return NextResponse.json({ error: 'Sub-category not found' }, { status: 404 });
    }

    let slug = existing.slug;
    const parentId = parent_category_id || existing.parent_category_id;

    if (name && (name !== existing.name || parentId !== existing.parent_category_id)) {
      slug = name ? name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') : existing.slug;
      
      // Check collision
      const collision = await queryOne(
        'SELECT id FROM sub_categories WHERE slug = ? AND parent_category_id = ? AND id != ?', 
        [slug, parentId, id]
      );
      if (collision) {
        return NextResponse.json({ error: 'Sub-category with this name already exists in this category' }, { status: 400 });
      }
    }

    await query(
      `UPDATE sub_categories SET 
        name = ?, 
        slug = ?, 
        parent_category_id = ?,
        description = ?, 
        is_active = ?, 
        display_order = ?
       WHERE id = ?`,
      [
        name || existing.name,
        slug,
        parentId,
        description !== undefined ? description : existing.description,
        is_active !== undefined ? is_active : existing.is_active,
        display_order !== undefined ? display_order : existing.display_order,
        id
      ]
    );

    const updated = await queryOne('SELECT * FROM sub_categories WHERE id = ?', [id]);

    return NextResponse.json({ subCategory: updated });
  } catch (error) {
    console.error('Error updating sub-category:', error);
    return NextResponse.json({ error: 'Failed to update sub-category' }, { status: 500 });
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

    await query('DELETE FROM sub_categories WHERE id = ?', [id]);

    return NextResponse.json({ success: true, message: 'Sub-category deleted' });
  } catch (error) {
    console.error('Error deleting sub-category:', error);
    return NextResponse.json({ error: 'Failed to delete sub-category' }, { status: 500 });
  }
}
