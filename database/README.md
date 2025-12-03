# Database Schema Documentation

## Overview
This database schema is designed for the Rudy Store e-commerce platform, supporting all core e-commerce functionality.

## Tables Created

### Core Tables

1. **users** - Customer accounts
   - Stores customer information, addresses, and account status
   - Supports email verification

2. **products** - Product catalog
   - Full product information including pricing, stock, and SEO metadata
   - Supports product variants and categories

3. **categories** - Product categories
   - Hierarchical category structure (parent-child relationships)
   - Supports multiple category levels

4. **product_images** - Product images
   - Multiple images per product
   - Primary image designation

5. **product_variants** - Product variations
   - Size, color, and other variant types
   - Individual pricing and stock per variant

### Order Management

6. **orders** - Customer orders
   - Complete order information
   - Payment and shipping status tracking
   - Order number generation

7. **order_items** - Order line items
   - Individual products in each order
   - Snapshot of product details at time of purchase

### Shopping Features

8. **cart** - Shopping cart
   - Supports both logged-in users and guest sessions
   - Product and variant selection

9. **wishlist** - Customer wishlists
   - Save products for later

10. **reviews** - Product reviews
    - Customer ratings and comments
    - Approval workflow

### Marketing & Content

11. **banners** - Homepage banners/slides
    - Banner management with scheduling
    - Display ordering

12. **coupons** - Discount codes
    - Percentage or fixed discounts
    - Usage limits and date ranges

### Administration

13. **admin_users** - Admin accounts
    - Role-based access control
    - Permission management

## Usage

### Test Database Connection
```bash
node scripts/test-db.js
```

### Create Schema
```bash
node scripts/create-schema.js
```

### Test API Endpoint
```bash
# Make sure dev server is running first
npm run dev

# Then test the endpoint
node scripts/test-api.js
# Or visit: http://localhost:3000/api/db/test
```

## Database Configuration

All database settings are configured in `.env.local`:
- `DB_HOST` - Database host
- `DB_PORT` - Database port
- `DB_USER` - Database username
- `DB_PASSWORD` - Database password
- `DB_NAME` - Database name

## Next Steps

1. **Seed Data**: Create seed scripts to populate initial data
2. **Migrations**: Set up migration system for future schema changes
3. **Backups**: Implement regular database backup strategy
4. **Indexes**: Review and optimize indexes based on query patterns

