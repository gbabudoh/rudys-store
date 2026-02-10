import { NextResponse } from 'next/server';
import { query, queryMany } from '@/lib/db';

interface FooterLink {
  id: number;
  section: string;
  label: string;
  href: string;
  display_order: number;
  is_active: boolean;
}

export async function GET() {
  try {
    // Ensure table exists
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

    const links = await queryMany<FooterLink>(
      'SELECT section, label, href FROM footer_links WHERE is_active = TRUE ORDER BY section, display_order ASC'
    );

    // Group by section
    const grouped = links.reduce((acc: Record<string, { label: string; href: string }[]>, link) => {
      if (!acc[link.section]) acc[link.section] = [];
      acc[link.section].push({ label: link.label, href: link.href });
      return acc;
    }, {});

    return NextResponse.json({ links: grouped });
  } catch (error) {
    console.error('Error fetching footer links:', error);
    return NextResponse.json({ links: {} });
  }
}
