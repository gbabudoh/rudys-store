import { NextRequest, NextResponse } from 'next/server';
import { queryOne, query } from '@/lib/db';

async function ensureTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS app_installations (
      id INT AUTO_INCREMENT PRIMARY KEY,
      ip_address VARCHAR(45) NOT NULL UNIQUE,
      last_opened_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_ip (ip_address)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);
}

/**
 * GET: Checks if the current visitor's IP has already installed/opened the app.
 * POST: Records the current visitor's IP as having the app.
 */

function getClientIp(req: NextRequest) {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return (req as unknown as { ip?: string }).ip || '0.0.0.0';
}

export async function GET(request: NextRequest) {
  try {
    await ensureTable();
    const ip = getClientIp(request);

    const installation = await queryOne<{ id: number }>(
      'SELECT id FROM app_installations WHERE ip_address = ? LIMIT 1',
      [ip]
    );

    return NextResponse.json({ 
      isInstalled: !!installation,
      ip: process.env.NODE_ENV === 'development' ? ip : undefined // For debugging in dev
    });

  } catch (error) {
    console.error('Error checking app status:', error);
    return NextResponse.json({ isInstalled: false, error: 'Failed to check status' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureTable();
    const ip = getClientIp(request);

    // Insert or update last_opened_at
    await query(
      `INSERT INTO app_installations (ip_address, last_opened_at) 
       VALUES (?, CURRENT_TIMESTAMP) 
       ON DUPLICATE KEY UPDATE last_opened_at = CURRENT_TIMESTAMP`,
      [ip]
    );

    return NextResponse.json({ success: true, message: 'App status updated' });

  } catch (error) {
    console.error('Error updating app status:', error);
    return NextResponse.json({ success: false, error: 'Failed to update status' }, { status: 500 });
  }
}
