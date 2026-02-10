import { NextRequest, NextResponse } from 'next/server';
import { query, queryMany } from '@/lib/db';
import { ResultSetHeader } from 'mysql2';

export async function GET() {
  try {
    // Proactively create table if it doesn't exist to avoid runtime errors for the user
    await query(`
      CREATE TABLE IF NOT EXISTS shipping_methods (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          carrier VARCHAR(100) NOT NULL,
          estimated_days VARCHAR(100) NOT NULL,
          price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
          free_shipping_threshold DECIMAL(10, 2) NULL,
          is_active BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX idx_active (is_active)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    const methods = await queryMany('SELECT * FROM shipping_methods ORDER BY created_at DESC');
    return NextResponse.json(methods);
  } catch (error) {
    console.error('Error fetching shipping methods:', error);
    return NextResponse.json({ error: 'Failed to fetch shipping methods' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, carrier, estimated_days, price, free_shipping_threshold, is_active } = body;

    if (!name || !carrier || !estimated_days || price === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const result = await query(
      `INSERT INTO shipping_methods (name, carrier, estimated_days, price, free_shipping_threshold, is_active) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, carrier, estimated_days, price, free_shipping_threshold || null, is_active ?? true]
    ) as ResultSetHeader;

    return NextResponse.json({ 
      id: result.insertId,
      message: 'Shipping method created successfully' 
    });

  } catch (error) {
    console.error('Error creating shipping method:', error);
    return NextResponse.json({ error: 'Failed to create shipping method' }, { status: 500 });
  }
}
