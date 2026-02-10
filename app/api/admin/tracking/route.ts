import { NextRequest, NextResponse } from 'next/server';
import { query, queryMany } from '@/lib/db';
import { ResultSetHeader } from 'mysql2';

export async function GET() {
  try {
    // Self-healing: create table if missing
    await query(`
      CREATE TABLE IF NOT EXISTS order_tracking (
          id INT AUTO_INCREMENT PRIMARY KEY,
          order_id INT NOT NULL,
          tracking_number VARCHAR(100) UNIQUE NOT NULL,
          carrier VARCHAR(100) NOT NULL,
          status ENUM('pending', 'in_transit', 'out_for_delivery', 'delivered', 'exception') DEFAULT 'pending',
          current_location VARCHAR(255),
          estimated_delivery DATE,
          notes TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
          INDEX idx_order (order_id),
          INDEX idx_tracking (tracking_number),
          INDEX idx_status (status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    const trackings = await queryMany(`
      SELECT 
        ot.*, 
        o.order_number, 
        o.first_name as customer_first_name, 
        o.last_name as customer_last_name, 
        o.email as customer_email
      FROM order_tracking ot
      JOIN orders o ON ot.order_id = o.id
      ORDER BY ot.created_at DESC
    `);
    
    return NextResponse.json(trackings);
  } catch (error) {
    console.error('Error fetching trackings:', error);
    return NextResponse.json({ error: 'Failed to fetch tracking records' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { order_id, tracking_number, carrier, status, current_location, estimated_delivery, notes } = body;

    if (!order_id || !tracking_number || !carrier) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const result = await query(
      `INSERT INTO order_tracking (order_id, tracking_number, carrier, status, current_location, estimated_delivery, notes) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [order_id, tracking_number, carrier, status || 'pending', current_location || null, estimated_delivery || null, notes || null]
    ) as ResultSetHeader;

    return NextResponse.json({ 
      id: result.insertId,
      message: 'Tracking record created successfully' 
    });
  } catch (error) {
    console.error('Error creating tracking:', error);
    return NextResponse.json({ error: 'Failed to create tracking record' }, { status: 500 });
  }
}
