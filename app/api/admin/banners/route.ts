import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';
import { verifyAdminAuth } from '@/lib/auth';

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
    ) as any[];

    return NextResponse.json({ banners: banners || [] });
  } catch (error: any) {
    console.error('Error fetching banners:', error);
    return NextResponse.json(
      { error: 'Failed to fetch banners', details: error.message },
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

    const result: any = await query(
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
    );

    const insertId = result?.insertId || result?.[0]?.insertId;
    if (!insertId) {
      throw new Error('Failed to get insert ID from database');
    }

    const banner = await queryOne(
      `SELECT * FROM banners WHERE id = ?`,
      [insertId]
    );

    return NextResponse.json({ banner }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating banner:', error);
    return NextResponse.json(
      { error: 'Failed to create banner', details: error.message },
      { status: 500 }
    );
  }
}

