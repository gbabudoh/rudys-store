# Rudy's Store - Architecture Documentation

## Overview

Rudy's Store is a modern e-commerce platform built with Next.js 16 (App Router), TypeScript, MySQL, and various third-party integrations. The architecture follows a modular, scalable design pattern with clear separation of concerns.

## Technology Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: Custom React components
- **State Management**: React Hooks (useState, useEffect)
- **Routing**: Next.js App Router with file-based routing

### Backend
- **Runtime**: Node.js 18+
- **API**: Next.js API Routes (RESTful)
- **Database**: MySQL 8.0+ with connection pooling
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs

### Third-Party Integrations
- **Payments**: Paystack API
- **Image Management**: Cloudinary
- **Analytics**: Google Analytics 4 (react-ga4)
- **Icons**: Lucide React (via custom SVG components)

## Architecture Patterns

### 1. File-Based Routing (Next.js App Router)

```
app/
├── page.tsx              # Homepage (/)
├── collections/          # Rudy Collections (/collections)
├── luxury/               # Rudy Luxury (/luxury)
├── crocs/                # Slide & Sole (/crocs)
├── products/             # All Products (/products)
├── admin/                # Admin Panel (/admin/*)
└── api/                  # API Routes (/api/*)
```

### 2. Component Architecture

Components are organized by functionality:

```
app/components/
├── Header.tsx            # Main navigation header
├── Footer.tsx            # Site footer
├── ProductCard.tsx      # Reusable product card
├── BannerSlider.tsx     # Homepage banner slider
├── CategorySection.tsx  # Category display sections
├── AdminSidebar.tsx     # Admin panel sidebar
└── CookieBanner.tsx     # Cookie consent banner
```

### 3. API Route Structure

API routes follow RESTful conventions:

```
app/api/
├── admin/                # Protected admin endpoints
│   ├── auth/            # Authentication
│   ├── banners/         # Banner CRUD
│   ├── homepage-sections/ # Homepage sections CRUD
│   └── users/           # Admin user management
├── banners/             # Public banner listing
├── payment/             # Payment processing
└── upload/              # File uploads
```

### 4. Library Layer (lib/)

Utility functions and integrations:

```
lib/
├── db.ts                # Database connection & queries
├── auth.ts              # Authentication utilities
├── paystack.ts          # Paystack integration
├── cloudinary.ts        # Cloudinary integration
├── analytics.ts         # Google Analytics utilities
└── products.ts          # Product data utilities
```

## Database Architecture

### Connection Pooling

The application uses MySQL connection pooling for efficient database connections:

```typescript
// lib/db.ts
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
```

### Database Schema

Key tables:
- `users` - Customer accounts
- `products` - Product catalog
- `orders` - Order management
- `order_items` - Order line items
- `cart` - Shopping cart
- `wishlist` - Customer wishlists
- `admin_users` - Admin accounts
- `banners` - Homepage banners
- `homepage_sections` - Category sections
- `categories` - Product categories
- `product_images` - Product images
- `product_variants` - Product variations
- `reviews` - Product reviews
- `coupons` - Discount codes

See `database/schema.sql` for complete schema.

## Authentication & Authorization

### Admin Authentication Flow

1. **Login** (`POST /api/admin/auth/login`)
   - Validates email/password
   - Returns JWT token
   - Stores token in localStorage (client-side)

2. **Token Verification** (`GET /api/admin/auth/verify`)
   - Validates JWT token
   - Returns admin user data

3. **Protected Routes**
   - Admin layout checks token on mount
   - Redirects to login if invalid
   - API routes use `verifyAdminAuth` middleware

### Role-Based Access Control (RBAC)

Three roles with hierarchical permissions:

```
super_admin
  ├── Full access to all features
  ├── Can create/manage all admin users
  └── Can change roles and permissions

admin
  ├── Can create/manage staff users
  ├── Can manage products, orders (based on permissions)
  └── Cannot change roles/permissions of other admins

staff
  └── Basic access with limited permissions
```

### Permission System

Permissions stored as JSON array in database:
- `all` - Full access (super admin only)
- `collections` - Manage collections
- `luxury` - Manage luxury products
- `crocs` - Manage Slide & Sole products
- `orders` - Manage orders
- `users` - Manage customer users
- `banners` - Manage banners
- `analytics` - View analytics

## State Management

### Client-Side State

- **React Hooks**: useState, useEffect for component state
- **Local Storage**: JWT tokens, admin user data, cookie preferences
- **URL State**: Filter parameters, pagination

### Server-Side State

- **Database**: Primary source of truth
- **API Routes**: Fetch data on-demand
- **Server Components**: Next.js server components for data fetching

## Data Flow

### Product Listing Flow

```
User visits /collections
  ↓
Page component loads
  ↓
Fetches products from lib/products.ts
  ↓
Applies filters (client-side)
  ↓
Renders ProductCard components
  ↓
User interacts (add to cart, view details)
  ↓
Client-side handlers process actions
```

### Admin Banner Management Flow

