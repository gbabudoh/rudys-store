import { sendEmail } from '../lib/email';
import dotenv from 'dotenv';
import path from 'path';

// Load .env.local if it exists
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config();

async function testEmail() {
  console.log('--- SMTP Test ---');
  console.log('Host:', process.env.SMTP_HOST);
  console.log('User:', process.env.SMTP_USER);

  try {
    const result = await sendEmail({
      to: process.env.SMTP_USER || 'test@example.com',
      subject: 'Ruddy\'s Store SMTP Test',
      text: 'This is a test email from Ruddy\'s Store to verify SMTP settings.',
      html: '<h1>SMTP Test</h1><p>This is a test email from <strong>Ruddy\'s Store</strong> to verify SMTP settings.</p>',
    });
    console.log('Test result:', result);
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testEmail();
