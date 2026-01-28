import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars from .env.local
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

if (!PAYSTACK_SECRET_KEY) {
    console.error('❌ Error: PAYSTACK_SECRET_KEY is not defined');
    process.exit(1);
}

async function testFetch() {
    console.log('Testing refactored fetch logic...');
    try {
        const response = await fetch(`https://api.paystack.co/transaction/initialize`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: 'test@example.com',
                amount: 10000,
                metadata: { test: true }
            }),
        });

        const body = await response.json();
        console.log('Response Status:', response.status);
        console.log('Response Body:', JSON.stringify(body, null, 2));

        if (body.status) {
            console.log('✨ Success! Paystack initialization via fetch is working.');
        } else {
            console.error('❌ Error: Paystack API returned failure.');
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

testFetch();
