import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { tracking_number, carrier, status, current_location, estimated_delivery, notes } = body;

    await query(
      `UPDATE order_tracking 
       SET tracking_number = ?, carrier = ?, status = ?, current_location = ?, estimated_delivery = ?, notes = ?
       WHERE id = ?`,
      [tracking_number, carrier, status, current_location || null, estimated_delivery || null, notes || null, id]
    );

    return NextResponse.json({ message: 'Tracking record updated successfully' });
  } catch (error) {
    console.error('Error updating tracking:', error);
    return NextResponse.json({ error: 'Failed to update tracking record' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await query('DELETE FROM order_tracking WHERE id = ?', [id]);
    return NextResponse.json({ message: 'Tracking record deleted successfully' });
  } catch (error) {
    console.error('Error deleting tracking:', error);
    return NextResponse.json({ error: 'Failed to delete tracking record' }, { status: 500 });
  }
}
