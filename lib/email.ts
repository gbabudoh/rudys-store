import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  from?: 'info' | 'support' | 'sales' | string;
}

/**
 * Centered Email Service using SMTP
 */
export async function sendEmail({ to, subject, text, html, from = 'info' }: EmailOptions) {
  // SMTP Configuration from environment variables
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // Determine sender address
  let fromAddress = process.env.SMTP_FROM_INFO || 'info@ruddysstore.com';
  if (from === 'support') {
    fromAddress = process.env.SMTP_FROM_SUPPORT || 'support@ruddysstore.com';
  } else if (from === 'sales') {
    fromAddress = process.env.SMTP_FROM_SALES || 'sales@ruddysstore.com';
  } else if (from.includes('@')) {
    fromAddress = from;
  }

  const mailOptions = {
    from: `"Ruddy's Store" <${fromAddress}>`,
    to: Array.isArray(to) ? to.join(', ') : to,
    subject,
    text,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: %s', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}
