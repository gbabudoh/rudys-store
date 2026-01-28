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

// GET - List all banners
export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdminAuth(request);
    if (!authResult.success) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const banners = await query(
      `SELECT * FROM banners ORDER BY display_order ASC, created_at DESC`
    ) as BannerRow[];

    return NextResponse.json({ banners: banners || [] });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error fetching banners:', error);
    return NextResponse.json(
      { error: 'Failed to fetch banners', details: errorMessage },
      { status: 500 }
    );
  }
}

// POST - Create a new banner
export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdminAuth(request);
    if (!authResult.success) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      subtitle,
      image_url,
      link_url,
      button_text,
      is_active = true,
      display_order = 0,
      start_date,
      end_date,
    } = body;

    if (!title || !image_url) {
      return NextResponse.json(
        { error: 'Title and image URL are required' },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO banners (
        title, subtitle, image_url, link_url, button_text, 
        is_active, display_order, start_date, end_date
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        subtitle || null,
        image_url,
        link_url || null,
        button_text || null,
        is_active,
        display_order,
        start_date || null,
        end_date || null,
      ]
    ) as { insertId: number };

    const insertId = result.insertId;
    if (!insertId) {
      throw new Error('Failed to get insert ID from database');
    }

    const banner = await queryOne<BannerRow>(
      `SELECT * FROM banners WHERE id = ?`,
      [insertId]
    );

    return NextResponse.json({ banner }, { status: 201 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error creating banner:', error);
    return NextResponse.json(
      { error: 'Failed to create banner', details: errorMessage },
      { status: 500 }
    );
  }
}

