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
  } catch (error) {
    let errorMessage = 'An unknown error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
      console.error('Error fetching banners:', error);
    } else if (typeof error === 'object' && error !== null && 'message' in error) {
      // Fallback for objects that might have a message property but are not Error instances
      errorMessage = (error as { message: string }).message;
      console.error('Error fetching banners:', error);
    } else {
      console.error('Error fetching banners:', error);
    }
    return NextResponse.json(
      { error: 'Failed to fetch banners', details: errorMessage },
      { status: 500 }
    );
  }
}
