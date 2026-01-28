import dotenv from 'dotenv';
import Paystack from 'paystack';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars from .env.local
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const secretKey = process.env.PAYSTACK_SECRET_KEY;

if (!secretKey) {
    console.error('❌ Error: PAYSTACK_SECRET_KEY is not defined in .env.local');
    process.exit(1);
}

console.log('✅ Found PAYSTACK_SECRET_KEY. Attempting to connect...');

const paystack = Paystack(secretKey);

async function testConnection() {
    try {
        console.log('Testing initializeTransaction...');
        const response = await paystack.transaction.initialize({
            email: 'test@example.com',
            amount: 10000, 
            callback_url: 'http://localhost:3000/api/payment/callback',
            metadata: {
                firstName: 'Test',
                lastName: 'User',
                address: '123 Test St',
                city: 'Lagos',
                phone: '08012345678',
                items: [
                    { id: 1, name: 'Item 1', quantity: 1, size: 'M', color: 'Red' }
                ]
            }
        });
        
        console.log('Full Response:', JSON.stringify(response, null, 2));
        
        if (response.status === true) {
            console.log('✨ Success! Transaction initialized.');
        } else {
            console.error('❌ Error: Paystack API returned failure status.');
        }
    } catch (error) {
        console.error('❌ Error connecting to Paystack:');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error(error.message);
        }
        process.exit(1);
    }
}

testConnection();
