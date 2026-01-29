import { NextResponse } from 'next/server';
import { query, queryMany } from '@/lib/db';
import { verify } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface AdminJWTPayload {
  id: number;
  email: string;
  role: 'super_admin' | 'admin' | 'staff';
}

async function checkAuth(request: Request): Promise<AdminJWTPayload | null> {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.split(' ')[1];
  try {
    return verify(token, JWT_SECRET) as unknown as AdminJWTPayload;
  } catch {
    return null;
  }
}

async function ensureContentTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS content_pages (
      id INT AUTO_INCREMENT PRIMARY KEY,
      slug VARCHAR(100) UNIQUE NOT NULL,
      title VARCHAR(255) NOT NULL,
      content LONGTEXT,
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  const defaultPages = [
    ['shipping-info', 'Shipping Info', '### Shipping Information\n\nWe offer worldwide shipping to our customers.'],
    ['returns-exchanges', 'Returns & Exchanges', '### Returns & Exchanges\n\nReturns are accepted within 30 days.'],
    ['size-guide', 'Size Guide', '### Size Guide\n\nFollow our detailed sizing chart.'],
    ['faq', 'FAQ', '### Frequently Asked Questions\n\nFind answers to common queries.'],
    ['support', 'Support', '### Customer Support\n\nContact us for dedicated assistance.'],
    ['contact-us', 'Contact Us', '### Get in Touch\n\n**Address**\n123 Fashion Street\nStyle City, SC 12345\nNigeria\n\n**Phone**\n+234 123 456 7890\n+234 987 654 3210\n\n**Email**\ninfo@rudysstore.com\nsupport@rudysstore.com\n\n**Business Hours**\nMonday - Friday: 9:00 AM - 6:00 PM\nSaturday: 10:00 AM - 4:00 PM\nSunday: Closed'],
    ['privacy-policy', 'Privacy Policy', '### Privacy Policy\n\n**Last Updated:** January 2025\n\n#### 1. Information We Collect\nWe collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support.\n\n#### 2. How We Use Your Information\nWe use the information we collect to process transactions, send communications, and improve our services.\n\n#### 3. Information Sharing\nWe do not sell your personal information. We may share your information with service providers who assist us in operating our business.\n\n#### 4. Data Security\nWe implement appropriate security measures to protect your personal information.\n\n#### 5. Contact Us\nIf you have questions about this Privacy Policy, please contact us at privacy@rudysstore.com'],
    ['terms-of-service', 'Terms of Service', '### Terms of Service\n\n**Last Updated:** January 2025\n\n#### 1. Acceptance of Terms\nBy accessing and using this website, you accept and agree to be bound by these Terms of Service.\n\n#### 2. Use of Service\nYou agree to use our service only for lawful purposes and in accordance with these Terms.\n\n#### 3. Products and Pricing\nAll prices are subject to change without notice. We reserve the right to modify or discontinue products at any time.\n\n#### 4. Orders and Payment\nWe reserve the right to refuse or cancel any order for any reason.\n\n#### 5. Returns and Refunds\nPlease refer to our Returns & Exchanges policy for information about returns and refunds.\n\n#### 6. Limitation of Liability\nWe shall not be liable for any indirect, incidental, special, or consequential damages.\n\n#### 7. Contact Us\nFor questions about these Terms, please contact us at legal@rudysstore.com']
  ];

  for (const [slug, title, content] of defaultPages) {
    try {
      await query(
        'INSERT IGNORE INTO content_pages (slug, title, content) VALUES (?, ?, ?)',
        [slug, title, content]
      );
    } catch (err) {
      console.error(`Migration error for slug ${slug}:`, err);
    }
  }
}

export async function GET(request: Request) {
  const user = await checkAuth(request);
  if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await ensureContentTable();
    const pages = await queryMany('SELECT * FROM content_pages ORDER BY title ASC');
    return NextResponse.json({ pages });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch content pages' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const user = await checkAuth(request);
  if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { slug, title, content, is_active } = body;

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    await ensureContentTable();

    await query(
      `UPDATE content_pages 
       SET title = ?, content = ?, is_active = ? 
       WHERE slug = ?`,
      [title, content, is_active === undefined ? true : is_active, slug]
    );

    return NextResponse.json({ message: 'Page updated successfully' });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to update page' }, { status: 500 });
  }
}
