import type { Metadata } from 'next';
import { queryOne } from '@/lib/db';

interface ProductRow {
  name: string;
  description: string;
  price: string;
  original_price: string | null;
  images: string;
  slug: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.ruddysstore.com';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;

  try {
    const product = await queryOne<ProductRow>(
      'SELECT name, description, price, original_price, images, slug FROM products WHERE slug = ? AND status = ?',
      [slug, 'active']
    );

    if (!product) {
      return {
        title: 'Product Not Found - Ruddy\'s Store',
      };
    }

    const images: string[] = typeof product.images === 'string'
      ? JSON.parse(product.images || '[]')
      : [];
    const firstImage = images[0] || `${BASE_URL}/rudy-store-logo.png`;
    const price = parseFloat(product.price);
    const description = product.description || `Shop ${product.name} at Ruddy's Store`;

    return {
      title: `${product.name} - Ruddy's Store`,
      description: description.slice(0, 160),
      openGraph: {
        title: product.name,
        description: description.slice(0, 160),
        url: `${BASE_URL}/product/${product.slug}`,
        siteName: "Ruddy's Store",
        images: [
          {
            url: firstImage,
            width: 800,
            height: 800,
            alt: product.name,
          },
        ],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: product.name,
        description: description.slice(0, 160),
        images: [firstImage],
      },
      other: {
        'product:price:amount': price.toString(),
        'product:price:currency': 'NGN',
      },
    };
  } catch (error) {
    console.error('Error generating product metadata:', error);
    return {
      title: "Ruddy's Store - Fashion & Luxury Collections",
    };
  }
}

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
