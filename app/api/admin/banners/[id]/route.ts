import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';
import { verifyAdminAuth } from '@/lib/auth';

interface BannerRow {
  id: number;
  title: string;
  subtitle: string | null;
  image_url: string;
  link_url: string | null;
  button_text: string | null;
  is_active: boolean;
  display_order: number;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string;
}

// GET - Get a single banner
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdminAuth(request);
    if (!authResult.success) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const banner = await queryOne<BannerRow>(
      `SELECT * FROM banners WHERE id = ?`,
      [id]
    );

    if (!banner) {
      return NextResponse.json({ error: 'Banner not found' }, { status: 404 });
    }

    return NextResponse.json({ banner });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error fetching banner:', error);
    return NextResponse.json(
      { error: 'Failed to fetch banner', details: errorMessage },
      { status: 500 }
    );
  }
}

// PUT - Update a banner
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdminAuth(request);
    if (!authResult.success) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const {
      title,
      subtitle,
      image_url,
      link_url,
      button_text,
      is_active,
      display_order,
      start_date,
      end_date,
    } = body;

    // Check if banner exists
    const existingBanner = await queryOne<BannerRow>(
      `SELECT * FROM banners WHERE id = ?`,
      [id]
    );

    if (!existingBanner) {
      return NextResponse.json({ error: 'Banner not found' }, { status: 404 });
    }

    await query(
      `UPDATE banners SET
        title = ?,
        subtitle = ?,
        image_url = ?,
        link_url = ?,
        button_text = ?,
        is_active = ?,
        display_order = ?,
        start_date = ?,
        end_date = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?`,
      [
        title ?? existingBanner.title,
        subtitle !== undefined ? subtitle : existingBanner.subtitle,
        image_url ?? existingBanner.image_url,
        link_url !== undefined ? link_url : existingBanner.link_url,
        button_text !== undefined ? button_text : existingBanner.button_text,
        is_active !== undefined ? is_active : existingBanner.is_active,
        display_order !== undefined ? display_order : existingBanner.display_order,
        start_date !== undefined ? start_date : existingBanner.start_date,
        end_date !== undefined ? end_date : existingBanner.end_date,
        id,
      ]
    );

    const updatedBanner = await queryOne<BannerRow>(
      `SELECT * FROM banners WHERE id = ?`,
      [id]
    );

    return NextResponse.json({ banner: updatedBanner });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error updating banner:', error);
    return NextResponse.json(
      { error: 'Failed to update banner', details: errorMessage },
      { status: 500 }
    );
  }
}

// DELETE - Delete a banner
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdminAuth(request);
    if (!authResult.success) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Check if banner exists
    const existingBanner = await queryOne(
      `SELECT * FROM banners WHERE id = ?`,
      [id]
    );

    if (!existingBanner) {
      return NextResponse.json({ error: 'Banner not found' }, { status: 404 });
    }

    await query(`DELETE FROM banners WHERE id = ?`, [id]);

    return NextResponse.json({ message: 'Banner deleted successfully' });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error deleting banner:', error);
    return NextResponse.json(
      { error: 'Failed to delete banner', details: errorMessage },
      { status: 500 }
    );
  }
}

