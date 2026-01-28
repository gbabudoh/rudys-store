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

// GET - List all homepage sections
export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdminAuth(request);
    if (!authResult.success) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sections = await query(
      `SELECT * FROM homepage_sections ORDER BY display_order ASC`
    ) as HomepageSectionRow[];

    return NextResponse.json({ sections: sections || [] });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error fetching homepage sections:', error);
    return NextResponse.json(
      { error: 'Failed to fetch homepage sections', details: errorMessage },
      { status: 500 }
    );
  }
}

// POST - Create a new homepage section
export async function POST(request: NextRequest) {
  try {
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
      product_count = 0,
      is_active = true,
      display_order = 0,
      gradient_color,
    } = body;

    if (!section_key || !title) {
      return NextResponse.json(
        { error: 'Section key and title are required' },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO homepage_sections (
        section_key, title, subtitle, description, image_url, link_url,
        product_count, is_active, display_order, gradient_color
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        section_key,
        title,
        subtitle || null,
        description || null,
        image_url || null,
        link_url || null,
        product_count,
        is_active,
        display_order,
        gradient_color || null,
      ]
    ) as { insertId: number };

    const insertId = result.insertId;
    if (!insertId) {
      throw new Error('Failed to get insert ID from database');
    }

    const section = await queryOne<HomepageSectionRow>(
      `SELECT * FROM homepage_sections WHERE id = ?`,
      [insertId]
    );

    return NextResponse.json({ section }, { status: 201 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error creating homepage section:', error);
    return NextResponse.json(
      { error: 'Failed to create homepage section', details: errorMessage },
      { status: 500 }
    );
  }
}

