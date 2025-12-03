# Rudy's Store - API Documentation

Complete API reference for Rudy's Store e-commerce platform.

## Base URL

- **Development**: `http://localhost:3000`
- **Production**: `https://yourdomain.com`

## Authentication

Most admin endpoints require authentication via JWT token. Include the token in the request header:

```
Authorization: Bearer <jwt_token>
```

The token is obtained by logging in at `/api/admin/auth/login`.

---

## Public Endpoints

### Banners

#### Get Active Banners
```http
GET /api/banners
```

**Response:**
```json
{
  "banners": [
    {
      "id": 1,
      "title": "Summer Sale",
      "subtitle": "Up to 50% off",
      "imageUrl": "https://...",
      "linkUrl": "/collections",
      "isActive": true,
      "displayOrder": 1,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Homepage Sections

#### Get Active Homepage Sections
```http
GET /api/homepage-sections
```

**Response:**
```json
{
  "sections": [
    {
      "id": 1,
      "title": "Rudy Collections",
      "description": "Discover our fashion collection",
      "imageUrl": "https://...",
      "linkUrl": "/collections",
      "productCount": 50,
      "isActive": true,
      "displayOrder": 1,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Database Test

#### Test Database Connection
```http
GET /api/db/test
```

**Response:**
```json
{
  "success": true,
  "message": "Database connection successful"
}
```

### Cloudinary Test

#### Test Cloudinary Connection
```http
GET /api/cloudinary/test
```

**Response:**
```json
{
  "message": "Cloudinary connection successful!"
}
```

---

## Admin Authentication Endpoints

### Login

#### Admin Login
```http
POST /api/admin/auth/login
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "admin@rudystore.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "id": 1,
    "email": "admin@rudystore.com",
    "firstName": "Super",
    "lastName": "Admin",
    "role": "super_admin",
    "permissions": ["all"]
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Invalid email or password"
}
```

### Verify Token

#### Verify Admin Token
```http
GET /api/admin/auth/verify
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "admin": {
    "id": 1,
    "email": "admin@rudystore.com",
    "firstName": "Super",
    "lastName": "Admin",
    "role": "super_admin",
    "permissions": ["all"]
  }
}
```

### Logout

#### Admin Logout
```http
POST /api/admin/auth/logout
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

**Note**: Logout is primarily handled client-side by removing the token from localStorage.

---

## Admin Banners Endpoints

### List All Banners

#### Get All Banners (Admin)
```http
GET /api/admin/banners
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "banners": [
    {
      "id": 1,
      "title": "Summer Sale",
      "subtitle": "Up to 50% off",
      "imageUrl": "https://...",
      "linkUrl": "/collections",
      "isActive": true,
      "displayOrder": 1,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Create Banner

#### Create New Banner
```http
POST /api/admin/banners
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "New Banner",
  "subtitle": "Banner subtitle",
  "imageUrl": "https://...",
  "linkUrl": "/collections",
  "isActive": true,
  "displayOrder": 1
}
```

**Response:**
```json
{
  "success": true,
  "banner": {
    "id": 2,
    "title": "New Banner",
    "subtitle": "Banner subtitle",
    "imageUrl": "https://...",
    "linkUrl": "/collections",
    "isActive": true,
    "displayOrder": 1,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Get Single Banner

#### Get Banner by ID
```http
GET /api/admin/banners/:id
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "banner": {
    "id": 1,
    "title": "Summer Sale",
    "subtitle": "Up to 50% off",
    "imageUrl": "https://...",
    "linkUrl": "/collections",
    "isActive": true,
    "displayOrder": 1,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Update Banner

#### Update Banner
```http
PUT /api/admin/banners/:id
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Updated Banner",
  "subtitle": "Updated subtitle",
  "imageUrl": "https://...",
  "linkUrl": "/luxury",
  "isActive": false,
  "displayOrder": 2
}
```

**Response:**
```json
{
  "success": true,
  "banner": {
    "id": 1,
    "title": "Updated Banner",
    "subtitle": "Updated subtitle",
    "imageUrl": "https://...",
    "linkUrl": "/luxury",
    "isActive": false,
    "displayOrder": 2,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-02T00:00:00.000Z"
  }
}
```

### Delete Banner

#### Delete Banner
```http
DELETE /api/admin/banners/:id
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Banner deleted successfully"
}
```

---

## Admin Homepage Sections Endpoints

### List All Sections

#### Get All Homepage Sections (Admin)
```http
GET /api/admin/homepage-sections
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "sections": [
    {
      "id": 1,
      "title": "Rudy Collections",
      "description": "Discover our fashion collection",
      "imageUrl": "https://...",
      "linkUrl": "/collections",
      "productCount": 50,
      "isActive": true,
      "displayOrder": 1,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Create Section

#### Create New Homepage Section
```http
POST /api/admin/homepage-sections
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "New Collection",
  "description": "Collection description",
  "imageUrl": "https://...",
  "linkUrl": "/collections",
  "productCount": 25,
  "isActive": true,
  "displayOrder": 1
}
```

**Response:**
```json
{
  "success": true,
  "section": {
    "id": 2,
    "title": "New Collection",
    "description": "Collection description",
    "imageUrl": "https://...",
    "linkUrl": "/collections",
    "productCount": 25,
    "isActive": true,
    "displayOrder": 1,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Get Single Section

#### Get Homepage Section by ID
```http
GET /api/admin/homepage-sections/:id
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "section": {
    "id": 1,
    "title": "Rudy Collections",
    "description": "Discover our fashion collection",
    "imageUrl": "https://...",
    "linkUrl": "/collections",
    "productCount": 50,
    "isActive": true,
    "displayOrder": 1,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Update Section

#### Update Homepage Section
```http
PUT /api/admin/homepage-sections/:id
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Updated Collection",
  "description": "Updated description",
  "imageUrl": "https://...",
  "linkUrl": "/luxury",
  "productCount": 75,
  "isActive": false,
  "displayOrder": 2
}
```

**Response:**
```json
{
  "success": true,
  "section": {
    "id": 1,
    "title": "Updated Collection",
    "description": "Updated description",
    "imageUrl": "https://...",
    "linkUrl": "/luxury",
    "productCount": 75,
    "isActive": false,
    "displayOrder": 2,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-02T00:00:00.000Z"
  }
}
```

### Delete Section

#### Delete Homepage Section
```http
DELETE /api/admin/homepage-sections/:id
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Homepage section deleted successfully"
}
```

---

## Admin Users Endpoints

### List All Users

#### Get All Admin Users
```http
GET /api/admin/users
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "users": [
    {
      "id": 1,
      "email": "admin@rudystore.com",
      "firstName": "Super",
      "lastName": "Admin",
      "role": "super_admin",
      "permissions": ["all"],
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Create User

#### Create New Admin User
```http
POST /api/admin/users
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "staff@rudystore.com",
  "password": "securepassword123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "staff",
  "permissions": ["collections", "orders"]
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": 2,
    "email": "staff@rudystore.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "staff",
    "permissions": ["collections", "orders"],
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Get Single User

#### Get Admin User by ID
```http
GET /api/admin/users/:id
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "user": {
    "id": 1,
    "email": "admin@rudystore.com",
    "firstName": "Super",
    "lastName": "Admin",
    "role": "super_admin",
    "permissions": ["all"],
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Update User

#### Update Admin User
```http
PUT /api/admin/users/:id
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "firstName": "Updated",
  "lastName": "Name",
  "role": "admin",
  "permissions": ["collections", "luxury", "orders"],
  "isActive": true
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": 2,
    "email": "staff@rudystore.com",
    "firstName": "Updated",
    "lastName": "Name",
    "role": "admin",
    "permissions": ["collections", "luxury", "orders"],
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-02T00:00:00.000Z"
  }
}
```

### Delete User

#### Delete Admin User
```http
DELETE /api/admin/users/:id
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Admin user deleted successfully"
}
```

---

## Payment Endpoints

### Initialize Payment

#### Initialize Paystack Transaction
```http
POST /api/payment/initialize
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "customer@example.com",
  "amount": 5000,
  "reference": "order_123",
  "metadata": {
    "orderId": 123,
    "customerId": 456
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "authorization_url": "https://paystack.com/pay/...",
    "access_code": "access_code_here",
    "reference": "order_123"
  }
}
```

### Verify Payment

#### Verify Paystack Transaction
```http
POST /api/payment/verify
Content-Type: application/json
```

**Request Body:**
```json
{
  "reference": "order_123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "success",
    "reference": "order_123",
    "amount": 5000,
    "currency": "NGN",
    "customer": {
      "email": "customer@example.com"
    }
  }
}
```

---

## File Upload Endpoints

### Upload to Cloudinary

#### Upload Image to Cloudinary
```http
POST /api/upload/cloudinary
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data
```

**Form Data:**
- `file`: Image file (File)

**Response:**
```json
{
  "success": true,
  "url": "https://res.cloudinary.com/.../image.jpg",
  "public_id": "rudy-store-1234567890-image",
  "filename": "image.jpg",
  "size": 123456,
  "type": "image/jpeg"
}
```

### Local Upload

#### Upload Image Locally
```http
POST /api/upload
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data
```

**Form Data:**
- `file`: Image file (File)

**Response:**
```json
{
  "success": true,
  "url": "/uploads/image-1234567890.jpg",
  "filename": "image.jpg",
  "size": 123456
}
```

---

## Error Responses

All endpoints may return error responses in the following format:

```json
{
  "error": "Error message here",
  "details": "Additional error details (optional)"
}
```

### Common HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## Rate Limiting

Currently, there is no rate limiting implemented. Consider implementing rate limiting for production use.

## CORS

CORS is configured to allow requests from the application domain. Adjust CORS settings in production as needed.

---

**Last Updated**: 2024

