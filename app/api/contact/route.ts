import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';

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

    // 1. Send Email to Admin (support@ruddysstore.com)
    await sendEmail({
      to: process.env.SMTP_FROM_SUPPORT || 'support@ruddysstore.com',
      subject: `Contact Form: ${subject} - from ${name}`,
      from: 'support',
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
      from: 'support',
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

    return NextResponse.json({ success: true, message: 'Message sent successfully' });

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
