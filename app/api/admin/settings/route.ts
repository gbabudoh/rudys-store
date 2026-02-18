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

  const defaultSettings = [
    ['store_name', 'Rudy Store', 'store_info'],
    ['store_email', 'info@rudysstore.com', 'store_info'],
    ['store_phone', '+234 123 456 7890', 'store_info'],
    ['store_address', '123 Fashion Street, Style City, SC 12345, Nigeria', 'store_info'],
    ['store_email_support', 'support@rudysstore.com', 'store_info'],
    ['store_phone_secondary', '+234 987 654 3210', 'store_info'],
    ['store_hours_weekday', 'Monday - Friday: 9:00 AM - 6:00 PM', 'store_info'],
    ['store_hours_saturday', 'Saturday: 10:00 AM - 4:00 PM', 'store_info'],
    ['store_hours_sunday', 'Sunday: Closed', 'store_info'],
    ['maintenance_mode', 'false', 'general'],
    ['email_notifications', 'true', 'general'],
    ['low_stock_alerts', 'true', 'general'],
    ['social_facebook', '', 'social'],
    ['social_instagram', '', 'social'],
    ['social_twitter', '', 'social'],
    ['social_tiktok', '', 'social'],
    ['social_whatsapp', '', 'social'],
    ['store_whatsapp', '', 'store_info']
  ];

  for (const [key, value, category] of defaultSettings) {
    try {
      await query(
        'INSERT IGNORE INTO store_settings (setting_key, setting_value, category) VALUES (?, ?, ?)',
        [key, value, category]
      );
    } catch (err) {
      console.error(`Migration error for key ${key}:`, err);
    }
  }
}

export async function GET(request: Request) {
  const user = await checkAuth(request);
  if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await ensureSettingsTable();
    interface SettingRow {
      setting_key: string;
      setting_value: string;
      category: string;
    }
    const settings = await queryMany<SettingRow>('SELECT setting_key, setting_value, category FROM store_settings');
    
    // Transform array to object for easier use on frontend
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

export async function PUT(request: Request) {
  const user = await checkAuth(request);
  if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { updates } = body;

    if (!updates || typeof updates !== 'object') {
      return NextResponse.json({ error: 'Invalid updates' }, { status: 400 });
    }

    await ensureSettingsTable();

    for (const [key, value] of Object.entries(updates)) {
      // Use INSERT ... ON DUPLICATE KEY UPDATE to handle both insert and update
      await query(
        `INSERT INTO store_settings (setting_key, setting_value) 
         VALUES (?, ?) 
         ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)`,
        [key, String(value)]
      );
    }

    return NextResponse.json({ message: 'Settings updated successfully' });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
