import { NextResponse } from 'next/server';
import { queryMany } from '@/lib/db';

interface SettingRow {
  setting_key: string;
  setting_value: string;
}

export async function GET() {
  try {
    const rows = await queryMany<SettingRow>(
      "SELECT setting_key, setting_value FROM store_settings WHERE category = 'pixel_tracking'"
    );

    const pixels = rows.reduce((acc: Record<string, string>, row) => {
      // Strip the "pixel_" prefix for cleaner keys
      const key = row.setting_key.replace('pixel_', '');
      acc[key] = row.setting_value || '';
      return acc;
    }, {});

    return NextResponse.json({ pixels });
  } catch {
    // Return empty pixels gracefully if table doesn't exist yet
    return NextResponse.json({ pixels: {} });
  }
}