```
Admin visits /admin/banners
  ↓
AdminLayout verifies authentication
  ↓
Page fetches banners from /api/admin/banners
  ↓
API route verifies admin auth
  ↓
Queries database for banners
  ↓
Returns JSON response
  ↓
Page displays banners in UI
  ↓
Admin creates/updates/deletes banner
  ↓
API route processes request
  ↓
Updates database
  ↓
Returns success response
```

## Security Architecture

### Authentication Security

- **Password Hashing**: bcryptjs with 10 rounds
- **JWT Tokens**: Signed with secret key, 7-day expiration
- **Token Storage**: localStorage (client-side)
- **Token Verification**: Server-side on every API request

### API Security

- **Admin Routes**: Protected with `verifyAdminAuth` middleware
- **CORS**: Configured for specific origins
- **Input Validation**: Type checking with TypeScript
- **SQL Injection Prevention**: Parameterized queries

### Environment Variables

- Sensitive data stored in `.env.local`
- Never committed to version control
- `NEXT_PUBLIC_*` prefix for client-side exposure

## Image Management

### Cloudinary Integration

- **Upload**: Images uploaded via `/api/upload/cloudinary`
- **Storage**: Cloudinary cloud storage
- **Optimization**: Automatic format and quality optimization
- **CDN**: Cloudinary CDN for fast delivery

### Image Flow

```
Admin uploads image
  ↓
POST /api/upload/cloudinary
  ↓
Verifies admin authentication
  ↓
Uploads to Cloudinary
  ↓
Returns secure URL
  ↓
URL stored in database
  ↓
Displayed via Next.js Image component
```

## Payment Integration

### Paystack Flow

1. **Initialize Transaction**
   - Customer clicks "Pay"
   - Frontend calls `/api/payment/initialize`
   - Returns Paystack authorization URL
   - Redirects customer to Paystack

2. **Payment Processing**
   - Customer completes payment on Paystack
   - Paystack redirects to callback URL

3. **Verify Transaction**
   - Backend verifies payment with Paystack API
   - Updates order status
   - Sends confirmation

## Performance Optimizations

### Frontend

- **Image Optimization**: Next.js Image component with lazy loading
- **Code Splitting**: Automatic with Next.js App Router
- **Static Generation**: Static pages where possible
- **Client-Side Filtering**: Reduces API calls

### Backend

- **Connection Pooling**: Reuses database connections
- **Query Optimization**: Indexed database queries
- **Caching**: Consider Redis for production
- **API Rate Limiting**: Implement for production

## Error Handling

### Client-Side

- Try-catch blocks in async functions
- Error boundaries for React components
- User-friendly error messages
- Console logging for debugging

### Server-Side

- Try-catch in API routes
- Proper HTTP status codes
- Error logging
- Graceful degradation

## Scalability Considerations

### Current Architecture

- Single database instance
- File-based routing
- Client-side filtering
- Stateless API routes

### Future Enhancements

- **Database**: Read replicas, sharding
- **Caching**: Redis for sessions and data
- **CDN**: Cloudinary CDN for assets
- **Load Balancing**: Multiple server instances
- **Microservices**: Separate services for payments, analytics
- **Search**: Elasticsearch for product search
- **Queue System**: Background job processing

## Deployment Architecture

### Development

- Local MySQL database
- Next.js dev server
- Environment variables in `.env.local`

### Production (Recommended)

```
Internet
  ↓
CDN (Cloudinary)
  ↓
Load Balancer
  ↓
Next.js App (Vercel/Server)
  ↓
MySQL Database (Managed)
  ↓
External Services (Paystack, Cloudinary, GA)
```

## Monitoring & Analytics

### Google Analytics 4

- Page view tracking
- Custom event tracking
- E-commerce tracking
- Conversion tracking

### Internal Analytics

- Order tracking
- Revenue metrics
- Product performance
- User behavior

## Development Workflow

1. **Local Development**
   - `npm run dev` - Start dev server
   - Hot reload for changes
   - Database connection pooling

2. **Database Migrations**
   - SQL files in `database/migrations/`
   - Scripts in `scripts/` directory
   - Manual execution for now

3. **Testing**
   - Database connection test: `node scripts/test-db.js`
   - API endpoint tests: Manual via browser/Postman
   - Cloudinary test: `node scripts/test-cloudinary.js`

## Best Practices

1. **Code Organization**: Modular, reusable components
2. **Type Safety**: Full TypeScript coverage
3. **Error Handling**: Comprehensive try-catch blocks
4. **Security**: Authentication on all admin routes
5. **Performance**: Optimized images and queries
6. **Accessibility**: Semantic HTML, ARIA labels
7. **SEO**: Meta tags, structured data

## Future Roadmap

- [ ] Unit and integration tests
- [ ] E2E testing with Playwright/Cypress
- [ ] CI/CD pipeline
- [ ] Docker containerization
- [ ] Redis caching layer
- [ ] Elasticsearch for search
- [ ] Email notifications
- [ ] SMS notifications
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)

---

**Last Updated**: 2024

