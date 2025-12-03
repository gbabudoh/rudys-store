# Database, Paystack & Environment Setup Guide

## Environment Variables Setup

1. **Create a `.env.local` file** in the root directory (copy from `env.example.txt`):
   ```bash
   # Database Configuration
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password_here
   DB_NAME=rudy_store
   DB_PORT=3306

   # Paystack Configuration
   PAYSTACK_SECRET_KEY=sk_test_your_secret_key_here
   NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_your_public_key_here
   PAYSTACK_CALLBACK_URL=http://localhost:3000/api/payment/callback

   # Application Configuration
   NODE_ENV=development
   NEXT_PUBLIC_APP_URL=http://localhost:3000

   # Google Analytics Configuration
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

2. **Update the values** with your actual credentials:
   - Replace `your_password_here` with your MySQL password
   - Replace `rudy_store` with your database name (or create this database)
   - Add your Paystack API keys from your Paystack dashboard

## MySQL Database Setup

### 1. Create the Database
```sql
CREATE DATABASE rudy_store CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Test Database Connection
Visit: `http://localhost:3000/api/db/test`

This will test if your database connection is working correctly.

## Paystack Setup

1. **Get your API keys** from [Paystack Dashboard](https://dashboard.paystack.com/#/settings/developer):
   - Secret Key: Used for server-side operations
   - Public Key: Used for client-side operations (starts with `pk_`)

2. **Add keys to `.env.local`**:
   - `PAYSTACK_SECRET_KEY`: Your secret key (starts with `sk_`)
   - `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`: Your public key (starts with `pk_`)

## Google Analytics Setup

1. **Get your Measurement ID** from [Google Analytics](https://analytics.google.com/):
   - Go to Admin → Data Streams → Select your stream
   - Copy your Measurement ID (starts with `G-`)

2. **Add to `.env.local`**:
   - `NEXT_PUBLIC_GA_MEASUREMENT_ID`: Your Google Analytics Measurement ID (e.g., `G-XXXXXXXXXX`)

3. **Google Analytics is automatically initialized** when the app loads. Page views are tracked automatically on route changes.

## Usage Examples

### Database Usage

```typescript
import { query, queryOne, queryMany, transaction } from '@/lib/db';

// Single query
const user = await queryOne('SELECT * FROM users WHERE id = ?', [1]);

// Multiple rows
const products = await queryMany('SELECT * FROM products WHERE category = ?', ['luxury']);

// Transaction
await transaction(async (connection) => {
  await connection.execute('INSERT INTO orders (user_id, total) VALUES (?, ?)', [1, 5000]);
  await connection.execute('UPDATE products SET stock = stock - 1 WHERE id = ?', [1]);
});
```

### Paystack Usage

```typescript
import { initializeTransaction, verifyTransaction } from '@/lib/paystack';

// Initialize payment
const payment = await initializeTransaction(
  'customer@example.com',
  5000, // Amount in Naira
  'unique_reference', // Optional
  { orderId: 123 } // Optional metadata
);

// Verify payment
const verification = await verifyTransaction('transaction_reference');
```

### Google Analytics Usage

```typescript
import { 
  trackEvent, 
  trackPurchase, 
  trackAddToCart, 
  trackProductView,
  trackSearch 
} from '@/lib/analytics';

// Track custom events
trackEvent('button_click', 'engagement', 'header_cta');

// Track purchases
trackPurchase('order_123', 5000, 'NGN', [
  { item_id: 'prod_1', item_name: 'Product Name', price: 5000, quantity: 1 }
]);

// Track add to cart
trackAddToCart('prod_1', 'Product Name', 5000, 1);

// Track product views
trackProductView('prod_1', 'Product Name', 5000, 'luxury');

// Track search
trackSearch('luxury bags');
```

### API Endpoints

- **Test Database**: `GET /api/db/test`
- **Initialize Payment**: `POST /api/payment/initialize`
  ```json
  {
    "email": "customer@example.com",
    "amount": 5000,
    "reference": "optional_reference",
    "metadata": {}
  }
  ```
- **Verify Payment**: `POST /api/payment/verify`
  ```json
  {
    "reference": "transaction_reference"
  }
  ```

## Notes

- Next.js automatically loads `.env.local` files (no need to manually configure dotenv)
- Environment variables prefixed with `NEXT_PUBLIC_` are exposed to the browser
- Never commit `.env.local` to version control (already in `.gitignore`)
- Use test keys during development and switch to live keys in production

