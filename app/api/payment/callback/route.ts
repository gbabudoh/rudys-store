import { NextRequest, NextResponse } from 'next/server';
import { verifyTransaction } from '@/lib/paystack';
import { transaction, queryOne } from '@/lib/db';
import { ResultSetHeader } from 'mysql2';
import { sendEmail } from '@/lib/email';

interface OrderMetadata {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    size?: string;
    color?: string;
    price?: number;
  }>;
}

const STORE_EMAIL = process.env.STORE_NOTIFICATION_EMAIL || process.env.SMTP_FROM_INFO || 'info@ruddysstore.com';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const reference = searchParams.get('reference');

  if (!reference) {
    return NextResponse.redirect(new URL('/checkout?error=no_reference', request.url));
  }

  try {
    console.log('Verifying transaction reference:', reference);
    const result = await verifyTransaction(reference);
    console.log('Verification result:', result);

    if (result.success && result.data) {
      const { metadata, amount, reference: paystackRef } = result.data;
      console.log('Order metadata:', metadata);
      const orderMetadata = metadata as unknown as OrderMetadata;

      // Guard against duplicate orders for the same payment reference
      const existing = await queryOne<{ id: number }>(
        'SELECT id FROM orders WHERE payment_reference = ? LIMIT 1',
        [paystackRef]
      );
      if (existing) {
        console.log('Duplicate callback for reference:', paystackRef, '- redirecting to success');
        return NextResponse.redirect(new URL(`/checkout/success?reference=${reference}`, request.url));
      }

      // Store order in database
      await transaction(async (connection) => {
        const [orderResult] = await connection.execute(
          `INSERT INTO orders (
            order_number, email, first_name, last_name, phone,
            shipping_address, shipping_city, shipping_state,
            payment_status, payment_method, payment_reference,
            subtotal, total
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            `ORD-${Date.now()}`,
            orderMetadata.email,
            orderMetadata.firstName,
            orderMetadata.lastName,
            orderMetadata.phone,
            orderMetadata.address,
            orderMetadata.city,
            orderMetadata.state,
            'paid',
            'paystack',
            paystackRef,
            amount,
            amount,
          ]
        );

        const orderId = (orderResult as ResultSetHeader).insertId;

        for (const item of orderMetadata.items) {
          const unitPrice = item.price || amount / orderMetadata.items.length;
          await connection.execute(
            `INSERT INTO order_items (
              order_id, product_id, product_name,
              variant_info, quantity, unit_price, total_price
            ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
              orderId,
              item.id,
              item.name,
              `${item.size || ''} ${item.color || ''}`.trim(),
              item.quantity,
              unitPrice,
              unitPrice * item.quantity,
            ]
          );
        }
      });

      const itemsHtml = orderMetadata.items
        .map(
          (item) => `
          <tr>
            <td style="padding:8px 0;border-bottom:1px solid #eee;">
              ${item.name}${item.size ? ` <span style="color:#888;">(${item.size})</span>` : ''}
              ${item.color ? ` <span style="color:#888;">${item.color}</span>` : ''}
            </td>
            <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:center;">${item.quantity}</td>
            <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;">₦${((item.price || 0)).toLocaleString()}</td>
          </tr>`
        )
        .join('');

      const orderTotal = `₦${amount.toLocaleString()}`;

      // Customer confirmation email
      try {
        await sendEmail({
          to: orderMetadata.email,
          subject: `Order Confirmed – ${paystackRef}`,
          from: 'info',
          html: `
            <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;border:1px solid #eee;border-radius:8px;">
              <h2 style="color:#201d1e;margin-bottom:4px;">Order Confirmed!</h2>
              <p style="color:#555;">Hi ${orderMetadata.firstName},</p>
              <p style="color:#555;">Thank you for your purchase. Your order has been successfully placed and is being processed.</p>
              <div style="background:#f9f9f9;padding:16px;border-radius:6px;margin:20px 0;">
                <p style="margin:4px 0;"><strong>Order Reference:</strong> <span style="font-family:monospace;">${paystackRef}</span></p>
                <p style="margin:4px 0;"><strong>Total Amount:</strong> ${orderTotal}</p>
              </div>
              <h3 style="color:#201d1e;">Order Summary</h3>
              <table style="width:100%;border-collapse:collapse;">
                <thead>
                  <tr>
                    <th style="text-align:left;padding:8px 0;border-bottom:2px solid #eee;color:#888;font-size:12px;">ITEM</th>
                    <th style="text-align:center;padding:8px 0;border-bottom:2px solid #eee;color:#888;font-size:12px;">QTY</th>
                    <th style="text-align:right;padding:8px 0;border-bottom:2px solid #eee;color:#888;font-size:12px;">PRICE</th>
                  </tr>
                </thead>
                <tbody>${itemsHtml}</tbody>
              </table>
              <p style="margin-top:24px;color:#555;">We will notify you once your order has been shipped.</p>
              <p style="color:#555;">Best regards,<br><strong>Ruddy's Store Team</strong></p>
            </div>
          `,
        });
      } catch (emailError) {
        console.error('Failed to send customer order confirmation email:', emailError);
      }

      // Store owner notification email
      try {
        await sendEmail({
          to: STORE_EMAIL,
          subject: `New Order Received – ${paystackRef}`,
          from: 'info',
          html: `
            <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;border:1px solid #eee;border-radius:8px;">
              <h2 style="color:#201d1e;">New Order Received</h2>
              <div style="background:#f0fdf4;padding:16px;border-radius:6px;margin:20px 0;border:1px solid #bbf7d0;">
                <p style="margin:4px 0;"><strong>Reference:</strong> <span style="font-family:monospace;">${paystackRef}</span></p>
                <p style="margin:4px 0;"><strong>Total:</strong> ${orderTotal}</p>
              </div>
              <h3 style="color:#201d1e;">Customer Details</h3>
              <p style="margin:4px 0;"><strong>Name:</strong> ${orderMetadata.firstName} ${orderMetadata.lastName}</p>
              <p style="margin:4px 0;"><strong>Email:</strong> ${orderMetadata.email}</p>
              <p style="margin:4px 0;"><strong>Phone:</strong> ${orderMetadata.phone || 'N/A'}</p>
              <p style="margin:4px 0;"><strong>Address:</strong> ${orderMetadata.address}, ${orderMetadata.city}, ${orderMetadata.state}</p>
              <h3 style="color:#201d1e;">Items Ordered</h3>
              <table style="width:100%;border-collapse:collapse;">
                <thead>
                  <tr>
                    <th style="text-align:left;padding:8px 0;border-bottom:2px solid #eee;color:#888;font-size:12px;">ITEM</th>
                    <th style="text-align:center;padding:8px 0;border-bottom:2px solid #eee;color:#888;font-size:12px;">QTY</th>
                    <th style="text-align:right;padding:8px 0;border-bottom:2px solid #eee;color:#888;font-size:12px;">PRICE</th>
                  </tr>
                </thead>
                <tbody>${itemsHtml}</tbody>
              </table>
              <p style="margin-top:24px;color:#888;font-size:13px;">Manage this order in the <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/orders" style="color:#7c3aed;">Admin Panel</a>.</p>
            </div>
          `,
        });
      } catch (emailError) {
        console.error('Failed to send store owner notification email:', emailError);
      }

      return NextResponse.redirect(new URL(`/checkout/success?reference=${reference}`, request.url));
    } else {
      return NextResponse.redirect(new URL(`/checkout?error=payment_failed&reference=${reference}`, request.url));
    }
  } catch (error) {
    console.error('Payment callback error:', error);
    return NextResponse.redirect(new URL('/checkout?error=internal_error', request.url));
  }
}
