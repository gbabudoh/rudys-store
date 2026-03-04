import { NextResponse } from 'next/server';
import { query, queryMany } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    // 1. Total Stats
    const totalProducts = await query('SELECT COUNT(*) as count FROM products');
    const totalOrders = await query('SELECT COUNT(*) as count FROM orders');
    const totalRevenue = await query("SELECT SUM(total) as sum FROM orders WHERE payment_status = 'paid'");
    const totalCustomers = await query('SELECT COUNT(*) as count FROM users');

    // 2. Products by Section
    const sectionCounts = await queryMany('SELECT store_section, COUNT(*) as count FROM products GROUP BY store_section');
    const collectionsCount = sectionCounts.find(s => s.store_section === 'collections')?.count || 0;
    const luxuryCount = sectionCounts.find(s => s.store_section === 'luxury')?.count || 0;
    const crocsCount = sectionCounts.find(s => s.store_section === 'crocs')?.count || 0;

    // 3. Recent Orders
    const recentOrders = await queryMany(`
      SELECT id, order_number, first_name, last_name, total as amount, status, created_at as date
      FROM orders
      ORDER BY created_at DESC
      LIMIT 5
    `);

    // 4. Top Products
    const topProducts = await queryMany(`
      SELECT product_name as name, SUM(quantity) as sales, SUM(total_price) as revenue
      FROM order_items
      GROUP BY product_name
      ORDER BY sales DESC
      LIMIT 5
    `);

    return NextResponse.json({
      totalProducts: totalProducts[0]?.count || 0,
      totalOrders: totalOrders[0]?.count || 0,
      totalRevenue: parseFloat(totalRevenue[0]?.sum || 0),
      totalCustomers: totalCustomers[0]?.count || 0,
      collectionsProducts: collectionsCount,
      luxuryProducts: luxuryCount,
      crocsProducts: crocsCount,
      recentOrders: recentOrders.map(o => ({
        id: o.order_number,
        customer: `${o.first_name} ${o.last_name}`,
        amount: parseFloat(o.amount),
        status: o.status,
        date: o.date
      })),
      topProducts: topProducts.map(p => ({
        name: p.name,
        sales: parseInt(p.sales),
        revenue: parseFloat(p.revenue)
      }))
    });
  } catch (error) {
    console.error('Dashboard Stats API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard stats' }, { status: 500 });
  }
}
