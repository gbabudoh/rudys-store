import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';
import { verifyAdminAuth } from '@/lib/auth';

interface HomepageSectionRow {
  id: number;
  section_key: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  image_url: string | null;
  link_url: string | null;
  product_count: number;
  is_active: boolean;
  display_order: number;
  gradient_color: string | null;
  created_at: string;
  updated_at: string;
}

// GET - Get a single homepage section
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Verify admin authentication
    const authResult = await verifyAdminAuth(request);
    if (!authResult.success) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const section = await queryOne<HomepageSectionRow>(
      `SELECT * FROM homepage_sections WHERE id = ?`,
      [id]
    );

    if (!section) {
      return NextResponse.json({ error: 'Section not found' }, { status: 404 });
    }

    return NextResponse.json({ section });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error fetching homepage section:', error);
    return NextResponse.json(
      { error: 'Failed to fetch homepage section', details: errorMessage },
      { status: 500 }
    );
  }
}

// PUT - Update a homepage section
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Verify admin authentication
    const authResult = await verifyAdminAuth(request);
    if (!authResult.success) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      section_key,
      title,
      subtitle,
      description,
      image_url,
      link_url,
      product_count,
      is_active,
      display_order,
      gradient_color,
    } = body;

    // Check if section exists
    const existingSection = await queryOne<HomepageSectionRow>(
      `SELECT * FROM homepage_sections WHERE id = ?`,
      [id]
    );

    if (!existingSection) {
      return NextResponse.json({ error: 'Section not found' }, { status: 404 });
    }

    await query(
      `UPDATE homepage_sections SET
        section_key = ?,
        title = ?,
        subtitle = ?,
        description = ?,
        image_url = ?,
        link_url = ?,
        product_count = ?,
        is_active = ?,
        display_order = ?,
        gradient_color = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?`,
      [
        section_key ?? existingSection.section_key,
        title ?? existingSection.title,
        subtitle !== undefined ? subtitle : existingSection.subtitle,
        description !== undefined ? description : existingSection.description,
        image_url !== undefined ? image_url : existingSection.image_url,
        link_url !== undefined ? link_url : existingSection.link_url,
        product_count !== undefined ? product_count : existingSection.product_count,
        is_active !== undefined ? is_active : existingSection.is_active,
        display_order !== undefined ? display_order : existingSection.display_order,
        gradient_color !== undefined ? gradient_color : existingSection.gradient_color,
        id,
      ]
    );

    const updatedSection = await queryOne<HomepageSectionRow>(
      `SELECT * FROM homepage_sections WHERE id = ?`,
      [id]
    );

    return NextResponse.json({ section: updatedSection });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error updating homepage section:', error);
    return NextResponse.json(
      { error: 'Failed to update homepage section', details: errorMessage },
      { status: 500 }
    );
  }
}

// DELETE - Delete a homepage section
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Verify admin authentication
    const authResult = await verifyAdminAuth(request);
    if (!authResult.success) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if section exists
    const existingSection = await queryOne(
      `SELECT * FROM homepage_sections WHERE id = ?`,
      [id]
    );

    if (!existingSection) {
      return NextResponse.json({ error: 'Section not found' }, { status: 404 });
    }

    await query(`DELETE FROM homepage_sections WHERE id = ?`, [id]);

    return NextResponse.json({ message: 'Homepage section deleted successfully' });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error deleting homepage section:', error);
    return NextResponse.json(
      { error: 'Failed to delete homepage section', details: errorMessage },
      { status: 500 }
    );
  }
}

