export interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  images: string[];
  rating: number;
  reviews: number;
  isNew?: boolean;
  isOnSale?: boolean;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  discount?: number;
  category: string;
  productType: 'clothing' | 'shoe' | 'accessory';
  sizes: string[];
  euSizes?: string[];
  colors: string[];
  colorDetails?: { name: string; hex_code: string }[];
  color_images?: { color: string; images: string[] }[];
  inStock: boolean;
  sku: string;
  features: string[];
  fullDescription: string;
  additionalInfo: Record<string, string>;
  gender?: string;
  brand?: string;
  subcategory?: string;
}

export const products: Product[] = [];

export function getProductById(id: string): Product | undefined {
  return products.find(p => p.id === id);
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find(p => p.slug === slug);
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter(p => p.category === category);
}

export function getAllProducts(): Product[] {
  return products;
}
