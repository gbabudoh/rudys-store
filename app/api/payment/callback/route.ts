import { NextRequest, NextResponse } from 'next/server';
import { verifyTransaction } from '@/lib/paystack';
import { transaction } from '@/lib/db';
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

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const reference = searchParams.get('reference');

  if (!reference) {
    return NextResponse.redirect(new URL('/checkout?error=no_reference', request.url));
  }

  try {
    const result = await verifyTransaction(reference);

    if (result.success && result.data) {
      const { metadata, amount, reference: paystackRef } = result.data;
      const orderMetadata = metadata as unknown as OrderMetadata;
      
      // Store order in database
      await transaction(async (connection) => {
        // Insert order
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
            amount
          ]
        );

        const orderId = (orderResult as ResultSetHeader).insertId;

        // Insert order items
        for (const item of orderMetadata.items) {
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
              item.price || (amount / orderMetadata.items.length), // Fallback if price not in metadata
              (item.price || (amount / orderMetadata.items.length)) * item.quantity
            ]
          );
        }
      });

      // Send Order Confirmation Email
      try {
        await sendEmail({
          to: orderMetadata.email,
          subject: `Order Confirmation - ${reference}`,
          from: 'sales',
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; rounded: 8px;">
              <h2 style="color: #cfa224;">Order Confirmed!</h2>
              <p>Hi ${orderMetadata.firstName},</p>
              <p>Thank you for your purchase. Your order has been successfully placed and is being processed.</p>
              <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p><strong>Order Reference:</strong> ${reference}</p>
                <p><strong>Total Amount:</strong> ₦${(amount / 100).toLocaleString()}</p>
              </div>
              <h3>Order Summary:</h3>
              <ul style="list-style: none; padding: 0;">
                ${orderMetadata.items.map(item => `
                  <li style="padding: 10px 0; border-bottom: 1px solid #eee;">
                    ${item.name} x ${item.quantity} ${item.size ? `(${item.size})` : ''} - ₦${((item.price || 0) / 100).toLocaleString()}
                  </li>
                `).join('')}
              </ul>
              <p style="margin-top: 30px;">We'll notify you once your order has been shipped.</p>
              <p>Best regards,<br>The Ruddy's Store Sales Team</p>
            </div>
          `
        });
      } catch (emailError) {
        console.error('Failed to send order confirmation email:', emailError);
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
