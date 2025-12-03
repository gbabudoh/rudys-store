import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET - Public API to fetch active banners for homepage
export async function GET() {
  try {
    const banners = await query(
      `SELECT 
        id, title, subtitle, image_url as image, 
        link_url as link, button_text as buttonText,
        is_active as isActive, display_order as \`order\`
      FROM banners 
      WHERE is_active = TRUE 
      ORDER BY display_order ASC, created_at DESC`
    );

    return NextResponse.json({ banners });
  } catch (error: any) {
    console.error('Error fetching banners:', error);
    return NextResponse.json(
      { error: 'Failed to fetch banners', details: error.message },
      { status: 500 }
    );
  }
}

