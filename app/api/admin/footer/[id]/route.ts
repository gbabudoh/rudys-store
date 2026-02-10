import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyAdminAuth } from '@/lib/auth';

// PUT - Update a footer link
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
    const { section, label, href, display_order, is_active } = await request.json();

    if (!label || !href) {
      return NextResponse.json({ error: 'Label and href are required' }, { status: 400 });
    }

    await query(
      'UPDATE footer_links SET section = ?, label = ?, href = ?, display_order = ?, is_active = ? WHERE id = ?',
      [section, label, href, display_order || 0, is_active ?? true, id]
    );

    return NextResponse.json({ message: 'Footer link updated' });
  } catch (error) {
    console.error('Error updating footer link:', error);
    return NextResponse.json({ error: 'Failed to update footer link' }, { status: 500 });
  }
}

// DELETE - Delete a footer link
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
    await query('DELETE FROM footer_links WHERE id = ?', [id]);

    return NextResponse.json({ message: 'Footer link deleted' });
  } catch (error) {
    console.error('Error deleting footer link:', error);
    return NextResponse.json({ error: 'Failed to delete footer link' }, { status: 500 });
  }
}
