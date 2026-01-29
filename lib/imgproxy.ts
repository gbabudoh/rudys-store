// Server-side only imgproxy URL generator
// This file should only be imported in Server Components or API routes

const IMGPROXY_URL = process.env.IMGPROXY_URL || 'http://149.102.128.35:8080';

export type ResizeType = 'fill' | 'fit' | 'auto';

export interface ImgproxyOptions {
  width: number;
  height: number;
  resize?: ResizeType;
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png' | 'avif';
  blur?: number;
  sharpen?: number;
}

/**
 * Generate an imgproxy URL for image optimization
 * Use this in Server Components or API routes only
 */
export function generateImgproxyUrl(
  imageUrl: string,
  options: ImgproxyOptions
): string {
  const { 
    width, 
    height, 
    resize = 'fill', 
    quality = 80, 
    format = 'webp',
    blur,
    sharpen 
  } = options;

  // Build processing options path
  let processingPath = `/rs:${resize}:${width}:${height}`;
  
  if (quality) {
    processingPath += `/q:${quality}`;
  }
  
  if (format) {
    processingPath += `/f:${format}`;
  }

  if (blur) {
    processingPath += `/bl:${blur}`;
  }

  if (sharpen) {
    processingPath += `/sh:${sharpen}`;
  }

  // URL-encode the source image URL
  const encodedUrl = encodeURIComponent(imageUrl);
  
  // Return unsigned URL (for development/internal use)
  return `${IMGPROXY_URL}/insecure${processingPath}/plain/${encodedUrl}`;
}

/**
 * Generate srcset for responsive images
 */
export function generateSrcSet(
  imageUrl: string,
  widths: number[] = [320, 640, 768, 1024, 1280],
  options: Omit<ImgproxyOptions, 'width'> & { aspectRatio?: number }
): string {
  const { aspectRatio = 1, height, ...rest } = options;
  
  return widths
    .map(w => {
      const h = height || Math.round(w / aspectRatio);
      const url = generateImgproxyUrl(imageUrl, { ...rest, width: w, height: h });
      return `${url} ${w}w`;
    })
    .join(', ');
}
