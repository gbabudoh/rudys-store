import { NextResponse } from 'next/server';
import { query, queryMany } from '@/lib/db';

// Public settings endpoint - no auth required
// Only returns non-sensitive store information

const PUBLIC_SETTINGS = [
  'store_name',
  'store_email',
  'store_phone',
  'store_phone_secondary',
  'store_address',
  'store_email_support',
  'store_hours_weekday',
  'store_hours_saturday',
  'store_hours_sunday',
  'social_facebook',
  'social_instagram',
  'social_twitter',
  'social_tiktok',
  'social_whatsapp',
  'store_whatsapp',
];

async function ensureSettingsTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS store_settings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      setting_key VARCHAR(100) UNIQUE NOT NULL,
      setting_value TEXT,
      category VARCHAR(50) DEFAULT 'general',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);
}

export async function GET() {
  try {
    await ensureSettingsTable();
    
    interface SettingRow {
      setting_key: string;
      setting_value: string;
    }
    
    // Only fetch public settings
    const placeholders = PUBLIC_SETTINGS.map(() => '?').join(', ');
    const settings = await queryMany<SettingRow>(
      `SELECT setting_key, setting_value FROM store_settings WHERE setting_key IN (${placeholders})`,
      PUBLIC_SETTINGS
    );
    
    // Transform array to object
    const settingsObj = settings.reduce((acc: Record<string, string>, item) => {
      acc[item.setting_key] = item.setting_value;
      return acc;
    }, {});

    return NextResponse.json({ settings: settingsObj });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}
