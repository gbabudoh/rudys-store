# Ruddy's Store — Admin Panel Guide

**Version:** 1.0  
**Last Updated:** February 2026  
**Admin URL:** `https://www.ruddysstore.com/admin`

---

## Table of Contents

1. [Getting Started](#1-getting-started)
2. [Dashboard Overview](#2-dashboard-overview)
3. [User Roles & Permissions](#3-user-roles--permissions)
4. [Product Management](#4-product-management)
5. [Managing Categories, Subcategories & Product Types](#5-managing-categories-subcategories--product-types)
6. [Managing Brands](#6-managing-brands)
7. [Managing Colours](#7-managing-colours)
8. [Managing Sizes](#8-managing-sizes)
9. [Image Upload](#9-image-upload)
10. [Content Management](#10-content-management)
11. [Orders & Sales](#11-orders--sales)
12. [Customer Management](#12-customer-management)
13. [Customer Service (Messages)](#13-customer-service-messages)
14. [Shipping & Tracking](#14-shipping--tracking)
15. [Payments](#15-payments)
16. [Analytics](#16-analytics)
17. [Settings](#17-settings)
18. [Troubleshooting](#18-troubleshooting)

---

## 1. Getting Started

### Logging In

1. Navigate to `/admin/login`
2. Enter your admin email and password
3. Click **Login**

Your session token is stored in the browser. If your session expires, you will be redirected to the login page automatically.

### First-Time Setup

Before adding products, set up these foundational items in order:

1. **Categories** — e.g., Clothing, Footwear, Accessories
2. **Sub-Categories** — e.g., Dresses, Sneakers, Handbags
3. **Product Types** — e.g., Shirt, Dress, Sandal
4. **Brands** — e.g., Nike, Gucci, Zara
5. **Colours** — e.g., Red (#FF0000), Navy (#000080)
6. **Sizes** — Clothing sizes (S, M, L, XL) and Shoe sizes (38, 39, 40...)

These items populate the dropdown menus in the product creation form.

---

## 2. Dashboard Overview

The admin dashboard (`/admin`) is your home base. The sidebar navigation is organized into sections:

| Section | Items |
|---------|-------|
| **Overview** | Dashboard, Customer Service |
| **Content** | Banners, Homepage Sections, Footer |
| **Products** | Ruddys Store, Ruddy Luxury, Slide & Sole |
| **Sales** | Orders, Shipping, Tracking, Payments |
| **Insights** | Analytics, Google Analytics |
| **Management** | Categories, Sub-Categories, Product Types, Brands, Colours, Clothing Sizes, Shoe Sizes, Customers, Admin Users, Settings |

---

## 3. User Roles & Permissions

| Role | Access Level |
|------|-------------|
| **Super Admin** | Full access to all sections including Admin Users, Settings, Content management |
| **Admin** | Access to Products, Sales, Insights, and Management sections |
| **Store Manager** | Same as Admin |
| **Sales Manager** | Same as Admin |
| **Staff** | Same as Admin |
| **Customer Service** | Same as Admin |

Only **Super Admin** can:
- Create/edit/delete admin users
- Manage site settings
- Manage content (Banners, Homepage Sections, Footer)
- Access the Dashboard overview

### Creating Admin Users (Super Admin Only)

1. Go to **Admin Users** in the sidebar
2. Click **Add User**
3. Fill in: First Name, Last Name, Email, Password, Role
4. Click **Save**

---

## 4. Product Management

The store has three departments, each managed from its own page:

| Department | Admin Page | Store Section Value | Frontend URL |
|-----------|-----------|-------------------|-------------|
| **Ruddys Store** | `/admin/collections` | `collections` | `/store` |
| **Ruddy Luxury** | `/admin/luxury` | `luxury` | `/luxury` |
| **Slide & Sole** | `/admin/crocs` | `crocs` | `/crocs` |

### Adding a New Product

1. Navigate to the department page (e.g., **Ruddys Store** in sidebar)
2. Click the **Add Product** button
3. The product form has three tabs: **Basic**, **Details**, and **Inventory**

#### Tab 1: Basic Information

| Field | Required | Description |
|-------|----------|-------------|
| **Product Name** | Yes | The display name. A URL slug is auto-generated from this (e.g., "Ladies Special Dress" → `ladies-special-dress`) |
| **Description** | No | Short description shown on product cards |
| **Full Description** | No | Detailed description shown on the product detail page |
| **Price (₦)** | Yes | Current selling price |
| **Original Price (₦)** | No | Strike-through price (set this higher than Price to show a discount) |
| **Discount (%)** | No | Discount percentage badge shown on the product card |

#### Tab 2: Details

| Field | Required | Description |
|-------|----------|-------------|
| **Category** | Yes | Select from your created categories (e.g., Clothing, Footwear, Accessories). This powers the frontend category filter |
| **Sub-Category** | No | Select from your created sub-categories. This powers the frontend subcategory filter |
| **Product Type** | No | Select from your created product types (e.g., Shirt, Dress, Sneaker) |
| **Brand** | No | Select from your created brands. If a brand is assigned, it appears in the frontend brand filter |
| **Gender** | No | Men, Women, Unisex, or Kids. Powers the frontend gender filter |
| **Colours** | No | Select one or more colours. These appear as colour swatches on the product card and detail page |
| **Sizes** | No | Toggle clothing sizes (S, M, L, XL, etc.). These appear in the frontend size filter and product detail page |
| **Shoe Sizes** | No | Toggle shoe sizes (38, 39, 40, etc.) for footwear products |
| **Features** | No | Add product features as a list (e.g., "100% Cotton", "Machine Washable") |

#### Tab 3: Inventory

| Field | Required | Description |
|-------|----------|-------------|
| **SKU** | No | Auto-generated if left blank (format: `XX-XX-XXXXXXX`) |
| **Stock** | No | Number of items in stock. 0 = Out of Stock |
| **Status** | Yes | **Draft** (not visible), **Active** (visible on frontend), **Inactive** (hidden) |
| **Is New** | No | Shows a "New" badge on the product card |
| **Is On Sale** | No | Marks product as on sale |
| **Is Featured** | No | Product appears in featured sections |
| **Is Best Seller** | No | Shows a "Best Seller" badge |

#### Product Images

- Click the **Upload** area or drag and drop images
- Images are uploaded to the MinIO storage server
- The first image becomes the main product image
- Upload multiple images for the product gallery/thumbnails
- Supported formats: JPG, PNG, WebP

#### Colour Variation Images

If a product has multiple colours:

1. Select the colours in the **Colours** field
2. For each colour, upload specific images showing that colour variant
3. When a customer clicks a colour swatch on the frontend, the images switch to show that colour's photos

### Editing a Product

1. In the product list, click the **Edit** button (pencil icon) on any product
2. The same form opens pre-filled with the product's current data
3. Make your changes across any tab
4. Click **Save**

### Deleting a Product

1. Click the **Delete** button (trash icon) on any product
2. A confirmation dialog appears: "Are you sure you want to delete this product?"
3. Click **Delete Product** to confirm
4. This action cannot be undone

### Viewing a Product on the Frontend

- Click the **View** button (eye icon) to open the product's public page in a new tab

### Product Status Explained

| Status | Visible on Frontend? | Use Case |
|--------|---------------------|----------|
| **Draft** | No | Product is being prepared, not ready for customers |
| **Active** | Yes | Product is live and visible to customers |
| **Inactive** | No | Temporarily hidden (e.g., out of season, restocking) |

**Important:** Only products with **Active** status appear on the public store pages.

---

## 5. Managing Categories, Subcategories & Product Types

### Categories (`/admin/categories`)

Categories are the top-level groupings that power the frontend filter sidebar.

**Default categories:** Clothing, Footwear, Accessories

To add a new category:
1. Go to **Categories** in the sidebar
2. Click **Add Category**
3. Enter: Name, Description (optional), Display Order
4. Toggle **Active** on/off
5. Click **Save**

**How it works:** When you assign a category to a product, that category automatically appears in the frontend filter. If no products use a category, it won't show in the filter.

### Sub-Categories (`/admin/sub-categories`)

Sub-categories provide a second level of filtering.

Examples: Under "Clothing" → Dresses, T-Shirts, Pants. Under "Footwear" → Sneakers, Sandals, Boots.

To add:
1. Go to **Sub-Categories**
2. Click **Add Sub-Category**
3. Enter: Name, select Parent Category, Display Order
4. Click **Save**

**How it works:** Sub-categories only appear in the frontend filter if at least one active product has that sub-category assigned.

### Product Types (`/admin/product-types`)

Product types are more specific classifications within sub-categories.

Examples: Shirt, Dress, Sneaker, Sandal, Handbag

To add:
1. Go to **Product Types**
2. Click **Add Product Type**
3. Enter: Name, Description (optional), Display Order
4. Click **Save**

---

## 6. Managing Brands

### Brands (`/admin/brands`)

Brands appear as a filter option on the frontend when products have a brand assigned.

To add a new brand:
1. Go to **Brands** in the sidebar
2. Click **Add Brand**
3. Enter: Brand Name, Description (optional)
4. Toggle **Active** on/off
5. Click **Save**

**How it works:** The brand filter only appears on a department's page if at least one active product in that department has a brand assigned (other than the default "Rudy Store").

---

## 7. Managing Colours

### Colours (`/admin/colors`)

Colours define the available colour options for products and their hex codes for swatch display.

To add a new colour:
1. Go to **Colours** in the sidebar
2. Click **Add Colour**
3. Enter: Colour Name (e.g., "Navy Blue"), Hex Code (e.g., `#000080`)
4. Click **Save**

The hex code is used to render the colour swatch circle on product cards and the product detail page.

---

## 8. Managing Sizes

### Clothing Sizes (`/admin/clothing-sizes`)

Manage standard clothing sizes like XS, S, M, L, XL, XXL, etc.

1. Go to **Clothing Sizes**
2. Click **Add Size**
3. Enter the size name
4. Toggle **Active** to make it available in the product form
5. Click **Save**

### Shoe Sizes (`/admin/shoe-sizes`)

Manage shoe sizes with different sizing systems (EU, UK, US).

1. Go to **Shoe Sizes**
2. Click **Add Size**
3. Enter: Size number, System (EU/UK/US)
4. Toggle **Active**
5. Click **Save**

---

## 9. Image Upload

### How Image Upload Works

- Images are stored on the MinIO object storage server
- When you upload an image in the product form, it is sent to `/api/upload`
- The API stores the file in the `ruddysstore` bucket on MinIO
- A public URL is generated: `https://www.ruddysstore.com/minio/ruddysstore/[filename]`
- This URL is saved with the product data

### Image Best Practices

| Aspect | Recommendation |
|--------|---------------|
| **Format** | JPG or WebP for photos, PNG for graphics with transparency |
| **Resolution** | Minimum 800×800px, recommended 1200×1200px |
| **File Size** | Keep under 2MB per image for fast loading |
| **Aspect Ratio** | Square (1:1) works best for product cards |
| **Quantity** | Upload 3–6 images per product (front, back, detail, lifestyle) |

### Uploading Colour-Specific Images

1. In the product form, select colours for the product
2. For each selected colour, an image upload section appears
3. Upload images specific to that colour variant
4. On the frontend, when a customer clicks a colour swatch, the gallery switches to show that colour's images

---

## 10. Content Management

### Banners (`/admin/banners`)

Banners are promotional images displayed on the homepage or other pages.

1. Go to **Banners**
2. Click **Add Banner**
3. Fill in: Title, Subtitle, Image URL (upload or paste), Link URL, Display Order
4. Toggle **Active** on/off
5. Click **Save**

### Homepage Sections (`/admin/homepage-sections`)

Homepage sections control the featured department blocks on the homepage.

Each section has:
- **Section Key** — Unique identifier (cannot be changed after creation)
- **Title** — Display name (e.g., "Ruddys Store", "Ruddy Luxury", "Slide & Sole")
- **Subtitle** — Short tagline
- **Description** — Brief description
- **Image URL** — Background or hero image
- **Link URL** — Where the section links to (e.g., `/store`, `/luxury`, `/crocs`)
- **Display Order** — Controls the order sections appear
- **Gradient Color** — CSS gradient class for styling
- **Active** — Toggle visibility

To edit:
1. Go to **Homepage Sections**
2. Click **Edit** on the section you want to change
3. Update the fields
4. Click **Save**

### Footer (`/admin/footer`)

Manage footer links and content sections.

1. Go to **Footer**
2. Add or edit footer link groups and individual links
3. Each link has: Title, URL, Display Order, Active status

---

## 11. Orders & Sales

### Orders (`/admin/orders`)

View all customer orders placed through the store.

Each order shows:
- **Order Number** — Unique identifier (e.g., `ORD-1740000000000`)
- **Customer Name** — First and last name
- **Email** — Customer email
- **Items** — Products ordered with quantities, sizes, and colours
- **Total Amount** — Order total in Naira (₦)
- **Payment Status** — Paid, Pending, or Failed
- **Payment Reference** — Paystack transaction reference
- **Date** — When the order was placed

### Order Workflow

1. Customer adds items to cart
2. Customer proceeds to checkout and enters shipping details
3. Payment is processed via Paystack
4. On successful payment, the order is created in the database
5. A confirmation email is sent to the customer
6. The order appears in the admin Orders page

---

## 12. Customer Management

### Customers (`/admin/customers`)

View and manage registered customers.

Each customer record shows:
- Name, Email, Phone
- Registration date
- Order history

You can:
- View customer details
- Edit customer information
- Delete customer accounts

---

## 13. Customer Service (Messages)

### Messages (`/admin/customer-service`)

The Customer Service section shows messages submitted through the website's contact form.

- **Unread count** is shown as a badge on the sidebar
- Messages are polled every 2 minutes for new arrivals

Each message shows:
- Sender name and email
- Subject and message body
- Status: **Unread** or **Read**
- Date received

You can:
- Click a message to read it and mark it as read
- Reply to the customer
- Delete messages

---

## 14. Shipping & Tracking

### Shipping (`/admin/shipping`)

Manage shipping methods and rates.

1. Go to **Shipping**
2. Click **Add Shipping Method**
3. Enter: Name, Description, Price, Estimated Delivery Time
4. Toggle **Active**
5. Click **Save**

### Tracking (`/admin/tracking`)

Manage order tracking information.

1. Go to **Tracking**
2. Find the order
3. Add tracking number and carrier information
4. The customer can view tracking status on their order page

---

## 15. Payments

### Payments (`/admin/payments`)

View all payment transactions processed through Paystack.

Each payment record shows:
- Transaction reference
- Amount
- Status (Success, Failed, Pending)
- Customer email
- Date

---

## 16. Analytics

### Analytics (`/admin/analytics`)

View store performance metrics:
- Total orders
- Revenue
- Product performance
- Customer statistics

### Google Analytics (`/admin/google-analytics`)

Integration with Google Analytics for detailed traffic and conversion tracking.

---

## 17. Settings

### Site Settings (`/admin/settings`)

Super Admin only. Configure global store settings:
- Store name and description
- Contact information
- Social media links
- Payment gateway settings
- Email configuration

---

## 18. Troubleshooting

### Product Not Showing on Frontend

| Check | Solution |
|-------|----------|
| Status is not "Active" | Edit the product → Inventory tab → Set Status to **Active** |
| Wrong store section | Verify the product is in the correct department (collections/luxury/crocs) |
| Cache issue | Delete the `.next` folder and restart the dev server |

### Image Not Displaying

| Check | Solution |
|-------|----------|
| Upload failed | Re-upload the image in the product form |
| Broken URL | Check that the image URL starts with `https://www.ruddysstore.com/minio/` |
| MinIO server down | Contact the system administrator to check the storage server |

### Filters Not Working

| Check | Solution |
|-------|----------|
| Category filter empty | Make sure products have a **Category** assigned |
| Brand filter not showing | Assign a brand to at least one active product in that department |
| Subcategory filter not showing | Assign a sub-category to at least one active product |

### Cannot Log In

| Check | Solution |
|-------|----------|
| Wrong credentials | Verify email and password with the Super Admin |
| Token expired | Clear browser localStorage and try again |
| Account disabled | Contact the Super Admin to check your account status |

---

## Quick Reference: Product Creation Checklist

Before publishing a product, ensure:

- [ ] Product name is clear and descriptive
- [ ] Price is set correctly (in Naira)
- [ ] At least one image is uploaded
- [ ] Category is selected
- [ ] Gender is set
- [ ] At least one size is selected (if applicable)
- [ ] Stock quantity is entered
- [ ] Status is set to **Active**

---

**End of Admin Guide**

*For technical support, contact the development team.*
