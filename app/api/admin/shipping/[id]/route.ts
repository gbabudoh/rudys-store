import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, carrier, estimated_days, price, free_shipping_threshold, is_active } = body;

    await query(
      `UPDATE shipping_methods 
       SET name = ?, carrier = ?, estimated_days = ?, price = ?, free_shipping_threshold = ?, is_active = ?
       WHERE id = ?`,
      [name, carrier, estimated_days, price, free_shipping_threshold || null, is_active, id]
    );

    return NextResponse.json({ message: 'Shipping method updated successfully' });

  } catch (error) {
    console.error('Error updating shipping method:', error);
    return NextResponse.json({ error: 'Failed to update shipping method' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await query('DELETE FROM shipping_methods WHERE id = ?', [id]);
    return NextResponse.json({ message: 'Shipping method deleted successfully' });
  } catch (error) {
    console.error('Error deleting shipping method:', error);
    return NextResponse.json({ error: 'Failed to delete shipping method' }, { status: 500 });
  }
}
