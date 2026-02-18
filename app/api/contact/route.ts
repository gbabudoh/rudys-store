import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    // Validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // 0. Self-healing: Create table if not exists
    await query(`
      CREATE TABLE IF NOT EXISTS contact_messages (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          phone VARCHAR(50),
          subject VARCHAR(255) NOT NULL,
          message TEXT NOT NULL,
          status ENUM('unread', 'read', 'archived') DEFAULT 'unread',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX idx_status (status),
          INDEX idx_email (email)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // 0.1. Persist message to database
    await query(
      'INSERT INTO contact_messages (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)',
      [name, email, phone || null, subject, message]
    );


    // 4. Send Emails (Non-blocking background process)
    // We don't 'await' this block to return the response immediately
    (async () => {
      try {
        // 1. Send Email to Admin
        const adminEmails = [
          'info@ruddysstore.com',
          process.env.SMTP_FROM_SUPPORT || 'support@ruddysstore.com'
        ];

        await sendEmail({
          to: adminEmails,
          subject: `Contact Form: ${subject} - from ${name}`,
          from: 'info',
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
              <h2 style="color: #cfa224; border-bottom: 2px solid #cfa224; padding-bottom: 10px;">New Contact Message</h2>
              <div style="margin: 20px 0;">
                <p><strong>From:</strong> ${name} (${email})</p>
                <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
                <p><strong>Subject:</strong> ${subject}</p>
              </div>
              <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px;">
                <p><strong>Message:</strong></p>
                <p style="white-space: pre-wrap;">${message}</p>
              </div>
            </div>
          `
        });

        // 2. Send Receipt Confirmation to Customer
        await sendEmail({
          to: email,
          subject: `Receipt: We received your message - ${subject}`,
          from: 'info',
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
              <h2 style="color: #cfa224;">Hello ${name},</h2>
              <p>Thank you for reaching out to Ruddy's Store. We have received your message regarding <strong>"${subject}"</strong>.</p>
              <p>Our support team will review your inquiry and get back to you as soon as possible.</p>
              <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #cfa224;">
                <p style="font-style: italic;">"We aim to respond to all inquiries within 24-48 business hours."</p>
              </div>
              <p>Best regards,<br>Ruddy's Store Support Team</p>
            </div>
          `
        });
      } catch (emailError) {
        console.error('Background email notification failed:', emailError);
      }
    })();

    return NextResponse.json({ success: true, message: 'Message sent successfully' });

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
