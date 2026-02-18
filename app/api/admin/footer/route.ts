import { NextRequest, NextResponse } from 'next/server';
import { query, queryMany } from '@/lib/db';
import { verifyAdminAuth } from '@/lib/auth';

interface FooterLink {
  id: number;
  section: string;
  label: string;
  href: string;
  display_order: number;
  is_active: boolean;
}

async function ensureFooterTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS footer_links (
      id INT AUTO_INCREMENT PRIMARY KEY,
      section VARCHAR(50) NOT NULL,
      label VARCHAR(100) NOT NULL,
      href VARCHAR(255) NOT NULL,
      display_order INT DEFAULT 0,
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_section (section),
      INDEX idx_order (display_order)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // Seed defaults if empty
  const existing = await queryMany<{ cnt: number }>('SELECT COUNT(*) as cnt FROM footer_links');
  if (existing[0]?.cnt === 0) {
    const defaults = [
      ['quick_links', 'Ruddys Store', '/store', 1],
      ['quick_links', 'Rudy Luxury', '/luxury', 2],
      ['quick_links', 'Slide & Sole', '/crocs', 3],
      ['quick_links', 'About Us', '/about', 4],
      ['quick_links', 'Contact', '/contact', 5],
      ['customer_service', 'Shipping Info', '/shipping', 1],
      ['customer_service', 'Returns & Exchanges', '/returns', 2],
      ['customer_service', 'Size Guide', '/size-guide', 3],
      ['customer_service', 'FAQ', '/faq', 4],
      ['customer_service', 'Support', '/support', 5],
    ];
    for (const [section, label, href, order] of defaults) {
      await query(
        'INSERT INTO footer_links (section, label, href, display_order) VALUES (?, ?, ?, ?)',
        [section, label, href, order]
      );
    }
  }
}

// GET - List all footer links
export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAdminAuth(request);
    if (!authResult.success) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await ensureFooterTable();
    const links = await queryMany<FooterLink>(
      'SELECT * FROM footer_links ORDER BY section, display_order ASC'
    );
    return NextResponse.json({ links });
  } catch (error) {
    console.error('Error fetching footer links:', error);
    return NextResponse.json({ error: 'Failed to fetch footer links' }, { status: 500 });
  }
}

// POST - Create a new footer link
export async function POST(request: NextRequest) {
  try {
    const authResult = await verifyAdminAuth(request);
    if (!authResult.success) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { section, label, href, display_order, is_active } = await request.json();
    if (!section || !label || !href) {
      return NextResponse.json({ error: 'Section, label, and href are required' }, { status: 400 });
    }

    await ensureFooterTable();
    await query(
      'INSERT INTO footer_links (section, label, href, display_order, is_active) VALUES (?, ?, ?, ?, ?)',
      [section, label, href, display_order || 0, is_active ?? true]
    );

    return NextResponse.json({ message: 'Footer link created' });
  } catch (error) {
    console.error('Error creating footer link:', error);
    return NextResponse.json({ error: 'Failed to create footer link' }, { status: 500 });
  }
}
