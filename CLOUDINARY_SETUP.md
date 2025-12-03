# Cloudinary Setup Guide

This guide will help you set up Cloudinary for image uploads and management in Rudy's Store.

## Prerequisites

1. A Cloudinary account (sign up at https://cloudinary.com if you don't have one)
2. Cloudinary credentials from your dashboard

## Step 1: Get Your Cloudinary Credentials

1. Log in to your Cloudinary account
2. Go to your Dashboard
3. Copy the following values:
   - **Cloud Name** (found at the top of the dashboard)
   - **API Key** (found in the dashboard)
   - **API Secret** (found in the dashboard - click "Reveal" to see it)

## Step 2: Add Environment Variables

Add the following variables to your `.env.local` file:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
CLOUDINARY_UPLOAD_PRESET=your_upload_preset_here
```

### Optional: Create an Upload Preset

1. Go to Cloudinary Dashboard → Settings → Upload
2. Scroll down to "Upload presets"
3. Click "Add upload preset"
4. Configure your preset:
   - **Preset name**: `rudy-store-uploads` (or your preferred name)
   - **Signing mode**: Choose based on your security needs
   - **Folder**: `rudy-store` (optional, for organization)
   - **Format**: `auto` (for automatic format optimization)
   - **Quality**: `auto` (for automatic quality optimization)
5. Save the preset
6. Use the preset name in `CLOUDINARY_UPLOAD_PRESET`

## Step 3: Test the Connection

After adding your credentials, test the Cloudinary connection:

### Option 1: Test via API Endpoint

Start your development server and visit:
```
http://localhost:3000/api/cloudinary/test
```

You should see a JSON response indicating success or failure.

### Option 2: Test via Script

Run the test script:
```bash
node scripts/test-cloudinary.js
```

## Usage

### Upload Images via API

Use the Cloudinary upload endpoint (requires admin authentication):

```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('folder', 'rudy-store/products'); // Optional

const response = await fetch('/api/upload/cloudinary', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${adminToken}`,
  },
  body: formData,
});

const result = await response.json();
console.log('Uploaded image URL:', result.url);
```

### Use Cloudinary Utility Functions

```typescript
import { uploadImage, deleteImage, getOptimizedImageUrl } from '@/lib/cloudinary';

// Upload an image
const result = await uploadImage(buffer, {
  folder: 'rudy-store/products',
  transformation: { width: 800, height: 600, crop: 'limit' }
});

// Get optimized URL
const optimizedUrl = getOptimizedImageUrl('product-image', {
  width: 400,
  height: 400,
  quality: 'auto',
  format: 'auto',
  folder: 'rudy-store/products'
});

// Delete an image
await deleteImage('rudy-store/products/product-image');
```

### Use Cloudinary Images in Next.js Image Component

Cloudinary images are automatically optimized by Next.js when using the `Image` component:

```tsx
import Image from 'next/image';

<Image
  src="https://res.cloudinary.com/your-cloud-name/image/upload/v1234567890/rudy-store/product.jpg"
  alt="Product"
  width={500}
  height={500}
/>
```

## Features

- **Automatic Image Optimization**: Cloudinary automatically optimizes images for web delivery
- **Format Conversion**: Automatically converts images to WebP or AVIF for better performance
- **Responsive Images**: Generate multiple sizes for different devices
- **Transformations**: Apply transformations on-the-fly (resize, crop, filters, etc.)
- **CDN Delivery**: Images are delivered via Cloudinary's global CDN
- **Secure Uploads**: Admin authentication required for uploads

## Troubleshooting

### Connection Failed

1. Verify your credentials are correct in `.env.local`
2. Check that your Cloudinary account is active
3. Ensure environment variables are loaded (restart dev server)

### Upload Errors

1. Check file size (max 10MB)
2. Verify file type is supported (JPEG, PNG, WebP, GIF)
3. Ensure admin authentication token is valid
4. Check Cloudinary dashboard for upload limits/quota

### Image Not Displaying

1. Verify the image URL is correct
2. Check that `res.cloudinary.com` is allowed in `next.config.ts`
3. Ensure the image hasn't been deleted from Cloudinary

## Additional Resources

- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Cloudinary Node.js SDK](https://cloudinary.com/documentation/node_integration)
- [Next.js Image Optimization](https://nextjs.org/docs/app/api-reference/components/image)

