# Rudy's Store - E-Commerce Platform

A modern, full-featured e-commerce platform built with Next.js 16, featuring three distinct product collections: Rudy Collections, Rudy Luxury, and Slide & Sole. The platform includes a comprehensive admin panel, payment integration, and analytics capabilities.

## 🚀 Features

### Customer-Facing Features

- **Multi-Collection Storefront**: Three distinct collections (Rudy Collections, Rudy Luxury, Slide & Sole)
- **Product Browsing**: Advanced filtering (gender, brand, size, subcategory, price range)
- **Product Views**: Grid and list view modes
- **Shopping Cart**: Add to cart functionality
- **Wishlist**: Save products for later
- **Product Search**: Search across all collections
- **Responsive Design**: Mobile-first, fully responsive UI
- **Cookie Consent**: NDPR-compliant cookie banner
- **Legal Pages**: Privacy Policy, Terms of Service, FAQ, Support, Shipping, Returns, Size Guide

### Admin Panel Features

- **Role-Based Access Control**: Super Admin, Admin, and Staff roles
- **Product Management**: CRUD operations for all three collections
- **Banner Management**: Dynamic homepage banner slider
- **Homepage Sections**: Manage category sections with images and descriptions
- **Order Management**: Track and manage customer orders
- **User Management**: Create and manage admin users with permissions
- **Analytics Dashboard**: Internal analytics and Google Analytics integration
- **Payment Configuration**: Paystack payment gateway setup
- **Shipping & Tracking**: Manage shipping methods and order tracking

### Technical Features

- **Payment Integration**: Paystack payment gateway
- **Image Management**: Cloudinary integration for image uploads
- **Analytics**: Google Analytics 4 (GA4) integration
- **Database**: MySQL with connection pooling
- **Authentication**: JWT-based admin authentication
- **API Routes**: RESTful API endpoints
- **TypeScript**: Full TypeScript support

## 📋 Prerequisites

- Node.js 18+
- MySQL 8.0+
- npm, yarn, pnpm, or bun
- Paystack account (for payments)
- Cloudinary account (for image management)
- Google Analytics account (optional, for analytics)

## 🛠️ Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/gbabudoh/rudys-store.git
   cd rudys-store
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**

   ```bash
   cp env.example.txt .env.local
   ```

   Edit `.env.local` with your configuration:

   ```env
   # Database
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=rudy_store
   DB_PORT=3306

   # Paystack
   PAYSTACK_SECRET_KEY=sk_test_your_secret_key
   NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_your_public_key
   PAYSTACK_CALLBACK_URL=http://localhost:3000/api/payment/callback

   # JWT
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRES_IN=7d

   # Cloudinary
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   CLOUDINARY_UPLOAD_PRESET=your_upload_preset

   # Google Analytics
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

   # App
   NODE_ENV=development
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Set up the database**

   ```bash
   # Create database
   mysql -u root -p
   CREATE DATABASE rudy_store CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   EXIT;

   # Run schema creation script
   node scripts/create-schema.js

   # Create super admin
   node scripts/create-super-admin.js
   ```

5. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
rudy-store/
├── app/                      # Next.js app directory
│   ├── admin/               # Admin panel pages
│   │   ├── banners/         # Banner management
│   │   ├── collections/     # Rudy Collections management
│   │   ├── luxury/          # Rudy Luxury management
│   │   ├── crocs/           # Slide & Sole management
│   │   ├── orders/          # Order management
│   │   ├── users/           # Admin user management
│   │   └── login/           # Admin login page
│   ├── api/                 # API routes
│   │   ├── admin/           # Admin API endpoints
│   │   ├── payment/         # Payment endpoints
│   │   └── upload/          # File upload endpoints
│   ├── components/          # React components
│   ├── collections/         # Rudy Collections page
│   ├── luxury/              # Rudy Luxury page
│   ├── crocs/               # Slide & Sole page
│   ├── products/            # All products page
│   └── [other pages]        # About, Contact, FAQ, etc.
├── database/                # Database files
│   ├── schema.sql           # Database schema
│   └── migrations/          # Database migrations
├── lib/                     # Utility libraries
│   ├── db.ts                # Database connection
│   ├── auth.ts              # Authentication utilities
│   ├── paystack.ts          # Paystack integration
│   ├── cloudinary.ts        # Cloudinary integration
│   └── analytics.ts         # Analytics utilities
├── scripts/                 # Node.js scripts
│   ├── create-schema.js     # Create database schema
│   ├── create-super-admin.js # Create initial admin
│   └── test-db.js           # Test database connection
├── public/                  # Static assets
│   ├── rudy-store-logo.png  # Main logo
│   ├── ruddy-lux-logo.png   # Luxury logo
│   └── ss-logo.png          # Slide & Sole logo
└── types/                   # TypeScript type definitions
```

## 🔐 Admin Access

### Default Credentials

After running `create-super-admin.js`, you can login at `/admin/login` with:

- **Email**: admin@ruddysstore.com
- **Password**: admin123

⚠️ **Important**: Change these credentials in production!

### Admin Roles

- **Super Admin**: Full access to all features
- **Admin**: Can manage products, orders, and staff
- **Staff**: Basic access with limited permissions

## 📚 Documentation

- **[SETUP.md](./SETUP.md)** - Detailed setup guide for database, Paystack, and environment variables
- **[ADMIN_SETUP.md](./ADMIN_SETUP.md)** - Admin authentication and user management guide
- **[CLOUDINARY_SETUP.md](./CLOUDINARY_SETUP.md)** - Cloudinary image management setup
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System architecture and design patterns
- **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** - Complete API reference
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Deployment guide

## 🧪 Testing

### Test Database Connection

```bash
node scripts/test-db.js
# or visit: http://localhost:3000/api/db/test
```

### Test Cloudinary Connection

```bash
node scripts/test-cloudinary.js
# or visit: http://localhost:3000/api/cloudinary/test
```

## 🚀 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

## 🛒 Collections

### Rudy Collections

General fashion and lifestyle products including clothing, accessories, and more.

### Rudy Luxury

Premium luxury items including designer bags, glasses, dresses, and high-end accessories.

### Slide & Sole

Comfortable and stylish footwear collection featuring Crocs and other comfortable shoe options.

## 💳 Payment Integration

The platform uses Paystack for payment processing:

- Supports Nigerian Naira (NGN)
- Secure payment gateway
- Transaction verification
- Customer management

## 📊 Analytics

- **Google Analytics 4**: Page views, events, and conversions
- **Internal Analytics**: Order tracking, revenue, and product performance

## 🎨 Branding

- **Primary Colors**: `#201d1e` (Dark) and `#cfa224` (Gold)
- **Luxury Collection**: `#201d1e` and `#cfa224`
- **Slide & Sole**: `#14699f` (Blue)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is private and proprietary.

## 👥 Support

For support, email support@ruddysstore.com or visit the [Support Page](http://localhost:3000/support).

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Paystack for payment integration
- Cloudinary for image management
- All contributors and users

---

**Built with ❤️ for Rudy's Store**
