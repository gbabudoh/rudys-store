import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET - Public API to fetch active homepage sections
export async function GET() {
  try {
    const sections = await query(
      `SELECT 
        id, section_key, title, subtitle, description,
        image_url, link_url, product_count,
        is_active, display_order, gradient_color
      FROM homepage_sections 
      WHERE is_active = TRUE 
      ORDER BY display_order ASC`
    );

    // Transform the data for frontend
    const transformedSections = (sections as any[]).map(section => ({
      id: section.id,
      key: section.section_key,
      section_key: section.section_key,
      title: section.title,
      subtitle: section.subtitle,
      description: section.description,
      image: section.image_url,
      image_url: section.image_url,
      href: section.link_url,
      link_url: section.link_url,
      productCount: section.product_count,
      product_count: section.product_count,
      isActive: section.is_active,
      displayOrder: section.display_order,
      gradient: section.gradient_color,
      gradient_color: section.gradient_color
    }));

    return NextResponse.json({ sections: transformedSections });
  } catch (error: any) {
    console.error('Error fetching homepage sections:', error);
    return NextResponse.json(
      { error: 'Failed to fetch homepage sections', details: error.message },
      { status: 500 }
    );
  }
}

