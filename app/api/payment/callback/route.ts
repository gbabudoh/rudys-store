import { NextRequest, NextResponse } from 'next/server';
import { verifyTransaction } from '@/lib/paystack';
import { transaction } from '@/lib/db';
import { ResultSetHeader } from 'mysql2';

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

      return NextResponse.redirect(new URL(`/checkout/success?reference=${reference}`, request.url));
    } else {
      return NextResponse.redirect(new URL(`/checkout?error=payment_failed&reference=${reference}`, request.url));
    }
  } catch (error) {
    console.error('Payment callback error:', error);
    return NextResponse.redirect(new URL('/checkout?error=internal_error', request.url));
  }
}
