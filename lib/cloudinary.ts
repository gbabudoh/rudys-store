import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

/**
 * Upload an image to Cloudinary
 * @param file - File buffer or base64 string
 * @param folder - Optional folder path in Cloudinary
 * @param publicId - Optional public ID for the image
 * @returns Promise with upload result
 */
export async function uploadImage(
  file: Buffer | string,
  options?: {
    folder?: string;
    publicId?: string;
    transformation?: any;
    resourceType?: 'image' | 'video' | 'raw' | 'auto';
  }
) {
  try {
    const uploadOptions: any = {
      resource_type: options?.resourceType || 'image',
    };

    if (options?.folder) {
      uploadOptions.folder = options.folder;
    }

    if (options?.publicId) {
      uploadOptions.public_id = options.publicId;
    }

    if (options?.transformation) {
      uploadOptions.transformation = options.transformation;
    }

    // If file is a Buffer, convert to base64 data URI
    if (Buffer.isBuffer(file)) {
      const base64 = file.toString('base64');
      const dataUri = `data:image/jpeg;base64,${base64}`;
      const result = await cloudinary.uploader.upload(dataUri, uploadOptions);
      return result;
    }

    // If file is already a string (base64 or URL)
    const result = await cloudinary.uploader.upload(file, uploadOptions);
    return result;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
}

/**
 * Delete an image from Cloudinary
 * @param publicId - Public ID of the image to delete
 * @param resourceType - Type of resource (image, video, raw, auto)
 * @returns Promise with deletion result
 */
export async function deleteImage(
  publicId: string,
  resourceType: 'image' | 'video' | 'raw' | 'auto' = 'image'
) {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
    return result;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw error;
  }
}

/**
 * Get optimized image URL from Cloudinary
 * @param publicId - Public ID of the image
 * @param options - Transformation options
 * @returns Optimized image URL
 */
export function getOptimizedImageUrl(
  publicId: string,
  options?: {
    width?: number;
    height?: number;
    quality?: number | 'auto';
    format?: 'auto' | 'jpg' | 'png' | 'webp';
    crop?: string;
    folder?: string;
  }
) {
  const fullPublicId = options?.folder ? `${options.folder}/${publicId}` : publicId;
  
  const transformation: any[] = [];
  
  if (options?.width || options?.height) {
    transformation.push({
      width: options.width,
      height: options.height,
      crop: options.crop || 'limit',
    });
  }
  
  if (options?.quality) {
    transformation.push({ quality: options.quality });
  }
  
  if (options?.format) {
    transformation.push({ format: options.format });
  }

  return cloudinary.url(fullPublicId, {
    transformation,
    secure: true,
  });
}

/**
 * Test Cloudinary connection
 * @returns Promise<boolean> - true if connection is successful
 */
export async function testCloudinaryConnection(): Promise<boolean> {
  try {
    // Try to ping Cloudinary API
    await cloudinary.api.ping();
    return true;
  } catch (error) {
    console.error('Cloudinary connection test failed:', error);
    return false;
  }
}

