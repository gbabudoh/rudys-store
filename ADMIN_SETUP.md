# Admin Authentication System Setup

This document describes the admin authentication and user management system.

## Features

- **Super Admin**: Full access to all features, can create/manage all admin users
- **Basic Admin**: Limited access, can be granted specific permissions by super admin
- **Staff**: Basic access level (can be created by admin)

## Database Setup

1. Make sure the database schema is up to date:
```bash
node scripts/create-schema.js
```

2. Create the initial super admin:
```bash
node scripts/create-super-admin.js
```

## Environment Variables

Add these to your `.env.local` file:

```env
# JWT Secret for Admin Authentication
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# Super Admin Credentials (for initial setup)
SUPER_ADMIN_EMAIL=admin@rudystore.com
SUPER_ADMIN_PASSWORD=admin123
SUPER_ADMIN_FIRST_NAME=Super
SUPER_ADMIN_LAST_NAME=Admin

# Basic Admin Credentials (optional, for testing)
BASIC_ADMIN_PASSWORD=staff123
```

## Default Credentials

After running the setup script, you can login with:

- **Super Admin**: admin@rudystore.com / admin123
- **Basic Admin**: staff@rudystore.com / staff123

⚠️ **Important**: Change these passwords in production!

## API Endpoints

### Authentication

- `POST /api/admin/auth/login` - Login with email and password
- `GET /api/admin/auth/verify` - Verify JWT token
- `POST /api/admin/auth/logout` - Logout (client-side)

### User Management

- `GET /api/admin/users` - List all admin users (requires admin/super_admin)
- `POST /api/admin/users` - Create new admin user (super_admin can create admins, admin can create staff)
- `GET /api/admin/users/[id]` - Get specific user details
- `PUT /api/admin/users/[id]` - Update user (permissions, role, etc.)
- `DELETE /api/admin/users/[id]` - Deactivate user (soft delete)

## Permissions System

Permissions are stored as a JSON array in the database. Common permissions include:

- `all` - Full access (super admin only)
- `collections` - Manage collections
- `luxury` - Manage luxury products
- `crocs` - Manage Slide & Sole products
- `orders` - Manage orders
- `users` - Manage customer users
- `banners` - Manage banners
- `analytics` - View analytics

Super admin automatically has all permissions.

## Role Hierarchy

1. **super_admin**: Can do everything, including:
   - Create/update/delete any admin user
   - Change roles and permissions
   - Deactivate users

2. **admin**: Can:
   - Create/update staff users
   - Manage products, orders, etc. (based on permissions)
   - Cannot change roles or permissions of other admins

3. **staff**: Basic access level, permissions granted by admin/super_admin

## Usage

### Login

The login page (`/admin/login`) authenticates users and stores a JWT token in localStorage.

### Protected Routes

All admin routes are protected by the `AdminLayout` component, which:
- Verifies the JWT token on page load
- Redirects to login if token is invalid
- Displays user information in the sidebar

### Creating Admin Users

Super admin can create new admin users through the admin panel:
1. Navigate to `/admin/users`
2. Click "Create Admin User"
3. Fill in details and select permissions
4. Save

### Granting Permissions

Super admin can grant permissions to basic admin users:
1. Go to `/admin/users`
2. Click edit on the user
3. Select/deselect permissions
4. Save changes

## Security Notes

- Passwords are hashed using bcrypt (10 rounds)
- JWT tokens expire after 7 days (configurable)
- Tokens are verified on every API request
- Users cannot change their own role or deactivate themselves
- Super admin cannot delete their own account

